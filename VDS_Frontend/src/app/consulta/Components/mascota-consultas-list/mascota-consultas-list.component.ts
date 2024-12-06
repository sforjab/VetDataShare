import { Component } from '@angular/core';
import { Consulta } from '../../Models/consulta.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaService } from '../../Services/consulta.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { BajaConsultaComponent } from '../baja-consulta/baja-consulta.component';

@Component({
  selector: 'app-mascota-consultas-list',
  templateUrl: './mascota-consultas-list.component.html',
  styleUrls: ['./mascota-consultas-list.component.css']
})
export class MascotaConsultasListComponent {

  consultas: Consulta[] = [];
  idMascota: number | undefined;
  rol: string | null = null;
  isLoading: boolean = false;

  columnasTabla: string[] = ['fecha', 'acciones'];

  constructor(private consultaService: ConsultaService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.rol = sessionStorage.getItem('rol');

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
    this.isLoading = true;
    this.consultaService.getConsultasPorIdMascota(idMascota).subscribe({
      next: (consultas) => {
        this.consultas = consultas;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar las consultas:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  nuevaConsulta(): void {
    if (this.idMascota) {
      this.router.navigate([`/consulta/alta-consulta/${this.idMascota}`]);
    } else {
      console.error('ID de mascota no encontrado.');
    }
  }

  verDetalleConsulta(idConsulta: number): void {
    this.router.navigate([`/consulta/detalle/${idConsulta}`]);
  }

  eliminarConsulta(consulta: Consulta): void {
    const dialogRef = this.dialog.open(BajaConsultaComponent, {
      width: '400px',
      data: consulta,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (this.idMascota) {
          this.cargarConsultas(this.idMascota);
        }
      }
    });
  }

  volver(): void {
    if (this.idMascota) {
      this.router.navigate([`/mascota/dashboard/${this.idMascota}`]);
    }
  }
}
