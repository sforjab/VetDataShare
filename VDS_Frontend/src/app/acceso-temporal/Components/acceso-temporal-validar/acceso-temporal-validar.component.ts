import { Component, OnInit } from '@angular/core';
import { AccesoTemporalService } from '../../Services/acceso-temporal.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-acceso-temporal-validar',
  templateUrl: './acceso-temporal-validar.component.html',
  styleUrls: ['./acceso-temporal-validar.component.css']
})
export class AccesoTemporalValidarComponent implements OnInit {
  accesoTemporalForm!: FormGroup;
  mensaje: string = '';

  constructor(private accesoTemporalService: AccesoTemporalService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.accesoTemporalForm = this.fb.group({
      codigoNumerico: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{6}$/) // Exactamente 6 dígitos
        ]
      ]
    });
  }

  validarCodigo(): void {
    if (this.accesoTemporalForm.invalid) {
      this.mensaje = 'Por favor, introduce un código de 6 dígitos válido.';
      return;
    }

    const codigo = this.accesoTemporalForm.value.codigoNumerico;

    this.accesoTemporalService.validarTokenSinExpiracion(codigo).subscribe({
      next: (res: any) => {
        if (res.numColegiado && res.fechaExpiracion) {
          // Token válido, redirigimos directamente
          this.router.navigate([`/mascota/dashboard/${res.mascotaId}`]);
        } else {
          // Redirigimos al formulario de número de colegiado
          this.router.navigate([`/acceso-temporal/numero-colegiado/${res.token}`]);
        }
      },
      error: (err) => {
        console.error('Error al validar el código:', err);
        this.mensaje = 'Código inválido o expirado.';
      }
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.accesoTemporalForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }    
}
