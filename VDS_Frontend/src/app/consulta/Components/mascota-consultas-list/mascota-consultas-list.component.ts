import { Component } from '@angular/core';
import { Consulta } from '../../Models/consulta.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaService } from '../../Services/consulta.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { BajaConsultaComponent } from '../baja-consulta/baja-consulta.component';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-mascota-consultas-list',
  templateUrl: './mascota-consultas-list.component.html',
  styleUrls: ['./mascota-consultas-list.component.css']
})
export class MascotaConsultasListComponent {

  consultas: Consulta[] = [];
  idMascota: number | undefined;
  rolUsuarioSesion: string | null = null;
  isLoading: boolean = false;
  clinicaUsuarioSesion: number | null | undefined = null;

  columnasTabla: string[] = ['fecha', 'acciones'];

  constructor(private consultaService: ConsultaService, private usuarioService: UsuarioService, 
              private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.rolUsuarioSesion = sessionStorage.getItem('rol');
    const idUsuario = sessionStorage.getItem('idUsuario');

    if (idUsuario) {
      this.obtenerClinicaUsuario(+idUsuario); // Obtenemos el 'clinicaId'
    }

    this.route.paramMap.subscribe(params => {
      const id = params.get('idMascota');
      if (id) {
        this.idMascota = +id;
        this.cargarConsultas(this.idMascota);
      } else {
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }

  // Obtenemos el 'clinicaId' del usuario
  obtenerClinicaUsuario(idUsuario: number): void {
    this.usuarioService.getUsuarioPorId(idUsuario).subscribe({
      next: (usuario) => {
        this.clinicaUsuarioSesion = usuario.clinicaId;
        console.log('Clinica del usuario:', this.clinicaUsuarioSesion);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al obtener la clínica del usuario:', err);
      }
    });
  }

  cargarConsultas(idMascota: number): void {
    this.isLoading = true;
    this.consultaService.getConsultasPorIdMascota(idMascota).subscribe({
      next: (consultas) => {
        this.consultas = consultas;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar las consultas:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  puedeEliminarConsulta(consulta: Consulta): boolean {
    if (this.rolUsuarioSesion === 'ADMIN') {
      return true; // ADMIN siempre puede eliminar
    }

    if (
      (this.rolUsuarioSesion === 'VETERINARIO' || this.rolUsuarioSesion === 'ADMIN_CLINICA') &&
      this.clinicaUsuarioSesion !== null &&
      consulta.clinicaId === this.clinicaUsuarioSesion
    ) {
      return true; // VETERINARIO y ADMIN_CLINICA pueden eliminar si están en la misma clínica
    }

    return false; // CLIENTE y TEMPORAL no pueden eliminar
  }

  nuevaConsulta(): void {
    if (this.idMascota) {
      this.router.navigate([`/consulta/alta-consulta/${this.idMascota}`]);
    } else {
      console.error('ID de mascota no encontrado.');
    }
  }

  verDetalleConsulta(idConsulta: number): void {
    this.router.navigate([`/consulta/detalle/${idConsulta}`]);
  }

  eliminarConsulta(consulta: Consulta): void {
    const dialogRef = this.dialog.open(BajaConsultaComponent, {
      width: '400px',
      data: consulta,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (this.idMascota) {
          this.cargarConsultas(this.idMascota);
        }
      }
    });
  }

  volver(): void {
    if (this.idMascota) {
      this.router.navigate([`/mascota/dashboard/${this.idMascota}`]);
    }
  }
}
