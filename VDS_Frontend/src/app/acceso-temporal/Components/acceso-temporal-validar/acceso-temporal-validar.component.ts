import { Component } from '@angular/core';
import { AccesoTemporalService } from '../../Services/acceso-temporal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceso-temporal-validar',
  templateUrl: './acceso-temporal-validar.component.html',
  styleUrls: ['./acceso-temporal-validar.component.css']
})
export class AccesoTemporalValidarComponent {
  codigoNumerico: string = '';
  mensaje: string = '';

  constructor(private accesoTemporalService: AccesoTemporalService, private router: Router) {}

  /* validarCodigo(): void {
    if (!this.codigoNumerico || this.codigoNumerico.length !== 6) {
      this.mensaje = 'Por favor, introduce un código de 6 dígitos válido.';
      return;
    }

    this.accesoTemporalService.validarTokenSinExpiracion(this.codigoNumerico).subscribe({
      next: (res: any) => {
        this.router.navigate([`/acceso-temporal/numero-colegiado/${res.token}`]);
      },
      error: (err) => {
        console.error('Error al validar el código:', err);
        this.mensaje = 'Código inválido o expirado.';
      }
    });
  } */

    validarCodigo(): void {
      if (!this.codigoNumerico || this.codigoNumerico.length !== 6) {
        this.mensaje = 'Por favor, introduce un código de 6 dígitos válido.';
        return;
      }
    
      this.accesoTemporalService.validarTokenSinExpiracion(this.codigoNumerico).subscribe({
        next: (res: any) => {
          if (res.numColegiado && res.fechaExpiracion) {
            // Token ya válido, redirige directamente al dashboard de la mascota
            this.router.navigate([`/mascota/dashboard/${res.mascotaId}`]);
          } else {
            // Redirigie al formulario de número de colegiado si aún no se completó
            this.router.navigate([`/acceso-temporal/numero-colegiado/${res.token}`]);
          }
        },
        error: (err) => {
          console.error('Error al validar el código:', err);
          this.mensaje = 'Código inválido o expirado.';
        }
      });
    }    
}
