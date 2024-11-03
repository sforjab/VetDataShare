import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) 
  },
  {
    path: 'cliente', 
    loadChildren: () => import('./usuarios/cliente/cliente.module').then(m => m.ClienteModule),
  },
  {
    path: 'veterinario', 
    loadChildren: () => import('./usuarios/veterinario/veterinario.module').then(m => m.VeterinarioModule),
  },
  /* {
    path: 'admin', 
    loadChildren: () => import('./usuarios/admin/admin.module').then(m => m.AdminModule),
  }, */
  {
    path: 'mascota', 
    loadChildren: () => import('./mascota/mascota.module').then(m => m.MascotaModule),
    /* canActivate: [AuthGuard],  // Cualquiera que esté autenticado puede acceder
    data: { roles: ['CLIENTE', 'VETERINARIO', 'ADMIN', 'ADMIN_CLINICA'] } */
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
