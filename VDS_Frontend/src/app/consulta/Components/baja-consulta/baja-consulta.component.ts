import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Consulta } from '../../Models/consulta.dto';
import { ConsultaService } from '../../Services/consulta.service';

@Component({
  selector: 'app-baja-consulta',
  templateUrl: './baja-consulta.component.html',
  styleUrl: './baja-consulta.component.css'
})
export class BajaConsultaComponent {
  constructor(public dialogRef: MatDialogRef<BajaConsultaComponent>, @Inject(MAT_DIALOG_DATA) public data: Consulta, private consultaService: ConsultaService, private snackBar: MatSnackBar
  ) {}

  confirmarEliminacion(): void {
    this.consultaService.deleteConsulta(this.data.id!).subscribe({
      next: () => {
        this.snackBar.open(
          `Consulta eliminada correctamente.`,
          'Cerrar',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error eliminando la consulta:', err);
        this.snackBar.open(
          `Error eliminando la consulta.`,
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
