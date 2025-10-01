import { Routes } from '@angular/router';
import PAGES_ROUTES from './core/routes/pages.routes';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PAGES_ROUTES.AUTH.DEFAULT,
      },
      {
        path: PAGES_ROUTES.AUTH.DEFAULT,
        loadChildren: () => import('./features/auth/auth.routes'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: PAGES_ROUTES.AUTH.DEFAULT,
  },
];
