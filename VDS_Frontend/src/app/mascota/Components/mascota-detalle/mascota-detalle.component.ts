import { Component, OnInit } from '@angular/core';
import { Mascota } from '../../Models/mascota.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '../../Services/mascota.service';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-mascota-detalle',
  templateUrl: './mascota-detalle.component.html',
  styleUrls: ['./mascota-detalle.component.css']
})
export class MascotaDetalleComponent implements OnInit {
  mascota: Mascota | null = null;
  idMascota: number | null = null;
  propietario: Usuario | null = null;

  constructor(private mascotaService: MascotaService, private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idMascota');
      if (id) {
        this.idMascota = +id; // Convertir a número
        this.cargarMascotaDetalle(this.idMascota);
      } else {
        console.error('ID de la mascota no disponible en la URL');
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }
  
  cargarMascotaDetalle(id: number): void {
    this.mascotaService.getMascotaPorId(id).subscribe({
      next: (mascota) => {
        this.mascota = mascota;
      },
      error: (err) => {
        console.error('Error obteniendo los detalles de la mascota:', err);
        if (err.status === 403) {
          this.router.navigate(['/acceso-no-autorizado']);
        }
      }
    });
  }

  cargarPropietario(idUsuario: number): void {
    this.usuarioService.getUsuarioPorId(idUsuario).subscribe({
      next: (usuario) => {
        this.propietario = usuario;
      },
      error: (err) => {
        console.error('Error obteniendo los detalles del propietario:', err);
      }
    });
  }

  volver(): void {
    this.router.navigate([`/mascota/dashboard/${this.idMascota}`]);
}
}
