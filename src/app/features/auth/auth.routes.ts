import { Routes } from '@angular/router';

export enum AUTH_PAGES {
  LOGIN = '',
  SIGNUP = 'sign-up',
  FORGOTPASSWORD = 'forgot-password',
}

export const authRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: AUTH_PAGES.LOGIN,
      },
      {
        path: AUTH_PAGES.LOGIN,
        loadComponent: () => import('./pages/login/login'),
      },
    //   {
    //     path: AUTH_PAGES.SIGNUP,
    //     loadComponent: () => import('./pages/sign-up/sign-up.component'),
    //   },
    //   {
    //     path: '',
    //     loadChildren: () => import('./forgot-password.routes'),
    //   },

    ],
  },
  {
    path: '**',
    redirectTo: AUTH_PAGES.LOGIN,
  },
];


export default authRoutes;