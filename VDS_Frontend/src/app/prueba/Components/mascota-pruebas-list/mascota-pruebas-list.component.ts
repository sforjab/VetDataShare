import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prueba } from '../../Models/prueba.dto';
import { PruebaService } from '../../Services/prueba.service';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mascota-pruebas-list',
  templateUrl: './mascota-pruebas-list.component.html',
  styleUrls: ['./mascota-pruebas-list.component.css']
})
export class MascotaPruebasListComponent implements OnInit {
  dataSource = new MatTableDataSource<Prueba>();
  idMascota: number | undefined;
  mascota: Mascota | null = null; // Datos de la mascota
  columnasTabla: string[] = ['tipo', 'fecha', 'acciones'];
  isLoading: boolean = false;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private pruebaService: PruebaService,
    private mascotaService: MascotaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
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
        this.cargarPruebas(this.idMascota);
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

  cargarPruebas(idMascota: number): void {
    this.pruebaService.getPruebasPorIdMascota(idMascota).subscribe({
      next: (pruebas) => {
        this.dataSource.data = pruebas || [];
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar las pruebas:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  verDetallePrueba(idPrueba: number): void {
    this.router.navigate([`/prueba/detalle/${idPrueba}`], {
      queryParams: { origen: 'mascota-pruebas-list' }
    });
  }

  volver(): void {
    this.router.navigate([`/mascota/dashboard/${this.idMascota}`]);
  }
}
