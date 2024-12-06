import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Rol, Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-veterinario-perfil',
  templateUrl: './veterinario-perfil.component.html',
  styleUrls: ['./veterinario-perfil.component.css']
})
export class VeterinarioPerfilComponent implements OnInit {
  usuario: Usuario = {
    numIdent: '',
    numColegiado: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    rol: Rol.VETERINARIO,
    username: '',
    password: ''
  };

  idVeterinario: number | null = null;
  esVeterinario: boolean = false;
  isLoading: boolean = false;

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idUsuario');
      if (id) {
        this.idVeterinario = +id;
        const idUsuarioSesion = sessionStorage.getItem('idUsuario');
        const rolUsuarioSesion = sessionStorage.getItem('rol');

        if (!idUsuarioSesion || !rolUsuarioSesion) {
          // Se redirige al usuario a la página de "Acceso No Autorizado" si no está logueado
          this.router.navigate(['/acceso-no-autorizado']);
          return;
        }

        this.esVeterinario = (rolUsuarioSesion === 'VETERINARIO' || rolUsuarioSesion === 'ADMIN_CLINICA');

        if (this.idVeterinario && idUsuarioSesion && Number(idUsuarioSesion) !== this.idVeterinario && rolUsuarioSesion !== 'ADMIN_CLINICA') {
          // Se redirige al usuario a una página de "Acceso No Autorizado" si no coincide el usuario logueado con el veterinario a editar
          this.router.navigate(['/acceso-no-autorizado']);
        } else {
          this.obtenerDatosUsuario(this.idVeterinario);
        }
      }
    });
  }

  obtenerDatosUsuario(id: number): void {
    this.isLoading = true;
    this.usuarioService.getUsuarioPorId(id).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        console.log('Datos del usuario obtenidos:', usuario);
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario:', err);
        /* if (err.status === 403) {
          this.router.navigate(['/acceso-no-autorizado']);  //REPASAR ESTO
        } */
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  guardarCambios(): void {
    if (this.usuario) {
      this.isLoading = true;
      this.usuarioService.updateUsuario(this.idVeterinario!, this.usuario).subscribe({
        next: () => {
          // Mostramos el snackbar al guardar con éxito
          this.snackBar.open('Usuario actualizado con éxito', 'Cerrar', {
            duration: 3000, // Duración de 3 segundos
            panelClass: ['snackbar-exito'] // Clase CSS personalizada
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al actualizar el usuario:', err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  volver(): void {
    const idUsuarioSesion = sessionStorage.getItem('idUsuario'); // Obtener idUsuario de la sesión

  if (idUsuarioSesion) {
    // Recuperar el usuario logueado para obtener información adicional
    this.usuarioService.getUsuarioPorId(Number(idUsuarioSesion)).subscribe({
      next: (usuarioSesion) => {
        const rolUsuarioSesion = usuarioSesion.rol;
        const idClinica = usuarioSesion.clinicaId;

        if (rolUsuarioSesion === 'VETERINARIO') {
          // Si es veterinario, volver al dashboard del veterinario
          this.router.navigate([`/veterinario/dashboard/${this.idVeterinario}`]);
        } else if (rolUsuarioSesion === 'ADMIN_CLINICA' || rolUsuarioSesion === 'ADMIN' && idClinica) {
          // Si es admin de clínica o admin general y tiene una clínica asociada
          this.router.navigate([`/clinica/gestion-empleados/${idClinica}`]);
        } else {
          // Redirigir a una ruta de acceso no autorizado por defecto
          this.router.navigate(['/acceso-no-autorizado']);
        }
      },
      error: (err) => {
        console.error('Error al recuperar el usuario de sesión:', err);
        this.router.navigate(['/acceso-no-autorizado']); // Redirigir si ocurre un error
      },
    });
  } else {
    // Redirigir si no hay idUsuario en la sesión
    this.router.navigate(['/acceso-no-autorizado']);
  }
    /* this.router.navigate([`/veterinario/dashboard/${this.idVeterinario}`]); */
  }
}
