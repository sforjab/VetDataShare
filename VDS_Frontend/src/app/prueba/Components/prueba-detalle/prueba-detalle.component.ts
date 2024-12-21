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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-prueba-detalle',
  templateUrl: './prueba-detalle.component.html',
  styleUrls: ['./prueba-detalle.component.css']
})
export class PruebaDetalleComponent implements OnInit {
  detallePruebaForm!: FormGroup;
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
  origenPrevio: string | null = null;
  origen: string | null = null;
  columnasTabla: string[] = ['nombreArchivo', 'acciones'];

  // Permisos
  puedeEditar: boolean = false;
  rol: string | null = null;
  usuarioLogueado: Usuario | null = null;

  constructor(private pruebaService: PruebaService, private mascotaService: MascotaService, private consultaService: ConsultaService, private usuarioService: UsuarioService, private documentoPruebaService: DocumentoPruebaService, 
              private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.pruebaId = +this.route.snapshot.paramMap.get('idPrueba')!;
    this.origenPrevio = this.route.snapshot.queryParamMap.get('origenPrevio');
    this.origen = this.route.snapshot.queryParamMap.get('origen');
    this.rol = sessionStorage.getItem('rol');

    this.inicializarFormulario();

    if (this.pruebaId) {
      this.cargarPrueba(this.pruebaId);
      this.cargarDocumentos(this.pruebaId);
    } else {
      this.snackBar.open('ID de prueba no encontrado', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/']);
    }
  }

  inicializarFormulario(): void {
    this.detallePruebaForm = this.fb.group({
      tipo: [this.prueba.tipo, Validators.required],
      descripcion: [this.prueba.descripcion, [Validators.required, Validators.maxLength(500)]]
    });
  }

  cargarPrueba(id: number): void {
    this.isLoading = true;
    this.pruebaService.getPruebaPorId(id).subscribe({
      next: (prueba) => {
        this.prueba = prueba;

        this.detallePruebaForm.patchValue({
          tipo: prueba.tipo,
          descripcion: prueba.descripcion
        });

        this.cargarMascota(prueba.mascotaId);
        this.cargarConsulta(prueba.consultaId);
        this.evaluarPermisos();
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

  evaluarPermisos(): void {
    const usuarioId = +sessionStorage.getItem('idUsuario')!;
    this.usuarioService.getUsuarioPorId(usuarioId).subscribe({
      next: (usuario: Usuario) => {
        this.usuarioLogueado = usuario;

        if (this.rol === 'ADMIN') {
          this.puedeEditar = true;
        } else if (this.rol === 'VETERINARIO' || this.rol === 'ADMIN_CLINICA') {
          this.puedeEditar = this.prueba.consultaId === usuario.clinicaId;
        } else if (this.rol === 'TEMPORAL') {
          this.puedeEditar = false;
        } else {
          this.puedeEditar = false;
        }

        if (this.puedeEditar) {
          this.detallePruebaForm.enable();
        } else {
            this.detallePruebaForm.disable();
        }
      },
      error: (err) => {
        console.error('Error cargando usuario logueado:', err);
        this.puedeEditar = false;
        this.detallePruebaForm.disable();
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
    if (this.detallePruebaForm.invalid) {
      this.snackBar.open('Por favor, corrija los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    const datosActualizados = {
      ...this.prueba,
      ...this.detallePruebaForm.value
    };

    this.isLoading = true;
    this.pruebaService.updatePrueba(this.prueba.id!, datosActualizados).subscribe({
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

  campoEsInvalido(campo: string): boolean {
    const control = this.detallePruebaForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  volver(): void {
    if(this.origen) {
      if (this.origen === 'mascota-pruebas-list') {
        this.router.navigate([`/prueba/mascota-pruebas-list/${this.prueba.mascotaId}`]);
      } else if (this.origen === 'mascota-dashboard') {
        this.router.navigate([`/mascota/dashboard/${this.prueba.mascotaId}`]);
      } else {
        this.router.navigate(['/']);
      }
    } else {
        this.router.navigate([`/consulta/detalle/${this.prueba.consultaId}`], {
            queryParams: { origen: this.origenPrevio }
        });
    }
  }
}
