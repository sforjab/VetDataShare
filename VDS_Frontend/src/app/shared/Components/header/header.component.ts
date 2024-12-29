import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/Services/auth.service';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;
  rolUsuario: string = '';
  usuario: Usuario | null = null;
  mensajeError: string = '';

  constructor(private authService: AuthService, private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.rolUsuario = sessionStorage.getItem('rol') || '';

    this.authService.isUsuarioLogin.subscribe(isLogged => {
      this.isLogged = isLogged;
      if (this.isLogged) {
        this.obtenerDatosUsuario();
      }
    });
  }

  navegarLogin(): void {
    this.router.navigate(['/auth/login']); 
  }

  obtenerDatosUsuario(): void {
    const idUsuario = sessionStorage.getItem('idUsuario');
    if (idUsuario) {
      this.usuarioService.getUsuarioPorId(Number(idUsuario)).subscribe({
        next: (usuario) => {
          this.usuario = usuario;
          console.log('Usuario obtenido:', usuario);
        },
        error: (err) => {
          this.mensajeError = 'Error al obtener los datos del usuario';
          console.error('Error al obtener usuario logueado:', err);
        }
      });
    } else {
      console.error('ID de usuario no encontrado en sessionStorage');
    }
  }

  // Método para cerrar sesión
  logout(): void {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("idUsuario");
    this.authService.usuarioActualLogin.next(false);
    this.authService.usuarioActualRol.next('');
    this.authService.usuarioActualId.next('');

    this.router.navigate(['/']);
  }

  navegarAccesoTemporalValidar(): void {
    this.router.navigate(['/acceso-temporal/validar']);
  }

  navegarDashboard(): void {
    if (!this.usuario || !this.usuario.rol) {
      console.error('Datos de usuario o rol no disponibles');
      return;
    }
  
    switch (this.usuario.rol) {
      case 'CLIENTE':
        this.router.navigate([`/cliente/dashboard/${this.usuario.id}`]);
        break;
      case 'VETERINARIO':
        this.router.navigate([`/veterinario/dashboard/${this.usuario.id}`]);
        break;
      case 'ADMIN_CLINICA':
        this.router.navigate([`/veterinario/dashboard/${this.usuario.id}`]);
        break;
        case 'ADMIN':
          this.router.navigate([`/admin/dashboard`]);
          break;
      default:
        console.error('Rol no reconocido:', this.usuario.rol);
        this.router.navigate(['/acceso-no-autorizado']);
        break;
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
