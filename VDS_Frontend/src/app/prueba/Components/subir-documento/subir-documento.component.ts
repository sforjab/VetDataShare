import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentoPruebaService } from '../../Services/documento-prueba.service';

@Component({
  selector: 'app-subir-documento',
  templateUrl: './subir-documento.component.html',
  styleUrl: './subir-documento.component.css'
})
export class SubirDocumentoComponent {
  selectedFile: File | null = null;

  constructor(private dialogRef: MatDialogRef<SubirDocumentoComponent>, @Inject(MAT_DIALOG_DATA) public data: { pruebaId: number }, 
              private documentoPruebaService: DocumentoPruebaService, private snackBar: MatSnackBar) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  subirDocumento(): void {
    if (this.selectedFile) {
      this.documentoPruebaService.subirDocumento(this.selectedFile, this.data.pruebaId).subscribe({
        next: () => {
          this.snackBar.open('Documento subido con éxito.', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true); // Cierra el diálogo y refresca la tabla en el componente padre
        },
        error: () => {
          this.snackBar.open('Error al subir el documento.', 'Cerrar', { duration: 3000 });
        },
      });
    } else {
      this.snackBar.open('Por favor selecciona un archivo.', 'Cerrar', { duration: 3000 });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false); // Cierra el diálogo sin realizar cambios
  }
}
