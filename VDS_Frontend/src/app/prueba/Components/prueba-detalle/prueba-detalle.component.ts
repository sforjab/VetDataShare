import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prueba, TipoPrueba } from '../../Models/prueba.dto';
import { PruebaService } from '../../Services/prueba.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-prueba-detalle',
  templateUrl: './prueba-detalle.component.html',
  styleUrls: ['./prueba-detalle.component.css']
})
export class PruebaDetalleComponent implements OnInit {
  /* prueba: Prueba | null = null; */

  prueba: Partial<Prueba> = {};
  tiposPrueba: TipoPrueba[] = [TipoPrueba.IMAGEN, TipoPrueba.ANALÍTICA]; // Valores del desplegable
  idPrueba: number | undefined;

  constructor(private pruebaService: PruebaService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idPrueba');
      if (id) {
        this.idPrueba = +id;
        this.cargarPrueba(this.idPrueba);
      } else {
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }

  cargarPrueba(idPrueba: number): void {
    this.pruebaService.getPruebaPorId(idPrueba).subscribe({
      next: prueba => {
        this.prueba = prueba;
        if (!this.prueba.tipo) {
          this.prueba.tipo = this.tiposPrueba[0]; // Valor por defecto si falta
        }
        if (!this.prueba.descripcion) {
          this.prueba.descripcion = ''; // Inicializa con un valor vacío
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar la prueba:', err);
      }
    });
  }

  guardar(): void {
    console.log('Guardar cambios - lógica pendiente');
  }

  volver(): void {
    this.router.navigate([`/prueba/mascota-pruebas-list/${this.prueba.mascota?.id}`]);
  }
}
