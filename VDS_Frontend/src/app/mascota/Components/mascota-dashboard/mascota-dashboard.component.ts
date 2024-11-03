import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mascota-dashboard',
  templateUrl: './mascota-dashboard.component.html',
  styleUrls: ['./mascota-dashboard.component.css']
})
export class MascotaDashboardComponent implements OnInit {
  idMascota: number | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navegacion = this.router.getCurrentNavigation();
    
    // Si no hay navegación, intenta obtener el estado del historial
    this.idMascota = navegacion?.extras?.state?.['idMascota'] || history.state.idMascota;
    
    if (!this.idMascota) {
      console.error('ID de la mascota no disponible');
    }
  }
  
  navegarDetalle() {
    this.router.navigate(['/mascota/detalle'], {
      state: { idMascota: this.idMascota }
    });
  }
  
  navegarHistorico() { //Este routing hay que verlo porque habrá que cambiarlo a consulta cuando esté creado
    this.router.navigate(['/mascota/historico'], {
      state: { idMascota: this.idMascota }
    });
  }
  
  navegarPruebas() {
    this.router.navigate(['/prueba/mascota-pruebas-list'], {
      state: { idMascota: this.idMascota }
    });
  }

  navegarVacunas() {
    this.router.navigate(['/vacuna/mascota-vacunas-list'], {
      state: { idMascota: this.idMascota }
    });
  }
}
