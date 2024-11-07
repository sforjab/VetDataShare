import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaDashboardComponent } from './Components/mascota-dashboard/mascota-dashboard.component';
import { MascotaDetalleComponent } from './Components/mascota-detalle/mascota-detalle.component';
import { MascotaRoutingModule } from './mascota-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { CalcularEdadPipe } from './Pipes/calcular-edad.pipe';



@NgModule({
  declarations: [
    MascotaDashboardComponent, // Pantalla de opciones para una mascota
    MascotaDetalleComponent, // Detalle de la mascota
    CalcularEdadPipe,

  ],
  imports: [
    CommonModule,
    MascotaRoutingModule,
    MatButtonModule
  ]
})
export class MascotaModule { }
