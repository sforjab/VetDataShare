import { Component, OnInit } from '@angular/core';
import { Mascota } from '../../Models/mascota.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '../../Services/mascota.service';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mascota-detalle',
  templateUrl: './mascota-detalle.component.html',
  styleUrls: ['./mascota-detalle.component.css']
})
export class MascotaDetalleComponent implements OnInit {
  mascota: Mascota = {
    numChip: '',
    nombre: '',
    especie: '',
    raza: '',
    sexo: '',
    fechaNacimiento: '',
    propietarioId: 0
  };
  propietario: Usuario | null = null;
  idMascota: number | null = null;
  isLoading: boolean = false;
  puedeEditar: boolean = false;

  constructor(private mascotaService: MascotaService, private usuarioService: UsuarioService, 
              private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idMascota');
      if (id) {
        this.idMascota = +id;
        this.cargarMascotaDetalle(this.idMascota);

        const rolUsuarioSesion = sessionStorage.getItem('rol');
        this.puedeEditar = this.evaluarPermisos(rolUsuarioSesion);
      } else {
        console.error('ID de la mascota no disponible en la URL');
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }
  
  cargarMascotaDetalle(id: number): void {
    this.isLoading = true;
    this.mascotaService.getMascotaPorId(id).subscribe({
      next: (mascota) => {
        this.mascota = mascota;
        if (mascota.propietarioId) {
          this.cargarPropietario(mascota.propietarioId);
        }
      },
      error: (err) => {
        console.error('Error obteniendo los detalles de la mascota:', err);
        if (err.status === 403) {
          this.router.navigate(['/acceso-no-autorizado']);
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  cargarPropietario(idUsuario: number): void {
    this.usuarioService.getUsuarioPorId(idUsuario).subscribe({
      next: (usuario) => {
        this.propietario = usuario;
      },
      error: (err) => {
        console.error('Error obteniendo los detalles del propietario:', err);
      }
    });
  }

  evaluarPermisos(rol: string | null): boolean {
    // CLIENTE y TEMPORAL no pueden editar
    if (rol === 'CLIENTE' || rol === 'TEMPORAL') {
      return false;
    }
    // VETERINARIO, ADMIN_CLINICA y ADMIN pueden editar
    if (rol === 'VETERINARIO' || rol === 'ADMIN_CLINICA' || rol === 'ADMIN') {
      return true;
    }
    // Por defecto, no permitir la edición
    return false;
  }

  guardarCambios(): void {
    if (this.mascota && this.idMascota) {
        const fechaNacimiento = this.mascota.fechaNacimiento 
            ? new Date(this.mascota.fechaNacimiento).toLocaleDateString('en-CA')
            : '';

        const mascotaActualizada: Mascota = {
            ...this.mascota,
            fechaNacimiento
        };

        this.isLoading = true;
        this.mascotaService.updateMascota(this.idMascota, mascotaActualizada).subscribe({
            next: () => {
                this.snackBar.open('Mascota actualizada con éxito', 'Cerrar', {
                    duration: 3000,
                });
            },
            error: (err) => {
                console.error('Error al actualizar la mascota:', err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }
  }

  volver(): void {
    this.router.navigate([`/mascota/dashboard/${this.idMascota}`]);
}
}
