import { Component } from '@angular/core';
import { Consulta } from '../../Models/consulta.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaService } from '../../Services/consulta.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mascota-consultas-list',
  templateUrl: './mascota-consultas-list.component.html',
  styleUrls: ['./mascota-consultas-list.component.css']
})
export class MascotaConsultasListComponent {

  consultas: Consulta[] = [];
  idMascota: number | undefined;

  displayedColumns: string[] = ['fecha', 'acciones'];

  constructor(private consultaService: ConsultaService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idMascota');
      if (id) {
        this.idMascota = +id;
        this.cargarConsultas(this.idMascota);
      } else {
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }

  cargarConsultas(idMascota: number): void {
    this.consultaService.getConsultasPorIdMascota(idMascota).subscribe({
      next: (consultas) => {
        this.consultas = consultas;
      },
      error: (err: HttpErrorResponse) => {
        /* console.error('Error al cargar las consultas:', err);
        if (err.status === 403) {
          this.router.navigate(['/acceso-no-autorizado']);
        } */
      }
    });
  }

  verDetalleConsulta(idConsulta: number): void {
    this.router.navigate([`/consulta/detalle/${idConsulta}`]);
  }
}
