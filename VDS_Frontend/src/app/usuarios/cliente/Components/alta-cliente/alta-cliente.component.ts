import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Rol, Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.component.html',
  styleUrls: ['./alta-cliente.component.css']
})
export class AltaClienteComponent implements OnInit {
  /* cliente: Usuario = {
    numIdent: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    telefono: '',
    email: '',
    rol: Rol.CLIENTE, // Rol por defecto
    username: '',
    password: ''
  }; */
  clienteForm!: FormGroup;

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder, 
              private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.clienteForm = this.fb.group({
      numIdent: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: [''],
      direccion: [''],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]] // Validación de formato de email
    });
  }

  crearCliente(): void {
    if (this.clienteForm.invalid) {
      this.snackBar.open('Por favor, corrija los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    const cliente: Usuario = {
      ...this.clienteForm.value,
      rol: Rol.CLIENTE,
      username: this.clienteForm.value.numIdent, // Asignamos 'numIdent' como 'username'
      password: 'password' // Contraseña predeterminada
    };
/* 
    if (!this.cliente.username) {
      this.cliente.username = this.cliente.numIdent; // Se asigna 'numIdent' como username
    }
    if (!this.cliente.password) {
      this.cliente.password = 'password'; // Asigamos un password por defecto
    } */
    
    this.usuarioService.createUsuario(cliente).subscribe({
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

  campoEsInvalido(campo: string): boolean {
    const control = this.clienteForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  volver(): void {
    this.router.navigate(['/cliente/gestion-clientes']);
  }
}
