import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Prueba, TipoPrueba } from '../../Models/prueba.dto';
import { PruebaService } from '../../Services/prueba.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-alta-prueba',
  templateUrl: './alta-prueba.component.html',
  styleUrl: './alta-prueba.component.css'
})
export class AltaPruebaComponent implements OnInit {
  /* prueba: Prueba = {
    tipo: TipoPrueba.IMAGEN,
    descripcion: '',
    fecha: '',
    consultaId: 0,
    mascotaId: 0
  }; */
  altaPruebaForm!: FormGroup;
  tiposPrueba = Object.values(TipoPrueba);

  constructor(private pruebaService: PruebaService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    const idConsulta = this.route.snapshot.paramMap.get('idConsulta');
    if (idConsulta) {
      this.altaPruebaForm.get('consultaId')?.setValue(+idConsulta);
    } else {
      console.error('ID de consulta no encontrado en la ruta.');
      this.router.navigate(['/acceso-no-autorizado']);
    }
  }

  inicializarFormulario(): void {
    this.altaPruebaForm = this.fb.group({
      tipo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      consultaId: [null, Validators.required]
    });
  }

  crearPrueba(): void {
    if (this.altaPruebaForm.invalid) {
      this.snackBar.open('Por favor, corrija los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    const nuevaPrueba: Prueba = this.altaPruebaForm.value;

    this.pruebaService.createPrueba(nuevaPrueba).subscribe({
      next: () => {
        this.snackBar.open('Prueba creada con éxito', 'Cerrar', { duration: 3000 });
        this.volver();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al crear la prueba:', err);
        this.snackBar.open('Error al crear la prueba', 'Cerrar', { duration: 3000 });
      }
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.altaPruebaForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  volver(): void {
    const idConsulta = this.altaPruebaForm.get('consultaId')?.value;
    this.router.navigate([`/consulta/detalle/${idConsulta}`]);
  }
}

