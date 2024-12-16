import { Component } from '@angular/core';
import { AccesoTemporalService } from '../../Services/acceso-temporal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-numero-colegiado',
  templateUrl: './numero-colegiado.component.html',
  styleUrls: ['./numero-colegiado.component.css']
})
export class NumeroColegiadoComponent {
  colegiadoForm!: FormGroup;
  accesoToken!: string;  // Token de acceso temporal que viene de la URL
  mensaje: string = '';

  constructor(private accesoTemporalService: AccesoTemporalService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    
    this.route.paramMap.subscribe(params => {
      const token = params.get('token'); // Recuperamos el token desde la URL
      if (token) {
        this.accesoTemporalService.validarTokenSinExpiracion(token).subscribe({
          next: (res: any) => {
            this.accesoToken = token;
            if (res.numColegiado && res.fechaExpiracion) {
              // Token ya válido, redirigir directamente al dashboard
              this.router.navigate([`/mascota/dashboard/${res.mascotaId}`]);
            }
          },
          error: () => {
            this.mensaje = 'Token no válido o expirado.';
            this.router.navigate(['/']); // Redirigir a la página de inicio en caso de error
          }
        });
      } else {
        console.error('Token de acceso temporal no encontrado en la URL.');
        this.router.navigate(['/']);
      }
    });
  }

  inicializarFormulario(): void {
    this.colegiadoForm = this.fb.group({
      numColegiado: [
        '',
        [
          Validators.required,
          Validators.maxLength(8), // Tamaño máximo de 8 caracteres
          Validators.pattern(/^\d+$/) // Solo números
        ]
      ]
    });
  }
    

  validarColegiado(): void {
    if (this.colegiadoForm.invalid) {
      this.mensaje = 'Por favor, introduce un número de colegiado válido.';
      return;
    }

    const numColegiado = this.colegiadoForm.value.numColegiado;

    const requestData = {
      token: this.accesoToken,
      numColegiado: numColegiado,
      fechaExpiracion: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString() // Una hora desde ahora
    };

    this.accesoTemporalService.actualizarAccesoTemporal(requestData).subscribe({
      next: (res: any) => {
        console.log('Acceso temporal registrado correctamente.');

        // Se guarda el JWT temporal en el 'sessionStorage'
        const jwtTemporal = res.jwtTemporal;
        sessionStorage.setItem('jwtTemporal', jwtTemporal);

        // Guardamos el rol temporal en sesión
        sessionStorage.setItem('rol', 'TEMPORAL');

        // Recuperamos el id de la mascota
        const idMascota = res.idMascota;

        // Navegamos al dashboard de la mascota
        setTimeout(() => {
          this.router.navigate([`/mascota/dashboard/${idMascota}`]);
        }, 0);
      },
      error: (err) => {
        console.error('Error al registrar el acceso temporal:', err);
        this.mensaje = 'Error al registrar el acceso temporal. Por favor, inténtalo de nuevo.';
      }
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.colegiadoForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }
}
