import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prueba, TipoPrueba } from '../../Models/prueba.dto';
import { PruebaService } from '../../Services/prueba.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';
import { ConsultaService } from 'src/app/consulta/Services/consulta.service';
import { Consulta } from 'src/app/consulta/Models/consulta.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { DocumentoPrueba } from '../../Models/documento-prueba.dto';
import { DocumentoPruebaService } from '../../Services/documento-prueba.service';
import { MatDialog } from '@angular/material/dialog';
import { SubirDocumentoComponent } from '../subir-documento/subir-documento.component';
import { EliminarDocumentoComponent } from '../eliminar-documento/eliminar-documento.component';

@Component({
  selector: 'app-prueba-detalle',
  templateUrl: './prueba-detalle.component.html',
  styleUrls: ['./prueba-detalle.component.css']
})
export class PruebaDetalleComponent implements OnInit {
  prueba: Prueba = {
    tipo: TipoPrueba.IMAGEN,
    descripcion: '',
    fecha: '',
    consultaId: 0,
    mascotaId: 0
  };
  pruebaId: number | null = null;
  tiposPrueba = Object.values(TipoPrueba); // Tipos disponibles
  isLoading: boolean = false;

  // Información adicional
  nombreMascota: string = '';
  numeroChip: string = '';
  numColegiado: string = '';
  documentos: DocumentoPrueba[] = [];
  origen: string | null = null;
  columnasTabla: string[] = ['nombreArchivo', 'acciones'];

  constructor(private pruebaService: PruebaService, private mascotaService: MascotaService, private consultaService: ConsultaService, private usuarioService: UsuarioService,
              private documentoPruebaService: DocumentoPruebaService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.pruebaId = +this.route.snapshot.paramMap.get('idPrueba')!;
    this.origen = this.route.snapshot.queryParamMap.get('origen');
    if (this.pruebaId) {
      this.cargarPrueba(this.pruebaId);
      this.cargarDocumentos(this.pruebaId);
    } else {
      this.snackBar.open('ID de prueba no encontrado', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/']);
    }
  }

  cargarPrueba(id: number): void {
    this.isLoading = true;
    this.pruebaService.getPruebaPorId(id).subscribe({
      next: (prueba) => {
        this.prueba = prueba;

        // Cargar datos adicionales
        this.cargarMascota(prueba.mascotaId);
        this.cargarConsulta(prueba.consultaId);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando prueba:', err);
        this.snackBar.open('Error cargando los datos de la prueba', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  cargarMascota(mascotaId: number): void {
    this.isLoading = true;
    this.mascotaService.getMascotaPorId(mascotaId).subscribe({
      next: (mascota: Mascota) => {
        this.nombreMascota = mascota.nombre || 'No disponible';
        this.numeroChip = mascota.numChip || 'No disponible';
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando mascota:', err);
        this.snackBar.open('Error cargando los datos de la mascota', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  cargarConsulta(consultaId: number): void {
    this.isLoading = true;
    this.consultaService.getConsultaPorId(consultaId).subscribe({
      next: (consulta: Consulta) => {
        this.cargarVeterinario(consulta.veterinarioId);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando consulta:', err);
        this.snackBar.open('Error cargando los datos de la consulta', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  cargarVeterinario(veterinarioId: number): void {
    this.isLoading = true;
    this.usuarioService.getUsuarioPorId(veterinarioId).subscribe({
      next: (veterinario: Usuario) => {
        this.numColegiado = veterinario.numColegiado || 'No disponible';
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando veterinario:', err);
        this.snackBar.open('Error cargando los datos del veterinario', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  cargarDocumentos(pruebaId: number): void {
    this.isLoading = true;
    this.documentoPruebaService.getDocumentosPorPruebaId(pruebaId).subscribe({
      next: (documentos) => {
        this.documentos = documentos;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando documentos:', err);
        this.snackBar.open('Error cargando documentos.', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  abrirDialogSubirDocumento(): void {
    const dialogRef = this.dialog.open(SubirDocumentoComponent, {
      width: '400px',
      data: { pruebaId: this.pruebaId }, // Pasa el ID de la prueba al diálogo
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarDocumentos(this.pruebaId!);
      }
    });
  }

  descargarDocumento(documento: DocumentoPrueba): void {
    this.documentoPruebaService.descargarDocumento(documento.id!).subscribe({
      next: (blob: Blob | MediaSource) => {
        const url = window.URL.createObjectURL(blob); // Se crea una URL para el Blob
        const a = document.createElement('a'); // Creamos un enlace temporal
        a.href = url;
        a.download = documento.nombreArchivo; // Este es el nombre del archivo para la descarga
        a.click(); // Se activa la descarga
        window.URL.revokeObjectURL(url); // Se limpia la URL temporal
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al descargar el documento:', err);
        this.snackBar.open(`Error al descargar el documento: ${documento.nombreArchivo}`, 'Cerrar', { duration: 3000 });
      }
    });
  }
  

  eliminarDocumento(documento: DocumentoPrueba): void {
    const dialogRef = this.dialog.open(EliminarDocumentoComponent, {
      width: '400px',
      data: documento
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cargarDocumentos(this.pruebaId!);
      }
    });
  }

  guardarPrueba(): void {
    this.isLoading = true;
    this.pruebaService.updatePrueba(this.prueba.id!, this.prueba).subscribe({
      next: () => {
        this.snackBar.open('Prueba actualizada con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate([`/consulta/detalle/${this.prueba.consultaId}`]);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al actualizar la prueba:', err);
        this.snackBar.open('Error al actualizar la prueba', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  volver(): void {
    if (this.origen === 'consulta-detalle') {
      this.router.navigate([`/consulta/detalle/${this.prueba.consultaId}`]);
    } else if (this.origen === 'mascota-pruebas-list') {
      this.router.navigate([`/prueba/mascota-pruebas-list/${this.prueba.mascotaId}`]);
    }
  }
}
