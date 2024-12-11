import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Clinica } from '../../Models/clinica.dto';
import { ClinicaService } from '../../Services/clinica.service';

@Component({
  selector: 'app-alta-clinica',
  templateUrl: './alta-clinica.component.html',
  styleUrl: './alta-clinica.component.css'
})
export class AltaClinicaComponent {
  clinica: Clinica = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    activo: true
  };

  constructor(
    private clinicaService: ClinicaService, private router: Router, private snackBar: MatSnackBar) {}

  crearClinica(): void {
    this.clinicaService.createClinica(this.clinica).subscribe({
      next: () => {
        this.snackBar.open('Clínica creada con éxito', 'Cerrar', { duration: 3000 });
        this.volver();
      },
      error: (err) => {
        console.error('Error al crear la clínica:', err);
        this.snackBar.open('Error al crear la clínica', 'Cerrar', { duration: 3000 });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/clinica/gestion-clinicas']);
  }
}
