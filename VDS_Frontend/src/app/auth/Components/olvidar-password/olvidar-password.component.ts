import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-olvidar-password',
  templateUrl: './olvidar-password.component.html',
  styleUrl: './olvidar-password.component.css'
})
export class OlvidarPasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  mensajeError: string = '';

  constructor(private authService: AuthService, private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.passwordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    });
  }

  enviarSolicitud(): void {
    if (this.passwordForm.invalid) {
      this.mensajeError = 'Por favor, corrija los errores en el formulario.';
      return;
    }
  
    const email = this.passwordForm.get('email')?.value;
  
    this.authService.solicitarRestablecimiento(email).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.snackBar.open(response.message, 'Cerrar', { duration: 3000 });
          this.router.navigate(['auth/login']);
        } else if (response.status === 'error') {
          this.mensajeError = response.message;
        }
      },
      error: (err) => {
        this.mensajeError = 'Error inesperado. Inténtalo nuevamente.';
        console.error('Error inesperado:', err);
      },
    });
  }
  

  campoEsInvalido(campo: string): boolean {
    const control = this.passwordForm.get(campo);
    return !!(control?.invalid && (control.touched || control.dirty));
  }
  
}
