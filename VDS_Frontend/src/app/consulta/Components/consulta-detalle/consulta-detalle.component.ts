import { Component, OnInit } from '@angular/core';
import { Consulta } from '../../Models/consulta.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaService } from '../../Services/consulta.service';
import { MascotaService } from '../../../mascota/Services/mascota.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Prueba } from 'src/app/prueba/Models/prueba.dto';
import { Vacuna } from 'src/app/vacuna/Models/vacuna.dto';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';

@Component({
  selector: 'app-consulta-detalle',
  templateUrl: './consulta-detalle.component.html',
  styleUrls: ['./consulta-detalle.component.css']
})
export class ConsultaDetalleComponent implements OnInit {
  consulta: Consulta | null = null;
  /* mascota: Mascota | null = null; */
  pruebas: Prueba[] = [];
  vacunas: Vacuna[] = [];
  idConsulta: number | undefined;

  constructor(private consultaService: ConsultaService, /* private mascotaService: MascotaService, */ private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idConsulta');
      if (id) {
        this.idConsulta = +id;
        this.cargarConsulta(this.idConsulta);
        this.cargarPruebas(this.idConsulta);
        this.cargarVacunas(this.idConsulta);
      } else {
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }

  cargarConsulta(idConsulta: number): void {
    this.consultaService.getConsultaPorId(idConsulta).subscribe({
      next: consulta => {
        this.consulta = consulta;
        /* if (this.consulta.mascota.id !== undefined) {
          this.cargarMascota(this.consulta.mascota.id);
        } */
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar la consulta:', err);
        /* this.router.navigate(['/']); */
      }
    });
  }

 /*  cargarMascota(idMascota: number): void {
    this.mascotaService.getMascotaPorId(idMascota).subscribe({
      next: mascota => {
        this.mascota = mascota;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar la mascota:', err);
      }
    });
  } */

  cargarPruebas(idConsulta: number): void {
    this.consultaService.getPruebasPorConsultaId(idConsulta).subscribe({
      next: pruebas => {
        this.pruebas = pruebas;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar las pruebas:', err);
      }
    });
  }

  cargarVacunas(idConsulta: number): void {
    this.consultaService.getVacunasPorConsultaId(idConsulta).subscribe({
      next: vacunas => {
        this.vacunas = vacunas;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar las vacunas:', err);
      }
    });
  }

  guardar(): void {
    console.log('Guardar cambios - lógica pendiente');
  }

  volver(): void {
    console.log(this.consulta?.mascota?.id);
    this.router.navigate([`/consulta/mascota-consultas-list/${this.consulta?.mascota?.id}`]);
  }
}
