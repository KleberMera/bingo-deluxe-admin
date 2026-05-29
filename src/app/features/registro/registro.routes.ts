import { Routes } from '@angular/router';

export const registroRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/registro-publico/registro-publico'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default registroRoutes;
