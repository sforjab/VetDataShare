import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mascota } from '../../Models/mascota.dto';
import { MascotaService } from '../../Services/mascota.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-baja-mascota',
  templateUrl: './baja-mascota.component.html',
  styleUrl: './baja-mascota.component.css'
})
export class BajaMascotaComponent {
  constructor(public dialogRef: MatDialogRef<BajaMascotaComponent>, @Inject(MAT_DIALOG_DATA) public data: Mascota, private mascotaService: MascotaService, private snackBar: MatSnackBar) {}

  confirmarEliminacion(): void {
    this.mascotaService.deleteMascota(this.data.id!).subscribe({
      next: () => {
        this.snackBar.open(
          `Mascota eliminada correctamente.`,
          'Cerrar',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error eliminando la mascota:', err);
        this.snackBar.open(
          `Error eliminando la mascota con chip ${this.data.numChip}.`,
          'Cerrar',
          { duration: 3000 }
        );
        this.dialogRef.close(false);
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
