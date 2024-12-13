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
  puedeEditarRol: boolean = false;
  rolesDisponibles: Rol[] = [Rol.VETERINARIO, Rol.ADMIN_CLINICA]; // Roles disponibles

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        const id = params.get('idUsuario');
        if (id) {
          this.idVeterinario = +id;
    
          // Obtener información de sesión
          const idUsuarioSesion = sessionStorage.getItem('idUsuario');
          const rolUsuarioSesion = sessionStorage.getItem('rol');
    
          if (!idUsuarioSesion || !rolUsuarioSesion) {
            // Si no hay usuario logueado o rol, se redirige a acceso no autorizado
            this.router.navigate(['/acceso-no-autorizado']);
            return;
          }

          // Controlar permisos para editar rol
          this.puedeEditarRol = rolUsuarioSesion === 'ADMIN' || rolUsuarioSesion === 'ADMIN_CLINICA';
    
          // Caso 1: Si el usuario es 'ADMIN', permitimos el acceso directamente
          if (rolUsuarioSesion === 'ADMIN') {
            this.obtenerDatosUsuario(this.idVeterinario);
            return;
          }
    
          // Caso 2: Se validan las restricciones para 'ADMIN_CLINICA' o 'VETERINARIO'
          this.esVeterinario = rolUsuarioSesion === 'VETERINARIO' || rolUsuarioSesion === 'ADMIN_CLINICA';
    
          // Si no es el propio usuario logueado y no es 'ADMIN_CLINICA', redirigimos
          if (this.idVeterinario !== Number(idUsuarioSesion) && rolUsuarioSesion !== 'ADMIN_CLINICA') {
            this.router.navigate(['/acceso-no-autorizado']);
            return;
          }
    
          // Si pasa todas las validaciones, se obtienen datos del veterinario
          this.obtenerDatosUsuario(this.idVeterinario);
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
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  guardarCambios(): void {
    if (this.usuario) {
      this.isLoading = true;

      // Si el campo de contraseña está vacío, eliminamos el atributo para evitar actualizarlo
      const usuarioCopia = { ...this.usuario };
      if (!usuarioCopia.password) {
        delete usuarioCopia.password;
      }

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
    if (!this.idVeterinario) {
      // Si no se obtuvo el id del veterinario, redirigimos al acceso no autorizado
      this.router.navigate(['/acceso-no-autorizado']);
      return;
    }
  
    // Obtenemos los datos del veterinario cuyo perfil se está viendo
    this.usuarioService.getUsuarioPorId(this.idVeterinario).subscribe({
      next: (veterinario) => {
        const idClinica = veterinario.clinicaId; // Clínica asociada al veterinario
        const rolUsuarioSesion = sessionStorage.getItem('rol'); // Rol del usuario logueado
  
        if (rolUsuarioSesion === 'VETERINARIO') {
          // Si es veterinario, volvemos al dashboard del veterinario logueado
          this.router.navigate([`/veterinario/dashboard/${this.idVeterinario}`]);
        } else if ((rolUsuarioSesion === 'ADMIN_CLINICA' && idClinica) || rolUsuarioSesion === 'ADMIN') {
          // Si es ADMIN_CLINICA o ADMIN, se navega a la gestión de empleados de la clínica
          this.router.navigate([`/clinica/gestion-empleados/${idClinica}`]);
        } else {
          // Si ninguna de las condiciones se cumple, redirigir al acceso no autorizado
          this.router.navigate(['/acceso-no-autorizado']);
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos del veterinario:', err);
        // En caso de error, redirigir al acceso no autorizado
        this.router.navigate(['/acceso-no-autorizado']);
      },
    });
  }
  
}
