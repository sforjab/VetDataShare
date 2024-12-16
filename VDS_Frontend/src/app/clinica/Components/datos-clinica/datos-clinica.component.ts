import { Component } from '@angular/core';
import { Clinica } from '../../Models/clinica.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicaService } from '../../Services/clinica.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos-clinica',
  templateUrl: './datos-clinica.component.html',
  styleUrl: './datos-clinica.component.css'
})
export class DatosClinicaComponent {
  datosClinicaForm!: FormGroup;
  idClinica: number | null = null;
  isLoading: boolean = false;

  constructor(private clinicaService: ClinicaService, private route: ActivatedRoute, private fb: FormBuilder, 
              private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.route.paramMap.subscribe(params => {
      const id = params.get('idClinica');
      if (id) {
        this.idClinica = +id;
        this.obtenerDatosClinica(this.idClinica);
      }
    });
  }

  inicializarFormulario(): void {
    this.datosClinicaForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  obtenerDatosClinica(id: number): void {
    this.isLoading = true;
    this.clinicaService.getClinicaPorId(id).subscribe({
      next: (clinica) => {
        this.datosClinicaForm.patchValue(clinica);
        console.log('Datos de la clínica obtenidos:', clinica);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al obtener los datos de la clínica:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  guardarCambios(): void {
    if (this.datosClinicaForm.invalid) {
      this.snackBar.open('Por favor, corrija los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.idClinica) {
      this.isLoading = true;
      this.clinicaService.updateClinica(this.idClinica, this.datosClinicaForm.value).subscribe({
        next: () => {
          this.snackBar.open('Clínica actualizada con éxito', 'Cerrar', {
            duration: 3000
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al actualizar la clínica:', err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.datosClinicaForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  volver(): void {
    this.router.navigate([`/clinica/dashboard/${this.idClinica}`]);
  }
}
