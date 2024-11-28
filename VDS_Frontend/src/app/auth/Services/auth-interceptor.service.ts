import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  /* intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('jwtTemporal') || this.authService.tokenUsuario;

    let modifiedReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      }
    });

    if (token) {
      modifiedReq = modifiedReq.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    console.log('Token enviado en el request:', token);
    return next.handle(modifiedReq);
  } */

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = sessionStorage.getItem('jwtTemporal') || this.authService.tokenUsuario;
  
      let modifiedReq = req;
  
      // Si no es una solicitud que usa 'FormData', agregamos los encabezados estándar
      if (!(req.body instanceof FormData)) {
        modifiedReq = req.clone({
          setHeaders: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json'
          }
        });
      }
  
      // Siempre agregamos el token si está presente
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
