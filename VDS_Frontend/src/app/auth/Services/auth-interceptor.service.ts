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
      sessionStorage.removeItem('rol');
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

    const rolSesion = sessionStorage.getItem('rol');
    const idUsuarioSesion = sessionStorage.getItem('idUsuario');

    if (rolSesion) {
      let headersToSet: { [header: string]: string } = {
        'Rol-Sesion': rolSesion
      };
    
      if (idUsuarioSesion) {
        headersToSet['IdUsuario-Sesion'] = idUsuarioSesion;
      }
    
      modifiedReq = modifiedReq.clone({
        setHeaders: headersToSet
      });
    }

    // Manejo de errores
    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let mensaje = 'Ha ocurrido un error inesperado.'; // Mensaje por defecto
    
        // Se comprueba si el backend envió un mensaje de error (ApiError)
        if (error.error && typeof error.error === 'object' && error.error.mensaje) {
          mensaje = error.error.mensaje; // Mensaje específico del backend
        } else if (error.error && typeof error.error === 'string') {
          mensaje = error.error; // En caso de que el backend envíe un texto simple
        }
    
        console.log('Error recibido del backend:', mensaje);

        // Manejamos errores 404 en /getUltimasConsultas como críticos
        if (error.status === 404 && req.url.includes('/getUltimasConsultas')) {
          // Se devuelve un observable vacío para que no interrumpa la ejecución
          return throwError(() => null);
        }
    
        // Evitamos mostrar el 'snackBar' si el error es un 404 en /getUltimasConsultas
        if (!(error.status === 404 && req.url.includes('/getUltimasConsultas'))) {
          this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
        }
    
        // Manejar errores según el código de estado
        if (error.status === 401) {
          if (req.url.includes('/login')) {
            // Propagamos el error al componente para manejar credenciales incorrectas
            return throwError(() => error);
          }
    
          // Mensaje específico para token expirado
          if (mensaje.includes('El token ha expirado')) {
            console.log('El token ha expirado. Redirigiendo a acceso restringido.');
            sessionStorage.removeItem('jwtTemporal');
            this.router.navigate(['/acceso-no-autorizado']);
          } else {
            this.router.navigate(['/acceso-no-autorizado']);
          }
        } else if (error.status === 403) {
          this.router.navigate(['/acceso-no-autorizado']);
        }
    
        // Propagar el error para otros manejos
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