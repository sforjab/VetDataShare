import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsultaService } from '../../Services/consulta.service';
import { Consulta } from '../../Models/consulta.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-alta-consulta',
  templateUrl: './alta-consulta.component.html',
  styleUrl: './alta-consulta.component.css'
})
export class AltaConsultaComponent implements OnInit {
  altaConsultaForm!: FormGroup;
  usuarioId: number | null = null;
  rol: string | null = null;

  constructor(private consultaService: ConsultaService, private usuarioService: UsuarioService, private fb: FormBuilder, 
              private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const idMascota = this.route.snapshot.paramMap.get('idMascota');
    if (!idMascota) {
      console.error('ID de la mascota no encontrado en la ruta.');
      this.router.navigate(['/acceso-no-autorizado']);
      return;
    }

    this.usuarioId = +sessionStorage.getItem('idUsuario')!;
    this.rol = sessionStorage.getItem('rol');

    this.inicializarFormulario(+idMascota);
    this.cargarClinica();
  }

  inicializarFormulario(idMascota: number): void {
    this.altaConsultaForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.maxLength(500)]],
      notas: ['', [Validators.maxLength(500)]],
      medicacion: ['', [Validators.maxLength(500)]],
      mascotaId: [idMascota, Validators.required],
      veterinarioId: [this.usuarioId, Validators.required],
      clinicaId: [null, Validators.required],
    });
  }

  cargarClinica(): void {
    if (this.usuarioId) {
      this.usuarioService.getUsuarioPorId(this.usuarioId).subscribe({
        next: (usuario) => {
          this.altaConsultaForm.patchValue({ clinicaId: usuario.clinicaId });
        },
        error: (err: any) => {
          console.error('Error al obtener datos del usuario:', err);
          this.snackBar.open('Error al cargar los datos del usuario', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/acceso-no-autorizado']);
        }
      });
    }
  }

  crearConsulta(): void {
    if (this.altaConsultaForm.invalid) {
      this.snackBar.open('Por favor, corrija los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    const consulta = { ...this.altaConsultaForm.value, fechaConsulta: new Date().toISOString() };

    this.consultaService.createConsulta(consulta).subscribe({
      next: (consulta) => {
        this.snackBar.open('Consulta creada con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate([`/consulta/detalle/${consulta.id}`]);
      },
      error: (err) => {
        console.error('Error al crear la consulta:', err);
        this.snackBar.open('Error al crear la consulta', 'Cerrar', { duration: 3000 });
      }
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.altaConsultaForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  volver(): void {
    this.router.navigate([`/consulta/mascota-consultas-list/${this.altaConsultaForm.get('mascotaId')?.value}`]);
  }
}
