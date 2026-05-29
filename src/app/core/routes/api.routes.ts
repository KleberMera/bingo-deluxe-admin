import { environment } from '../../../environments/environment';

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${environment.apiUrl}/auth/login`,
    REGISTER: `${environment.apiUrl}/auth/register`,
  },
  ASISTENCIA: `${environment.apiUrl}/asistencia/`,
  ASISTENCIA_BRIGADA_ACTIVA: `${environment.apiUrl}/asistencia/brigada-activa`,
};
export default API_ROUTES;
