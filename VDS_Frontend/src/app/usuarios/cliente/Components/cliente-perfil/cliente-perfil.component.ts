import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Rol, Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-cliente-perfil',
  templateUrl: './cliente-perfil.component.html',
  styleUrls: ['./cliente-perfil.component.css']
})
export class ClientePerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  usuario: Usuario = {
    numIdent: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    direccion: '',
    telefono: '',
    email: '',
    rol: Rol.CLIENTE,
    username: '',
    password: '',
  };

  idCliente: number | null = null;
  esCliente: boolean = false;
  isLoading: boolean = false;

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder, private route: ActivatedRoute, 
              private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    this.route.paramMap.subscribe(params => {
      const id = params.get('idUsuario');
      if (id) {
        this.idCliente = +id;
        const idUsuarioSesion = sessionStorage.getItem('idUsuario');
        const rolUsuarioSesion = sessionStorage.getItem('rol');

        if (!idUsuarioSesion || !rolUsuarioSesion) {
          // Se redirige al usuario a la página de "Acceso No Autorizado" si no está logueado
          this.router.navigate(['/acceso-no-autorizado']);
          return;
        }

        this.esCliente = (rolUsuarioSesion === 'CLIENTE');

        if (this.esCliente) {
          this.perfilForm.disable();
  
          // Habilitamos únicamente los últimos 4 campos
          this.perfilForm.get('direccion')?.enable();
          this.perfilForm.get('telefono')?.enable();
          this.perfilForm.get('email')?.enable();
          this.perfilForm.get('password')?.enable();
        } else {
          this.perfilForm.enable();
        }

        if (this.esCliente && idUsuarioSesion && Number(idUsuarioSesion) !== this.idCliente) {
          // Se redirige al usuario a una página de "Acceso No Autorizado" si no coincide el usuario logueado con el cliente a editar
          this.router.navigate(['/acceso-no-autorizado']);
        } else {
          this.obtenerDatosUsuario(this.idCliente);
        }
      }
    });
  }

  inicializarFormulario(): void {
    this.perfilForm = this.fb.group({
      numIdent: ['', [Validators.required, Validators.maxLength(15)]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellido1: ['', [Validators.required, Validators.maxLength(50)]],
      apellido2: ['', [Validators.maxLength(50)]],
      direccion: ['', [Validators.maxLength(250)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      username: ['', Validators.required],
      password: ['', [Validators.minLength(8), Validators.maxLength(16)]],
    });
  }

  obtenerDatosUsuario(id: number): void {
    this.isLoading = true;
    this.usuarioService.getUsuarioPorId(id).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.perfilForm.patchValue({
          numIdent: usuario.numIdent,
          nombre: usuario.nombre,
          apellido1: usuario.apellido1,
          apellido2: usuario.apellido2,
          direccion: usuario.direccion,
          telefono: usuario.telefono,
          email: usuario.email,
          username: usuario.username,
        });
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  guardarCambios(): void {
    if (this.perfilForm.invalid) {
      this.snackBar.open('Por favor, corrija los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    const datosActualizados: Usuario = {
      ...this.usuario,
      ...this.perfilForm.value,
    };

    if (!datosActualizados.password) {
      delete datosActualizados.password;
    }

    this.isLoading = true;

    this.usuarioService.updateUsuario(this.idCliente!, datosActualizados).subscribe({
      next: () => {
        this.snackBar.open('Usuario actualizado con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-exito'],
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al actualizar el usuario:', err);
        this.snackBar.open('Error al actualizar el usuario', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.perfilForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  volver(): void {
    this.router.navigate([`/cliente/dashboard/${this.idCliente}`]);
  }
}
