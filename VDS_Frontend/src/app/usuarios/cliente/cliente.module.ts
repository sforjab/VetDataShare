import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteDashboardComponent } from './Components/cliente-dashboard/cliente-dashboard.component';
import { ClientePerfilComponent } from './Components/cliente-perfil/cliente-perfil.component';
import { ClienteMascotasListComponent } from '../../mascota/Components/cliente-mascotas-list/cliente-mascotas-list.component';
import { AltaClienteComponent } from './Components/alta-cliente/alta-cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { GestionClientesComponent } from './Components/gestion-clientes/gestion-clientes.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BajaClienteComponent } from './Components/baja-cliente/baja-cliente.component';
import { TransferirMascotasComponent } from './Components/transferir-mascotas/transferir-mascotas.component';
import { ConfirmarTransferenciaComponent } from './Components/confirmar-transferencia/confirmar-transferencia.component';


@NgModule({
  declarations: [
    ClienteDashboardComponent,
    ClientePerfilComponent,
    ClienteMascotasListComponent,
    GestionClientesComponent,
    AltaClienteComponent,
    BajaClienteComponent,
    TransferirMascotasComponent,
    ConfirmarTransferenciaComponent ,
    MatProgressSpinnerModule
  ],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatPaginatorModule,
    MatDialogModule,
    RouterModule
  ]
})
export class ClienteModule { }
