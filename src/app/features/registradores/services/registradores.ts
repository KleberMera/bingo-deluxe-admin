import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { apiResponse } from '../../../core/interfaces/apiResponse';
import { Registrador, TipoRegistrador } from '../../../core/interfaces/registrador';

export interface CreateRegistradorRequest {
  nombre_registrador: string;
  id_tipo_registrador?: number;
}

export interface UpdateRegistradorRequest {
  nombre_registrador: string;
  id_tipo_registrador?: number;
}

@Injectable({
  providedIn: 'root',
})
export class srvRegistradores {
  protected readonly _http = inject(HttpClient);
  urlApi = environment.apiUrl;

  // Resource para listar registradores
  listRegResource = httpResource<apiResponse<Registrador[]>>(() => this.urlApi + '/registrador');

  // Listar tipos de registradores
  listarTiposRegistradores(): Observable<apiResponse<TipoRegistrador[]>> {
    const url = `${this.urlApi}/registrador/tipos`;
    return this._http.get<apiResponse<TipoRegistrador[]>>(url);
  }

  // Crear registrador
  crearRegistrador(data: CreateRegistradorRequest): Observable<apiResponse<Registrador>> {
    const url = `${this.urlApi}/registrador`;
    return this._http.post<apiResponse<Registrador>>(url, data);
  }

  // Actualizar registrador
  actualizarRegistrador(id: number, data: UpdateRegistradorRequest): Observable<apiResponse<Registrador>> {
    const url = `${this.urlApi}/registrador/${id}`;
    return this._http.put<apiResponse<Registrador>>(url, data);
  }

  // Eliminar registrador (si se necesita en el futuro)
  eliminarRegistrador(id: number): Observable<apiResponse<any>> {
    const url = `${this.urlApi}/registrador/${id}`;
    return this._http.delete<apiResponse<any>>(url);
  }

  // Buscar registrador por nombre
  buscarPorNombre(nombre: string): Observable<apiResponse<Registrador[]>> {
    const url = `${this.urlApi}/registrador/search?nombre_registrador=${encodeURIComponent(nombre)}`;
    return this._http.get<apiResponse<Registrador[]>>(url);
  }
}
