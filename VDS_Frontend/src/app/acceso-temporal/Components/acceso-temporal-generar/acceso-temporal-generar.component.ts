import { Component } from '@angular/core';
import { AccesoTemporalService } from '../../Services/acceso-temporal.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-acceso-temporal-generar',
  templateUrl: './acceso-temporal-generar.component.html',
  styleUrls: ['./acceso-temporal-generar.component.css']
})
export class AccesoTemporalGenerarComponent {
  mascotaId!: number;
  tipo: string = 'qr'; // Valor predeterminado
  codigoGenerado: string | null = null;

  constructor(private accesoTemporalService: AccesoTemporalService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idMascota'); // Se obtiene el ID de la mascota de la URL
      if (id) {
        this.mascotaId = +id;
      } else {
        console.error('ID de la mascota no encontrado en la URL.');
      }
    });
  }

  generarAcceso(): void {
    const usuarioId = Number(sessionStorage.getItem('idUsuario')); // Se obtiene el ID del usuario desde sesión
    if (!usuarioId || !this.mascotaId) {
      console.error('ID de usuario o mascota faltante');
      return;
    }

    const requestData = {
      usuarioId,
      mascotaId: this.mascotaId,
      tipo: this.tipo
    };

    this.accesoTemporalService.generarAccesoTemporal(requestData).subscribe({
      next: (res: any) => {
        this.codigoGenerado = res.token;
        console.log('Código generado:', this.codigoGenerado);
      },
      error: (err) => {
        console.error('Error al generar acceso temporal:', err);
      }
    });
  }
}
