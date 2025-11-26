import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import Aura from '@primeng/themes/aura'; // 👈 Importe o tema Aura
import { providePrimeNG } from 'primeng/config'; // 👈 Importe o provider

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    // 👇 Configuração Nova do PrimeNG 19
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          cssLayer: false,
          darkModeSelector: false, // Força o tema light e ignora a preferência do sistema
        },
      },
    }),
  ],
};
