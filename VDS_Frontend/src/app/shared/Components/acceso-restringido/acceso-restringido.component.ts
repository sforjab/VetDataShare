import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceso-restringido',
  templateUrl: './acceso-restringido.component.html',
  styleUrls: ['./acceso-restringido.component.css']
})
export class AccesoRestringidoComponent implements OnInit {
  idUsuarioSesion: string = '';
  rolUsuarioSesion: string = '';
  esTemporal: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.rolUsuarioSesion = sessionStorage.getItem('rol') || ''; // Obtiene el rol del sessionStorage
    this.esTemporal = this.rolUsuarioSesion === 'TEMPORAL'; // Evalúa si el rol es TEMPORAL
  }
  

  volverDashboard(): void {
    const idUsuarioSesion = sessionStorage.getItem('idUsuario');

    if (idUsuarioSesion && this.rolUsuarioSesion) {
      if (this.rolUsuarioSesion === 'CLIENTE') {
        this.router.navigate([`/cliente/dashboard/${idUsuarioSesion}`]);
      } else if (this.rolUsuarioSesion === 'VETERINARIO' || this.rolUsuarioSesion === 'ADMIN_CLINICA') {
        this.router.navigate([`/veterinario/dashboard/${idUsuarioSesion}`]);
      } else if (this.rolUsuarioSesion === 'ADMIN') {
        this.router.navigate([`/admin/dashboard`]);
      }
    } else {
      this.router.navigate(['/']); // En caso de que no haya un usuario logueado, redirige a la página de inicio.
    }
  }
}
