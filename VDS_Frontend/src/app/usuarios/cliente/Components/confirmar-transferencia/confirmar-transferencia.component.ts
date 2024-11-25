import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-confirmar-transferencia',
  templateUrl: './confirmar-transferencia.component.html',
  styleUrl: './confirmar-transferencia.component.css'
})
export class ConfirmarTransferenciaComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmarTransferenciaComponent>, @Inject(MAT_DIALOG_DATA) public data: { idOrigen: string; idDestino: string; idMascota: number | null }, 
              private usuarioService: UsuarioService, private snackBar: MatSnackBar) {}

  /* confirmarTransferencia(): void {
    this.usuarioService.transferirMascotas(this.data.idOrigen, this.data.idDestino).subscribe({
      next: () => {
        this.snackBar.open(
          `Transferencia de mascotas completada correctamente.`,
          'Cerrar',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error realizando la transferencia:', err);
        this.snackBar.open(
          `Error realizando la transferencia entre ${this.data.idOrigen} y ${this.data.idDestino}.`,
          'Cerrar',
          { duration: 3000 }
        );
        this.dialogRef.close(false);
      }
    });
  } */

    /* confirmarTransferencia(): void {
      this.usuarioService.transferirMascotas(this.data.idOrigen, this.data.idDestino, this.data.idMascota).subscribe({
        next: () => {
          this.snackBar.open('Transferencia completada con éxito.', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error durante la transferencia:', err);
          this.snackBar.open('Error durante la transferencia.', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(false);
        }
      });
    } */

      confirmarTransferencia(): void {
        const { idOrigen, idDestino, idMascota } = this.data;
      
        this.usuarioService.transferirMascotas(idOrigen, idDestino, idMascota).subscribe({
          next: () => {
            this.snackBar.open(
              'Transferencia realizada correctamente.',
              'Cerrar',
              { duration: 3000 }
            );
            this.dialogRef.close(true); // Informar éxito
          },
          error: (err) => {
            console.error('Error realizando la transferencia:', err);
            this.snackBar.open(
              'Error al realizar la transferencia.',
              'Cerrar',
              { duration: 3000 }
            );
            this.dialogRef.close(false); // Informar fallo
          }
        });
      }
      

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
