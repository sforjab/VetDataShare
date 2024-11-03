import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const rolesPermitidos = route.data['roles'] as Array<string>;
    return this.authService.rolUsuario.pipe(
      map(rolUsuario => {
        if (!rolUsuario) { // No hay usuario logueado
          this.router.navigate(['/login']);
          return false;
        }
        if (rolesPermitidos && rolesPermitidos.length > 0 && !rolesPermitidos.includes(rolUsuario)) { // Los roles están definidos y el rol del usuario no está entre los permitidos
          this.router.navigate(['/permiso-denegado']);
          return false;

        }
        return true; // Si el usuario está autenticado y no hay restricciones de roles, permite el acceso
      })
    );
  }
}
