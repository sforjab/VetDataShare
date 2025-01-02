import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Vacuna } from '../../Models/vacuna.dto';
import { VacunaService } from '../../Services/vacuna.service';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';
import { ConsultaService } from 'src/app/consulta/Services/consulta.service';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-alta-vacuna',
  templateUrl: './alta-vacuna.component.html',
  styleUrls: ['./alta-vacuna.component.css']
})
export class AltaVacunaComponent implements OnInit {
  altaVacunaForm!: FormGroup;
  mascota: Mascota | null = null;
  isLoading: boolean = false;
  origen: string | null = null;
  origenPrincipal: string | null = null;

  constructor(
    private vacunaService: VacunaService,
    private consultaService: ConsultaService,
    private mascotaService: MascotaService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    const idConsulta = this.route.snapshot.paramMap.get('idConsulta');
    this.origen = this.route.snapshot.queryParamMap.get('origen');
    this.origenPrincipal = this.route.snapshot.queryParamMap.get('origenPrincipal');
    if (idConsulta) {
      this.altaVacunaForm.get('consultaId')?.setValue(+idConsulta);
      this.altaVacunaForm.get('veterinarioId')?.setValue(+sessionStorage.getItem('idUsuario')!);

      // Cargar datos de la mascota asociada a la consulta
      this.cargarMascota(+idConsulta);
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

  cargarMascota(idConsulta: number): void {
    this.isLoading = true;
    this.consultaService.getConsultaPorId(idConsulta).subscribe({
      next: (consulta) => {
        if (consulta.mascotaId) {
          this.mascotaService.getMascotaPorId(consulta.mascotaId).subscribe({
            next: (mascota) => {
              this.mascota = mascota;
            },
            error: (err) => {
              console.error('Error al cargar la mascota:', err);
              this.snackBar.open('Error al cargar los datos de la mascota.', 'Cerrar', { duration: 3000 });
            }
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar la consulta:', err);
        this.snackBar.open('Error al cargar los datos de la consulta.', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
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
        this.snackBar.open('Error al crear la vacuna.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.altaVacunaForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  volver(): void {
    const consultaId = this.altaVacunaForm.get('consultaId')?.value;
    this.router.navigate([`/consulta/detalle/${consultaId}`], {
      queryParams: { 
        origen: this.origen,
        origenPrincipal: this.origenPrincipal 
      }
    });

    ;
  }
}
