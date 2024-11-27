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

  // Información adicional para mostrar
  nombreMascota: string = '';
  numeroChip: string = '';
  numColegiado: string = '';

  constructor(private pruebaService: PruebaService, private mascotaService: MascotaService, private consultaService: ConsultaService, private usuarioService: UsuarioService,
              private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.pruebaId = +this.route.snapshot.paramMap.get('idPrueba')!;
    if (this.pruebaId) {
      this.cargarPrueba(this.pruebaId);
    } else {
      this.snackBar.open('ID de prueba no encontrado', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/']);
    }
  }

  cargarPrueba(id: number): void {
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
        this.router.navigate(['/']);
      }
    });
  }

  cargarMascota(mascotaId: number): void {
    this.mascotaService.getMascotaPorId(mascotaId).subscribe({
      next: (mascota: Mascota) => {
        this.nombreMascota = mascota.nombre || 'No disponible';
        this.numeroChip = mascota.numChip || 'No disponible';
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando mascota:', err);
        this.snackBar.open('Error cargando los datos de la mascota', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cargarConsulta(consultaId: number): void {
    this.consultaService.getConsultaPorId(consultaId).subscribe({
      next: (consulta: Consulta) => {
        this.cargarVeterinario(consulta.veterinarioId);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando consulta:', err);
        this.snackBar.open('Error cargando los datos de la consulta', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cargarVeterinario(veterinarioId: number): void {
    this.usuarioService.getUsuarioPorId(veterinarioId).subscribe({
      next: (veterinario: Usuario) => {
        this.numColegiado = veterinario.numColegiado || 'No disponible';
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando veterinario:', err);
        this.snackBar.open('Error cargando los datos del veterinario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  guardarPrueba(): void {
    if (!this.prueba) return;

    this.pruebaService.updatePrueba(this.prueba.id!, this.prueba).subscribe({
      next: () => {
        this.snackBar.open('Prueba actualizada con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate([`/consulta/detalle/${this.prueba.consultaId}`]);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al actualizar la prueba:', err);
        this.snackBar.open('Error al actualizar la prueba', 'Cerrar', { duration: 3000 });
      }
    });
  }

  volver(): void {
    this.router.navigate([`/consulta/detalle/${this.prueba.consultaId}`]);
  }
}
