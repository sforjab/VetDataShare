import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/Services/auth.service';
import { Rol, Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-cliente-perfil',
  templateUrl: './cliente-perfil.component.html',
  styleUrls: ['./cliente-perfil.component.css']
})
export class ClientePerfilComponent implements OnInit {
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
    password: ''
  };

  /* usuario: Usuario | null = null; */
  idCliente: number | null = null;
  esCliente: boolean = false;

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
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

        if (this.esCliente && idUsuarioSesion && Number(idUsuarioSesion) !== this.idCliente) {
          // Se redirige al usuario a una página de "Acceso No Autorizado" si no coincide el usuario logueado con el cliente a editar
          this.router.navigate(['/acceso-no-autorizado']);
        } else {
          this.obtenerDatosUsuario(this.idCliente);
        }
      }
    });
  }
  obtenerDatosUsuario(id: number): void {
    this.usuarioService.getUsuarioPorId(id).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        console.log('Datos del usuario obtenidos:', usuario);
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario:', err);
        /* if (err.status === 403) {
          this.router.navigate(['/acceso-no-autorizado']);  //REPASAR ESTO
        } */
      }
    });
  }

  guardarCambios(): void {
    if (this.usuario) {
      this.usuarioService.updateUsuario(this.idCliente!, this.usuario).subscribe({
        next: () => {
          // Mostramos el snackbar al guardar con éxito
          this.snackBar.open('Usuario actualizado con éxito', 'Cerrar', {
            duration: 3000, // Duración de 3 segundos
            panelClass: ['snackbar-exito'] // Clase CSS personalizada
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al actualizar el usuario:', err);
        }
      });
    }
  }

  volver(): void {
    this.router.navigate([`/cliente/${this.idCliente}`]);
  }
}
