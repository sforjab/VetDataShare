import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacunaRoutingModule } from './vacuna-routing.module';
import { MascotaVacunasListComponent } from './Components/mascota-vacunas-list/mascota-vacunas-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { AltaVacunaComponent } from './Components/alta-vacuna/alta-vacuna.component';
import { BajaVacunaComponent } from './Components/baja-vacuna/baja-vacuna.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { VacunaDetalleComponent } from './Components/vacuna-detalle/vacuna-detalle.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    MascotaVacunasListComponent,
    AltaVacunaComponent,
    BajaVacunaComponent,
    VacunaDetalleComponent
  ],
  imports: [
    CommonModule,
    VacunaRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  
  ]
})
export class VacunaModule { }
