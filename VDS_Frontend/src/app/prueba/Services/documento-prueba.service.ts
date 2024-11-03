import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentoPrueba } from '../Models/documento-prueba.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentoPruebaService {
  private docsPruebaUrl = `${environment.APIHost}api/documentos-prueba`; // URL base para los documentos de prueba

  constructor(private http: HttpClient) {}

  // Obtener un documento por su ID
  getDocumentoPorId(idDocumento: number): Observable<DocumentoPrueba> {
    return this.http.get<DocumentoPrueba>(`${this.docsPruebaUrl}/getDocumentoPorId/${idDocumento}`);
  }

  // Crear un nuevo documento
  createDocumento(documento: DocumentoPrueba): Observable<DocumentoPrueba> {
    return this.http.post<DocumentoPrueba>(`${this.docsPruebaUrl}/create`, documento);
  }

  // Eliminar un documento por su ID
  deleteDocumento(idDocumento: number): Observable<void> {
    return this.http.delete<void>(`${this.docsPruebaUrl}/delete/${idDocumento}`);
  }
}
