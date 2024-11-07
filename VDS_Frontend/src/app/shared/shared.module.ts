import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './Components/header/header.component';
import { AccesoRestringidoComponent } from './Components/acceso-restringido/acceso-restringido.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    HeaderComponent,
    AccesoRestringidoComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  exports: [
    FormsModule,
    HeaderComponent
  ]
})
export class SharedModule { }
