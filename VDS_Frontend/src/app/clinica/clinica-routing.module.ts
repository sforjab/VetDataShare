import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicaDashboardComponent } from './Components/clinica-dashboard/clinica-dashboard.component';
import { DatosClinicaComponent } from './Components/datos-clinica/datos-clinica.component';
import { GestionEmpleadosComponent } from './Components/gestion-empleados/gestion-empleados.component';

const routes: Routes = [
  { path: 'dashboard/:idClinica', component: ClinicaDashboardComponent },
  { path: 'datos-clinica/:idClinica', component: DatosClinicaComponent },
  { path: 'gestion-empleados/:idClinica', component: GestionEmpleadosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicaRoutingModule { }