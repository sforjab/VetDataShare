import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Prueba } from '../../Models/prueba.dto';
import { PruebaService } from '../../Services/prueba.service';

@Component({
  selector: 'app-mascota-pruebas-list',
  templateUrl: './mascota-pruebas-list.component.html',
  styleUrls: ['./mascota-pruebas-list.component.css']
})
export class MascotaPruebasListComponent implements OnInit{
  pruebas: Prueba[] = [];
  idMascota: number | null = null;

  columnasTabla: string[] = ['tipo', 'fecha', 'consulta', 'acciones'];

  constructor(private pruebaService: PruebaService, private router: Router) {}

  ngOnInit(): void {
    const navegacion = this.router.getCurrentNavigation();
    this.idMascota = navegacion?.extras?.state?.['idMascota'] || history.state.idMascota;

    if (this.idMascota) {
      this.cargarPruebas(this.idMascota);
    } else {
      console.error('ID de la mascota no disponible');
    }
  }

  cargarPruebas(idMascota: number): void {
    this.pruebaService.getPruebasPorIdMascota(idMascota).subscribe({
      next: (pruebas) => {
        this.pruebas = pruebas;
      },
      error: (err) => {
        console.error('Error obteniendo las pruebas:', err);
      }
    });
  }

  navegarDetallePrueba(idPrueba: number): void {
    this.router.navigate(['/prueba-detalle'], {
      state: { idPrueba }
    });
  }

  navegarConsulta(idConsulta: number): void {
    this.router.navigate(['/consulta-detalle'], {
      state: { idConsulta }
    });
  }
}
