import { Component, OnInit } from '@angular/core';
import { Consulta } from '../../Models/consulta.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaService } from '../../Services/consulta.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Prueba } from 'src/app/prueba/Models/prueba.dto';
import { Vacuna } from 'src/app/vacuna/Models/vacuna.dto';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { ClinicaService } from 'src/app/clinica/Services/clinica.service';
import { Clinica } from 'src/app/clinica/Models/clinica.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BajaVacunaComponent } from 'src/app/vacuna/Components/baja-vacuna/baja-vacuna.component';
import { BajaPruebaComponent } from 'src/app/prueba/Components/baja-prueba/baja-prueba.component';
import { ConsultaDetalleResponse } from '../../Models/consulta-detalle-response.dto';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-consulta-detalle',
  templateUrl: './consulta-detalle.component.html',
  styleUrls: ['./consulta-detalle.component.css'],
})
export class ConsultaDetalleComponent implements OnInit {
  consulta: Consulta | null = null;
  mascota: Mascota | null = null;
  veterinario: Usuario | null = null;
  clinica: Clinica | null = null;
  pruebas: Prueba[] = [];
  vacunas: Vacuna[] = [];
  motivo: string = '';
  notas: string = '';
  medicacion: string = '';
  usuarioLogueado: Usuario | null = null;
  rol: string | null = null;
  puedeEditar: boolean = false;
  mostrarNotas: boolean = true;
  idConsulta: number | null = null;
  isLoading: boolean = false;

  constructor(private consultaService: ConsultaService, private mascotaService: MascotaService, private usuarioService: UsuarioService, private clinicaService: ClinicaService,
              private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    const usuarioId = +sessionStorage.getItem('idUsuario')!;
    const consultaId = +this.route.snapshot.paramMap.get('idConsulta')!;
    this.rol = sessionStorage.getItem('rol'); // Recuperamos el rol del usuario logueado
  
    if (!consultaId) {
      this.snackBar.open('ID de consulta no encontrado', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/']);
      return;
    }
  
    this.isLoading = true; // Activar spinner
    this.cargarDatos(usuarioId, consultaId);
  }
  
  cargarDatos(usuarioId: number, consultaId: number): void {
    const requests: { [key: string]: Observable<any> } = {
      consultaDetalle: this.consultaService.getConsultaDetalle(consultaId),
    };
  
    // Solo añade la carga del usuario si el usuarioId es válido (no temporal)
    if (usuarioId !== 0) {
      requests['usuario'] = this.usuarioService.getUsuarioPorId(usuarioId);
    }
  
    forkJoin(requests).subscribe({
      next: (responses) => {
        // Extraemos 'consultaDetalle' directamente
      const consultaDetalle = responses['consultaDetalle'];
  
      // Datos de la consulta
      this.consulta = consultaDetalle.consulta;
      this.mascota = consultaDetalle.mascota;
      this.veterinario = consultaDetalle.veterinario;
      this.clinica = consultaDetalle.clinica;
      this.pruebas = consultaDetalle.pruebas;
      this.vacunas = consultaDetalle.vacunas;
      this.motivo = consultaDetalle.consulta.motivo || '';
      this.notas = consultaDetalle.consulta.notas || '';
      this.medicacion = consultaDetalle.consulta.medicacion || '';

      // Asignamos el usuario si está disponible en las respuestas
      if ('usuario' in responses) {
        this.usuarioLogueado = responses['usuario'];
      }
  
      // Evaluar permisos
      this.evaluarPermisos();
      this.evaluarPermisosConsulta();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar los datos:', err);
        this.snackBar.open('No se pudieron cargar los datos.', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/acceso-no-autorizado']);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  evaluarPermisos(): void {
    this.mostrarNotas = this.rol !== 'CLIENTE';
  }

  evaluarPermisosConsulta(): void {
    if (this.rol === 'CLIENTE' || this.rol === 'TEMPORAL') {
        this.puedeEditar = false;
    } else if (this.rol === 'VETERINARIO' || this.rol === 'ADMIN_CLINICA') {
        this.puedeEditar = this.consulta?.clinicaId === this.usuarioLogueado?.clinicaId;
    } else {
        this.puedeEditar = true;
    }
  }

  guardar(): void {
    if (!this.puedeEditar || !this.consulta) return;

    // Se actualizan los campos antes de enviar
    this.consulta.motivo = this.motivo;
    this.consulta.notas = this.notas;
    this.consulta.medicacion = this.medicacion;

    this.isLoading = true;
    this.consultaService.updateConsulta(this.consulta.id!, this.consulta).subscribe({
      next: () => {
        this.snackBar.open('Consulta actualizada correctamente', 'Cerrar', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Error al guardar la consulta:', err);
        this.snackBar.open('Error al actualizar la consulta', 'Cerrar', {
          duration: 3000,
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  nuevaPrueba(): void {
    if (this.idConsulta) {
      this.router.navigate([`/prueba/alta-prueba/${this.idConsulta}`]);
    } else {
      this.snackBar.open('No se puede crear prueba, ID de consulta no disponible', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  editarPrueba(prueba: Prueba): void {
    /* this.router.navigate([`/prueba/detalle/${prueba.id}`]); */
    this.router.navigate([`/prueba/detalle/${prueba.id}`], {
      queryParams: { origen: 'consulta-detalle' }
    });
  }

  eliminarPrueba(prueba: Prueba): void {
    const dialogRef = this.dialog.open(BajaPruebaComponent, {
      width: '400px',
      data: prueba
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cargarPruebasConsulta(); // Para refrescar listado de pruebas
      }
    });
  }
  
  private cargarPruebasConsulta(): void {
    if (this.idConsulta) {
      this.consultaService.getPruebasPorConsultaId(this.idConsulta).subscribe((pruebas) => {
        this.pruebas = pruebas;
      });
    }
  }

  nuevaVacuna(): void {
    if (this.idConsulta) {
      this.router.navigate([`/vacuna/alta-vacuna/${this.idConsulta}`]);
    } else {
      this.snackBar.open('No se puede crear vacuna, ID de consulta no disponible', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  editarVacuna(vacuna: Vacuna): void {
    this.router.navigate([`/vacuna/detalle/${vacuna.id}`]);
  }

  eliminarVacuna(vacuna: Vacuna): void {
    const dialogRef = this.dialog.open(BajaVacunaComponent, {
      width: '400px',
      data: vacuna
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cargarVacunasConsulta(); // Para refrescar listado de vacunas
      }
    });
  }

  private cargarVacunasConsulta(): void {
    if (this.idConsulta) {
      this.consultaService.getVacunasPorConsultaId(this.idConsulta).subscribe((vacunas) => {
        this.vacunas = vacunas;
      });
    }
  }

  volver(): void {
    this.router.navigate([`/consulta/mascota-consultas-list/${this.mascota?.id}`]);
  }
}
