import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import API_ROUTES from '../../../core/routes/api.routes';
import { apiResponse } from '../../../core/interfaces/apiResponse';
import {
  AsistenciaBrigadaActivaResponse,
  RegistrarAsistenciaRequest,
} from '../interfaces/asistencia.interface';
import { environment } from '../../../../environments/environment';

export interface RegistrarAsistenciaInput {
  nombres: string;
  apellidos: string;
  cedula: string;
  celular: string;
}

@Injectable({
  providedIn: 'root',
})
export class srvAsistencia {
  private readonly _http = inject(HttpClient);
  urlApi = environment.apiUrl;

  listBrigadaActivaResource = httpResource<AsistenciaBrigadaActivaResponse>(
    () => API_ROUTES.ASISTENCIA_BRIGADA_ACTIVA,
  );

  registrar(data: RegistrarAsistenciaInput): Observable<apiResponse<unknown>> {
    const payload: RegistrarAsistenciaRequest = {
      nombres: data.nombres.trim().toUpperCase(),
      apellidos: data.apellidos.trim().toUpperCase(),
      cedula: data.cedula.trim().toUpperCase(),
      celular: data.celular.trim(),
    };

    return this._http.post<apiResponse<unknown>>(this.urlApi + '/asistencia', payload);
  }
}
