import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Prueba, TipoPrueba } from '../../Models/prueba.dto';
import { PruebaService } from '../../Services/prueba.service';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';
import { ConsultaService } from 'src/app/consulta/Services/consulta.service';
import { Consulta } from 'src/app/consulta/Models/consulta.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-alta-prueba',
  templateUrl: './alta-prueba.component.html',
  styleUrls: ['./alta-prueba.component.css']
})
export class AltaPruebaComponent implements OnInit {
  altaPruebaForm!: FormGroup;
  tiposPrueba = Object.values(TipoPrueba);
  isLoading: boolean = false; 
  mascota: Mascota | null = null; 
  origenPrevio: string | null = null;

  constructor(
    private pruebaService: PruebaService,
    private mascotaService: MascotaService,
    private consultaService: ConsultaService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    const idConsulta = this.route.snapshot.paramMap.get('idConsulta');
    this.origenPrevio = this.route.snapshot.queryParamMap.get('origenPrevio');
    if (idConsulta) {
      this.altaPruebaForm.get('consultaId')?.setValue(+idConsulta);
      this.cargarConsultaYObtenerMascota(+idConsulta);
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

  cargarConsultaYObtenerMascota(idConsulta: number): void {
    this.isLoading = true;

    // Primero obtenemos la consulta
    this.consultaService.getConsultaPorId(idConsulta).subscribe({
      next: (consulta: Consulta) => {
        if (consulta.mascotaId) {
          // Luego obtenemos la mascota asociada
          this.mascotaService.getMascotaPorId(consulta.mascotaId).subscribe({
            next: (mascota) => {
              this.mascota = mascota;
            },
            error: (err: HttpErrorResponse) => {
              console.error('Error al obtener la mascota asociada:', err);
              this.snackBar.open('Error al cargar la información de la mascota.', 'Cerrar', { duration: 3000 });
            },
            complete: () => {
              this.isLoading = false;
            }
          });
        } else {
          console.error('La consulta no tiene un ID de mascota asociado.');
          this.snackBar.open('No se encontró información de la mascota asociada.', 'Cerrar', { duration: 3000 });
          this.isLoading = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al obtener la consulta:', err);
        this.snackBar.open('Error al cargar la consulta.', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
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
    this.router.navigate([`/consulta/detalle/${idConsulta}`], {
      queryParams: { origen: this.origenPrevio }
    });

    ;
  }
}
