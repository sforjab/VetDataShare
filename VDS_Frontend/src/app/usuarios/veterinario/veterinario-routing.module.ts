import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VeterinarioDashboardComponent } from './Components/veterinario-dashboard/veterinario-dashboard.component';
import { AuthGuard } from 'src/app/auth/Guards/auth.guard';
import { VeterinarioPerfilComponent } from './Components/veterinario-perfil/veterinario-perfil.component';

const routes: Routes = [
  {
    path: '', // Dashboard de veterinario
    component: VeterinarioDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO'] }
  },
  { path: 'perfil', component: VeterinarioPerfilComponent }, // Perfil del veterinario

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VeterinarioRoutingModule { }
