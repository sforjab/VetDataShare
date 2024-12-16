import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { LoginRequestDTO } from '../../Models/login-request.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  mensajeError: string = '';

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.mensajeError = 'Por favor, complete todos los campos correctamente.';
      return;
    }

    const datosLogin = this.loginForm.value;

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
          this.router.navigate([`/admin/dashboard`]);
        } else {
          this.router.navigate(['/acceso-restringido']);
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Credenciales incorrectas
          this.mensajeError = 'Credenciales incorrectas. Inténtelo de nuevo.';
        } else {
          // Otro error
          this.mensajeError = 'Error al iniciar sesión. Por favor, inténtelo más tarde.';
        }
      }
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.loginForm.get(campo);
    return !!(control?.invalid && (control.touched || control.dirty));
  }
}
