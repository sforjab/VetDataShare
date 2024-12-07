import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtTemporal = sessionStorage.getItem('jwtTemporal');
    const tokenUsuario = this.authService.tokenUsuario;

    // Se verifica si el usuario está realizando un autenticación con usuasrio y contraseña y hay un 'jwtTemporal'
    if (jwtTemporal && req.url.includes('/login')) { 
      console.log('Borrando jwtTemporal para nueva autenticación');
      sessionStorage.removeItem('jwtTemporal');
    }

    let modifiedReq = req;

    // Si no es una solicitud que usa 'FormData', agregamos encabezados estándar
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
    return next.handle(modifiedReq);
  }
}
