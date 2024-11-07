import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaConsultasListComponent } from './Components/mascota-consultas-list/mascota-consultas-list.component';

const routes: Routes = [
  { path: 'mascota-consultas-list/:idMascota', component: MascotaConsultasListComponent }, // Historial de consultas de una mascota
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaRoutingModule { }
