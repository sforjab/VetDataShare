import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Consulta } from '../Models/consulta.dto';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private consultaUrl = `${environment.APIHost}api/consultas`;

  constructor(private http: HttpClient) {}

  // Obtener consulta por ID
  getConsultaPorId(id: number): Observable<Consulta> {
    return this.http.get<Consulta>(`${this.consultaUrl}/getConsultaPorId/${id}`).pipe(
      tap((consulta) => console.log('Consulta obtenida:', consulta)),
      catchError(this.handleError)
    );
  }

  // Obtener consultas por fecha
  getConsultasPorFecha(fecha: string): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.consultaUrl}/getConsultasPorFecha/${fecha}`).pipe(
      tap((consultas) => console.log('Consultas obtenidas por fecha:', consultas)),
      catchError(this.handleError)
    );
  }

  // Obtener consultas por ID de mascota
  getConsultasPorIdMascota(idMascota: number): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.consultaUrl}/getConsultasPorIdMascota/${idMascota}`).pipe(
      tap((consultas) => console.log('Consultas obtenidas para la mascota:', consultas)),
      catchError(this.handleError)
    );
  }

  // Crear una nueva consulta
  createConsulta(consulta: Consulta): Observable<Consulta> {
    return this.http.post<Consulta>(`${this.consultaUrl}/create`, consulta).pipe(
      tap((nuevaConsulta) => console.log('Consulta creada:', nuevaConsulta)),
      catchError(this.handleError)
    );
  }

  // Actualizar una consulta existente
  updateConsulta(id: number, consulta: Consulta): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.consultaUrl}/update/${id}`, consulta).pipe(
      tap((consultaActualizada) => console.log('Consulta actualizada:', consultaActualizada)),
      catchError(this.handleError)
    );
  }

  // Eliminar una consulta por su ID
  deleteConsulta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.consultaUrl}/delete/${id}`).pipe(
      tap(() => console.log(`Consulta con ID ${id} eliminada`)),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`Código de error: ${error.status}\nMensaje: ${error.message}`);
    
    // Se propaga el error original para que el componente pueda manejar el código de estado
    return throwError(() => error);
  }
}