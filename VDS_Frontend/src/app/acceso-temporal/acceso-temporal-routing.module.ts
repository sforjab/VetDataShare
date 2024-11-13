import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccesoTemporalGenerarComponent } from './Components/acceso-temporal-generar/acceso-temporal-generar.component';
import { AccesoTemporalValidarComponent } from './Components/acceso-temporal-validar/acceso-temporal-validar.component';
import { NumeroColegiadoComponent } from './Components/numero-colegiado/numero-colegiado.component';

const routes: Routes = [
  { path: 'generar/:idMascota', component: AccesoTemporalGenerarComponent },
  { path: 'validar/:token', component: AccesoTemporalValidarComponent },
  { path: 'colegiado', component: NumeroColegiadoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccesoTemporalRoutingModule { }