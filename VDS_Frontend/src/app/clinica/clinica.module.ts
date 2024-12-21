import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicaRoutingModule } from './clinica-routing.module';
import { ClinicaDashboardComponent } from './Components/clinica-dashboard/clinica-dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatosClinicaComponent } from './Components/datos-clinica/datos-clinica.component';
import { GestionEmpleadosComponent } from './Components/gestion-empleados/gestion-empleados.component';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { AltaEmpleadoComponent } from './Components/alta-empleado/alta-empleado.component';
import { BajaEmpleadoComponent } from './Components/baja-empleado/baja-empleado.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GestionClinicasComponent } from './Components/gestion-clinicas/gestion-clinicas.component';
import { BajaClinicaComponent } from './Components/baja-clinica/baja-clinica.component';
import { AltaClinicaComponent } from './Components/alta-clinica/alta-clinica.component';
import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
  declarations: [
    ClinicaDashboardComponent,
    DatosClinicaComponent,
    GestionEmpleadosComponent,
    AltaEmpleadoComponent,
    BajaEmpleadoComponent,
    GestionClinicasComponent,
    AltaClinicaComponent,
    BajaClinicaComponent
  ],
  imports: [
    CommonModule,
    ClinicaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatExpansionModule
  ]
})
export class ClinicaModule { }
