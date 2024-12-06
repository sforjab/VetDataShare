import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; // Para las tablas
import { MatButtonModule } from '@angular/material/button'; // Para los botones
import { MascotaPruebasListComponent } from './Components/mascota-pruebas-list/mascota-pruebas-list.component';
import { PruebaRoutingModule } from './prueba-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { PruebaDetalleComponent } from './Components/prueba-detalle/prueba-detalle.component';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { AltaPruebaComponent } from './Components/alta-prueba/alta-prueba.component';
import { BajaPruebaComponent } from './Components/baja-prueba/baja-prueba.component';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { SubirDocumentoComponent } from './Components/subir-documento/subir-documento.component';
import { EliminarDocumentoComponent } from './Components/eliminar-documento/eliminar-documento.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    MascotaPruebasListComponent,
    PruebaDetalleComponent,
    AltaPruebaComponent,
    BajaPruebaComponent,
    SubirDocumentoComponent,
    EliminarDocumentoComponent
  ],
  imports: [
    CommonModule,
    PruebaRoutingModule,
    FormsModule,
    MatFormField,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class PruebaModule { }

