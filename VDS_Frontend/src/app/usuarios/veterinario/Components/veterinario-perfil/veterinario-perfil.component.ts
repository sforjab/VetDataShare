import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rol, Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-veterinario-perfil',
  templateUrl: './veterinario-perfil.component.html',
  styleUrls: ['./veterinario-perfil.component.css']
})
export class VeterinarioPerfilComponent implements OnInit {
  usuario: Usuario = {
    numIdent: '',
    numColegiado: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    rol: Rol.VETERINARIO,
    username: '',
    password: ''
  };

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario(): void {
    /* this.usuarioService.getUsuarioLogueado().subscribe({
      next: (usuario) => {
        this.usuario = usuario; // Guardamos los datos del usuario
      },
      error: (err) => {
        console.error('Error al obtener datos del usuario:', err);
      }
    }); */
  }

  // Guardar los cambios en el perfil
  guardarPerfil(): void {
    if (this.usuario.id) {
      this.usuarioService.updateUsuario(this.usuario.id, this.usuario).subscribe({
        next: (usuarioActualizado) => {
          alert('Perfil actualizado exitosamente');
          this.router.navigate(['/veterinario/']);  // Volver al dashboard después de guardar
        },
        error: (error) => {
          console.error('Error al actualizar el perfil:', error);
          alert('Hubo un problema al actualizar el perfil.');
        }
      });
    }
  }

  // Volver al dashboard
  volver(): void {
    this.router.navigate(['/veterinario/']);
  }
}
