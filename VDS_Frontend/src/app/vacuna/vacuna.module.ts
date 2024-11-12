import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacunaRoutingModule } from './vacuna-routing.module';
import { MascotaVacunasListComponent } from './Components/mascota-vacunas-list/mascota-vacunas-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    MascotaVacunasListComponent
  ],
  imports: [
    CommonModule,
    VacunaRoutingModule,
    MatTableModule,      // Para poder usar <table mat-table>
    MatButtonModule,     // Para poder usar <button mat-button>
  ]
})
export class VacunaModule { }
