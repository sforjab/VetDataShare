import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const rolesPermitidos = route.data['roles'] as Array<string>;
    return this.authService.rolUsuario.pipe(
      map(rolUsuario => {
        if (!rolUsuario) {
          // Intenta recuperar el rol directamente del sessionStorage
          rolUsuario = sessionStorage.getItem('rol') || '';
        }
        if (!rolUsuario) {
          this.router.navigate(['/login']);
          return false;
        }
        if (rolUsuario === 'TEMPORAL' || (rolesPermitidos && rolesPermitidos.includes(rolUsuario))) {
          return true; // Permite acceso si el rol es TEMPORAL o está en los roles permitidos
        }
        this.router.navigate(['/acceso-no-autorizado']); // Rol no permitido
        return false;
      })
    );
  }
}
