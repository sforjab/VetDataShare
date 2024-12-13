import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-restablecer-password',
  templateUrl: './restablecer-password.component.html',
  styleUrl: './restablecer-password.component.css'
})
export class RestablecerPasswordComponent {
  token: string = '';
  password: string = '';
  confirmarPassword: string = '';

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  guardarNuevoPassword(): void {
    if (this.password !== this.confirmarPassword) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', { duration: 3000 });
      return;
    }
  
    this.authService.restablecerPassword(this.token, this.password).subscribe({
      next: () => {
        this.snackBar.open('Contraseña actualizada con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate(['auth/login']);
      },
      error: (err: any) => {
        console.error('Error al restablecer la contraseña:', err);
        this.snackBar.open('Error al restablecer la contraseña. Inténtalo nuevamente.', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
