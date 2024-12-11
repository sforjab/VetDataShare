import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { AccesoRestringidoComponent } from './shared/Components/acceso-restringido/acceso-restringido.component';
import { AyudaComponent } from './shared/Components/pages/ayuda/ayuda.component';
import { PoliticaPrivacidadComponent } from './shared/Components/pages/politica-privacidad/politica-privacidad.component';
import { SobreNosotrosComponent } from './shared/Components/pages/sobre-nosotros/sobre-nosotros.component';

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
  {
    path: 'admin', 
    loadChildren: () => import('./usuarios/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'mascota', 
    loadChildren: () => import('./mascota/mascota.module').then(m => m.MascotaModule),
  },
  {
    path: 'consulta', 
    loadChildren: () => import('./consulta/consulta.module').then(m => m.ConsultaModule),
  },
  {
    path: 'prueba', 
    loadChildren: () => import('./prueba/prueba.module').then(m => m.PruebaModule),
  },
  {
    path: 'vacuna', 
    loadChildren: () => import('./vacuna/vacuna.module').then(m => m.VacunaModule),
  },
  {
    path: 'clinica', 
    loadChildren: () => import('./clinica/clinica.module').then(m => m.ClinicaModule),
  },
  {
    path: 'acceso-temporal', 
    loadChildren: () => import('./acceso-temporal/acceso-temporal.module').then(m => m.AccesoTemporalModule),
  },
  {
    path: 'acceso-no-autorizado',
    component: AccesoRestringidoComponent,
  },
  { path: 'ayuda', component: AyudaComponent },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'politica-privacidad', component: PoliticaPrivacidadComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
