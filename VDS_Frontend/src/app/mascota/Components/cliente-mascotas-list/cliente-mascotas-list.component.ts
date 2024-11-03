import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-cliente-mascotas-list',
  templateUrl: './cliente-mascotas-list.component.html',
  styleUrls: ['./cliente-mascotas-list.component.css']
})
export class ClienteMascotasListComponent implements OnInit {
  mascotas: Mascota[] = [];
  usuario: Usuario | null = null;

  columnasTabla: string[] = ['nombre', 'numChip'];

  constructor(private mascotaService: MascotaService, private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerUsuarioYListarMascotas();
  }

  // Obtener el usuario logueado y cargar sus mascotas
  obtenerUsuarioYListarMascotas(): void {
    this.usuarioService.getUsuarioLogueado().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.cargarMascotas(usuario.id!); // Llamamos al servicio de mascotas con el id del usuario logueado
      },
      error: (err) => {
        console.error('Error obteniendo el usuario logueado:', err);
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
  navegarMascotaDashboard(id: number): void {
    console.log('Navegando a Mascota Dashboard con ID:', id);
    this.router.navigate(['/mascota'], {
      state: { idMascota: id } // Pasamos el id de la mascota en el estado de navegación
    });
  }
}