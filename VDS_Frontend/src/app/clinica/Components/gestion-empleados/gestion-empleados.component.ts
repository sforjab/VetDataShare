import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    { valor: 'VETERINARIO', nombre: 'Veterinario' },
    { valor: 'ADMIN_CLINICA', nombre: 'Administrador de Clínica' }
  ];

  dataSource = new MatTableDataSource<Usuario>();
  busquedaRealizada: boolean = false;
  columnasTabla: string[] = ['numIdent', 'nombre', 'apellido1', 'apellido2', 'rol', 'acciones'];

  idClinica: number | null = null;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idClinica = params.get('idClinica');
      if (idClinica) {
        this.idClinica = +idClinica;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  buscarEmpleados() {
    if (!this.idClinica) {
      console.error('ID de clínica no encontrado.');
      return;
    }

    this.busquedaRealizada = true;
    const filtrosAplicados = this.prepararFiltros(this.filtros);

    this.usuarioService.buscarEmpleados(this.idClinica, filtrosAplicados).subscribe((result: Usuario[]) => {
      this.dataSource.data = result || [];
      setTimeout(() => {
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      });
    }, error => {
      console.error('Error en la llamada al backend: ', error);
      this.dataSource.data = [];
    });
  }

  private prepararFiltros(filtros: any): any {
    return {
      nombre: filtros.nombre || undefined,
      apellido1: filtros.apellido1 || undefined,
      apellido2: filtros.apellido2 || undefined,
      rol: filtros.rol && filtros.rol !== '' ? filtros.rol : undefined // Solo se envía si 'rol' tiene un valor
    };
  }

  /* limpiarFiltros(): void {
    this.filtros = {
      nombre: '',
      apellido1: '',
      apellido2: '',
      rol: ''
    };
    this.busquedaRealizada = false;
    this.dataSource.data = [];
  } */

  navegarPerfilEmpleado(idUsuario: number): void {
    this.router.navigate([`/veterinario/perfil/${idUsuario}`]);
  }

  volver(): void {
    this.router.navigate([`/clinica/dashboard/${this.idClinica}`]);
  }
}
