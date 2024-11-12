import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { Router } from '@angular/router';

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
  busquedaRealizada: boolean = false;
  columnasTabla: string[] = ['numIdent', 'nombre', 'apellido1', 'apellido2', 'telefono', 'email', 'acciones'];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      console.log('Paginador asignado en ngAfterViewInit:', this.dataSource.paginator);
    } else {
      console.warn('Paginador no disponible en ngAfterViewInit. Intentando asignar después.');
    }
  }

  buscarClientes() {
    this.busquedaRealizada = true;
    const filtrosAplicados = this.prepararFiltros(this.filtros);
  
    this.usuarioService.buscarClientes(filtrosAplicados).subscribe((result: Usuario[]) => {
      this.dataSource.data = result || [];
      console.log('Datos del DataSource antes de vincular el paginador:', this.dataSource.data);
  
      setTimeout(() => {
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          console.log('Paginador asignado correctamente después de la búsqueda.');
        } else {
          console.warn('Paginador aún no disponible después de la búsqueda.');
        }
      });
    }, error => {
      console.log('Error en la llamada al backend: ', error);
      this.dataSource.data = [];
    });
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

  navegarDashboardCliente(idUsuario: number): void {
    this.router.navigate([`/cliente/dashboard/${idUsuario}`]);
  }

  volver(): void {
    const idVeterinario = sessionStorage.getItem('idUsuario');
    if (idVeterinario) {
      this.router.navigate([`/veterinario/dashboard/${idVeterinario}`]);
    } else {
      console.error('ID del veterinario no encontrado en la sesión.');
      this.router.navigate(['/acceso-no-autorizado']);
    }
  }
}
