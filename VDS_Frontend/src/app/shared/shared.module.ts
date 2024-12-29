import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './Components/header/header.component';
import { AccesoRestringidoComponent } from './Components/acceso-restringido/acceso-restringido.component';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from './Components/footer/footer.component';
import { AyudaComponent } from './Components/pages/ayuda/ayuda.component';
import { SobreNosotrosComponent } from './Components/pages/sobre-nosotros/sobre-nosotros.component';
import { PoliticaPrivacidadComponent } from './Components/pages/politica-privacidad/politica-privacidad.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AccesoRestringidoComponent,
    AyudaComponent,
    SobreNosotrosComponent,
    PoliticaPrivacidadComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule ,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule
  ],
  exports: [
    FormsModule,
    HeaderComponent,
    FooterComponent,
    AyudaComponent,
    SobreNosotrosComponent,
    PoliticaPrivacidadComponent,
  ]
})
export class SharedModule { }
