import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeterinarioRoutingModule } from './veterinario-routing.module';
import { VeterinarioDashboardComponent } from './Components/veterinario-dashboard/veterinario-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { VeterinarioPerfilComponent } from './Components/veterinario-perfil/veterinario-perfil.component';


@NgModule({
  declarations: [
    VeterinarioDashboardComponent,
    VeterinarioPerfilComponent
  ],
  imports: [
    CommonModule,
    VeterinarioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    RouterModule
  ]
})
export class VeterinarioModule { }
