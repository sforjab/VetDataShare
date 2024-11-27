import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaVacunasListComponent } from './Components/mascota-vacunas-list/mascota-vacunas-list.component';
import { AltaVacunaComponent } from './Components/alta-vacuna/alta-vacuna.component';
import { VacunaDetalleComponent } from './Components/vacuna-detalle/vacuna-detalle.component';

const routes: Routes = [
  { path: 'mascota-vacunas-list/:idMascota', component: MascotaVacunasListComponent },
  { path: 'alta-vacuna/:idConsulta', component: AltaVacunaComponent },
  { path: 'detalle/:idVacuna', component: VacunaDetalleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacunaRoutingModule { }
