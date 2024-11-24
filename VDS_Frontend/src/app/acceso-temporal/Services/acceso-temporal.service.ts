import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccesoTemporalService {
  private acessoTemporalUrl = `${environment.APIHost}api/accesos-temporales`;

  constructor(private http: HttpClient) {}

  generarAccesoTemporal(data: { usuarioId: number; mascotaId: number }): Observable<any> {
    return this.http.post(`${this.acessoTemporalUrl}/generar`, data);
  }

  validarTokenSinExpiracion(token: string): Observable<any> {
    return this.http.get(`${this.acessoTemporalUrl}/validar-sin-expiracion/${token}`);
  }

  actualizarAccesoTemporal(data: { token: string; numColegiado: string; fechaExpiracion: string }): Observable<any> {
    return this.http.put(`${this.acessoTemporalUrl}/actualizar`, data);
  }

  getAccesoTemporalPorId(id: number): Observable<any> {
    return this.http.get(`${this.acessoTemporalUrl}/${id}`);
  }
}