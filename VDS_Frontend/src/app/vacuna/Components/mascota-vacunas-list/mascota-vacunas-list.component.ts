import { Component, OnInit } from '@angular/core';
import { Vacuna } from '../../Models/vacuna.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { VacunaService } from '../../Services/vacuna.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mascota-vacunas-list',
  templateUrl: './mascota-vacunas-list.component.html',
  styleUrls: ['./mascota-vacunas-list.component.css']
})
export class MascotaVacunasListComponent implements OnInit {
  vacunas: Vacuna[] = [];
  idMascota: number | undefined;
  columnasTabla: string[] = ['fecha', 'nombre'];

  constructor(private vacunaService: VacunaService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idMascota');
      if (id) {
        this.idMascota = +id;
        this.cargarVacunas(this.idMascota);
      } else {
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }

  cargarVacunas(idMascota: number): void {
    this.vacunaService.getVacunasPorIdMascota(idMascota).subscribe({
      next: (vacunas) => {
        this.vacunas = vacunas;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar las vacunas:', err);
      }
    });
  }

  volver(): void {
    this.router.navigate([`/mascota/dashboard/${this.idMascota}`]);
  }
}
