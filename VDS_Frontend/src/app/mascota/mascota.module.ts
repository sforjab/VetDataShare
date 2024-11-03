import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaDashboardComponent } from './Components/mascota-dashboard/mascota-dashboard.component';
import { MascotaDetalleComponent } from './Components/mascota-detalle/mascota-detalle.component';
import { HistoricoCitasComponent } from './Components/historico-citas/historico-citas.component';
import { MascotaRoutingModule } from './mascota-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { CalcularEdadPipe } from './Pipes/calcular-edad.pipe';



@NgModule({
  declarations: [
    MascotaDashboardComponent, // Pantalla de opciones para una mascota
    MascotaDetalleComponent, // Detalle de la mascota
    HistoricoCitasComponent, // Historial de citas
    CalcularEdadPipe,

  ],
  imports: [
    CommonModule,
    MascotaRoutingModule,
    MatButtonModule
  ]
})
export class MascotaModule { }
