import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-veterinario-dashboard',
  templateUrl: './veterinario-dashboard.component.html',
  styleUrls: ['./veterinario-dashboard.component.css']
})
export class VeterinarioDashboardComponent {
  constructor(private router: Router) {}

  navegarPerfil(): void {
    this.router.navigate(['/veterinario/perfil']);
  }

  navegarClientes(): void {
    this.router.navigate(['/cliente/gestion-clientes']);
  }

  navegarMascotas(): void {
    this.router.navigate(['/mascota/gestion-mascotas']);
  }

  navegarConsultas(): void {
    this.router.navigate(['/consulta/gestion-consultas']);
  }
}
