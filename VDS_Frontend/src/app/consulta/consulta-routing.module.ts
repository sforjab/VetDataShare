import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaConsultasListComponent } from './Components/mascota-consultas-list/mascota-consultas-list.component';
import { ConsultaDetalleComponent } from './Components/consulta-detalle/consulta-detalle.component';
import { AltaConsultaComponent } from './Components/alta-consulta/alta-consulta.component';
import { AuthGuard } from '../auth/Guards/auth.guard';

const routes: Routes = [
  { 
    path: 'mascota-consultas-list/:idMascota', // Historial de consultas de una mascota
    component: MascotaConsultasListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN', 'CLIENTE', 'TEMPORAL'] }
  }, 
  { 
    path: 'detalle/:idConsulta', // Detalle de una consulta
    component: ConsultaDetalleComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN', 'CLIENTE', 'TEMPORAL'] }
  }, 
  { 
    path: 'alta-consulta/:idMascota', // Alta de una consulta
    component: AltaConsultaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaRoutingModule { }
