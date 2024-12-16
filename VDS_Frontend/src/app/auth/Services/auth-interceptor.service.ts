import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtTemporal = sessionStorage.getItem('jwtTemporal');
    const tokenUsuario = this.authService.tokenUsuario;

    // Si hay un token temporal, verificamos su expiración
    if (jwtTemporal && this.isTokenExpired(jwtTemporal)) {
      console.log('El token temporal ha expirado. Eliminándolo de la sesión.');
      sessionStorage.removeItem('jwtTemporal');
    }

    // Si el usuario está iniciando sesión con usuario y contraseña, se elimina el 'jwtTemporal'
    if (jwtTemporal && req.url.includes('/login')) {
      console.log('Borrando jwtTemporal para nueva autenticación');
      sessionStorage.removeItem('jwtTemporal');
    }

    let modifiedReq = req;

    // Si no es una solicitud que use 'FormData', agregamos encabezados estándar
    if (!(req.body instanceof FormData)) {
      modifiedReq = req.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json'
        }
      });
    }

    // Se añade token de autorización si está disponible
    const token = jwtTemporal || tokenUsuario;
    if (token) {
      modifiedReq = modifiedReq.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    console.log('Token enviado en el request:', token);

    // Manejo de errores
    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Distinción entre solicitudes de login y otras solicitudes
          if (req.url.includes('/login')) {
            // Propagamos el error al componente para manejar credenciales incorrectas
            return throwError(() => error);
          }

          const backendMessage = error.error;
          if (typeof backendMessage === 'string' && backendMessage.includes('El token ha expirado')) {
            console.log('El token ha expirado. Redirigiendo a acceso restringido.');
            sessionStorage.removeItem('jwtTemporal');
            this.snackBar.open('El acceso temporal ha expirado.', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/acceso-no-autorizado']);
          } else {
            this.snackBar.open('Acceso no autorizado. Inicie sesión nuevamente.', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/acceso-no-autorizado']);
          }
        } else if (error.status === 403) {
          this.snackBar.open('No tiene permisos para realizar esta acción.', 'Cerrar', { duration: 3000 });
        }

        // Propagamos el error
        return throwError(() => error);
      })
    );
  }

  // Se verifica si el token ha expirado
  private isTokenExpired(token: string): boolean {
    const payload = this.decodeJwt(token);
    if (payload && payload.exp) {
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime; // Si la fecha actual supera a la fecha de expiración
    }
    return false;
  }

  // Se decodifica el 'payload' del token JWT
  private decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      return null;
    }
  }
}