import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  perfilForm!: FormGroup;
  usuario: Usuario = {
    numIdent: '',
    numColegiado: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    rol: Rol.VETERINARIO,
    username: '',
    password: '',
  };
  idVeterinario: number | null = null;
  esVeterinario: boolean = false;
  isLoading: boolean = false;
  puedeEditarRol: boolean = false;
  rolesDisponibles: Rol[] = [Rol.VETERINARIO, Rol.ADMIN_CLINICA]; // Roles disponibles

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder, private route: ActivatedRoute, 
              private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  
    this.route.paramMap.subscribe((params) => {
      const id = params.get('idUsuario');
      if (!id) {
        this.router.navigate(['/acceso-no-autorizado']);
        return;
      }
  
      this.idVeterinario = +id;
  
      // Obtener información de sesión
      const idUsuarioSesion = sessionStorage.getItem('idUsuario');
      const rolUsuarioSesion = sessionStorage.getItem('rol');
  
      if (!idUsuarioSesion || !rolUsuarioSesion) {
        this.router.navigate(['/acceso-no-autorizado']);
        return;
      }
  
      // Determinar permisos
      this.puedeEditarRol = rolUsuarioSesion === 'ADMIN' || rolUsuarioSesion === 'ADMIN_CLINICA';
      this.esVeterinario = rolUsuarioSesion === 'VETERINARIO';
  
      // Ajustar el estado del control 'rol'
      if (this.puedeEditarRol) {
        this.perfilForm.get('rol')?.enable();
      } else {
        this.perfilForm.get('rol')?.disable();
      }
  
      // Caso 1: Si el usuario es 'ADMIN', obtenemos datos directamente
      if (rolUsuarioSesion === 'ADMIN') {
        this.obtenerDatosUsuario(this.idVeterinario);
        return;
      }
  
      // Caso 2: Validar restricciones para ADMIN_CLINICA o VETERINARIO
      if (this.idVeterinario !== Number(idUsuarioSesion) && rolUsuarioSesion !== 'ADMIN_CLINICA') {
        this.router.navigate(['/acceso-no-autorizado']);
        return;
      }
  
      // Obtener datos del usuario si pasa todas las validaciones
      this.obtenerDatosUsuario(this.idVeterinario);
    });
  }
              
    
  inicializarFormulario(): void {
    this.perfilForm = this.fb.group({
      numIdent: ['', [Validators.required, Validators.maxLength(15)]],
      numColegiado: ['', [Validators.required, Validators.maxLength(8), Validators.pattern(/^\d+$/)]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellido1: ['', [Validators.required, Validators.maxLength(50)]],
      apellido2: ['', [Validators.maxLength(50)]],
      password: ['', [Validators.minLength(8), Validators.maxLength(16)]],
      rol: [
        { value: '', disabled: true }, // Se inicializa como deshabilitado
        Validators.required
      ]
    });
  }
  
  obtenerDatosUsuario(id: number): void {
    this.isLoading = true;
    this.usuarioService.getUsuarioPorId(id).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.perfilForm.patchValue({
          numIdent: usuario.numIdent,
          numColegiado: usuario.numColegiado,
          nombre: usuario.nombre,
          apellido1: usuario.apellido1,
          apellido2: usuario.apellido2,
          rol: usuario.rol
        });
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
    if (this.perfilForm.invalid) {
      this.snackBar.open('Por favor, corrija los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    const datosActualizados: Usuario = {
      ...this.usuario, // Todos los datos existentes
      ...this.perfilForm.value // Solo los campos editables
    };

    if (!datosActualizados.password) {
      delete datosActualizados.password; // No se envía el campo si está vacío
    }

    this.isLoading = true;

    this.usuarioService.updateUsuario(this.idVeterinario!, datosActualizados).subscribe({
      next: () => {
        this.snackBar.open('Usuario actualizado con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-exito']
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al actualizar el usuario:', err);
        this.snackBar.open('Error al actualizar el usuario', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.perfilForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
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
