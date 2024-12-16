import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-restablecer-password',
  templateUrl: './restablecer-password.component.html',
  styleUrl: './restablecer-password.component.css'
})
export class RestablecerPasswordComponent {
  restablecerForm!: FormGroup;
  token: string = '';
  errorMensaje: string = '';

  constructor(private authService: AuthService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.restablecerForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16)
        ]
      ],
      confirmarPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16)
        ]
      ]
    });
  }

  guardarNuevoPassword(): void {
    this.errorMensaje = ''; // Limpiar mensajes de error previos

    if (this.restablecerForm.invalid) {
      this.errorMensaje = 'Por favor, corrija los errores en el formulario.';
      return;
    }

    const { password, confirmarPassword } = this.restablecerForm.value;

    if (password !== confirmarPassword) {
      this.errorMensaje = 'Las contraseñas no coinciden.';
      return;
    }

    this.authService.restablecerPassword(this.token, password).subscribe({
      next: () => {
        this.snackBar.open('Contraseña actualizada con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate(['auth/login']);
      },
      error: (err: any) => {
        console.error('Error al restablecer la contraseña:', err);
        this.errorMensaje = 'Error al restablecer la contraseña. Inténtalo nuevamente.';
      },
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.restablecerForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }
}
