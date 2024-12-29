import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BajaEmpleadoComponent } from '../baja-empleado/baja-empleado.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-gestion-empleados',
  templateUrl: './gestion-empleados.component.html',
  styleUrls: ['./gestion-empleados.component.css']
})
export class GestionEmpleadosComponent implements OnInit, AfterViewInit {

  filtros = {
    nombre: '',
    apellido1: '',
    apellido2: '',
    rol: ''
  };

  roles = [
    { valor: '', nombre: 'Todos' },
    { valor: 'VETERINARIO', nombre: 'Veterinario' },
    { valor: 'ADMIN_CLINICA', nombre: 'Administrador de Clínica' }
  ];

  dataSource = new MatTableDataSource<Usuario>();
  isLoading: boolean = false;
  busquedaRealizada: boolean = false;
  columnasTabla: string[] = ['numIdent', 'nombre', 'apellido1', 'apellido2', /* 'rol',  */'acciones'];
  idClinica: number | null = null;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idClinica = params.get('idClinica');
      if (idClinica) {
        this.idClinica = +idClinica;
      }
    });

    this.buscarEmpleados();
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

  buscarEmpleados() {
    if (!this.idClinica) {
      console.error('ID de clínica no encontrado.');
      return;
    }
    
    this.isLoading = true; // Activa el spinner
    this.busquedaRealizada = false; // Oculta resultados anteriores

    const filtrosAplicados = this.prepararFiltros(this.filtros);

    this.usuarioService.buscarEmpleados(this.idClinica, filtrosAplicados).subscribe(
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
      nombre: filtros.nombre || undefined,
      apellido1: filtros.apellido1 || undefined,
      apellido2: filtros.apellido2 || undefined,
      rol: filtros.rol && filtros.rol !== '' ? filtros.rol : undefined // Solo se envía si 'rol' tiene un valor
    };
  }

  // Método auxiliar para obtener valores de objetos
  private getValue(obj: any, column: string): string {
    return obj[column] ? obj[column].toString() : '';
  }

  navegarPerfilEmpleado(idUsuario: number): void {
    this.router.navigate([`/veterinario/perfil/${idUsuario}`]);
  }

  nuevoEmpleado(): void {
    if (this.idClinica) {
      this.router.navigate([`/clinica/alta-empleado/${this.idClinica}`]);
    } else {
      console.error('No se encontró el ID de la clínica.');
    }
  }

  bajaEmpleado(empleado: Usuario): void {
    const dialogRef = this.dialog.open(BajaEmpleadoComponent, {
      width: '400px',
      data: { id: empleado.id, numColegiado: empleado.numColegiado }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.buscarEmpleados(); // Actualiza la lista después de la baja
      }
    });
  }
  
  volver(): void {
    this.router.navigate([`/clinica/dashboard/${this.idClinica}`]);
  }
}
