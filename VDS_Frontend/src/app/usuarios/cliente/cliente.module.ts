import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteDashboardComponent } from './Components/cliente-dashboard/cliente-dashboard.component';
import { ClientePerfilComponent } from './Components/cliente-perfil/cliente-perfil.component';
import { ClienteMascotasListComponent } from '../../mascota/Components/cliente-mascotas-list/cliente-mascotas-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { GestionClientesComponent } from './Components/gestion-clientes/gestion-clientes.component';


@NgModule({
  declarations: [
    ClienteDashboardComponent,
    ClientePerfilComponent,
    ClienteMascotasListComponent,
    GestionClientesComponent
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
    RouterModule
  ]
})
export class ClienteModule { }
