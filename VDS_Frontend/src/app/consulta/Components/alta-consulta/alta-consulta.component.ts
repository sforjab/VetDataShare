import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsultaService } from '../../Services/consulta.service';
import { Consulta } from '../../Models/consulta.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-alta-consulta',
  templateUrl: './alta-consulta.component.html',
  styleUrl: './alta-consulta.component.css'
})
export class AltaConsultaComponent implements OnInit {
  consulta: Consulta = {
    motivo: '',
    notas: '',
    medicacion: '',
    fechaConsulta: '',
    mascotaId: 0,
    veterinarioId: 0,
    clinicaId: 0,
    pruebaIds: [],
    vacunaIds: [] 
  };

  usuarioId: number | null = null;
  rol: string | null = null;

  constructor(private consultaService: ConsultaService, private usuarioService: UsuarioService, 
              private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const idMascota = this.route.snapshot.paramMap.get('idMascota');
    if (idMascota) {
      this.consulta.mascotaId = +idMascota;
    } else {
      console.error('ID de la mascota no encontrado en la ruta.');
      this.router.navigate(['/acceso-no-autorizado']);
      return;
    }

    // Obtener datos de sesión
    this.usuarioId = +sessionStorage.getItem('idUsuario')!;
    this.rol = sessionStorage.getItem('rol');
    this.consulta.veterinarioId = this.usuarioId!;

    // Obtener el clinicaId del usuario logueado
    this.usuarioService.getUsuarioPorId(this.usuarioId).subscribe({
      next: (usuario) => {
        this.consulta.clinicaId = usuario.clinicaId; // Asignar la clínica del usuario logueado
      },
      error: (err: any) => {
        console.error('Error al obtener datos del usuario:', err);
        this.snackBar.open('Error al cargar los datos del usuario', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/acceso-no-autorizado']);
      }
    });
  }

  crearConsulta(): void {
    // Asignar la fecha de la consulta al momento actual
    this.consulta.fechaConsulta = new Date().toISOString();

    this.consultaService.createConsulta(this.consulta).subscribe({
      next: (consulta) => {
        this.snackBar.open('Consulta creada con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate([`/consulta/detalle/${consulta.id}`]);
      },
      error: (err) => {
        console.error('Error al crear la consulta:', err);
        this.snackBar.open('Error al crear la consulta', 'Cerrar', { duration: 3000 });
      }
    });
  }

  volver(): void {
    this.router.navigate([`/consulta/mascota-consultas-list/${this.consulta.mascotaId}`]);
  }
}
