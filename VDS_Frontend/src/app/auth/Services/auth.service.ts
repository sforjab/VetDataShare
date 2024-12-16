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
  private authUrl = `${environment.APIHost}api/auth`;  // URL del backend
  usuarioActualLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  usuarioActualRol: BehaviorSubject<string> = new BehaviorSubject<string>('');
  usuarioActualId: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    this.usuarioActualLogin.next(sessionStorage.getItem("token") !== null);
    this.usuarioActualRol.next(sessionStorage.getItem("rol") || '');
    this.usuarioActualId.next(sessionStorage.getItem("idUsuario"));
  }

  login(credenciales: LoginRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.authUrl}/login`, credenciales).pipe(
      tap((response: AuthResponseDTO) => {
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("rol", response.rol);
        sessionStorage.setItem("idUsuario", response.idUsuario);
        this.usuarioActualLogin.next(true);
        this.usuarioActualRol.next(response.rol);
        this.usuarioActualId.next(response.idUsuario);
      }),
      catchError(this.handleError)
    );
  }

  solicitarRestablecimiento(email: string): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/olvidar-password`, { email }).pipe(
      tap(() => {
        console.log('Solicitud de restablecimiento enviada con éxito.');
      }),
      catchError(this.handleError)
    );
  }
  
  restablecerPassword(token: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/restablecer-password`, { token, password }).pipe(
      tap(() => {
        console.log('Contraseña restablecida con éxito.');
      }),
      catchError(this.handleError)
    );
  }
  

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }

  get isUsuarioLogin(): Observable<boolean> {
    return this.usuarioActualLogin.asObservable();
  }

  get rolUsuario(): Observable<string> {
    return this.usuarioActualRol.asObservable();
  }

  get idUsuario(): Observable<string | null> {
    return this.usuarioActualId.asObservable();
  }

  get tokenUsuario(): string | null {
    return sessionStorage.getItem('token');
  }
}
