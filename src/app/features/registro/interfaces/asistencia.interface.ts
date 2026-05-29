export interface RegistrarAsistenciaRequest {
  nombres: string;
  apellidos: string;
  celular: string;
  cedula: string;
}

export interface Asistencia {
  id: number;
  nombres: string;
  apellidos: string;
  celular: string;
  cedula: string;
  id_brigada: number;
  nombre_brigada: string;
  created_at: string;
}

export interface BrigadaActiva {
  id_brigada: number;
  nombre_brigada: string;
}

export interface AsistenciaBrigadaActivaResponse {
  success: boolean;
  message: string;
  brigada_activa: BrigadaActiva;
  data: Asistencia[];
}
