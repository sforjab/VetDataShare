import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BajaClienteComponent } from '../baja-cliente/baja-cliente.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-gestion-clientes',
  templateUrl: './gestion-clientes.component.html',
  styleUrls: ['./gestion-clientes.component.css']
})
export class GestionClientesComponent implements OnInit, AfterViewInit {
  
  filtros = {
    numIdent: '',
    telefono: '',
    email: '',
    nombre: '',
    apellido1: '',
    apellido2: ''
  };

  dataSource = new MatTableDataSource<Usuario>();
  isLoading: boolean = false;
  busquedaRealizada: boolean = false;
  columnasTabla: string[] = ['numIdent', 'nombre', 'apellido1', 'apellido2', /* 'telefono', 'email', */ 'acciones'];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(private usuarioService: UsuarioService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.buscarClientes();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;

      // Comparador personalizado para manejar acentos
      this.dataSource.sortData = (data: Usuario[], sort: MatSort) => {
        const active = sort.active;
        const direction = sort.direction;

        if (!active || direction === '') {
          return data;
        }

        return data.sort((a, b) => {
          const valueA = this.getValue(a, active);
          const valueB = this.getValue(b, active);

          // Se usa 'localeCompare' para ordenación considerando acentos
          return direction === 'asc'
            ? valueA.localeCompare(valueB, 'es', { sensitivity: 'base' })
            : valueB.localeCompare(valueA, 'es', { sensitivity: 'base' });
        });
      };
    }
  }

  buscarClientes() {
    this.isLoading = true; // Activa el spinner
    this.busquedaRealizada = false; // Oculta resultados anteriores

    const filtrosAplicados = this.prepararFiltros(this.filtros);

    this.usuarioService.buscarClientes(filtrosAplicados).subscribe(
      (result: Usuario[]) => {
        this.dataSource.data = result || [];

        setTimeout(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          } else {
            console.warn('Paginador aún no disponible después de la búsqueda.');
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
            this.dataSource.sort.sort({ id: 'apellido1', start: 'asc', disableClear: true });
          } else {
            console.warn('Ordenación aún no disponible después de la búsqueda.');
          }
        });

        this.busquedaRealizada = true; // La búsqueda ha terminado
      },
      (error) => {
        console.error('Error en la llamada al backend:', error);
        this.dataSource.data = [];
        this.busquedaRealizada = true; // Evita que el spinner quede activo
      },
      () => {
        this.isLoading = false; // Finaliza el estado de carga
      }
    );
  }

  private prepararFiltros(filtros: any): any {
    return {
      numIdent: filtros.numIdent || undefined,
      nombre: filtros.nombre || undefined,
      apellido1: filtros.apellido1 || undefined,
      apellido2: filtros.apellido2 || undefined,
      telefono: filtros.telefono || undefined,
      email: filtros.email || undefined
    };
  }

  // Método auxiliar para obtener valores de objetos
  private getValue(obj: any, column: string): string {
    return obj[column] ? obj[column].toString() : '';
  }

  navegarDashboardCliente(idUsuario: number): void {
    this.router.navigate([`/cliente/dashboard/${idUsuario}`]);
  }

  altaCliente(): void {
    this.router.navigate(['/cliente/alta-cliente']);
  }

  eliminarCliente(cliente: Usuario): void {
    const dialogRef = this.dialog.open(BajaClienteComponent, {
      width: '400px',
      data: cliente
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.buscarClientes(); // Actualizar lista después de eliminar
      }
    });
  }

  transferirMascotas(numIdent: String): void {
    this.router.navigate([`/cliente/transferir-mascotas/${numIdent}`]);
  }

  volver(): void {
    const idUsuario = sessionStorage.getItem('idUsuario');
    const rolUsuario = sessionStorage.getItem('rol');
  
    if (!idUsuario || !rolUsuario) {
      console.error('ID del usuario o rol no encontrado en la sesión.');
      this.router.navigate(['/acceso-no-autorizado']);
      return;
    }
  
    if (rolUsuario === 'ADMIN') {
      // Redirige al dashboard de administrador general
      this.router.navigate(['/admin/dashboard']);
    } else {
      // Redirige al dashboard del veterinario o administrador de clínica
      this.router.navigate([`/veterinario/dashboard/${idUsuario}`]);
    }
  }
}
