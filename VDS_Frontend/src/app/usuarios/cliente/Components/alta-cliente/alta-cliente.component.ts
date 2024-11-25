import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Rol, Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.component.html',
  styleUrls: ['./alta-cliente.component.css']
})
export class AltaClienteComponent {
  cliente: Usuario = {
    numIdent: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    telefono: '',
    email: '',
    rol: Rol.CLIENTE, // Rol por defecto
    username: '',
    password: ''
  };

  constructor(
    private usuarioService: UsuarioService, private router: Router, private snackBar: MatSnackBar) {}

  crearCliente(): void {
    if (!this.cliente.username) {
      this.cliente.username = this.cliente.numIdent; // Se asigna 'numIdent' como username
    }
    if (!this.cliente.password) {
      this.cliente.password = 'password'; // Asigamos un password por defecto
    }
    
    this.usuarioService.createUsuario(this.cliente).subscribe({
      next: () => {
        this.snackBar.open('Cliente creado con éxito', 'Cerrar', { duration: 3000 });
        this.volver();
      },
      error: (err) => {
        console.error('Error al crear el cliente:', err);
        this.snackBar.open('Error al crear el cliente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/cliente/gestion-clientes']);
  }
}
