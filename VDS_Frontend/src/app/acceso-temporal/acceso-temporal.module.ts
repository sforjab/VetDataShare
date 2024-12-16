import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccesoTemporalRoutingModule } from './acceso-temporal-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AccesoTemporalValidarComponent } from './Components/acceso-temporal-validar/acceso-temporal-validar.component';
import { NumeroColegiadoComponent } from './Components/numero-colegiado/numero-colegiado.component';
import { MatOptionModule } from '@angular/material/core';
import { QRCodeModule } from 'angularx-qrcode';
import { AccesoTemporalGenerarComponent } from './Components/acceso-temporal-generar/acceso-temporal-generar.component';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    AccesoTemporalGenerarComponent,
    AccesoTemporalValidarComponent,
    NumeroColegiadoComponent
  ],
  imports: [
    CommonModule,
    AccesoTemporalRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    MatCardModule,
    FormsModule,
    QRCodeModule
  ]
})
export class AccesoTemporalModule { }
