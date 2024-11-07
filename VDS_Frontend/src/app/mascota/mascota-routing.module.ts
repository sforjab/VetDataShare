import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaDashboardComponent } from './Components/mascota-dashboard/mascota-dashboard.component';
import { MascotaDetalleComponent } from './Components/mascota-detalle/mascota-detalle.component';
import { ClienteMascotasListComponent } from './Components/cliente-mascotas-list/cliente-mascotas-list.component';

const routes: Routes = [
  { path: ':idMascota', component: MascotaDashboardComponent },  // Dashboard de la mascota
  { path: 'detalle/:idMascota', component: MascotaDetalleComponent },      // Detalle de la mascota
  { path: 'cliente-mascotas-list/:idUsuario', component: ClienteMascotasListComponent } // Lista de mascotas del cliente
  /* { path: 'pruebas-list', component: MascotaPruebasComponent },      // Pruebas de una mascota */
  /* { path: 'all-pruebas-list', component: PruebasListComponent } */      // Pruebas de todas las mascotas
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MascotaRoutingModule { }
