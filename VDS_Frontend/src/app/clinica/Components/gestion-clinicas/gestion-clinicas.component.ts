import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Clinica } from '../../Models/clinica.dto';
import { ClinicaService } from '../../Services/clinica.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BajaClinicaComponent } from '../baja-clinica/baja-clinica.component';

@Component({
  selector: 'app-gestion-clinicas',
  templateUrl: './gestion-clinicas.component.html',
  styleUrl: './gestion-clinicas.component.css'
})
export class GestionClinicasComponent implements OnInit, AfterViewInit {
  filtros = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    activo: 'true'
  };

  dataSource = new MatTableDataSource<Clinica>();
  isLoading: boolean = false;
  busquedaRealizada: boolean = false;
  columnasTabla: string[] = ['nombre', 'direccion', 'telefono', 'email', 'acciones'];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(private clinicaService: ClinicaService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.buscarClinicas();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    } else {
      console.warn('Paginador no disponible en ngAfterViewInit.');
    }
  }

  buscarClinicas() {
    this.isLoading = true;
    this.busquedaRealizada = false;

    const filtrosAplicados = this.prepararFiltros(this.filtros);

    this.clinicaService.buscarClinicas(filtrosAplicados).subscribe(
      (result: Clinica[]) => {
        this.dataSource.data = result || [];

        setTimeout(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        });

        this.busquedaRealizada = true;
      },
      (error: HttpErrorResponse) => {
        console.error('Error en la llamada al backend:', error);
        this.dataSource.data = [];
        this.busquedaRealizada = true;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  private prepararFiltros(filtros: any): any {
    return {
      nombre: filtros.nombre || undefined,
      direccion: filtros.direccion || undefined,
      telefono: filtros.telefono || undefined,
      email: filtros.email || undefined,
      activo: filtros.activo === 'true' ? true : filtros.activo === 'false' ? false : undefined
    };
  }

  navegarDashboardClinica(idClinica: number): void {
    this.router.navigate([`/clinica/dashboard/${idClinica}`]);
  }

  altaClinica(): void {
    this.router.navigate(['/clinica/alta-clinica']);
  }

  bajaClinica(clinica: Clinica): void {
    const dialogRef = this.dialog.open(BajaClinicaComponent, {
      width: '400px',
      data: { id: clinica.id, nombre: clinica.nombre }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.buscarClinicas(); // Actualiza la lista de clínicas
      }
    });
  }
  

  volver(): void {
    const idAdmin = sessionStorage.getItem('idUsuario');
    if (idAdmin) {
      this.router.navigate([`/admin/dashboard`]);
    } else {
      console.error('ID del administrador no encontrado en la sesión.');
      this.router.navigate(['/acceso-no-autorizado']);
    }
  }
}
