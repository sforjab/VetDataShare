import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaDashboardComponent } from './Components/mascota-dashboard/mascota-dashboard.component';
import { MascotaDetalleComponent } from './Components/mascota-detalle/mascota-detalle.component';
import { ClienteMascotasListComponent } from './Components/cliente-mascotas-list/cliente-mascotas-list.component';
import { GestionMascotasComponent } from './Components/gestion-mascotas/gestion-mascotas.component';
import { AltaMascotaComponent } from './Components/alta-mascota/alta-mascota.component';
import { AuthGuard } from '../auth/Guards/auth.guard';

const routes: Routes = [
  { 
    path: 'dashboard/:idMascota', // Dashboard de la mascota
    component: MascotaDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN', 'CLIENTE', 'TEMPORAL'] }
  },
  { 
    path: 'detalle/:idMascota', // Detalle de la mascota
    component: MascotaDetalleComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN', 'CLIENTE', 'TEMPORAL'] }
  },      
  { 
    path: 'cliente-mascotas-list/:idUsuario', // Lista de mascotas del cliente
    component: ClienteMascotasListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['CLIENTE', 'VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  }, 
  { 
    path: 'gestion-mascotas', // Gestión de mascotas
    component: GestionMascotasComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  }, 
  { 
    path: 'alta-mascota/:idCliente', // Alta de mascota
    component: AltaMascotaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MascotaRoutingModule { }
