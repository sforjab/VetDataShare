import { Component, OnInit } from '@angular/core';
import { Mascota } from '../../Models/mascota.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '../../Services/mascota.service';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mascota-detalle',
  templateUrl: './mascota-detalle.component.html',
  styleUrls: ['./mascota-detalle.component.css']
})
export class MascotaDetalleComponent implements OnInit {
  mascotaForm!: FormGroup;
  mascota: Mascota | null = null; // Información completa de la mascota
  propietario: Usuario | null = null;
  idMascota: number | null = null;
  isLoading: boolean = false;
  puedeEditar: boolean = false;
  origen: string | null = null;

  constructor(
    private mascotaService: MascotaService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('idMascota');
      if (!id) {
        console.error('ID de la mascota no disponible en la URL');
        this.router.navigate(['/acceso-no-autorizado']);
        return;
      }

      this.route.queryParams.subscribe(queryParams => {
        this.origen = queryParams['origen'] || null;
      });

      this.idMascota = +id;

       // Verifica permisos
      this.mascotaService.verificarPropietario(this.idMascota).subscribe({
        next: () => {
          console.log('Acceso autorizado a la mascota.');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error de acceso:', err);
          if (err.status === 403) {
            this.router.navigate(['/acceso-no-autorizado']);
          } else {
            console.error('Error inesperado:', err);
          }
        }
      });

      this.cargarMascotaDetalle(this.idMascota);

      const rolUsuarioSesion = sessionStorage.getItem('rol');
      this.puedeEditar = this.evaluarPermisos(rolUsuarioSesion);

      if (this.puedeEditar) {
        this.mascotaForm.enable();
      } else {
        this.mascotaForm.disable();
      }
    });
  }

  inicializarFormulario(): void {
    this.mascotaForm = this.fb.group({
      numChip: ['', [Validators.required, Validators.pattern(/^\d{15}$/)]],
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      sexo: ['', Validators.required],
      fechaNacimiento: ['', [Validators.required, this.validarFechaNacimiento]]
    });
  }

  cargarMascotaDetalle(id: number): void {
    this.isLoading = true;
    this.mascotaService.getMascotaPorId(id).subscribe({
      next: (mascota) => {
        this.mascota = mascota;
        this.mascotaForm.patchValue({
          numChip: mascota.numChip,
          nombre: mascota.nombre,
          especie: mascota.especie,
          raza: mascota.raza,
          sexo: mascota.sexo,
          fechaNacimiento: mascota.fechaNacimiento
        });

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
    return ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'].includes(rol || '');
  }

  guardarCambios(): void {
    if (this.mascotaForm.invalid) {
      this.snackBar.open('Por favor, corrija los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    const mascotaActualizada: Mascota = {
      ...this.mascotaForm.value,
      fechaNacimiento: new Date(this.mascotaForm.value.fechaNacimiento).toISOString().split('T')[0]
    };

    if (this.idMascota) {
      this.isLoading = true;
      this.mascotaService.updateMascota(this.idMascota, mascotaActualizada).subscribe({
        next: () => {
          this.snackBar.open('Mascota actualizada con éxito', 'Cerrar', { duration: 3000 });
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

  campoEsInvalido(campo: string): boolean {
    const control = this.mascotaForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  validarFechaNacimiento(control: any) {
    const fechaSeleccionada = new Date(control.value);
    const fechaActual = new Date();
    return fechaSeleccionada > fechaActual ? { fechaInvalida: true } : null;
  }

  volver(): void {
    this.router.navigate([`/mascota/dashboard/${this.idMascota}`], {
      queryParams: { origen: this.origen }
    });
  }
}
