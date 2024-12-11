import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaPruebasListComponent } from './Components/mascota-pruebas-list/mascota-pruebas-list.component';
import { PruebaDetalleComponent } from './Components/prueba-detalle/prueba-detalle.component';
import { AltaPruebaComponent } from './Components/alta-prueba/alta-prueba.component';
import { AuthGuard } from '../auth/Guards/auth.guard';

const routes: Routes = [
  { 
    path: 'mascota-pruebas-list/:idMascota', 
    component: MascotaPruebasListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN', 'CLIENTE', 'TEMPORAL'] }
  },
  { 
    path: 'detalle/:idPrueba', 
    component: PruebaDetalleComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN', 'CLIENTE', 'TEMPORAL'] }
  },
  { path: 'alta-prueba/:idConsulta', 
    component: AltaPruebaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VETERINARIO', 'ADMIN_CLINICA', 'ADMIN'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PruebaRoutingModule { }
