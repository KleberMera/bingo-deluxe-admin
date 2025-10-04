import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

import MyTheme from './core/types/apptheme';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    // providePrimeNG({
    //   theme: {
    //     preset: MyPreset,
    //     options: {
    //     darkModeSelector: '.dark',
    //       cssLayer: {
    //         name: 'primeng',
    //         order: 'theme, base, primeng',
    //       },
    //     },
    //   },
    // }),
    providePrimeNG({ theme: MyTheme, ripple: true }),
  ],
};
