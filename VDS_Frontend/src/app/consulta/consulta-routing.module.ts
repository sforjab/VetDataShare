import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaConsultasListComponent } from './Components/mascota-consultas-list/mascota-consultas-list.component';
import { ConsultaDetalleComponent } from './Components/consulta-detalle/consulta-detalle.component';

const routes: Routes = [
  { path: 'mascota-consultas-list/:idMascota', component: MascotaConsultasListComponent }, // Historial de consultas de una mascota
  { path: 'detalle/:idConsulta', component: ConsultaDetalleComponent } // Detalle de una consulta
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaRoutingModule { }
