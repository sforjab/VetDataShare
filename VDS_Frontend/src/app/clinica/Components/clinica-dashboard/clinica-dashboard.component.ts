import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Clinica } from '../../Models/clinica.dto';
import { ClinicaService } from '../../Services/clinica.service';

@Component({
  selector: 'app-clinica-dashboard',
  templateUrl: './clinica-dashboard.component.html',
  styleUrls: ['./clinica-dashboard.component.css']
})
export class ClinicaDashboardComponent {
  idClinica: number | null = null;
  clinica: Clinica | null = null;
  isLoading: boolean = false; // Propiedad para controlar el estado de carga

  constructor(private clinicaService: ClinicaService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idClinica');
      if (id) {
        this.idClinica = +id;
        this.obtenerClinica(this.idClinica);
      }
    });
  }

  obtenerClinica(idClinica: number): void {
    this.isLoading = true; // Activa el spinner
    this.clinicaService.getClinicaPorId(idClinica).subscribe({
      next: (clinica) => {
        this.clinica = clinica;
      },
      error: (err) => {
        console.error('Error al obtener la clínica:', err);
      },
      complete: () => {
        this.isLoading = false; // Desactiva el spinner
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
    const rolUsuario = sessionStorage.getItem('rol'); // Obtenemos el rol del usuario

    if (!idUsuario) {
      console.error('ID del usuario no encontrado en la sesión.');
      this.router.navigate(['/acceso-no-autorizado']);
      return;
    }

    // Redirigimos según el rol del usuario
    if (rolUsuario === 'ADMIN') {
      this.router.navigate(['/clinica/gestion-clinicas']);
    } else if (rolUsuario === 'VETERINARIO' || rolUsuario === 'ADMIN_CLINICA') {
      this.router.navigate([`/veterinario/dashboard/${idUsuario}`]);
    } else {
      console.error('Rol del usuario no reconocido.');
      this.router.navigate(['/acceso-no-autorizado']);
    }
  }
}
