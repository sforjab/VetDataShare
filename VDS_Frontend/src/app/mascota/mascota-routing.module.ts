import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaDashboardComponent } from './Components/mascota-dashboard/mascota-dashboard.component';
import { MascotaDetalleComponent } from './Components/mascota-detalle/mascota-detalle.component';
import { ClienteMascotasListComponent } from './Components/cliente-mascotas-list/cliente-mascotas-list.component';
import { GestionMascotasComponent } from './Components/gestion-mascotas/gestion-mascotas.component';

const routes: Routes = [
  { path: 'dashboard/:idMascota', component: MascotaDashboardComponent },  // Dashboard de la mascota
  { path: 'detalle/:idMascota', component: MascotaDetalleComponent },      // Detalle de la mascota
  { path: 'cliente-mascotas-list/:idUsuario', component: ClienteMascotasListComponent }, // Lista de mascotas del cliente
  { path: 'gestion-mascotas', component: GestionMascotasComponent } // Gestión de mascotas
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MascotaRoutingModule { }
