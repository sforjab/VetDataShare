import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Mascota } from '../../Models/mascota.dto';
import { MascotaService } from '../../Services/mascota.service';

@Component({
  selector: 'app-gestion-mascotas',
  templateUrl: './gestion-mascotas.component.html',
  styleUrls: ['./gestion-mascotas.component.css']
})
export class GestionMascotasComponent implements OnInit, AfterViewInit {
  filtros = {
    numChip: '',
    nombre: '',
    especie: '',
    raza: '',
  };

  dataSource = new MatTableDataSource<Mascota>();
  busquedaRealizada: boolean = false;
  columnasTabla: string[] = ['numChip', 'nombre', 'especie', 'raza', 'fechaNacimiento', 'acciones'];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(private mascotaService: MascotaService, private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      console.log('Paginador asignado en ngAfterViewInit:', this.dataSource.paginator);
    } else {
      console.warn('Paginador no disponible en ngAfterViewInit. Intentando asignar después.');
    }
  }

  buscarMascotas() {
    this.busquedaRealizada = true;
    const filtrosAplicados = this.prepararFiltros(this.filtros);

    this.mascotaService.buscarMascotas(filtrosAplicados).subscribe((result: Mascota[]) => {
      this.dataSource.data = result || [];
      console.log('Datos del DataSource antes de vincular el paginador:', this.dataSource.data);

      setTimeout(() => {
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          console.log('Paginador asignado correctamente después de la búsqueda.');
        } else {
          console.warn('Paginador aún no disponible después de la búsqueda.');
        }
      });
    }, error => {
      console.error('Error al buscar mascotas:', error);
      this.dataSource.data = [];
    });
  }

  private prepararFiltros(filtros: any): any {
    return {
      numChip: filtros.numChip || undefined,
      nombre: filtros.nombre || undefined,
      especie: filtros.especie || undefined,
      raza: filtros.raza || undefined,
    };
  }

  navegarDashboardMascota(idMascota: number): void {
    this.router.navigate([`/mascota/dashboard/${idMascota}`]);
  }
}
