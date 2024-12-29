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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BajaConsultaComponent } from './Components/baja-consulta/baja-consulta.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    ConsultaDetalleComponent,
    MascotaConsultasListComponent,
    AltaConsultaComponent,
    BajaConsultaComponent
  ],
  imports: [
    CommonModule,
    ConsultaRoutingModule,
    ReactiveFormsModule ,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class ConsultaModule { }
