import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaRoutingModule } from './consulta-routing.module';
import { ConsultaDetalleComponent } from './Components/consulta-detalle/consulta-detalle.component';
import { MascotaConsultasListComponent } from './Components/mascota-consultas-list/mascota-consultas-list.component';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    ConsultaDetalleComponent,
    MascotaConsultasListComponent,
  ],
  imports: [
    CommonModule,
    ConsultaRoutingModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ConsultaModule { }
