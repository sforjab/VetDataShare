import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Clinica } from '../../Models/clinica.dto';
import { ClinicaService } from '../../Services/clinica.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-alta-clinica',
  templateUrl: './alta-clinica.component.html',
  styleUrl: './alta-clinica.component.css'
})
export class AltaClinicaComponent implements OnInit {
  /* clinica: Clinica = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    activo: true
  }; */
  clinicaForm!: FormGroup;

  constructor(private clinicaService: ClinicaService, private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.clinicaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    });
  }

  crearClinica(): void {
    if (this.clinicaForm.invalid) {
      this.snackBar.open('Por favor, corrija los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    const clinicaData = this.clinicaForm.value;

    this.clinicaService.createClinica(clinicaData).subscribe({
      next: () => {
        this.snackBar.open('Clínica creada con éxito', 'Cerrar', { duration: 3000 });
        this.volver();
      },
      error: (err) => {
        console.error('Error al crear la clínica:', err);
        this.snackBar.open('Error al crear la clínica', 'Cerrar', { duration: 3000 });
      }
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.clinicaForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  volver(): void {
    this.router.navigate(['/clinica/gestion-clinicas']);
  }
}
