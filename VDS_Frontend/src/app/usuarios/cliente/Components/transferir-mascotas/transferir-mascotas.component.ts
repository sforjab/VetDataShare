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
  datosDestino: any = null; // Almacena los datos del propietario destino
  errorBusqueda: string = ''; // Mensaje de error si no se encuentra el propietario destino
  mensajeSinMascotas: string = ''; // Mensaje si el propietario origen no tiene mascotas
  tieneMascotas: boolean = true; // Para mostrar u ocultar opciones de transferencia
  idMascota: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private usuarioService: UsuarioService, private mascotaService: MascotaService, private dialog: MatDialog) {}

  /* ngOnInit(): void {
    // Obtener el ID del propietario origen desde los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      const propietarioOrigen = params.get('numIdent');
      if (propietarioOrigen) {
        this.propietarioOrigen = propietarioOrigen;
        this.verificarMascotas(propietarioOrigen);
      }
    });
  } */

  /* ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const propietarioOrigen = params.get('numIdent') || ''; // Número de identificación del cliente
      const idMascota = params.get('idMascota'); // ID de la mascota (opcional)
  
      if (propietarioOrigen) {
        this.propietarioOrigen = propietarioOrigen;
      }
  
      if (idMascota) {
        this.idMascota = Number(idMascota); // Si existe, se trata de una transferencia de una mascota
      }
  
      // Verificar mascotas solo en transferencias masivas
      if (!this.idMascota) {
        this.verificarMascotas(propietarioOrigen);
      }
    });
  } */

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idMascota = params.get('idMascota'); // ID de la mascota (opcional)
  
      if (idMascota) {
        this.idMascota = Number(idMascota);
        this.obtenerPropietarioDesdeMascota(this.idMascota); // Método para obtener propietario
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
                this.tieneMascotas = false; // Ocultar opciones de transferencia
              }
            },
            error: (error) => {
              console.error('Error al verificar mascotas:', error);
              this.mensajeSinMascotas = 'Error al verificar las mascotas del cliente.';
              this.tieneMascotas = false; // Ocultar opciones de transferencia
            },
          });
        } else {
          this.mensajeSinMascotas = 'No se encontró el cliente con el número de identificación proporcionado.';
          this.tieneMascotas = false; // Ocultar opciones de transferencia
        }
      },
      error: (error) => {
        console.error('Error al obtener usuario:', error);
        this.mensajeSinMascotas = 'Error al obtener el cliente por número de identificación.';
        this.tieneMascotas = false; // Ocultar opciones de transferencia
      },
    });
  }
  

  buscarPropietarioDestino(): void {
    this.errorBusqueda = ''; // Limpiar mensajes previos
    this.datosDestino = null; // Limpiar datos previos
  
    this.usuarioService.getUsuarioPorNumIdent(this.propietarioDestino).subscribe({
      next: usuario => {
        this.datosDestino = usuario; // Asignar datos si se encuentra el usuario
      },
      error: (error) => {
        if (error.status === 404) { // Manejar específicamente el error 404
          this.errorBusqueda = 'No se encontró ningún cliente con el número de identificación proporcionado.';
        } else {
          this.errorBusqueda = 'Ocurrió un error al buscar el cliente.';
        }
        this.datosDestino = null; // Asegurarse de que los datos queden limpios
      }
    });
  }

  /* transferirMascotas(): void {
    const dialogRef = this.dialog.open(ConfirmarTransferenciaComponent, {
      width: '400px',
      data: {
        idOrigen: this.propietarioOrigen,
        idDestino: this.propietarioDestino
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Navegar de vuelta a gestión de clientes si la transferencia fue confirmada
        this.router.navigate(['/cliente/gestion-clientes']);
      } else {
        console.log('Transferencia cancelada por el usuario.');
      }
    });
  } */

  /* transferirMascotas(): void {
    const dialogRef = this.dialog.open(ConfirmarTransferenciaComponent, {
      width: '400px',
      data: {
        idOrigen: this.propietarioOrigen,
        idDestino: this.propietarioDestino,
        idMascota: this.idMascota || null // Solo se envía si existe
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Navegar de vuelta al origen correspondiente
        if (this.idMascota) {
          this.router.navigate(['/mascota/gestion-mascotas']); // Para transferencias individuales
        } else {
          this.router.navigate(['/cliente/gestion-clientes']); // Para transferencias masivas
        }
      } else {
        console.log('Transferencia cancelada por el usuario.');
      }
    });
  } */

  /* transferirMascotas(): void {
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
        this.usuarioService.transferirMascotas(this.propietarioOrigen, this.propietarioDestino, this.idMascota).subscribe({
          next: () => {
            console.log('Transferencia realizada con éxito.');
            this.router.navigate(this.idMascota ? ['/mascota/gestion-mascotas'] : ['/cliente/gestion-clientes']);
          },
          error: (err) => {
            console.error('Error realizando la transferencia:', err);
          }
        });
      }
    });
  } */

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
    /* this.router.navigate(['/cliente/gestion-clientes']); */ // Volver a la pantalla de gestión de clientes
    if (this.idMascota) {
      this.router.navigate(['/mascota/gestion-mascotas']); // Para transferencias individuales
    } else {
      this.router.navigate(['/cliente/gestion-clientes']); // Para transferencias masivas
    }
  }
}
