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
import { AltaConsultaComponent } from './Components/alta-consulta/alta-consulta.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ConsultaDetalleComponent,
    MascotaConsultasListComponent,
    AltaConsultaComponent
  ],
  imports: [
    CommonModule,
    ConsultaRoutingModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ConsultaModule { }
