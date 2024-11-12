import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-cliente-dashboard',
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.css']
})
export class ClienteDashboardComponent implements OnInit {

  idCliente: number | null = null;
  rolUsuarioSesion: string | null = null; // Guardamos el rol del usuario logueado

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idUsuario');
      if (id) {
        this.idCliente = +id;
        const idUsuarioSesion = sessionStorage.getItem('idUsuario');
        this.rolUsuarioSesion = sessionStorage.getItem('rol');

        if (!idUsuarioSesion || !this.rolUsuarioSesion) {
          // Redirigir si no está logueado
          this.router.navigate(['/acceso-no-autorizado']);
          return;
        }

        if (this.rolUsuarioSesion === 'CLIENTE' && Number(idUsuarioSesion) !== this.idCliente) {
          // Redirigir si el cliente intenta acceder a otro perfil
          this.router.navigate(['/acceso-no-autorizado']);
        }

        this.usuarioService.verificarIdentidadCliente(this.idCliente).subscribe({
          next: () => {
            console.log('Acceso autorizado para el cliente.');
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error de acceso desde backend:', err);
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

  navegarPerfil() {
    this.router.navigate([`/cliente/perfil/${this.idCliente}`]);
  }

  navegarMascotas() {
    this.router.navigate([`/mascota/cliente-mascotas-list/${this.idCliente}`]);
  }

  navegarGestionClientes() {
    this.router.navigate(['/cliente/gestion-clientes']);
  }

  mostrarBotonVolver(): boolean {
    return this.rolUsuarioSesion !== 'CLIENTE'; // Se muestra únicamente si no es CLIENTE
  }
}
