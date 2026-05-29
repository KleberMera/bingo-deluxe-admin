import { environment } from '../../../environments/environment.development';

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${environment.apiUrl}/auth/login`,
    REGISTER: `${environment.apiUrl}/auth/register`,
  },
  ASISTENCIA: `${environment.apiUrl}/asistencia/`,
};
export default API_ROUTES;
