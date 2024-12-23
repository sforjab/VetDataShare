import { Component, OnInit, ViewChild } from '@angular/core';
import { Vacuna } from '../../Models/vacuna.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { VacunaService } from '../../Services/vacuna.service';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mascota-vacunas-list',
  templateUrl: './mascota-vacunas-list.component.html',
  styleUrls: ['./mascota-vacunas-list.component.css']
})
export class MascotaVacunasListComponent implements OnInit {
  dataSource = new MatTableDataSource<Vacuna>();
  idMascota: number | undefined;
  mascota: Mascota | null = null; // Datos de la mascota
  columnasTabla: string[] = ['fecha', 'nombre'];
  isLoading: boolean = false;

  constructor(
    private vacunaService: VacunaService,
    private mascotaService: MascotaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idMascota');
      if (id) {
        this.idMascota = +id;
         // Verifica permisos
         this.mascotaService.verificarPropietario(this.idMascota).subscribe({
          next: () => {
            console.log('Acceso autorizado a la mascota.');
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error de acceso:', err);
            if (err.status === 403) {
              this.router.navigate(['/acceso-no-autorizado']);
            } else {
              console.error('Error inesperado:', err);
            }
          }
        });
        this.cargarMascota(this.idMascota);
        this.cargarVacunas(this.idMascota);
      } else {
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  cargarMascota(idMascota: number): void {
    this.mascotaService.getMascotaPorId(idMascota).subscribe({
      next: (mascota) => {
        this.mascota = mascota;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar los datos de la mascota:', err);
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }

  cargarVacunas(idMascota: number): void {
    this.isLoading = true;
    this.vacunaService.getVacunasPorIdMascota(idMascota).subscribe({
      next: (vacunas) => {
        this.dataSource.data = vacunas || [];
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar las vacunas:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate([`/mascota/dashboard/${this.idMascota}`]);
  }
}
