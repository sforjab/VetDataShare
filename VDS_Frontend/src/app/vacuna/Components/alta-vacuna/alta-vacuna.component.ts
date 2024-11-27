import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Vacuna } from '../../Models/vacuna.dto';
import { VacunaService } from '../../Services/vacuna.service';

@Component({
  selector: 'app-alta-vacuna',
  templateUrl: './alta-vacuna.component.html',
  styleUrl: './alta-vacuna.component.css'
})
export class AltaVacunaComponent implements OnInit {
  vacuna: Vacuna = {
    nombre: '',
    laboratorio: '',
    fecha: '',
    mascotaId: 0,
    veterinarioId: 0,
    consultaId: 0
  };

  constructor(private vacunaService: VacunaService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Obtenemos idConsulta de la URL
    const idConsulta = this.route.snapshot.paramMap.get('idConsulta');
    if (idConsulta) {
      this.vacuna.consultaId = +idConsulta;

      // Configuramos veterinario desde sesión
      this.vacuna.veterinarioId = +sessionStorage.getItem('idUsuario')!;
    } else {
      console.error('ID de consulta no encontrado en la ruta.');
      this.router.navigate(['/acceso-no-autorizado']);
    }
  }

  crearVacuna(): void {
    // Enviar los datos de la vacuna al servicio para su creación
    this.vacunaService.createVacuna(this.vacuna).subscribe({
      next: () => {
        this.snackBar.open('Vacuna creada con éxito', 'Cerrar', { duration: 3000 });
        this.volver();
      },
      error: (err) => {
        console.error('Error al crear la vacuna:', err);
        this.snackBar.open('Error al crear la vacuna', 'Cerrar', { duration: 3000 });
      }
    });
  }

  volver(): void {
    this.router.navigate([`/consulta/detalle/${this.vacuna.consultaId}`]);
  }
}