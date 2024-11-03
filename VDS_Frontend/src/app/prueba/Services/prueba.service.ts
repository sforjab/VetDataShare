import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prueba } from '../Models/prueba.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PruebaService {
    private pruebaUrl = `${environment.APIHost}api/pruebas`;  // URL del backend para las pruebas

    constructor(private http: HttpClient) {}

    // Obtener las pruebas por ID de la mascota
    getPruebasPorIdMascota(idMascota: number): Observable<Prueba[]> {
        return this.http.get<Prueba[]>(`${this.pruebaUrl}/getPruebasPorIdMascota/${idMascota}`);
    }

    // Obtener una prueba por su ID
    getPruebaPorId(idPrueba: number): Observable<Prueba> {
        return this.http.get<Prueba>(`${this.pruebaUrl}/getPruebaPorId/${idPrueba}`);
    }

    // Crear una nueva prueba
    createPrueba(prueba: Prueba): Observable<Prueba> {
        return this.http.post<Prueba>(`${this.pruebaUrl}/create`, prueba);
    }

    // Actualizar una prueba existente
    updatePrueba(idPrueba: number, prueba: Prueba): Observable<Prueba> {
        return this.http.put<Prueba>(`${this.pruebaUrl}/update/${idPrueba}`, prueba);
    }

    // Eliminar una prueba por su ID
    deletePrueba(idPrueba: number): Observable<void> {
        return this.http.delete<void>(`${this.pruebaUrl}/delete/${idPrueba}`);
    }
}