import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-mascota-consultas-list',
  templateUrl: './mascota-consultas-list.component.html',
  styleUrls: ['./mascota-consultas-list.component.css']
})
export class MascotaConsultasListComponent implements OnInit {
  dataSource = new MatTableDataSource<Consulta>();
  idMascota: number | undefined;
  mascota: Mascota | null = null; // Información de la mascota
  rolUsuarioSesion: string | null = null;
  isLoading: boolean = false;
  clinicaUsuarioSesion: number | null | undefined = null;

  columnasTabla: string[] = ['fecha', 'acciones'];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private consultaService: ConsultaService,
    private mascotaService: MascotaService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

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
        this.cargarMascota(this.idMascota);
        this.cargarConsultas(this.idMascota);
      } else {
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
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
      this.router.navigate([`/consulta/alta-consulta/${this.idMascota}`]);
    } else {
      console.error('ID de mascota no encontrado.');
    }
  }

  verDetalleConsulta(idConsulta: number): void {
    this.router.navigate([`/consulta/detalle/${idConsulta}`], {
      queryParams: { origen: 'mascota-consultas-list' },
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

  volver(): void {
    if (this.idMascota) {
      this.router.navigate([`/mascota/dashboard/${this.idMascota}`]);
    }
  }
}
