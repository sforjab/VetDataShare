import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  constructor(private router: Router) {}

  navegarGestionClinicas(): void {
    this.router.navigate(['/clinica/gestion-clinicas']);
  }

  navegarGestionClientes(): void {
    this.router.navigate(['/cliente/gestion-clientes']);
  }

  navegarGestionMascotas(): void {
    this.router.navigate(['/mascota/gestion-mascotas']);
  }
}
