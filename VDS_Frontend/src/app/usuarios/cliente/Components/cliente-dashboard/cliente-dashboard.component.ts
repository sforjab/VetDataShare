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
  rolUsuarioSesion: string | null = null; 
  cliente: any = null; 
  isLoading: boolean = true;

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idUsuario');
      if (id) {
        this.idCliente = +id;
        const idUsuarioSesion = sessionStorage.getItem('idUsuario');
        this.rolUsuarioSesion = sessionStorage.getItem('rol');

        if (!idUsuarioSesion || !this.rolUsuarioSesion) {
          this.router.navigate(['/acceso-no-autorizado']);
          return;
        }

        if (this.rolUsuarioSesion === 'CLIENTE' && Number(idUsuarioSesion) !== this.idCliente) {
          this.router.navigate(['/acceso-no-autorizado']);
          return;
        }

        this.usuarioService.getUsuarioPorId(this.idCliente).subscribe({
          next: (data) => {
            this.cliente = data; // Asignamos los datos del cliente
            this.isLoading = false; // Ocultamos el spinner
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error al obtener datos del cliente:', err);
            this.isLoading = false; // Ocultamos el spinner en caso de error
            if (err.status === 403) {
              console.log('Acceso no autorizado')
              this.router.navigate(['/acceso-no-autorizado']);
            } else if (err.status === 404) {
              console.error('Usuario no encontrado');
              this.router.navigate(['/acceso-no-autorizado']);
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
