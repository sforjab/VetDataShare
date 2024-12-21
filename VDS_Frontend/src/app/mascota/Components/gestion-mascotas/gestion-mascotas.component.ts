import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Mascota } from '../../Models/mascota.dto';
import { MascotaService } from '../../Services/mascota.service';
import { MatDialog } from '@angular/material/dialog';
import { BajaMascotaComponent } from '../baja-mascota/baja-mascota.component';

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
  isLoading: boolean = false;
  busquedaRealizada: boolean = false;
  columnasTabla: string[] = ['numChip', 'nombre', 'especie', 'raza',/*  'fechaNacimiento', */ 'acciones'];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(private mascotaService: MascotaService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.buscarMascotas();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  buscarMascotas() {
    this.isLoading = true; // Activa el spinner
    this.busquedaRealizada = false; // Oculta resultados anteriores

    const filtrosAplicados = this.prepararFiltros(this.filtros);

    this.mascotaService.buscarMascotas(filtrosAplicados).subscribe(
      (result: Mascota[]) => {
        this.dataSource.data = result || [];

        setTimeout(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          } else {
            console.warn('Paginador aún no disponible después de la búsqueda.');
          }
        });

        this.busquedaRealizada = true; // La búsqueda ha terminado
      },
      (error) => {
        console.error('Error en la llamada al backend:', error);
        this.dataSource.data = [];
        this.busquedaRealizada = true; // Evita que el spinner quede activo
      },
      () => {
        this.isLoading = false; // Finaliza el estado de carga
      }
    );
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
    this.router.navigate([`/mascota/dashboard/${idMascota}`], {
      queryParams: { origen: 'gestion-mascotas' },
    });
  }

  eliminarMascota(mascota: Mascota): void {
    const dialogRef = this.dialog.open(BajaMascotaComponent, {
      width: '400px',
      data: mascota,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.buscarMascotas(); // Actualiza la tabla después de la eliminación
      }
    });
  }

  transferirMascota(idMascota: number): void {
    this.router.navigate([`/cliente/transferir-mascota/${idMascota}`]);
  }

  volver(): void {
    const idUsuario = sessionStorage.getItem('idUsuario');
    const rolUsuario = sessionStorage.getItem('rol');
  
    if (!idUsuario || !rolUsuario) {
      console.error('ID del usuario o rol no encontrado en la sesión.');
      this.router.navigate(['/acceso-no-autorizado']);
      return;
    }
  
    if (rolUsuario === 'ADMIN') {
      // Redirige al dashboard de administrador general
      this.router.navigate(['/admin/dashboard']);
    } else {
      // Redirige al dashboard del veterinario o administrador de clínica
      this.router.navigate([`/veterinario/dashboard/${idUsuario}`]);
    }
  }
  
}
