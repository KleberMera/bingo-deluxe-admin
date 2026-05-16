import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface ResumenTipoRegistradorItem {
  id: number;
  ACTIVIDAD: string;
  CANTIDAD_REGISTROS: number;
  CANTIDAD_TABLAS: string;
}

export interface ResumenTipoRegistradorResponse {
  success: boolean;
  message: string;
  data: ResumenTipoRegistradorItem[];
}

@Injectable({ providedIn: 'root' })
export class ResumenTipoRegistradorService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getResumen(): Observable<ResumenTipoRegistradorResponse> {
    return this.http.get<ResumenTipoRegistradorResponse>(`${this.apiUrl}/usuarios-otros/resumen/tipo-registrador`);
  }
}