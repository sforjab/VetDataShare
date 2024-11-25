import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-baja-cliente',
  templateUrl: './baja-cliente.component.html',
  styleUrl: './baja-cliente.component.css'
})
export class BajaClienteComponent {
  constructor(
    public dialogRef: MatDialogRef<BajaClienteComponent>, @Inject(MAT_DIALOG_DATA) public data: Usuario, private usuarioService: UsuarioService, private snackBar: MatSnackBar) {}

  confirmarEliminacion(): void {
    this.usuarioService.deleteUsuario(this.data.id!).subscribe({
      next: () => {
        this.snackBar.open(`Cliente eliminado correctamente.`, 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error eliminando cliente:', err);
        this.snackBar.open(`Error eliminando el cliente ${this.data.nombre}.`, 'Cerrar', { duration: 3000 });
        this.dialogRef.close(false);
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
