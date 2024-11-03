import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; // Para las tablas
import { MatButtonModule } from '@angular/material/button'; // Para los botones
import { MascotaPruebasListComponent } from './Components/mascota-pruebas-list/mascota-pruebas-list.component';
import { PruebaRoutingModule } from './prueba-routing.module';

@NgModule({
  declarations: [
    MascotaPruebasListComponent // Aquí es donde declaras tu componente
  ],
  imports: [
    CommonModule,
    MatTableModule,      // Para poder usar <table mat-table>
    MatButtonModule,     // Para poder usar <button mat-button>
    PruebaRoutingModule  // Enrutamiento del módulo
  ]
})
export class PruebaModule { }

