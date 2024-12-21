import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { BajaMascotaComponent } from '../baja-mascota/baja-mascota.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-cliente-mascotas-list',
  templateUrl: './cliente-mascotas-list.component.html',
  styleUrls: ['./cliente-mascotas-list.component.css']
})
export class ClienteMascotasListComponent implements OnInit {
  dataSource = new MatTableDataSource<Mascota>();
  mascotas: Mascota[] = [];
  cliente: any = null; // Datos del cliente
  idCliente: number | null = null;
  isLoading: boolean = false;
  isLoadingCliente: boolean = false;
  rolUsuarioSesion: string | null = null;

  columnasTabla: string[] = ['nombre', 'numChip', 'acciones'];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private mascotaService: MascotaService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idUsuario');
      if (id) {
        this.idCliente = +id;
        const idUsuarioSesion = sessionStorage.getItem('idUsuario');
        this.rolUsuarioSesion = sessionStorage.getItem('rol');

        if (!idUsuarioSesion || !this.rolUsuarioSesion) {
          this.router.navigate(['/acceso-no-autorizado']);
          return;
        }

        if (this.rolUsuarioSesion === 'CLIENTE' && idUsuarioSesion && Number(idUsuarioSesion) !== this.idCliente) {
          this.router.navigate(['/acceso-no-autorizado']);
        } else {
          this.obtenerCliente(this.idCliente);
          this.cargarMascotas(this.idCliente);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  // Carga los datos del cliente
  obtenerCliente(idUsuario: number): void {
    this.isLoadingCliente = true;
    this.usuarioService.getUsuarioPorId(idUsuario).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
      },
      error: (err) => {
        console.error('Error obteniendo datos del cliente:', err);
      },
      complete: () => {
        this.isLoadingCliente = false;
      }
    });
  }

  // Carga las mascotas del cliente
  cargarMascotas(idUsuario: number): void {
    this.isLoading = true;
    this.mascotaService.getMascotasPorIdUsuario(idUsuario).subscribe({
      next: (mascotas) => {
        this.dataSource.data = mascotas || [];
      },
      error: (err) => {
        console.error('Error obteniendo las mascotas:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  navegarMascotaDashboard(idMascota: number): void {
    this.router.navigate([`/mascota/dashboard/${idMascota}`], {
      queryParams: { origen: 'cliente-mascotas-list' },
    });
  }

  crearMascota(): void {
    if (this.idCliente) {
      this.router.navigate([`/mascota/alta-mascota/${this.idCliente}`]);
    } else {
      console.error('ID del cliente no disponible.');
    }
  }

  eliminarMascota(mascota: Mascota): void {
    const dialogRef = this.dialog.open(BajaMascotaComponent, {
      width: '400px',
      data: mascota
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarMascotas(this.idCliente!);
      }
    });
  }

  volver(): void {
    this.router.navigate([`/cliente/dashboard/${this.idCliente}`]);
  }
}
