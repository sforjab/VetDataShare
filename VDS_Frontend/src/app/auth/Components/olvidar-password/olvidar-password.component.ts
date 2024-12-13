import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-olvidar-password',
  templateUrl: './olvidar-password.component.html',
  styleUrl: './olvidar-password.component.css'
})
export class OlvidarPasswordComponent {
  email: string = '';

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {}

  enviarSolicitud(): void {
    this.authService.solicitarRestablecimiento(this.email).subscribe({
      next: () => {
        this.snackBar.open('Se ha enviado un enlace a tu correo', 'Cerrar', { duration: 3000 });
        this.router.navigate(['auth/login']);
      },
      error: (err: any) => {
        console.error('Error en la solicitud de restablecimiento:', err);
        this.snackBar.open('Error al procesar la solicitud. Verifica tu correo e inténtalo nuevamente.', 'Cerrar', { duration: 3000 });
      },
    });
  }
  
}
