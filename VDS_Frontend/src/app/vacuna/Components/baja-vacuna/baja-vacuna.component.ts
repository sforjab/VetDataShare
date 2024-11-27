import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Vacuna } from '../../Models/vacuna.dto';
import { VacunaService } from '../../Services/vacuna.service';

@Component({
  selector: 'app-baja-vacuna',
  templateUrl: './baja-vacuna.component.html',
  styleUrl: './baja-vacuna.component.css'
})
export class BajaVacunaComponent {
  constructor(public dialogRef: MatDialogRef<BajaVacunaComponent>, @Inject(MAT_DIALOG_DATA) public data: Vacuna, 
              private vacunaService: VacunaService, private snackBar: MatSnackBar) {}

  confirmarEliminacion(): void {
    this.vacunaService.deleteVacuna(this.data.id!).subscribe({
      next: () => {
        this.snackBar.open(`Vacuna eliminada correctamente.`, 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error eliminando la vacuna:', err);
        this.snackBar.open(`Error eliminando la vacuna: ${this.data.nombre}.`, 'Cerrar', { duration: 3000 });
        this.dialogRef.close(false);
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
