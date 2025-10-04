import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { apiResponse } from '../../../core/interfaces/apiResponse';
import { TipoRegistrador } from '../interfaces/tipo-registrador.interface';

export interface CreateTipoRegistradorRequest {
  nombre_tipo: string;
  descripcion?: string;
  activo?: boolean;
}

export interface UpdateTipoRegistradorRequest {
  nombre_tipo: string;
  descripcion?: string;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class srvTiposRegistradores {
  protected readonly _http = inject(HttpClient);
  urlApi = environment.apiUrl;

  // Resource para listar tipos de registradores
  listTiposResource = httpResource<apiResponse<TipoRegistrador[]>>(() => this.urlApi + '/tipos-registradores');

  // Obtener tipo por ID
  obtenerTipoPorId(id: number): Observable<apiResponse<TipoRegistrador>> {
    const url = `${this.urlApi}/tipos-registradores/${id}`;
    return this._http.get<apiResponse<TipoRegistrador>>(url);
  }

  // Crear tipo de registrador
  crearTipo(data: CreateTipoRegistradorRequest): Observable<apiResponse<TipoRegistrador>> {
    const url = `${this.urlApi}/tipos-registradores`;
    return this._http.post<apiResponse<TipoRegistrador>>(url, data);
  }

  // Actualizar tipo de registrador
  actualizarTipo(id: number, data: UpdateTipoRegistradorRequest): Observable<apiResponse<TipoRegistrador>> {
    const url = `${this.urlApi}/tipos-registradores/${id}`;
    return this._http.put<apiResponse<TipoRegistrador>>(url, data);
  }

  // Eliminar tipo de registrador
  eliminarTipo(id: number): Observable<apiResponse<any>> {
    const url = `${this.urlApi}/tipos-registradores/${id}`;
    return this._http.delete<apiResponse<any>>(url);
  }

  // Cambiar estado activo/inactivo
  toggleEstado(id: number): Observable<apiResponse<{ id: number; activo: boolean }>> {
    const url = `${this.urlApi}/tipos-registradores/${id}/toggle-status`;
    return this._http.patch<apiResponse<{ id: number; activo: boolean }>>(url, {});
  }
}