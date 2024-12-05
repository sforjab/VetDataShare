import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Consulta } from '../Models/consulta.dto';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Prueba } from 'src/app/prueba/Models/prueba.dto';
import { Vacuna } from 'src/app/vacuna/Models/vacuna.dto';
import { ConsultaDetalleResponse } from '../Models/consulta-detalle-response.dto';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private consultaUrl = `${environment.APIHost}api/consultas`;

  constructor(private http: HttpClient) {}

  // Obtener el detalle completo de una consulta
  getConsultaDetalle(id: number): Observable<ConsultaDetalleResponse> {
    return this.http.get<ConsultaDetalleResponse>(`${this.consultaUrl}/getConsultaDetalle/${id}`).pipe(
      tap((response) => console.log('Consulta detalle obtenida:', response)),
      catchError(this.handleError)
    );
  }
  

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

  // Obtener pruebas por ID de consulta
  getPruebasPorConsultaId(idConsulta: number): Observable<Prueba[]> {
    return this.http.get<Prueba[]>(`${this.consultaUrl}/getPruebasPorConsultaId/${idConsulta}`).pipe(
      tap((pruebas) => console.log('Pruebas obtenidas para la consulta:', pruebas)),
      catchError(this.handleError)
    );
  }

  // Obtener vacunas por ID de consulta
  getVacunasPorConsultaId(idConsulta: number): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(`${this.consultaUrl}/getVacunasPorConsultaId/${idConsulta}`).pipe(
      tap((vacunas) => console.log('Vacunas obtenidas para la consulta:', vacunas)),
      catchError(this.handleError)
    );
  }

    // Obtener una prueba por su ID
  getPruebaPorId(idPrueba: number): Observable<Prueba> {
    return this.http.get<Prueba>(`${this.consultaUrl}/getPruebaPorId/${idPrueba}`).pipe(
      tap((prueba) => console.log(`Prueba obtenida: ${prueba}`)),
      catchError(this.handleError)
    );
  }

  // Obtener una vacuna por su ID
  getVacunaPorId(idVacuna: number): Observable<Vacuna> {
    return this.http.get<Vacuna>(`${this.consultaUrl}/getVacunaPorId/${idVacuna}`).pipe(
      tap((vacuna) => console.log(`Vacuna obtenida: ${vacuna}`)),
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
