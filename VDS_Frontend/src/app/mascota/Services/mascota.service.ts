import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Mascota } from '../Models/mascota.dto';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {

  private mascotaUrl = `${environment.APIHost}api/mascotas`;  // URL del backend para la gestión de mascotas

  constructor(private http: HttpClient) {}

  // Obtener mascota por ID
  getMascotaPorId(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.mascotaUrl}/getMascotaPorId/${id}`).pipe(
      tap(mascota => console.log('Mascota obtenida: ', mascota)),
      catchError(this.handleError)
    );
  }

  // Obtener mascota por número de chip
  getMascotaPorNumChip(numChip: string): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.mascotaUrl}/getMascotaPorNumChip/${numChip}`).pipe(
      tap(mascota => console.log('Mascota obtenida por número de chip: ', mascota)),
      catchError(this.handleError)
    );
  }

  // Obtener mascotas por nombre
  getMascotaPorNombre(nombre: string): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.mascotaUrl}/getMascotaPorNombre/${nombre}`).pipe(
      tap(mascotas => console.log('Mascotas obtenidas por nombre: ', mascotas)),
      catchError(this.handleError)
    );
  }

  // Obtener mascotas por ID de usuario
  getMascotasPorIdUsuario(idUsuario: number): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.mascotaUrl}/getMascotasPorIdUsuario/${idUsuario}`).pipe(
      tap(mascotas => console.log('Mascotas obtenidas por ID de usuario: ', mascotas)),
      catchError(this.handleError)
    );
  }

  // Crear una nueva mascota
  createMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(`${this.mascotaUrl}/create`, mascota).pipe(
      tap(nuevaMascota => console.log('Mascota creada: ', nuevaMascota)),
      catchError(this.handleError)
    );
  }

  // Actualizar una mascota existente
  updateMascota(id: number, mascota: Mascota): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.mascotaUrl}/update/${id}`, mascota).pipe(
      tap(mascotaActualizada => console.log('Mascota actualizada: ', mascotaActualizada)),
      catchError(this.handleError)
    );
  }

  // Eliminar una mascota por su ID
  deleteMascota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.mascotaUrl}/delete/${id}`).pipe(
      tap(() => console.log(`Mascota con ID: ${id} eliminada`)),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = '¡Ha ocurrido un error desconocido!';
    if (error.error instanceof ErrorEvent) {
        mensajeError = `Error: ${error.error.message}`;
    } else {
        mensajeError = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(() => new Error(mensajeError));
  }

  
}
