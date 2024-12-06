import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Vacuna } from '../../Models/vacuna.dto';
import { VacunaService } from '../../Services/vacuna.service';

@Component({
  selector: 'app-vacuna-detalle',
  templateUrl: './vacuna-detalle.component.html',
  styleUrls: ['./vacuna-detalle.component.css']
})
export class VacunaDetalleComponent implements OnInit {
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

  constructor(private route: ActivatedRoute, private vacunaService: VacunaService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.vacunaId = +this.route.snapshot.paramMap.get('idVacuna')!;
    if (this.vacunaId) {
      this.cargarVacuna(this.vacunaId);
    } else {
      this.snackBar.open('ID de vacuna no encontrado', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/']);
    }
  }

  cargarVacuna(id: number): void {
    this.isLoading = true;
    this.vacunaService.getVacunaPorId(id).subscribe({
      next: (vacuna) => {
        this.vacuna = vacuna;
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
    if (!this.vacuna) return;

    this.isLoading = true;
    this.vacunaService.updateVacuna(this.vacuna.id!, this.vacuna).subscribe({
      next: () => {
        this.snackBar.open('Vacuna actualizada con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate([`/consulta/detalle/${this.vacuna?.consultaId}`]);
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

  volver(): void {
    this.router.navigate([`/consulta/detalle/${this.vacuna?.consultaId}`]);
  }
}