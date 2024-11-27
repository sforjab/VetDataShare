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

  constructor(private consultaService: ConsultaService, private mascotaService: MascotaService, private usuarioService: UsuarioService, private clinicaService: ClinicaService,
              private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  /* ngOnInit(): void {
    const usuarioId = +sessionStorage.getItem('idUsuario')!;
    this.cargarUsuarioLogueado(usuarioId);
    this.rol = sessionStorage.getItem('rol');

    this.evaluarPermisos();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('idConsulta');
      if (id) {
        this.cargarConsulta(+id);
      }
    });
  } */

  ngOnInit(): void {
    const usuarioId = +sessionStorage.getItem('idUsuario')!;
    this.cargarUsuarioLogueado(usuarioId, () => {
      this.rol = sessionStorage.getItem('rol');
      this.evaluarPermisos();
  
      this.route.paramMap.subscribe((params) => {
        const id = params.get('idConsulta');
        if (id) {
          this.cargarConsulta(+id);
        }
      });
    });
  }

  /* cargarUsuarioLogueado(id: number): void {
    this.usuarioService.getUsuarioPorId(id).subscribe((usuario) => {
      this.usuarioLogueado = usuario;
    });
  } */

  cargarUsuarioLogueado(id: number, callback: () => void): void {
    this.usuarioService.getUsuarioPorId(id).subscribe((usuario) => {
      this.usuarioLogueado = usuario;
      console.log('Usuario logueado cargado:', usuario);
      callback();
    });
  }

  cargarConsulta(idConsulta: number): void {
    this.consultaService.getConsultaPorId(idConsulta).subscribe((consulta) => {
      this.consulta = consulta;
      this.motivo = consulta.motivo || '';
      this.notas = consulta.notas || '';
      this.medicacion = consulta.medicacion || '';
      this.cargarMascota(consulta.mascotaId);
      this.cargarVeterinario(consulta.veterinarioId);
      if (consulta.clinicaId) {
        this.cargarClinica(consulta.clinicaId);
      }
      this.evaluarPermisosConsulta();
    });
  }

  cargarMascota(mascotaId: number): void {
    this.mascotaService.getMascotaPorId(mascotaId).subscribe((mascota) => {
      this.mascota = mascota;
    });
  }

  cargarVeterinario(veterinarioId: number): void {
    this.usuarioService.getUsuarioPorId(veterinarioId).subscribe((usuario) => {
      this.veterinario = usuario;
    });
  }

  cargarClinica(clinicaId: number): void {
    this.clinicaService.getClinicaPorId(clinicaId).subscribe((clinica) => {
      this.clinica = clinica;
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

    // Actualizar campos antes de enviar
    this.consulta.motivo = this.motivo;
    this.consulta.notas = this.notas;
    this.consulta.medicacion = this.medicacion;

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
    });
  }

  volver(): void {
    this.router.navigate([`/consulta/mascota-consultas-list/${this.mascota?.id}`]);
  }
}
