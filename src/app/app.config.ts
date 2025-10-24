import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { throwError } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([
        (req, next) => {
          console.log('Http Request Interceptor', req.params.get('q'));
          const router = inject(Router);
          if (req.params.get('q') === 'amber') {
            // alert('Amber is not allowed');
            // router.navigate(['/']);
            return throwError(
              () =>
                new Error('Amber is not allowed', { cause: 'Amber key-word is NOT allowed !!!!' })
            );
          }
          return next(req);
        },
      ])
    ),

    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
  ],
};
