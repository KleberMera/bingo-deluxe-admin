
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface UsuarioCheckResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    first_name: string;
    last_name: string;
    id_card: string;
    phone: string;
    provincia_id: number;
    canton_id: number;
    barrio_id: number;
    created_at: string;
    updated_at: string;
    latitud: string;
    longitud: string;
    ubicacion_detallada: string;
    otp: string | null;
    otp_expires_at: string | null;
    phone_verified: number;
    id_registrador: number;
    id_tipo_registrador_snapshot: number;
    nombre_tipo_registrador: string;
    id_evento: number;
    fecha_registro: string;
    cantidad_tablas: number;
  };
  exists: boolean;
  brigadaInfo: any;
}

@Injectable({ providedIn: 'root' })
export class BuscarTablasService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  buscarPorCedula(cedula: string): Observable<UsuarioCheckResponse> {
    return this.http.get<UsuarioCheckResponse>(`${this.apiUrl}/usuarios-otros/check/${cedula}`);
  }

  actualizarCantidadTablas(id_card: string, cantidad: number) {
    return this.http.put<{ success: boolean; message: string }>(
      `${this.apiUrl}/usuarios-otros/cantidad-tablas/${id_card}`,
      { cantidad_tablas: cantidad }
    );
  }
}