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
  rolUsuario: string | null = null;
  origin: string | null = null;

  constructor(private mascotaService: MascotaService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idMascota');
      if (id) {
        this.idMascota = +id;

        this.route.queryParams.subscribe((queryParams) => {
          this.origin = queryParams['origin'] || null;
        });

        this.rolUsuario = sessionStorage.getItem('rol');
  
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
  
  navegarConsultas() {
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
      this.router.navigate([`/acceso-temporal/generar/${this.idMascota}`]);
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
        // Si es cliente, se navega al listado de sus mascotas
        this.router.navigate([`/mascota/cliente-mascotas-list/${idUsuarioSesion}`]);
        return;
    }

    // Si no es cliente, determinamos el origen
    if (this.origin === 'cliente-mascotas-list') {
        // Navegamos al listado de mascotas del cliente según el propietario
        if (this.idMascota !== undefined) {
            this.mascotaService.getMascotaPorId(this.idMascota).subscribe({
                next: (mascota) => {
                    if (mascota && mascota.propietarioId) {
                        // Redirigimos al listado del propietario
                        this.router.navigate([`/mascota/cliente-mascotas-list/${mascota.propietarioId}`]);
                    } else {
                        console.error('No se encontró el propietario de la mascota. Redirigiendo a acceso no autorizado.');
                        this.router.navigate(['/acceso-no-autorizado']);
                    }
                },
                error: (err) => {
                    console.error('Error obteniendo el propietario de la mascota:', err);
                    this.router.navigate(['/acceso-no-autorizado']);
                }
            });
        } else {
            console.error('ID de la mascota no está definido. Redirigiendo a gestión de mascotas.');
            this.router.navigate(['/mascota/gestion-mascotas']);
        }
    } else {
        // Si el origen no es 'cliente-mascotas-list', se navega a gestión de mascotas
        this.router.navigate(['/mascota/gestion-mascotas']);
    }
}

}
