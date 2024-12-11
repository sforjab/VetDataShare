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
