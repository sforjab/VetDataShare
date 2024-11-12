import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaVacunasListComponent } from './Components/mascota-vacunas-list/mascota-vacunas-list.component';

const routes: Routes = [
  { path: 'mascota-vacunas-list/:idMascota', component: MascotaVacunasListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacunaRoutingModule { }
