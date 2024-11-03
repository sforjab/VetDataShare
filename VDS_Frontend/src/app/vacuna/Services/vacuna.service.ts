import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vacuna } from '../Models/vacuna.dto';  // Importa el modelo de Vacuna
import { environment } from 'src/environments/environment';  // Asegúrate de tener la URL del backend en el environment

@Injectable({
  providedIn: 'root',
})
export class VacunaService {
  private vacunaUrl = `${environment.APIHost}api/vacunas`;  // URL base para las vacunas

  constructor(private http: HttpClient) {}

  // Obtener una vacuna por su ID
  getVacunaPorId(idVacuna: number): Observable<Vacuna> {
    return this.http.get<Vacuna>(`${this.vacunaUrl}/getVacunaPorId/${idVacuna}`);
  }

  // Obtener vacunas por ID de mascota
  getVacunasPorIdMascota(idMascota: number): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(`${this.vacunaUrl}/getVacunasPorIdMascota/${idMascota}`);
  }

  // Crear una nueva vacuna
  createVacuna(vacuna: Vacuna): Observable<Vacuna> {
    return this.http.post<Vacuna>(`${this.vacunaUrl}/create`, vacuna);
  }

  // Actualizar una vacuna existente
  updateVacuna(idVacuna: number, vacuna: Vacuna): Observable<Vacuna> {
    return this.http.put<Vacuna>(`${this.vacunaUrl}/update/${idVacuna}`, vacuna);
  }

  // Eliminar una vacuna por su ID
  deleteVacuna(idVacuna: number): Observable<void> {
    return this.http.delete<void>(`${this.vacunaUrl}/delete/${idVacuna}`);
  }
}
