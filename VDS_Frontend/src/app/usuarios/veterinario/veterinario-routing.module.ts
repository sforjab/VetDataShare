import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VeterinarioDashboardComponent } from './Components/veterinario-dashboard/veterinario-dashboard.component';
import { AuthGuard } from 'src/app/auth/Guards/auth.guard';
import { VeterinarioPerfilComponent } from './Components/veterinario-perfil/veterinario-perfil.component';

const routes: Routes = [
  {
    path: 'dashboard/:idUsuario', // Dashboard de veterinario
    component: VeterinarioDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  },
  { path: 'perfil/:idUsuario', // Perfil del veterinario
    component: VeterinarioPerfilComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VeterinarioRoutingModule { }
