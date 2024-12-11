import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClinicaService } from '../../Services/clinica.service';

@Component({
  selector: 'app-baja-clinica',
  templateUrl: './baja-clinica.component.html',
  styleUrl: './baja-clinica.component.css'
})
export class BajaClinicaComponent {
  constructor(public dialogRef: MatDialogRef<BajaClinicaComponent>, @Inject(MAT_DIALOG_DATA) public data: { id: number; nombre: string }, 
              private clinicaService: ClinicaService, private snackBar: MatSnackBar) {}

  confirmarBaja(): void {
    this.clinicaService.darBajaClinica(this.data.id).subscribe({
      next: () => {
        this.snackBar.open('Clínica dada de baja con éxito', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        console.error('Error al dar de baja la clínica:', err);
        this.snackBar.open('Error al dar de baja la clínica', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(false);
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
