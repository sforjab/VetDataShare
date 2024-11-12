import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; // Para las tablas
import { MatButtonModule } from '@angular/material/button'; // Para los botones
import { MascotaPruebasListComponent } from './Components/mascota-pruebas-list/mascota-pruebas-list.component';
import { PruebaRoutingModule } from './prueba-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { PruebaDetalleComponent } from './Components/prueba-detalle/prueba-detalle.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    MascotaPruebasListComponent,
    PruebaDetalleComponent // Aquí es donde declaras tu componente
  ],
  imports: [
    CommonModule,
    PruebaRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    FormsModule
  ]
})
export class PruebaModule { }

