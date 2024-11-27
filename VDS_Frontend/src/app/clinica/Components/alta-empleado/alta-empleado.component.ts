import { Component, OnInit } from '@angular/core';
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
  empleado: Usuario = {
    numIdent: '',
    numColegiado: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    rol: Rol.VETERINARIO, // Rol por defecto
    username: '',
    password: '',
    clinicaId: 0
  };

  roles = [Rol.VETERINARIO, Rol.ADMIN_CLINICA]; // Lista de roles disponibles
  idClinica: number | null = null;

  constructor(private usuarioService: UsuarioService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Obtener el ID de la clínica desde el parámetro de la ruta
    this.route.paramMap.subscribe((params) => {
      const idClinica = params.get('idClinica');
      if (idClinica) {
        this.idClinica = +idClinica;
        this.empleado.clinicaId = this.idClinica; // Se asigna al empleado
      } else {
        console.error('No se encontró el ID de la clínica en los parámetros de la ruta.');
        this.snackBar.open('Error: No se encontró el ID de la clínica.', 'Cerrar', { duration: 3000 });
        this.volver(); // Redirigir si no hay ID de clínica
      }
    });
  }

  crearEmpleado(): void {
    if (!this.empleado.username) {
      this.empleado.username = this.empleado.numIdent; // Se asigna 'numIdent' como username si no está definido
    }
    if (!this.empleado.password) {
      this.empleado.password = 'password'; // Se asigna una contraseña por defecto
    }
    
    this.usuarioService.createUsuario(this.empleado).subscribe({
      next: () => {
        this.snackBar.open('Empleado creado con éxito', 'Cerrar', { duration: 3000 });
        this.volver();
      },
      error: (err) => {
        console.error('Error al crear el empleado:', err);
        this.snackBar.open('Error al crear el empleado', 'Cerrar', { duration: 3000 });
      }
    });
  }

  volver(): void {
    this.router.navigate([`/clinica/gestion-empleados/${this.idClinica}`]);
  }
}
