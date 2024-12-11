import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicaDashboardComponent } from './Components/clinica-dashboard/clinica-dashboard.component';
import { DatosClinicaComponent } from './Components/datos-clinica/datos-clinica.component';
import { GestionEmpleadosComponent } from './Components/gestion-empleados/gestion-empleados.component';
import { AltaEmpleadoComponent } from './Components/alta-empleado/alta-empleado.component';
import { GestionClinicasComponent } from './Components/gestion-clinicas/gestion-clinicas.component';
import { AltaClinicaComponent } from './Components/alta-clinica/alta-clinica.component';
import { AuthGuard } from '../auth/Guards/auth.guard';

const routes: Routes = [
  { path: 'dashboard/:idClinica',
    component: ClinicaDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN_CLINICA', 'ADMIN'] },
  },
  { 
    path: 'datos-clinica/:idClinica', 
    component: DatosClinicaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN_CLINICA', 'ADMIN'] },
  },
  {
    path: 'gestion-empleados/:idClinica',
    component: GestionEmpleadosComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN_CLINICA', 'ADMIN'] },
  },
  { 
    path: 'alta-empleado/:idClinica', 
    component: AltaEmpleadoComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN_CLINICA', 'ADMIN'] },
  },
  {
    path: 'gestion-clinicas',
    component: GestionClinicasComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'alta-clinica',
    component: AltaClinicaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicaRoutingModule { }
