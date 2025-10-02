import { Routes } from '@angular/router';
import PAGES_ROUTES from '../../core/routes/pages.routes';


export const tablasRoutes: Routes = [
  {
    path: PAGES_ROUTES.DASHBOARD.TABLAS.DEFAULT,
    children: [
      {
        path: PAGES_ROUTES.DASHBOARD.TABLAS.BUSCAR_TABLA,
        loadComponent: () => import('./pages/buscar-tablas/buscar-tablas'),
      },
    ],
  },
];

