import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceso-restringido',
  templateUrl: './acceso-restringido.component.html',
  styleUrls: ['./acceso-restringido.component.css']
})
export class AccesoRestringidoComponent {

  constructor(private router: Router) {}

  volverDashboard(): void {
    const idUsuarioSesion = sessionStorage.getItem('idUsuario');
    const rolUsuarioSesion = sessionStorage.getItem('rol');

    if (idUsuarioSesion && rolUsuarioSesion) {
      if (rolUsuarioSesion === 'CLIENTE') {
        this.router.navigate([`/cliente/${idUsuarioSesion}`]);
      } else if (rolUsuarioSesion === 'VETERINARIO') {
        this.router.navigate([`/veterinario/${idUsuarioSesion}`]);
      } else if (rolUsuarioSesion === 'ADMIN_CLINICA') {
        this.router.navigate([`/admin-clinica/${idUsuarioSesion}`]);
      }
    } else {
      this.router.navigate(['/']); // En caso de que no haya un usuario logueado, redirige a la página de inicio.
    }
  }
}
