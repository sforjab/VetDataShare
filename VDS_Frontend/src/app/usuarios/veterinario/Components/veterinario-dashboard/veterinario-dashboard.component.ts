import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-veterinario-dashboard',
  templateUrl: './veterinario-dashboard.component.html',
  styleUrls: ['./veterinario-dashboard.component.css']
})
export class VeterinarioDashboardComponent implements OnInit {
  idUsuario: number | null = null;
  rolUsuarioSesion: string | null = null;
  idClinica: number | null = null;
  idUsuarioSesion: number | null = null;

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idUsuario');
      if (id) {
        this.idUsuario = +id;
        this.idUsuarioSesion = Number(sessionStorage.getItem('idUsuario'));
        this.rolUsuarioSesion = sessionStorage.getItem('rol');

        if (!this.idUsuarioSesion || !this.rolUsuarioSesion) {
          // Redirigimos si no está logueado
          this.router.navigate(['/acceso-no-autorizado']);
          return;
        }

        if ((this.rolUsuarioSesion === 'VETERINARIO' || this.rolUsuarioSesion === 'ADMIN_CLINICA') && this.idUsuarioSesion !== this.idUsuario) {
          // Redirigimos si el veterinario o el admin clínica intenta acceder a otro perfil
          this.router.navigate(['/acceso-no-autorizado']);
        }

        /* this.usuarioService.verificarIdentidadVeterinario(this.idVeterinario).subscribe({
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
        }); */

        // Realizar la petición para obtener el usuario y la clínica asociada
        this.usuarioService.getUsuarioPorId(this.idUsuario).subscribe({
          next: (usuario: Usuario) => {
            console.log('Respuesta del backend:', usuario);
            if (usuario.clinicaId  && usuario.clinicaId  !== undefined) {
              this.idClinica = usuario.clinicaId ;
              console.log('ID de Clínica:', this.idClinica);
            } else {
              console.error('El usuario no tiene una clínica asociada.');
              this.router.navigate(['/acceso-no-autorizado']);
            }
          },
          error: (err) => {
            console.error('Error al obtener el usuario:', err);
            this.router.navigate(['/acceso-no-autorizado']);
          }
        });
      } else {
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }
  
  navegarPerfil(): void {
    this.router.navigate([`/veterinario/perfil/${this.idUsuario}`]);
  }

  navegarClientes(): void {
    this.router.navigate(['/cliente/gestion-clientes']);
  }

  navegarMascotas(): void {
    this.router.navigate(['/mascota/gestion-mascotas']);
  }

  navegarClinica(): void {
    this.router.navigate([`/clinica/dashboard/${this.idClinica}`]);
  }
}
