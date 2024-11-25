import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Mascota } from '../../Models/mascota.dto';
import { MascotaService } from '../../Services/mascota.service';

@Component({
  selector: 'app-alta-mascota',
  templateUrl: './alta-mascota.component.html',
  styleUrls: ['./alta-mascota.component.css']
})
export class AltaMascotaComponent implements OnInit {
  mascota: Mascota = {
    nombre: '',
    numChip: '',
    especie: '',
    raza: '',
    sexo: 'Macho',
    fechaNacimiento: '',
    propietarioId: 0 
  };

  constructor(
    private mascotaService: MascotaService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const idCliente = this.route.snapshot.paramMap.get('idCliente');
    if (idCliente) {
      this.mascota.propietarioId = +idCliente;
    } else {
      console.error('ID del cliente no encontrado en la ruta.');
      this.router.navigate(['/acceso-no-autorizado']);
    }
  }

  crearMascota(): void {
    this.mascotaService.createMascota(this.mascota).subscribe({
      next: () => {
        this.snackBar.open('Mascota creada con éxito', 'Cerrar', { duration: 3000 });
        this.volver();
      },
      error: (err) => {
        console.error('Error al crear la mascota:', err);
        this.snackBar.open('Error al crear la mascota', 'Cerrar', { duration: 3000 });
      }
    });
  }

  volver(): void {
    this.router.navigate([`/mascota/cliente-mascotas-list/${this.mascota.propietarioId}`]);
  }
}
