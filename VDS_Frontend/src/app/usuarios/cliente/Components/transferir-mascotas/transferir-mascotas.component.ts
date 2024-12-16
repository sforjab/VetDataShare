import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';
import { ConfirmarTransferenciaComponent } from '../confirmar-transferencia/confirmar-transferencia.component';
import { MascotaService } from 'src/app/mascota/Services/mascota.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-transferir-mascotas',
  templateUrl: './transferir-mascotas.component.html',
  styleUrl: './transferir-mascotas.component.css'
})
export class TransferirMascotasComponent implements OnInit {
  propietarioForm!: FormGroup;
  propietarioOrigen: string = '';
  propietarioDestino: string = '';
  datosDestino: any = null; 
  errorBusqueda: string = ''; 
  mensajeSinMascotas: string = ''; 
  tieneMascotas: boolean = true; 
  idMascota: number | null = null;

  constructor(private usuarioService: UsuarioService, private mascotaService: MascotaService, private fb: FormBuilder, 
              private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.inicializarFormulario();

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

  inicializarFormulario(): void {
    this.propietarioForm = this.fb.group({
      propietarioDestino: ['', Validators.required] // Campo obligatorio
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
          this.mensajeSinMascotas = 'El identificador no pertenece a ningún cliente.';
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
    if (this.propietarioForm.invalid) {
      this.propietarioForm.markAllAsTouched(); // Se marcan los campos para mostrar errores
      return;
    }
  
    const propietarioDestino = this.propietarioForm.value.propietarioDestino;
  
    // Comprobar si el ID de destino es igual al ID de origen
    if (propietarioDestino === this.propietarioOrigen) {
      this.propietarioForm.get('propietarioDestino')?.setErrors({ sameAsOrigin: true });
      this.datosDestino = null;
      return;
    }
  
    this.usuarioService.getUsuarioPorNumIdent(propietarioDestino).subscribe({
      next: (usuario) => {
        if (usuario.rol === 'CLIENTE') {
          this.datosDestino = usuario; // Asignamos datos del propietario destino
          this.propietarioForm.get('propietarioDestino')?.setErrors(null); // Para asegurar que no hay errores en el control
        } else {
          this.propietarioForm.get('propietarioDestino')?.setErrors({ notFound: true });
          this.datosDestino = null;
        }
      },
      error: (error) => {
        if (error.status === 404) {
          this.propietarioForm.get('propietarioDestino')?.setErrors({ notFound: true });
        } else {
          this.propietarioForm.get('propietarioDestino')?.setErrors({ serverError: true });
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
        idDestino: this.propietarioForm.value.propietarioDestino,
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

  campoEsInvalido(campo: string): boolean {
    const control = this.propietarioForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }  

  volver(): void {
    if (this.idMascota) {
      this.router.navigate(['/mascota/gestion-mascotas']); // Para transferencias individuales
    } else {
      this.router.navigate(['/cliente/gestion-clientes']); // Para transferencias masivas
    }
  }
}
