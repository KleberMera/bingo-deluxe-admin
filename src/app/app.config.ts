import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import Aura from '@primeuix/themes/aura';
import mypreset from './core/types/mypreset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
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
    providePrimeNG({ theme: mypreset, ripple: true }),
  ],
};
