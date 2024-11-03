import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaRoutingModule } from './consulta-routing.module';
import { ConsultaDetalleComponent } from './Components/consulta-detalle/consulta-detalle.component';
import { MascotaConsultasListComponent } from './Components/mascota-consultas-list/mascota-consultas-list.component';


@NgModule({
  declarations: [
    ConsultaDetalleComponent,
    MascotaConsultasListComponent
  ],
  imports: [
    CommonModule,
    ConsultaRoutingModule
  ]
})
export class ConsultaModule { }
