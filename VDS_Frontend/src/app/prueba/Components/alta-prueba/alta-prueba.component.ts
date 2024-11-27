import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Prueba, TipoPrueba } from '../../Models/prueba.dto';
import { PruebaService } from '../../Services/prueba.service';

@Component({
  selector: 'app-alta-prueba',
  templateUrl: './alta-prueba.component.html',
  styleUrl: './alta-prueba.component.css'
})
export class AltaPruebaComponent implements OnInit {
  prueba: Prueba = {
    tipo: TipoPrueba.IMAGEN,
    descripcion: '',
    fecha: '',
    consultaId: 0,
    mascotaId: 0
  };
  tiposPrueba = Object.values(TipoPrueba);

  constructor(private pruebaService: PruebaService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const idConsulta = this.route.snapshot.paramMap.get('idConsulta');
    if (idConsulta) {
      this.prueba.consultaId = +idConsulta;
    } else {
      console.error('ID de consulta no encontrado en la ruta.');
      this.router.navigate(['/acceso-no-autorizado']);
    }
  }

  crearPrueba(): void {
    this.pruebaService.createPrueba(this.prueba).subscribe({
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

  volver(): void {
    this.router.navigate([`/consulta/detalle/${this.prueba.consultaId}`]);
  }
}

