import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaVacunasListComponent } from './Components/mascota-vacunas-list/mascota-vacunas-list.component';
import { AltaVacunaComponent } from './Components/alta-vacuna/alta-vacuna.component';
import { VacunaDetalleComponent } from './Components/vacuna-detalle/vacuna-detalle.component';
import { AuthGuard } from '../auth/Guards/auth.guard';

const routes: Routes = [
  { 
    path: 'mascota-vacunas-list/:idMascota', 
    component: MascotaVacunasListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN', 'CLIENTE', 'TEMPORAL'] }
  },
  { 
    path: 'alta-vacuna/:idConsulta', 
    component: AltaVacunaComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  },
  { 
    path: 'detalle/:idVacuna', 
    component: VacunaDetalleComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacunaRoutingModule { }
