import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { LoginRequestDTO } from '../../Models/login-request.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  mensajeError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const datosLogin = new LoginRequestDTO(this.username, this.password);
    this.authService.login(datosLogin).subscribe({
      next: (response) => {
        // Se guardan en sesión el 'rol' y el 'idUsuario' en sessionStorage para todos los usuarios
        const rolUsuario = sessionStorage.getItem('rol');
        const idUsuario = sessionStorage.getItem('idUsuario');

        if (rolUsuario === 'CLIENTE') {
          this.router.navigate([`/cliente/dashboard/${idUsuario}`]);
        } else if (rolUsuario === 'VETERINARIO' || rolUsuario === 'ADMIN_CLINICA') {
          this.router.navigate([`/veterinario/dashboard/${idUsuario}`]);
        } else if (rolUsuario === 'ADMIN') {
          this.router.navigate([`/admin/dashboard/${idUsuario}`]);
        } else {
          this.router.navigate(['/']);  // Ruta por defecto o home
        }
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }
}
