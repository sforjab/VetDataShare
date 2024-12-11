import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { ConfirmarTransferenciaComponent } from '../confirmar-transferencia/confirmar-transferencia.component';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';

@Component({
  selector: 'app-transferir-mascotas',
  templateUrl: './transferir-mascotas.component.html',
  styleUrl: './transferir-mascotas.component.css'
})
export class TransferirMascotasComponent implements OnInit {
  propietarioOrigen: string = '';
  propietarioDestino: string = '';
  datosDestino: any = null; 
  errorBusqueda: string = ''; 
  mensajeSinMascotas: string = ''; 
  tieneMascotas: boolean = true; 
  idMascota: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private usuarioService: UsuarioService, private mascotaService: MascotaService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idMascota = params.get('idMascota'); 
  
      if (idMascota) {
        this.idMascota = Number(idMascota);
        this.obtenerPropietarioDesdeMascota(this.idMascota); 
      } else {
        const propietarioOrigen = params.get('numIdent') || ''; // Para transferencias masivas
        if (propietarioOrigen) {
          this.propietarioOrigen = propietarioOrigen;
          this.verificarMascotas(propietarioOrigen); // Método existente para transferencias masivas
        }
      }
    });
  }

  obtenerPropietarioDesdeMascota(idMascota: number): void {
    this.mascotaService.getMascotaPorId(idMascota).subscribe({
      next: (mascota) => {
        if (mascota.propietarioId) {
          this.usuarioService.getUsuarioPorId(mascota.propietarioId).subscribe({
            next: (usuario) => {
              this.propietarioOrigen = usuario.numIdent; // Asignar el propietario origen
            },
            error: (err) => {
              console.error('Error obteniendo el propietario de la mascota:', err);
              this.mensajeSinMascotas = 'Error al obtener el propietario de la mascota.';
              this.tieneMascotas = false; // Bloquea las transferencias
            },
          });
        }
      },
      error: (err) => {
        console.error('Error obteniendo datos de la mascota:', err);
        this.mensajeSinMascotas = 'Error al obtener datos de la mascota.';
        this.tieneMascotas = false; // Bloquea las transferencias
      }
    });
  }

  verificarMascotas(propietarioOrigen: string): void {
    this.usuarioService.getUsuarioPorNumIdent(propietarioOrigen).subscribe({
      next: (usuario) => {
        if (usuario && usuario.id) {
          this.mascotaService.getMascotasPorIdUsuario(usuario.id).subscribe({
            next: (mascotas) => {
              if (mascotas.length === 0) {
                this.mensajeSinMascotas = 'El cliente no tiene mascotas asociadas.';
                this.tieneMascotas = false;
              }
            },
            error: (error) => {
              console.error('Error al verificar mascotas:', error);
              this.mensajeSinMascotas = 'Error al verificar las mascotas del cliente.';
              this.tieneMascotas = false; 
            },
          });
        } else {
          this.mensajeSinMascotas = 'No se encontró el cliente con el número de identificación proporcionado.';
          this.tieneMascotas = false; 
        }
      },
      error: (error) => {
        console.error('Error al obtener usuario:', error);
        this.mensajeSinMascotas = 'Error al obtener el cliente por número de identificación.';
        this.tieneMascotas = false; 
      },
    });
  }
  

  buscarPropietarioDestino(): void {
    this.errorBusqueda = ''; 
    this.datosDestino = null; 
  
    this.usuarioService.getUsuarioPorNumIdent(this.propietarioDestino).subscribe({
      next: usuario => {
        this.datosDestino = usuario; 
      },
      error: (error) => {
        if (error.status === 404) { 
          this.errorBusqueda = 'No se encontró ningún cliente con el número de identificación proporcionado.';
        } else {
          this.errorBusqueda = 'Ocurrió un error al buscar el cliente.';
        }
        this.datosDestino = null; 
      }
    });
  }

  transferirMascotas(): void {
    const dialogRef = this.dialog.open(ConfirmarTransferenciaComponent, {
      width: '400px',
      data: {
        idOrigen: this.propietarioOrigen,
        idDestino: this.propietarioDestino,
        idMascota: this.idMascota // Null si es una transferencia masiva
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Redirige automáticamente según el contexto
        this.router.navigate(this.idMascota ? ['/mascota/gestion-mascotas'] : ['/cliente/gestion-clientes']);
      } else {
        console.log('Transferencia cancelada o fallida.');
      }
    });
  }

  volver(): void {
    if (this.idMascota) {
      this.router.navigate(['/mascota/gestion-mascotas']); // Para transferencias individuales
    } else {
      this.router.navigate(['/cliente/gestion-clientes']); // Para transferencias masivas
    }
  }
}
