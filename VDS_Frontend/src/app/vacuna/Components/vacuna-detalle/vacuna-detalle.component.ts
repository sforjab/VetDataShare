import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Vacuna } from '../../Models/vacuna.dto';
import { VacunaService } from '../../Services/vacuna.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-vacuna-detalle',
  templateUrl: './vacuna-detalle.component.html',
  styleUrls: ['./vacuna-detalle.component.css']
})
export class VacunaDetalleComponent implements OnInit {
  detalleVacunaForm!: FormGroup;
  vacuna: Vacuna = {
    nombre: '',
    laboratorio: '',
    fecha: '',
    consultaId: 0,
    veterinarioId: 0,
    mascotaId: 0
  };
  vacunaId: number | null = null;
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private vacunaService: VacunaService, private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    this.vacunaId = +this.route.snapshot.paramMap.get('idVacuna')!;
    if (this.vacunaId) {
      this.cargarVacuna(this.vacunaId);
    } else {
      this.snackBar.open('ID de vacuna no encontrado', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/']);
    }
  }

  inicializarFormulario(): void {
    this.detalleVacunaForm = this.fb.group({
      nombre: [this.vacuna.nombre, [Validators.required, Validators.maxLength(250)]],
      laboratorio: [this.vacuna.laboratorio, [Validators.required, Validators.maxLength(250)]]
    });
  }

  cargarVacuna(id: number): void {
    this.isLoading = true;
    this.vacunaService.getVacunaPorId(id).subscribe({
      next: (vacuna) => {
        this.vacuna = vacuna;
        this.detalleVacunaForm.patchValue({
          nombre: vacuna.nombre,
          laboratorio: vacuna.laboratorio
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando vacuna:', err);
        this.snackBar.open('Error cargando los datos de la vacuna', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/']);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  guardarVacuna(): void {
    if (this.detalleVacunaForm.invalid) {
      this.snackBar.open('Por favor, corrija los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    const datosActualizados = {
      ...this.vacuna,
      ...this.detalleVacunaForm.value
    };

    this.isLoading = true;
    this.vacunaService.updateVacuna(this.vacuna.id!, datosActualizados).subscribe({
      next: () => {
        this.snackBar.open('Vacuna actualizada con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate([`/consulta/detalle/${this.vacuna.consultaId}`]);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al actualizar la vacuna:', err);
        this.snackBar.open('Error al actualizar la vacuna', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.detalleVacunaForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  volver(): void {
    this.router.navigate([`/consulta/detalle/${this.vacuna?.consultaId}`]);
  }
}