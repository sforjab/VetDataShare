import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccesoTemporalService {
  private acessoTemporalUrl = `${environment.APIHost}api/accesos-temporales`;  // URL del backend para la gestión de mascotas

  constructor(private http: HttpClient) {}

  generarAccesoTemporal(data: { usuarioId: number; mascotaId: number; tipo: string }): Observable<any> {
    return this.http.post(`${this.acessoTemporalUrl}/generar`, data);
  }

  validarToken(token: string): Observable<any> {
    return this.http.get(`${this.acessoTemporalUrl}/validar/${token}`);
  }
}
