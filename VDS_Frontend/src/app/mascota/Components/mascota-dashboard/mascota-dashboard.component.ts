import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '../../Services/mascota.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mascota-dashboard',
  templateUrl: './mascota-dashboard.component.html',
  styleUrls: ['./mascota-dashboard.component.css']
})
export class MascotaDashboardComponent implements OnInit {
  idMascota: number | undefined;

  constructor(private mascotaService: MascotaService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idMascota');
      if (id) {
        this.idMascota = +id;
  
        this.mascotaService.verificarPropietario(this.idMascota).subscribe({
          next: () => {
            console.log('Acceso autorizado a la mascota.');
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error de acceso:', err);
            // Se comprueba el código de estado HTTP
            if (err.status === 403) {
              this.router.navigate(['/acceso-no-autorizado']);
            } else {
              console.error('Error inesperado:', err);
            }
          }
        });
      } else {
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }
  
  navegarDetalle() {
    if (this.idMascota !== null) {
      this.router.navigate([`/mascota/detalle/${this.idMascota}`]);
    } else {
      console.error('ID de la mascota no disponible para navegación');
    }
  }
  
  navegarConsultas() { // Este routing hay que verlo porque habrá que cambiarlo a consulta cuando esté creado
    if (this.idMascota !== null) {
      this.router.navigate([`/consulta/mascota-consultas-list/${this.idMascota}`]);
    } else {
      console.error('ID de la mascota no disponible para navegación');
    }
  }
  
  navegarPruebas() {
    if (this.idMascota !== null) {
      this.router.navigate([`/prueba/mascota-pruebas-list/${this.idMascota}`]);
    } else {
      console.error('ID de la mascota no disponible para navegación');
    }
  }

  navegarVacunas() {
    if (this.idMascota !== null) {
      this.router.navigate([`/vacuna/mascota-vacunas-list/${this.idMascota}`]);
    } else {
      console.error('ID de la mascota no disponible para navegación');
    }
  }

  navegarAccesoTemporal(): void {
    if (this.idMascota !== null) {
      this.router.navigate([`/acceso_temporal/generar/${this.idMascota}`]);
    } else {
      console.error('ID de la mascota no disponible para navegación');
    }
  }

  volver(): void {
    const idUsuarioSesion = sessionStorage.getItem('idUsuario');
    const rolUsuarioSesion = sessionStorage.getItem('rol');
  
    if (!idUsuarioSesion || !rolUsuarioSesion) {
      console.error('No se encontraron datos de sesión. Redirigiendo a acceso no autorizado.');
      this.router.navigate(['/acceso-no-autorizado']);
      return;
    }
  
    if (rolUsuarioSesion === 'CLIENTE') {
      // Navegar al listado de mascotas del cliente
      this.router.navigate([`/mascota/cliente-mascotas-list/${idUsuarioSesion}`]);
    } else {
      // Navegar a la gestión de mascotas
      this.router.navigate(['/mascota/gestion-mascotas']);
    }
  }
}
