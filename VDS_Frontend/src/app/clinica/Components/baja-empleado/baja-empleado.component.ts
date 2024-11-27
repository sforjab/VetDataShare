import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-baja-empleado',
  templateUrl: './baja-empleado.component.html',
  styleUrl: './baja-empleado.component.css'
})
export class BajaEmpleadoComponent {
  constructor(public dialogRef: MatDialogRef<BajaEmpleadoComponent>, @Inject(MAT_DIALOG_DATA) public data: { id: number; numColegiado: string }, private usuarioService: UsuarioService, private snackBar: MatSnackBar) {}

  confirmarBaja(): void {
    this.usuarioService.desvincularEmpleado(this.data.id).subscribe({
      next: () => {
        this.snackBar.open(`Empleado desvinculado con éxito`, 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        console.error('Error al desvincular empleado:', err);
        this.snackBar.open('Error al desvincular el empleado', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(false);
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
