import { Routes } from '@angular/router';
export enum FEATURE_PAGES {
  AUTH = 'auth',
  HOME = 'home',
}
export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: FEATURE_PAGES.AUTH,
      },
      {
        path: FEATURE_PAGES.AUTH,
        loadChildren: () => import('./features/auth/auth.routes'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: FEATURE_PAGES.AUTH,
  },
];
