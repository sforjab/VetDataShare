import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RestablecerPasswordComponent } from './Components/restablecer-password/restablecer-password.component';
import { OlvidarPasswordComponent } from './Components/olvidar-password/olvidar-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'olvidar-password', component: OlvidarPasswordComponent },
  { path: 'restablecer-password', component: RestablecerPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
