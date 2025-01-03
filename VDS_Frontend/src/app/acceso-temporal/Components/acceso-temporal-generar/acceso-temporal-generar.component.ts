import { Component } from '@angular/core';
import { AccesoTemporalService } from '../../Services/acceso-temporal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GenerarAccesoRequestDTO } from '../../Models/generar-acceso-request.dto';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';

@Component({
  selector: 'app-acceso-temporal-generar',
  templateUrl: './acceso-temporal-generar.component.html',
  styleUrls: ['./acceso-temporal-generar.component.css']
})
export class AccesoTemporalGenerarComponent {
  mascotaId!: number;
  mascota: Mascota | null = null;
  codigoGeneradoQR: string | null = null;
  codigoGeneradoNumerico: string | null = null;

  constructor(private accesoTemporalService: AccesoTemporalService, private mascotaService: MascotaService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idMascota'); // Se obtiene el ID de la mascota de la URL
      if (id) {
        this.mascotaId = +id;
        /* this.obtenerNumChipMascota(this.mascotaId); */
        this.obtenerMascota(this.mascotaId);
      } else {
        console.error('ID de la mascota no encontrado en la URL.');
      }
    });
  }

  /* obtenerNumChipMascota(mascotaId: number): void { */
  obtenerMascota(mascotaId: number): void {
    this.mascotaService.getMascotaPorId(mascotaId).subscribe({
      next: (mascota: any) => {
        this.mascota = mascota;
        /* this.numChip = mascota.numChip; */
      },
      error: (err: any) => {
        console.error('Error al obtener el número de chip de la mascota:', err);
      }
    });
  }

  generarAcceso(): void {
    const usuarioId = Number(sessionStorage.getItem('idUsuario')); // Se obtiene el ID del usuario desde sesión
    if (!usuarioId || !this.mascotaId) {
      console.error('ID de usuario o número de chip de mascota faltante');
      return;
    }

    const requestData: GenerarAccesoRequestDTO = {
      usuarioId,
      mascotaId: this.mascotaId
    };
    console.log('Datos de la petición:', requestData);

    this.accesoTemporalService.generarAccesoTemporal(requestData).subscribe({
      next: (res: any) => {
        this.codigoGeneradoQR = res.tokenQR; // URL completa para el QR
        this.codigoGeneradoNumerico = res.tokenNumerico; // Código numérico
        console.log('Códigos generados:', this.codigoGeneradoQR, this.codigoGeneradoNumerico);
      },
      error: (err) => {
        console.error('Error al generar acceso temporal:', err);
      }
    });
  }

  volver(): void {
    if (this.mascotaId) {
      this.router.navigate([`/mascota/dashboard/${this.mascotaId}`]);
    } else {
      console.error('ID de mascota no disponible para redirigir al dashboard.');
    }
  }
}