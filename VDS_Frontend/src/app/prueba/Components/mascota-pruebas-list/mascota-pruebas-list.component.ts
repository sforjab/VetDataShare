import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prueba } from '../../Models/prueba.dto';
import { PruebaService } from '../../Services/prueba.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mascota-pruebas-list',
  templateUrl: './mascota-pruebas-list.component.html',
  styleUrls: ['./mascota-pruebas-list.component.css']
})
export class MascotaPruebasListComponent implements OnInit {
  pruebas: Prueba[] = [];
  idMascota: number | undefined;
  columnasTabla: string[] = ['tipo', 'fecha', 'acciones'];

  constructor(private pruebaService: PruebaService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idMascota');
      if (id) {
        this.idMascota = +id;
        this.cargarPruebas(this.idMascota);
      } else {
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }

  cargarPruebas(idMascota: number): void {
    this.pruebaService.getPruebasPorIdMascota(idMascota).subscribe({
      next: (pruebas) => {
        this.pruebas = pruebas;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar las pruebas:', err);
      }
    });
  }

  verDetallePrueba(idPrueba: number): void {
    /* this.router.navigate([`/prueba/detalle/${idPrueba}`]); */
    this.router.navigate([`/prueba/detalle/${idPrueba}`], {
      queryParams: { origen: 'mascota-pruebas-list' }
    });
  }

  volver(): void {
    this.router.navigate([`/mascota/dashboard/${this.idMascota}`]);
  }
}
