import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Consulta } from '../../Models/consulta.dto';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaService } from '../../Services/consulta.service';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { BajaConsultaComponent } from '../baja-consulta/baja-consulta.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-mascota-consultas-list',
  templateUrl: './mascota-consultas-list.component.html',
  styleUrls: ['./mascota-consultas-list.component.css']
})
export class MascotaConsultasListComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Consulta>();
  idMascota: number | undefined;
  mascota: Mascota | null = null;
  rolUsuarioSesion: string | null = null;
  isLoading: boolean = false;
  clinicaUsuarioSesion: number | null | undefined = null;
  origen: string | null = null;

  columnasTabla: string[] = ['fecha', 'acciones'];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(private consultaService: ConsultaService, private mascotaService: MascotaService, private usuarioService: UsuarioService,
              private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.rolUsuarioSesion = sessionStorage.getItem('rol');
    const idUsuario = sessionStorage.getItem('idUsuario');

    if (idUsuario) {
      this.obtenerClinicaUsuario(+idUsuario);
    }

    this.route.paramMap.subscribe(params => {
      const id = params.get('idMascota');
      if (id) {
        this.idMascota = +id;
         // Verifica permisos
         this.mascotaService.verificarPropietario(this.idMascota).subscribe({
          next: () => {
            console.log('Acceso autorizado a la mascota.');
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error de acceso:', err);
            if (err.status === 403) {
              this.router.navigate(['/acceso-no-autorizado']);
            } else {
              console.error('Error inesperado:', err);
            }
          }
        });
        this.cargarMascota(this.idMascota);
        this.cargarConsultas(this.idMascota);
      } else {
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });

    this.route.queryParams.subscribe(queryParams => {
      this.origen = queryParams['origen'] || null; // Recupera el origen
    });
  }

  ngAfterViewInit(): void {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
  
      if (this.sort) {
        this.dataSource.sort = this.sort;

        // Configuración del accesor para manejar fechas
        this.dataSource.sortingDataAccessor = (item: Consulta, property: string) => {
          console.log('Sorting item:', item);
          console.log('Sorting property:', property);
        
          switch (property) {
            case 'fecha':
              // Convierte a timestamp para asegurar que sea ordenable
              const timestamp = item.fechaConsulta ? new Date(item.fechaConsulta).getTime() : 0;
              console.log('Timestamp:', timestamp);
              return timestamp;
            default:
              // Acceso seguro para otras propiedades
              return (item as any)[property] || '';
          }
        };        
      }
    }

  // Carga la información de la mascota
  cargarMascota(idMascota: number): void {
    this.isLoading = true;
    this.mascotaService.getMascotaPorId(idMascota).subscribe({
      next: (mascota: any) => {
        this.mascota = mascota;
      },
      error: (err: any) => {
        console.error('Error al obtener la mascota:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Obtenemos el 'clinicaId' del usuario
  obtenerClinicaUsuario(idUsuario: number): void {
    this.usuarioService.getUsuarioPorId(idUsuario).subscribe({
      next: usuario => {
        this.clinicaUsuarioSesion = usuario.clinicaId;
        console.log('Clinica del usuario:', this.clinicaUsuarioSesion);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al obtener la clínica del usuario:', err);
      }
    });
  }

  cargarConsultas(idMascota: number): void {
    this.isLoading = true;
    this.consultaService.getConsultasPorIdMascota(idMascota).subscribe({
      next: consultas => {
        this.dataSource.data = consultas || [];

        setTimeout(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          } else {
            console.warn('Paginador aún no disponible después de la carga de consultas.');
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
            this.dataSource.sort.sort({ id: 'fecha', start: 'asc', disableClear: true });
          } else {
            console.warn('Ordenación aún no disponible después de la carga de consultas.');
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar las consultas:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  puedeEliminarConsulta(consulta: Consulta): boolean {
    if (this.rolUsuarioSesion === 'ADMIN') {
      return true;
    }

    if (
      (this.rolUsuarioSesion === 'VETERINARIO' || this.rolUsuarioSesion === 'ADMIN_CLINICA') &&
      this.clinicaUsuarioSesion !== null &&
      consulta.clinicaId === this.clinicaUsuarioSesion
    ) {
      return true;
    }

    return false;
  }

  nuevaConsulta(): void {
    if (this.idMascota) {
      this.router.navigate([`/consulta/alta-consulta/${this.idMascota}`], {
        queryParams: {
          origen: this.origen,
        },
      });
    } else {
      console.error('ID de mascota no encontrado.');
    }
  }

  verDetalleConsulta(idConsulta: number): void {
    this.router.navigate([`/consulta/detalle/${idConsulta}`], {
      queryParams: {
        origen: 'mascota-consultas-list',
        origenPrincipal: this.origen,
      },
    });
  }

  eliminarConsulta(consulta: Consulta): void {
    const dialogRef = this.dialog.open(BajaConsultaComponent, {
      width: '400px',
      data: consulta
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        if (this.idMascota) {
          this.cargarConsultas(this.idMascota);
        }
      }
    });
  }

  // Método auxiliar para obtener valores de objetos
  private getValue(obj: any, column: string): string {
    return obj[column] ? obj[column].toString() : '';
  }

  volver(): void {
    if (this.idMascota) {
      this.router.navigate([`/mascota/dashboard/${this.idMascota}`], {
        queryParams: { origen: this.origen },
      });
    } else {
      console.error('ID de mascota no encontrado para volver.');
    }
  }  
}
