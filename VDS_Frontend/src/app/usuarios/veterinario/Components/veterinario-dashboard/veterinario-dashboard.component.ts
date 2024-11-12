import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-veterinario-dashboard',
  templateUrl: './veterinario-dashboard.component.html',
  styleUrls: ['./veterinario-dashboard.component.css']
})
export class VeterinarioDashboardComponent implements OnInit {
  idVeterinario: number | null = null;

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idUsuario');
      if (id) {
        this.idVeterinario = +id;
        const idUsuarioSesion = sessionStorage.getItem('idUsuario');
        const rolUsuarioSesion = sessionStorage.getItem('rol');

        if (!idUsuarioSesion || !rolUsuarioSesion) {
          // Redirigir si no está logueado
          this.router.navigate(['/acceso-no-autorizado']);
          return;
        }

        if (rolUsuarioSesion === 'VETERINARIO' && Number(idUsuarioSesion) !== this.idVeterinario) {
          // Redirigir si el veterinario intenta acceder a otro perfil
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
      } else {
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }
  
  navegarPerfil(): void {
    this.router.navigate([`/veterinario/perfil/${this.idVeterinario}`]);
  }

  navegarClientes(): void {
    this.router.navigate(['/cliente/gestion-clientes']);
  }

  navegarMascotas(): void {
    this.router.navigate(['/mascota/gestion-mascotas']);
  }
}
