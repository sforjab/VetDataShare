import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../Models/usuario.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioUrl = `${environment.APIHost}api/usuarios`;  // URL del backend para la gestión de usuarios

  constructor(private http: HttpClient) {}

  // Obtener usuario por ID
  getUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.usuarioUrl}/getUsuarioPorId/${id}`).pipe(
      tap(usuario => console.log('Usuario obtenido: ', usuario)),
      catchError(this.handleError)
    );
  }

  // Obtenemos usuario por número de identificación
  getUsuarioPorNumIdent(numIdent: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.usuarioUrl}/getUsuarioPorNumIdent/${numIdent}`).pipe(
      tap(usuario => console.log('Usuario obtenido por número de identificación: ', usuario)),
      catchError(this.handleError)
    );
  }

  verificarIdentidadCliente(idCliente: number): Observable<void> {
    return this.http.get<void>(`${this.usuarioUrl}/verificarIdentidadCliente/${idCliente}`).pipe(
      tap(() => console.log(`Verificación de identidad exitosa para cliente con ID: ${idCliente}`)),
      catchError(this.handleError)
    );
  }

  getNumColegiadoPorIdVet(id: number): Observable<{ numColegiado: string }> {
    return this.http
      .get<{ numColegiado: string }>(`${this.usuarioUrl}/getNumColegiadoPorIdVet/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error obteniendo el número de colegiado:', error);
          throw error;
        })
      );
  }

  buscarClientes(filtros: {
    numIdent?: string;
    nombre?: string;
    apellido1?: string;
    apellido2?: string;
    telefono?: string;
    email?: string;
  }): Observable<Usuario[]> {
    let params = new HttpParams();
    
    // Solo agregamos los parámetros que no son nulos o vacíos
    if (filtros.numIdent) {
      params = params.set('numIdent', filtros.numIdent);
    }
    if (filtros.nombre) {
      params = params.set('nombre', filtros.nombre);
    }
    if (filtros.apellido1) {
      params = params.set('apellido1', filtros.apellido1);
    }
    if (filtros.apellido2) {
      params = params.set('apellido2', filtros.apellido2);
    }
    if (filtros.telefono) {
      params = params.set('telefono', filtros.telefono);
    }
    if (filtros.email) {
      params = params.set('email', filtros.email);
    }

    console.log('Filtros enviados: ', filtros);

    return this.http.get<Usuario[]>(`${this.usuarioUrl}/buscarClientes`, { params }).pipe(
      tap(clientes => console.log('Clientes encontrados: ', clientes)),
      catchError(this.handleError)
    );
  }

  buscarEmpleados(idClinica: number, filtros: {
    nombre?: string;
    apellido1?: string;
    apellido2?: string;
    rol?: string;
  }): Observable<Usuario[]> {
    let params = new HttpParams();

    // Solo agregamos los parámetros que no son nulos o vacíos
    if (filtros.nombre) {
      params = params.set('nombre', filtros.nombre);
    }
    if (filtros.apellido1) {
      params = params.set('apellido1', filtros.apellido1);
    }
    if (filtros.apellido2) {
      params = params.set('apellido2', filtros.apellido2);
    }
    if (filtros.rol) {
      params = params.set('rol', filtros.rol);
    }

    console.log('Filtros enviados: ', filtros);

    return this.http.get<Usuario[]>(`${this.usuarioUrl}/buscarEmpleados/${idClinica}`, { params }).pipe(
      tap(empleados => console.log('Empleados encontrados: ', empleados)),
      catchError(this.handleError)
    );
  }

  // Crear un nuevo usuario
  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.usuarioUrl}/create`, usuario).pipe(
      tap(nuevoUsuario => console.log('Usuario creado: ', nuevoUsuario)),
      catchError(this.handleError)
    );
  }

  // Actualizar un usuario existente
  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.usuarioUrl}/update/${id}`, usuario).pipe(
      tap(usuarioActualizado => console.log('Usuario actualizado: ', usuarioActualizado)),
      catchError(this.handleError)
    );
  }

  // Eliminar un usuario por su ID
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.usuarioUrl}/delete/${id}`).pipe(
      tap(() => console.log(`Usuario con ID: ${id} eliminado`)),
      catchError(this.handleError)
    );
  }

  transferirMascotas(idOrigen: string, idDestino: string, idMascota: number | null = null): Observable<any> {
    const payload: any = { idOrigen, idDestino };
    if (idMascota !== null) {
      payload.idMascota = idMascota;
    }
    return this.http.post(`${this.usuarioUrl}/mascotas/transferir`, payload, { responseType: 'text' });
  }

  desvincularEmpleado(idEmpleado: number): Observable<string> {
    return this.http.put(`${this.usuarioUrl}/desvincularEmpleado/${idEmpleado}`, null, {
      responseType: 'text', // Especificar que la respuesta es texto
    }).pipe(
      tap((response) => console.log('Respuesta del backend:', response)),
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
