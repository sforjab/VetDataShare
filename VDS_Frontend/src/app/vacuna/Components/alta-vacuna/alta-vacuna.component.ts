import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Vacuna } from '../../Models/vacuna.dto';
import { VacunaService } from '../../Services/vacuna.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-alta-vacuna',
  templateUrl: './alta-vacuna.component.html',
  styleUrl: './alta-vacuna.component.css'
})
export class AltaVacunaComponent implements OnInit {
  /* vacuna: Vacuna = {
    nombre: '',
    laboratorio: '',
    fecha: '',
    mascotaId: 0,
    veterinarioId: 0,
    consultaId: 0
  }; */
  altaVacunaForm!: FormGroup;

  constructor(private vacunaService: VacunaService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    const idConsulta = this.route.snapshot.paramMap.get('idConsulta');
    if (idConsulta) {
      this.altaVacunaForm.get('consultaId')?.setValue(+idConsulta);
      this.altaVacunaForm.get('veterinarioId')?.setValue(+sessionStorage.getItem('idUsuario')!);
    } else {
      console.error('ID de consulta no encontrado en la ruta.');
      this.router.navigate(['/acceso-no-autorizado']);
    }
  }

  inicializarFormulario(): void {
    this.altaVacunaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      laboratorio: ['', [Validators.required, Validators.maxLength(250)]],
      consultaId: [null, Validators.required],
      veterinarioId: [null, Validators.required]
    });
  }

  crearVacuna(): void {
    if (this.altaVacunaForm.invalid) {
      this.snackBar.open('Por favor, corrija los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    const nuevaVacuna: Vacuna = this.altaVacunaForm.value;

    this.vacunaService.createVacuna(nuevaVacuna).subscribe({
      next: () => {
        this.snackBar.open('Vacuna creada con éxito', 'Cerrar', { duration: 3000 });
        this.volver();
      },
      error: (err) => {
        console.error('Error al crear la vacuna:', err);
        this.snackBar.open('Error al crear la vacuna', 'Cerrar', { duration: 3000 });
      }
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.altaVacunaForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  volver(): void {
    const consultaId = this.altaVacunaForm.get('consultaId')?.value;
    this.router.navigate([`/consulta/detalle/${consultaId}`]);
  }
}