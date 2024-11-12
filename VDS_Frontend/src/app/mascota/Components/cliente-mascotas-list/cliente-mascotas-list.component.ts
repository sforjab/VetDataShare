import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';

@Component({
  selector: 'app-cliente-mascotas-list',
  templateUrl: './cliente-mascotas-list.component.html',
  styleUrls: ['./cliente-mascotas-list.component.css']
})
export class ClienteMascotasListComponent implements OnInit {
  mascotas: Mascota[] = [];
  idCliente: number | null = null;

  columnasTabla: string[] = ['nombre', 'numChip', 'acciones'];

  constructor(private mascotaService: MascotaService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idUsuario');
      if (id) {
        this.idCliente = +id;
        const idUsuarioSesion = sessionStorage.getItem('idUsuario');
        const rolUsuarioSesion = sessionStorage.getItem('rol');

        if (!idUsuarioSesion || !rolUsuarioSesion) {
          // Redirige al usuario a la página de "Acceso No Autorizado" si no está logueado
          this.router.navigate(['/acceso-no-autorizado']);
          return;
        }

        if (rolUsuarioSesion === 'CLIENTE' && idUsuarioSesion && Number(idUsuarioSesion) !== this.idCliente) {
          // Se redirige al usuario a una página de "Acceso No Autorizado" si no coincide el usuario logueado con el propietarios de las mascotas
          this.router.navigate(['/acceso-no-autorizado']);
        } else {
          this.cargarMascotas(this.idCliente);
        }
      }
    });
  }

  // Cargar las mascotas del usuario logueado
  cargarMascotas(idUsuario: number): void {
    this.mascotaService.getMascotasPorIdUsuario(idUsuario).subscribe({
      next: (mascotas) => {
        this.mascotas = mascotas;
      },
      error: (err) => {
        console.error('Error obteniendo las mascotas:', err);
      }
    });
  }

  // Navegar a la página de detalle de la mascota
  navegarMascotaDashboard(idMascota: number): void {
    console.log('Navegando a Mascota Dashboard con ID:', idMascota);
    this.router.navigate([`/mascota/dashboard/${idMascota}`]);
  }

  volver(): void {
    const idUsuarioSesion = sessionStorage.getItem('idUsuario');
    if (idUsuarioSesion) {
      this.router.navigate([`/cliente/dashboard/${idUsuarioSesion}`]);
    } else {
      console.error('No se encontró el ID del usuario en sesión.');
      this.router.navigate(['/acceso-no-autorizado']);
    }
  }
}