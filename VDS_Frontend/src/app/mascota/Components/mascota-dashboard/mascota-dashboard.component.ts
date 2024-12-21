import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '../../Services/mascota.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Mascota } from '../../Models/mascota.dto';
import { Vacuna } from 'src/app/vacuna/Models/vacuna.dto';
import { VacunaService } from 'src/app/vacuna/Services/vacuna.service';
import { Prueba } from 'src/app/prueba/Models/prueba.dto';
import { PruebaService } from 'src/app/prueba/Services/prueba.service';
import { DocumentoPrueba } from 'src/app/prueba/Models/documento-prueba.dto';
import { DocumentoPruebaService } from 'src/app/prueba/Services/documento-prueba.service';
import { Consulta } from 'src/app/consulta/Models/consulta.dto';
import { ConsultaService } from 'src/app/consulta/Services/consulta.service';

@Component({
  selector: 'app-mascota-dashboard',
  templateUrl: './mascota-dashboard.component.html',
  styleUrls: ['./mascota-dashboard.component.css']
})
export class MascotaDashboardComponent implements OnInit {
  idMascota: number | undefined;
  mascota: Mascota | null = null;
  ultimasConsultas: Consulta[] = [];
  ultimasPruebas: Prueba[] = [];
  ultimasVacunas: Vacuna[] = [];
  isLoading: boolean = false;
  rolUsuario: string | null = null;
  origen: string | null = null;

  constructor(private mascotaService: MascotaService, private vacunaService: VacunaService, private pruebaService: PruebaService, private consultaService: ConsultaService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idMascota');
      if (id) {
        this.idMascota = +id;

        this.route.queryParams.subscribe(queryParams => {
          this.origen = queryParams['origen'] || null;
        });

        this.rolUsuario = sessionStorage.getItem('rol');

        // Se inicia la carga de la mascota
        this.cargarMascota(this.idMascota);

        // Cargamos las últimas pruebas
        this.cargarUltimasConsultas(this.idMascota);

        // Cargamos las últimas pruebas
        this.cargarUltimasPruebas(this.idMascota);

        // Cargamos las últimas vacunas
        this.cargarUltimasVacunas(this.idMascota);

        // Verifica permisos
        this.mascotaService.verificarPropietario(this.idMascota).subscribe({
          next: () => {
            console.log('Acceso autorizado a la mascota.');
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error de acceso:', err);
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

  cargarUltimasConsultas(idMascota: number): void {
    this.consultaService.getUltimasConsultas(idMascota).subscribe({
        next: (consultas) => {
            this.ultimasConsultas = consultas;
            console.log('Consultas cargadas:', consultas);
        },
        error: (err) => {
            console.error('Error obteniendo las últimas pruebas:', err);
        }
    });
  }

  cargarUltimasPruebas(idMascota: number): void {
    this.pruebaService.getUltimasPruebas(idMascota).subscribe({
        next: (pruebas) => {
            this.ultimasPruebas = pruebas;
            console.log('Pruebas cargadas:', pruebas);
        },
        error: (err) => {
            console.error('Error obteniendo las últimas pruebas:', err);
        }
    });
  }

  cargarUltimasVacunas(idMascota: number): void {
    this.vacunaService.getUltimasVacunas(idMascota).subscribe({
      next: (vacunas) => {
        this.ultimasVacunas = vacunas;
      },
      error: (err) => {
        console.error('Error obteniendo las últimas vacunas:', err);
      }
    });
  }

  // Carga los datos de la mascota
  cargarMascota(idMascota: number): void {
    this.isLoading = true;
    this.mascotaService.getMascotaPorId(idMascota).subscribe({
      next: (mascota) => {
        this.mascota = mascota;
      },
      error: (err) => {
        console.error('Error obteniendo la mascota:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  verDetallePrueba(idPrueba: number): void {
    this.router.navigate([`/prueba/detalle/${idPrueba}`], {
      queryParams: { origen: 'mascota-dashboard' }
    });
  }

  verDetalleConsulta(idConsulta: number): void {
    this.router.navigate([`/consulta/detalle/${idConsulta}`], {
      queryParams: { origen: 'mascota-dashboard' }
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
      this.router.navigate([`/mascota/cliente-mascotas-list/${idUsuarioSesion}`]);
      return;
    }

    if (this.origen === 'cliente-mascotas-list') {
      if (this.idMascota !== undefined) {
        this.mascotaService.getMascotaPorId(this.idMascota).subscribe({
          next: (mascota) => {
            if (mascota && mascota.propietarioId) {
              this.router.navigate([`/mascota/cliente-mascotas-list/${mascota.propietarioId}`]);
            } else {
              console.error('No se encontró el propietario de la mascota.');
              this.router.navigate(['/acceso-no-autorizado']);
            }
          },
          error: (err) => {
            console.error('Error obteniendo el propietario de la mascota:', err);
            this.router.navigate(['/acceso-no-autorizado']);
          }
        });
      } else {
        this.router.navigate(['/mascota/gestion-mascotas']);
      }
    } else {
      this.router.navigate(['/mascota/gestion-mascotas']);
    }
  }
}
