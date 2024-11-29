import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentoPrueba } from '../../Models/documento-prueba.dto';
import { DocumentoPruebaService } from '../../Services/documento-prueba.service';

@Component({
  selector: 'app-eliminar-documento',
  templateUrl: './eliminar-documento.component.html',
  styleUrl: './eliminar-documento.component.css'
})
export class EliminarDocumentoComponent {
  constructor(
    public dialogRef: MatDialogRef<EliminarDocumentoComponent>, @Inject(MAT_DIALOG_DATA) public data: DocumentoPrueba,
    private documentoPruebaService: DocumentoPruebaService, private snackBar: MatSnackBar) {}

  confirmarEliminacion(): void {
    this.documentoPruebaService.deleteDocumento(this.data.id!).subscribe({
      next: () => {
        this.snackBar.open(`Documento "${this.data.nombreArchivo}" eliminado correctamente.`, 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error eliminando el documento:', err);
        this.snackBar.open(`Error eliminando el documento: ${this.data.nombreArchivo}.`, 'Cerrar', { duration: 3000 });
        this.dialogRef.close(false);
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
