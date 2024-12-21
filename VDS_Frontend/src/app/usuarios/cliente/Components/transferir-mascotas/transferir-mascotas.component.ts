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
  styleUrls: ['./transferir-mascotas.component.css']
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
  mascota: any = null; // Información de la mascota
  propietario: any = null; // Información del propietario

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    this.route.paramMap.subscribe(params => {
      const idMascota = params.get('idMascota'); 
  
      if (idMascota) {
        this.idMascota = Number(idMascota);
        this.cargarMascotaYPropietario(this.idMascota);
      } else {
        const propietarioOrigen = params.get('numIdent') || ''; // Para transferencias masivas
        if (propietarioOrigen) {
          this.propietarioOrigen = propietarioOrigen;
          this.cargarPropietarioPorNumIdent(propietarioOrigen);
        }
      }
    });
  }

  inicializarFormulario(): void {
    this.propietarioForm = this.fb.group({
      propietarioDestino: ['', Validators.required]
    });
  }

  cargarMascotaYPropietario(idMascota: number): void {
    this.mascotaService.getMascotaPorId(idMascota).subscribe({
      next: (mascota) => {
        this.mascota = mascota;
        if (mascota.propietarioId) {
          this.cargarPropietarioPorId(mascota.propietarioId);
        }
      },
      error: (err) => {
        console.error('Error obteniendo datos de la mascota:', err);
        this.mensajeSinMascotas = 'Error al obtener datos de la mascota.';
        this.tieneMascotas = false;
      }
    });
  }

  cargarPropietarioPorId(propietarioId: number): void {
    this.usuarioService.getUsuarioPorId(propietarioId).subscribe({
      next: (usuario) => {
        this.propietario = usuario;
        this.propietarioOrigen = usuario.numIdent;
      },
      error: (err) => {
        console.error('Error obteniendo datos del propietario:', err);
        this.mensajeSinMascotas = 'Error al obtener datos del propietario.';
        this.tieneMascotas = false;
      }
    });
  }

  cargarPropietarioPorNumIdent(numIdent: string): void {
    this.usuarioService.getUsuarioPorNumIdent(numIdent).subscribe({
      next: (usuario) => {
        this.propietario = usuario;
      },
      error: (err) => {
        console.error('Error obteniendo datos del propietario:', err);
        this.mensajeSinMascotas = 'Error al obtener datos del propietario.';
        this.tieneMascotas = false;
      }
    });
  }

  buscarPropietarioDestino(): void {
    if (this.propietarioForm.invalid) {
      this.propietarioForm.markAllAsTouched();
      return;
    }

    const propietarioDestino = this.propietarioForm.value.propietarioDestino;

    if (propietarioDestino === this.propietarioOrigen) {
      this.propietarioForm.get('propietarioDestino')?.setErrors({ sameAsOrigin: true });
      this.datosDestino = null;
      return;
    }

    this.usuarioService.getUsuarioPorNumIdent(propietarioDestino).subscribe({
      next: (usuario) => {
        if (usuario.rol === 'CLIENTE') {
          this.datosDestino = usuario;
          this.propietarioForm.get('propietarioDestino')?.setErrors(null);
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
        idMascota: this.idMascota
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.router.navigate(this.idMascota ? ['/mascota/gestion-mascotas'] : ['/cliente/gestion-clientes']);
      }
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.propietarioForm.get(campo);
    return !!(control?.invalid && (control.dirty || control.touched));
  }  

  volver(): void {
    if (this.idMascota) {
      this.router.navigate(['/mascota/gestion-mascotas']);
    } else {
      this.router.navigate(['/cliente/gestion-clientes']);
    }
  }
}
