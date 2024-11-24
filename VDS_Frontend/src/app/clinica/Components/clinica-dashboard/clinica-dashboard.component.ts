import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-clinica-dashboard',
  templateUrl: './clinica-dashboard.component.html',
  styleUrl: './clinica-dashboard.component.css'
})
export class ClinicaDashboardComponent {
  idClinica: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idClinica');
      if (id) {
        this.idClinica = +id;
      }
    });
  }

  navegarDatosClinica(): void {
    if (this.idClinica !== null) {
      this.router.navigate([`/clinica/datos-clinica/${this.idClinica}`]);
    }
  }

  navegarGestionEmpleados(): void {
    if (this.idClinica !== null) {
      this.router.navigate([`/clinica/gestion-empleados/${this.idClinica}`]);
    }
  }

  navegarVolver(): void {
    const idUsuario = sessionStorage.getItem('idUsuario');
    if (idUsuario) {
      this.router.navigate([`/veterinario/dashboard/${idUsuario}`]);
    }
  }
}
