import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteDashboardComponent } from './Components/cliente-dashboard/cliente-dashboard.component';
import { ClientePerfilComponent } from './Components/cliente-perfil/cliente-perfil.component';
import { ClienteMascotasListComponent } from '../../mascota/Components/cliente-mascotas-list/cliente-mascotas-list.component';
import { AuthGuard } from 'src/app/auth/Guards/auth.guard';
import { GestionClientesComponent } from './Components/gestion-clientes/gestion-clientes.component';
import { AltaClienteComponent } from './Components/alta-cliente/alta-cliente.component';
import { TransferirMascotasComponent } from './Components/transferir-mascotas/transferir-mascotas.component';

const routes: Routes = [
  {
    path: 'dashboard/:idUsuario',
    component: ClienteDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['CLIENTE', 'VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  },
  { 
    path: 'perfil/:idUsuario', 
    component: ClientePerfilComponent,
    canActivate: [AuthGuard],
    data: { roles: ['CLIENTE', 'VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  },     
  { 
    path: 'gestion-clientes', 
    component: GestionClientesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  }, 
  { 
    path: 'alta-cliente', 
    component: AltaClienteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  },
  { 
    path: 'transferir-mascotas/:numIdent', 
    component: TransferirMascotasComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  },
  { 
    path: 'transferir-mascota/:idMascota', 
    component: TransferirMascotasComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
