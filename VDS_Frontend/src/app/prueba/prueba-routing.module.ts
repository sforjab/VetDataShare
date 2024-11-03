import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaPruebasListComponent } from './Components/mascota-pruebas-list/mascota-pruebas-list.component';
/* import { PruebaDetalleComponent } from './Components/prueba-detalle/prueba-detalle.component';
 */
const routes: Routes = [
  { path: 'mascota-pruebas-list', component: MascotaPruebasListComponent },
  /* { path: 'prueba-detalle', component: PruebaDetalleComponent } */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PruebaRoutingModule { }
