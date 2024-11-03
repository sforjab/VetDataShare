// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { LoginRequestDTO } from '../Models/login-request.dto';
import { AuthResponseDTO } from '../Models/auth-response.dto';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.APIHost}api/auth/login`;  // URL del backend para el login
  usuarioActualLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  usuarioActualRol: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    this.usuarioActualLogin.next(sessionStorage.getItem("token") !== null);
    this.usuarioActualRol.next(sessionStorage.getItem("rol") || '');
  }

  login(credenciales: LoginRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(this.authUrl, credenciales).pipe(
      tap((response: AuthResponseDTO) => {
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("rol", response.rol);
        this.usuarioActualLogin.next(true);
        this.usuarioActualRol.next(response.rol);
      }),
      catchError(this.handleError)
    );
  }

  /* logout(): void {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("rol");
    this.usuarioActualLogin.next(false);
    this.usuarioActualRol.next('');
  } */

  private handleError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = '¡Ha ocurrido un error desconocido!';
    if (error.error instanceof ErrorEvent) {
        mensajeError = `Error: ${error.error.message}`;
    } else {
        mensajeError = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(() => new Error(mensajeError));
  }

  get isUsuarioLogin(): Observable<boolean> {
    return this.usuarioActualLogin.asObservable();
  }

  get rolUsuario(): Observable<string> {
    return this.usuarioActualRol.asObservable();
  }

  get tokenUsuario(): string | null {
    return sessionStorage.getItem('token');
  }
}
