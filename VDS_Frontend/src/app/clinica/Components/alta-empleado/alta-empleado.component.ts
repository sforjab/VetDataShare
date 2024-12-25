import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario, Rol } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.component.html',
  styleUrl: './alta-empleado.component.css'
})
export class AltaEmpleadoComponent implements OnInit {
  empleadoForm!: FormGroup;
  roles = [Rol.VETERINARIO, Rol.ADMIN_CLINICA]; // Lista de roles disponibles
  idClinica: number | null = null;

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder, private router: Router, 
              private route: ActivatedRoute, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    // Obtener el ID de la clínica desde el parámetro de la ruta
    this.route.paramMap.subscribe((params) => {
      const idClinica = params.get('idClinica');
      if (idClinica) {
        this.idClinica = +idClinica;
        this.empleadoForm.get('clinicaId')?.setValue(this.idClinica);
        /* this.empleado.clinicaId = this.idClinica; // Se asigna al empleado */
      } else {
        console.error('No se encontró el ID de la clínica en los parámetros de la ruta.');
        this.snackBar.open('Error: No se encontró el ID de la clínica.', 'Cerrar', { duration: 3000 });
        this.volver(); // Redirigimos si no hay ID de clínica
      }
    });
  }

  inicializarFormulario(): void {
    this.empleadoForm = this.fb.group({
      numIdent: ['', [Validators.required, Validators.maxLength(15)]],
      numColegiado: ['', [Validators.required, Validators.maxLength(8), Validators.pattern(/^\d+$/)]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellido1: ['', [Validators.required, Validators.maxLength(50)]],
      apellido2: ['', [Validators.maxLength(50)]],
      rol: ['', Validators.required],
      clinicaId: [null]
    });
  }
  

  crearEmpleado(): void {
    if (this.empleadoForm.invalid) {
      this.snackBar.open('Por favor, corrija los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    const empleado: Usuario = this.empleadoForm.value;

    if (!empleado.username) {
      empleado.username = empleado.numIdent; // Se asigna 'numIdent' como username si no está definido
    }
    if (!empleado.password) {
      empleado.password = 'password'; // Se asigna una contraseña por defecto
    }
    
    this.usuarioService.createUsuario(empleado).subscribe({
      next: () => {
        this.snackBar.open('Empleado creado con éxito', 'Cerrar', { duration: 3000 });
        this.volver();
      },
      error: (err) => {
        console.error('Error al crear el empleado:', err);
        let mensajeError = 'Error al crear el empleado';
        if (err.error && err.error.mensaje) {
          mensajeError = err.error.mensaje; // Mostrar mensaje específico del backend
        }
  
        this.snackBar.open(mensajeError, 'Cerrar', { duration: 3000 });
      }
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.empleadoForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  volver(): void {
    this.router.navigate([`/clinica/gestion-empleados/${this.idClinica}`]);
  }
}
