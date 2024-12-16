import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Mascota } from '../../Models/mascota.dto';
import { MascotaService } from '../../Services/mascota.service';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-alta-mascota',
  templateUrl: './alta-mascota.component.html',
  styleUrls: ['./alta-mascota.component.css']
})
export class AltaMascotaComponent implements OnInit {
  /* mascota: Mascota = {
    nombre: '',
    numChip: '',
    especie: '',
    raza: '',
    sexo: 'Macho',
    fechaNacimiento: '',
    propietarioId: 0,
    clinicaId: 0
  }; */
  altaMascotaForm!: FormGroup;

  constructor(private mascotaService: MascotaService, private usuarioService: UsuarioService, private fb: FormBuilder, 
              private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    const idCliente = this.route.snapshot.paramMap.get('idCliente');
    if (idCliente) {
      this.altaMascotaForm.get('propietarioId')?.setValue(+idCliente);
    } else {
      console.error('ID del cliente no encontrado en la ruta.');
      this.router.navigate(['/acceso-no-autorizado']);
    }

    const idUsuario = sessionStorage.getItem('idUsuario');
    if (idUsuario) {
      this.usuarioService.getUsuarioPorId(+idUsuario).subscribe({
        next: (usuario) => {
          this.altaMascotaForm.get('clinicaId')?.setValue(usuario.clinicaId);
        },
        error: (err) => {
          console.error('Error al obtener datos del usuario:', err);
          this.router.navigate(['/acceso-no-autorizado']);
        }
      });
    } else {
      console.error('ID del usuario no encontrado en la sesión.');
      this.router.navigate(['/acceso-no-autorizado']);
    }
  }

  inicializarFormulario(): void {
    this.altaMascotaForm = this.fb.group({
      nombre: ['', Validators.required],
      numChip: ['', [Validators.required, Validators.pattern(/^\d{15}$/)]],
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      sexo: ['', Validators.required],
      fechaNacimiento: ['', [Validators.required, this.validarFechaNacimiento]],
      propietarioId: [null, Validators.required],
      clinicaId: [null, Validators.required]
    });
  }

  crearMascota(): void {
    if (this.altaMascotaForm.invalid) {
      this.snackBar.open('Por favor, corrija los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    const nuevaMascota: Mascota = this.altaMascotaForm.value;

    this.mascotaService.createMascota(nuevaMascota).subscribe({
      next: () => {
        this.snackBar.open('Mascota creada con éxito', 'Cerrar', { duration: 3000 });
        this.volver();
      },
      error: (err) => {
        console.error('Error al crear la mascota:', err);
        this.snackBar.open('Error al crear la mascota', 'Cerrar', { duration: 3000 });
      }
    });
  }

  validarFechaNacimiento(control: any) {
    const fechaSeleccionada = new Date(control.value);
    const fechaActual = new Date();
    return fechaSeleccionada > fechaActual ? { fechaInvalida: true } : null;
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.altaMascotaForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }
  

  volver(): void {
    const propietarioId = this.altaMascotaForm.get('propietarioId')?.value;
    this.router.navigate([`/mascota/cliente-mascotas-list/${propietarioId}`]);
  }
}
