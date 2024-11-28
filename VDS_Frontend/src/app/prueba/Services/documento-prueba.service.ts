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

  // Obtener todos los documentos de una prueba por su ID
  getDocumentosPorPruebaId(pruebaId: number): Observable<DocumentoPrueba[]> {
    return this.http.get<DocumentoPrueba[]>(`${this.docsPruebaUrl}/getDocumentosPorPruebaId/${pruebaId}`);
  }

  /* // Subir un nuevo documento
  subirDocumento(formData: FormData): Observable<void> {
    return this.http.post<void>(`${this.docsPruebaUrl}/subirDocumento`, formData, {
      headers: {
        'enctype': 'multipart/form-data'
      }
    });
  } */

  subirDocumento(file: File, pruebaId: number): Observable<void> {
    console.log(file.name);  // Nombre del archivo
    console.log(file.type);  // Tipo de archivo
    console.log(file.size);  // Tamaño del archivo
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pruebaId', pruebaId.toString());
    console.log('FormData contents:');

    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    return this.http.post<void>(`${this.docsPruebaUrl}/subirDocumento`, formData);
  }
    

  // Descargar un documento
  descargarDocumento(documentoId: number): Observable<Blob> {
    return this.http.get(`${this.docsPruebaUrl}/descargarDocumento/${documentoId}`, { responseType: 'blob' });
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
