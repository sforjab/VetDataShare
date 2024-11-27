import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaPruebasListComponent } from './Components/mascota-pruebas-list/mascota-pruebas-list.component';
import { PruebaDetalleComponent } from './Components/prueba-detalle/prueba-detalle.component';
import { AltaPruebaComponent } from './Components/alta-prueba/alta-prueba.component';

const routes: Routes = [
  { path: 'mascota-pruebas-list/:idMascota', component: MascotaPruebasListComponent },
  { path: 'detalle/:idPrueba', component: PruebaDetalleComponent },
  { path: 'alta-prueba/:idConsulta', component: AltaPruebaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PruebaRoutingModule { }
