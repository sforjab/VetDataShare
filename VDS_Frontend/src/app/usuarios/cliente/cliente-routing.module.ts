import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteDashboardComponent } from './Components/cliente-dashboard/cliente-dashboard.component';
import { ClientePerfilComponent } from './Components/cliente-perfil/cliente-perfil.component';
import { ClienteMascotasListComponent } from '../../mascota/Components/cliente-mascotas-list/cliente-mascotas-list.component';
import { AuthGuard } from 'src/app/auth/Guards/auth.guard';
import { GestionClientesComponent } from './Components/gestion-clientes/gestion-clientes.component';

const routes: Routes = [
  {
    path: 'dashboard/:idUsuario', // Dashboard de cliente
    component: ClienteDashboardComponent,
    /* canActivate: [AuthGuard],
    data: { roles: ['CLIENTE'] } */
  },
  /* {
    path: 'veterinario-dashboard', // Dashboard de veterinario
    component: VetDashboardComponent,  // Asegúrate de crear este componente
    canActivate: [RolGuard],
    data: { roles: ['VETERINARIO'] }
  },
  {
    path: 'admin-dashboard', // Dashboard de admin
    component: AdminDashboardComponent,  // Asegúrate de crear este componente
    canActivate: [RolGuard],
    data: { roles: ['ADMIN'] }
  }, */
  // MIRAR QUÉ RUTAS LLEVAN GUARD O NO
  { path: 'perfil/:idUsuario', component: ClientePerfilComponent },        // Perfil del cliente
  { path: 'gestion-clientes', component: GestionClientesComponent } // Gestión del cliente GUARD PARA ESTA RUTA
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
