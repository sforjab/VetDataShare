import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prueba, TipoPrueba } from '../../Models/prueba.dto';
import { PruebaService } from '../../Services/prueba.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Mascota } from 'src/app/mascota/Models/mascota.dto';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { ConsultaService } from 'src/app/consulta/Services/consulta.service';

@Component({
  selector: 'app-prueba-detalle',
  templateUrl: './prueba-detalle.component.html',
  styleUrls: ['./prueba-detalle.component.css']
})
export class PruebaDetalleComponent implements OnInit {
  prueba: Partial<Prueba> = {};
  tiposPrueba: TipoPrueba[] = [TipoPrueba.IMAGEN, TipoPrueba.ANALÍTICA];
  idPrueba: number | undefined;
  mascota: Mascota | null = null;
  veterinario: Usuario | null = null;

  constructor(private pruebaService: PruebaService, private consultaService: ConsultaService, private mascotaService: MascotaService, private usuarioService: UsuarioService, 
              private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idPrueba');
      if (id) {
        this.idPrueba = +id;
        this.cargarPrueba(this.idPrueba);
      } else {
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }

  cargarPrueba(idPrueba: number): void {
    this.pruebaService.getPruebaPorId(idPrueba).subscribe({
      next: prueba => {
        this.prueba = prueba;

        // Cargar detalles adicionales
        if (prueba.mascotaId) {
          this.cargarMascota(prueba.mascotaId);
        }
        if (prueba.consultaId) {
          this.cargarVeterinarioDesdeConsulta(prueba.consultaId);
        }

        // Valores predeterminados
        this.prueba.tipo = this.prueba.tipo || this.tiposPrueba[0];
        this.prueba.descripcion = this.prueba.descripcion || '';
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar la prueba:', err);
      }
    });
  }

  cargarMascota(idMascota: number): void {
    this.mascotaService.getMascotaPorId(idMascota).subscribe({
      next: mascota => {
        this.mascota = mascota;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar la mascota:', err);
      }
    });
  }

  cargarVeterinarioDesdeConsulta(idConsulta: number): void {
    this.consultaService.getConsultaPorId(idConsulta).subscribe({
      next: consulta => {
        if (consulta.veterinarioId) {
          this.usuarioService.getUsuarioPorId(consulta.veterinarioId).subscribe({
            next: veterinario => {
              this.veterinario = veterinario;
            },
            error: (err: HttpErrorResponse) => {
              console.error('Error al cargar el veterinario:', err);
            }
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar la consulta:', err);
      }
    });
  }

  guardar(): void {
    console.log('Guardar cambios - lógica pendiente');
  }

  volver(): void {
    this.router.navigate([`/prueba/mascota-pruebas-list/${this.prueba.mascotaId}`]);
  }
}
