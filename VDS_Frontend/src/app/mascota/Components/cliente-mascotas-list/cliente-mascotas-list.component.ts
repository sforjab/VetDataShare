import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';
import { BajaMascotaComponent } from '../baja-mascota/baja-mascota.component';

@Component({
  selector: 'app-cliente-mascotas-list',
  templateUrl: './cliente-mascotas-list.component.html',
  styleUrls: ['./cliente-mascotas-list.component.css']
})
export class ClienteMascotasListComponent implements OnInit {
  mascotas: Mascota[] = [];
  idCliente: number | null = null;
  isLoading: boolean = false;
  rolUsuarioSesion: string | null = null;

  columnasTabla: string[] = ['nombre', 'numChip', 'acciones'];

  constructor(private mascotaService: MascotaService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idUsuario');
      if (id) {
        this.idCliente = +id;
        const idUsuarioSesion = sessionStorage.getItem('idUsuario');
        this.rolUsuarioSesion = sessionStorage.getItem('rol');

        if (!idUsuarioSesion || !this.rolUsuarioSesion) {
          // Redirige al usuario a la página de "Acceso No Autorizado" si no está logueado
          this.router.navigate(['/acceso-no-autorizado']);
          return;
        }

        if (this.rolUsuarioSesion === 'CLIENTE' && idUsuarioSesion && Number(idUsuarioSesion) !== this.idCliente) {
          // Se redirige al usuario a una página de "Acceso No Autorizado" si no coincide el usuario logueado con el propietarios de las mascotas
          this.router.navigate(['/acceso-no-autorizado']);
        } else {
          this.cargarMascotas(this.idCliente);
        }
      }
    });
  }

  // Cargamos las mascotas del usuario logueado
  cargarMascotas(idUsuario: number): void {
    this.isLoading = true;
    this.mascotaService.getMascotasPorIdUsuario(idUsuario).subscribe({
      next: (mascotas) => {
        this.mascotas = mascotas;
      },
      error: (err) => {
        console.error('Error obteniendo las mascotas:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Navegar a la página de detalle de la mascota
  navegarMascotaDashboard(idMascota: number): void {
    /* this.router.navigate([`/mascota/dashboard/${idMascota}`]); */
    this.router.navigate([`/mascota/dashboard/${idMascota}`], {
      queryParams: { origin: 'cliente-mascotas-list' },
    });
  }

  crearMascota(): void {
    if (this.idCliente) {
      this.router.navigate([`/mascota/alta-mascota/${this.idCliente}`]); // Redirige al componente de alta
    } else {
      console.error('ID del cliente no disponible.');
    }
  }

  eliminarMascota(mascota: Mascota): void {
    const dialogRef = this.dialog.open(BajaMascotaComponent, {
      width: '400px',
      data: mascota
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarMascotas(this.idCliente!); // Refrescar la lista de mascotas después de eliminar
      }
    });
  }

  volver(): void {
    this.router.navigate([`/cliente/dashboard/${this.idCliente}`]);
  }
}