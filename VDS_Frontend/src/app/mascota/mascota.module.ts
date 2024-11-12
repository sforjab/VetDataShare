import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaDashboardComponent } from './Components/mascota-dashboard/mascota-dashboard.component';
import { MascotaDetalleComponent } from './Components/mascota-detalle/mascota-detalle.component';
import { MascotaRoutingModule } from './mascota-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { CalcularEdadPipe } from './Pipes/calcular-edad.pipe';
import { MatCardModule } from '@angular/material/card';
import { GestionMascotasComponent } from './Components/gestion-mascotas/gestion-mascotas.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MascotaDashboardComponent, // Pantalla de opciones para una mascota
    MascotaDetalleComponent, // Detalle de la mascota
    CalcularEdadPipe, GestionMascotasComponent,

  ],
  imports: [
    CommonModule,
    MascotaRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule
  ]
})
export class MascotaModule { }
