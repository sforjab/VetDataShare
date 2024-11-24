import { Component } from '@angular/core';
import { AccesoTemporalService } from '../../Services/acceso-temporal.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-numero-colegiado',
  templateUrl: './numero-colegiado.component.html',
  styleUrls: ['./numero-colegiado.component.css']
})
export class NumeroColegiadoComponent {
  numColegiado: string = '';
  accesoToken!: string;  // Token de acceso temporal que viene de la URL
  mensaje: string = '';

  constructor(private accesoTemporalService: AccesoTemporalService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const token = params.get('token'); // Recuperamos el token desde la URL
      if (token) {
        this.accesoToken = token; // Guardamos en 'accesoToken'
      } else {
        console.error('Token de acceso temporal no encontrado en la URL.');
        this.router.navigate(['/']);
      }
    });
  }

  validarColegiado(): void {
    if (!this.numColegiado) {
      this.mensaje = 'Por favor, introduce un número de colegiado válido.';
      return;
    }

    // Crear el objeto requestData con el accesoToken y los datos adicionales
    const requestData = {
      token: this.accesoToken,
      numColegiado: this.numColegiado,
      fechaExpiracion: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString() // Una hora desde ahora
    };

    this.accesoTemporalService.actualizarAccesoTemporal(requestData).subscribe({
      next: (res: any) => {
        console.log('Acceso temporal registrado correctamente.');

        // Se guarda el JWT temporal en el 'sessionStorage'
        const jwtTemporal = res.jwtTemporal; 
        sessionStorage.setItem('jwtTemporal', jwtTemporal);

        // Recuperamos el id de la mascota
        const idMascota = res.idMascota;

        // Navegamos al dashboard de la mascota
        this.router.navigate([`/mascota/dashboard/${idMascota}`]);
      },
      error: (err) => {
        console.error('Error al registrar el acceso temporal:', err);
        this.mensaje = 'Error al registrar el acceso temporal. Por favor, inténtalo de nuevo.';
      }
    });
  }
}
