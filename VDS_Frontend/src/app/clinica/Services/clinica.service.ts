import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Clinica } from '../Models/clinica.dto';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {
  private clinicaUrl = `${environment.APIHost}api/clinicas`; // URL del backend para la gestión de clínicas

  constructor(private http: HttpClient) {}

  // Obtenemos clínica por ID
  getClinicaPorId(id: number): Observable<Clinica> {
    return this.http.get<Clinica>(`${this.clinicaUrl}/getClinicaPorId/${id}`).pipe(
      tap(clinica => console.log('Clínica obtenida: ', clinica)),
      catchError(this.handleError)
    );
  }

  // Obtenemos clínica por nombre
  getClinicaPorNombre(nombre: string): Observable<Clinica> {
    return this.http.get<Clinica>(`${this.clinicaUrl}/getClinicaPorNombre/${nombre}`).pipe(
      tap(clinica => console.log('Clínica obtenida por nombre: ', clinica)),
      catchError(this.handleError)
    );
  }

  // Creación de una nueva clínica
  createClinica(clinica: Clinica): Observable<Clinica> {
    return this.http.post<Clinica>(`${this.clinicaUrl}/create`, clinica).pipe(
      tap(nuevaClinica => console.log('Clínica creada: ', nuevaClinica)),
      catchError(this.handleError)
    );
  }

  // Se actualiza una clínica existente
  updateClinica(id: number, clinica: Clinica): Observable<Clinica> {
    return this.http.put<Clinica>(`${this.clinicaUrl}/update/${id}`, clinica).pipe(
      tap(clinicaActualizada => console.log('Clínica actualizada: ', clinicaActualizada)),
      catchError(this.handleError)
    );
  }

  // Eliminarción una clínica por su ID
  deleteClinica(id: number): Observable<void> {
    return this.http.delete<void>(`${this.clinicaUrl}/delete/${id}`).pipe(
      tap(() => console.log(`Clínica con ID: ${id} eliminada`)),
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
