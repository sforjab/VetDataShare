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
import { AltaMascotaComponent } from './Components/alta-mascota/alta-mascota.component';
import { MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import { BajaMascotaComponent } from './Components/baja-mascota/baja-mascota.component';



@NgModule({
  declarations: [
    MascotaDashboardComponent, // Pantalla de opciones para una mascota
    MascotaDetalleComponent, // Detalle de la mascota
    GestionMascotasComponent,
    AltaMascotaComponent,
    BajaMascotaComponent,
    CalcularEdadPipe

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
    MatDividerModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
    
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
})
export class MascotaModule { }
