import { Component, OnInit } from '@angular/core';
import { Mascota } from '../../Models/mascota.dto';
import { Router } from '@angular/router';
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

  constructor(private mascotaService: MascotaService, private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    const navegacion = this.router.getCurrentNavigation();
    this.idMascota = navegacion?.extras?.state?.['idMascota'] || history.state.idMascota;
    
    if (this.idMascota) {
      this.cargarMascotaDetalle(Number(this.idMascota));  // Convertir a número si es necesario
    } else {
      console.error('ID de la mascota no disponible');
    }
  }
  
  cargarMascotaDetalle(id: number): void {
    this.mascotaService.getMascotaPorId(id).subscribe({
      next: (mascota) => {
        this.mascota = mascota;
      },
      error: (err) => {
        console.error('Error obteniendo los detalles de la mascota:', err);
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
}
