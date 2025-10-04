import { Routes } from '@angular/router';
import PAGES_ROUTES from '../../core/routes/pages.routes';


export const tablasRoutes: Routes = [
  {
    path: PAGES_ROUTES.DASHBOARD.REGISTRADORES.DEFAULT,
    children: [
      {
        path: PAGES_ROUTES.DASHBOARD.REGISTRADORES.PANEL,
        loadComponent: () => import('./pages/registradores/registradores')
      },
      {
        path: PAGES_ROUTES.DASHBOARD.REGISTRADORES.TIPOS,
        loadComponent: () => import('./pages/tipos-registradores/tipos-registradores')
      }
    ],
  },
];

export default tablasRoutes;

