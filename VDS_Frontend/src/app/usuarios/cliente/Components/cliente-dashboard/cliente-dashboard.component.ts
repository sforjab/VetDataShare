import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-dashboard',
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.css']
})
export class ClienteDashboardComponent {

  constructor(private router: Router) {}

  navegarPerfil() {
    this.router.navigate(['/cliente/perfil']);
  }

  navegarMascotas() {
    this.router.navigate(['/mascota/cliente-mascotas-list']);
  }

}
