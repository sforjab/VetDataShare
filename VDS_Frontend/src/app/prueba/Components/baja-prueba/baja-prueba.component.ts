import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Prueba } from '../../Models/prueba.dto';
import { PruebaService } from '../../Services/prueba.service';

@Component({
  selector: 'app-baja-prueba',
  templateUrl: './baja-prueba.component.html',
  styleUrl: './baja-prueba.component.css'
})
export class BajaPruebaComponent {
  constructor(
    public dialogRef: MatDialogRef<BajaPruebaComponent>, @Inject(MAT_DIALOG_DATA) public data: Prueba, private pruebaService: PruebaService, private snackBar: MatSnackBar) {}

  confirmarEliminacion(): void {
    this.pruebaService.deletePrueba(this.data.id!).subscribe({
      next: () => {
        this.snackBar.open(`Prueba eliminada correctamente.`, 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error eliminando la prueba:', err);
        this.snackBar.open(`Error eliminando la prueba: ${this.data.tipo}.`, 'Cerrar', { duration: 3000 });
        this.dialogRef.close(false);
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
