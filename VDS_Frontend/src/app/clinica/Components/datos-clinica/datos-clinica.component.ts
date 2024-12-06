import { Component } from '@angular/core';
import { Clinica } from '../../Models/clinica.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicaService } from '../../Services/clinica.service';

@Component({
  selector: 'app-datos-clinica',
  templateUrl: './datos-clinica.component.html',
  styleUrl: './datos-clinica.component.css'
})
export class DatosClinicaComponent {
  clinica: Clinica = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  };

  idClinica: number | null = null;
  isLoading: boolean = false;

  constructor(private clinicaService: ClinicaService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idClinica');
      if (id) {
        this.idClinica = +id;
        this.obtenerDatosClinica(this.idClinica);
      }
    });
  }

  obtenerDatosClinica(id: number): void {
    this.isLoading = true;
    this.clinicaService.getClinicaPorId(id).subscribe({
      next: (clinica) => {
        this.clinica = clinica;
        console.log('Datos de la clínica obtenidos:', clinica);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al obtener los datos de la clínica:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  guardarCambios(): void {
    if (this.idClinica) {
      this.isLoading = true;
      this.clinicaService.updateClinica(this.idClinica, this.clinica).subscribe({
        next: () => {
          this.snackBar.open('Clínica actualizada con éxito', 'Cerrar', {
            duration: 3000
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al actualizar la clínica:', err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  volver(): void {
    this.router.navigate([`/clinica/dashboard/${this.idClinica}`]);
  }
}
