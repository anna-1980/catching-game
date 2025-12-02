import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { firstValueFrom, lastValueFrom, throwError } from 'rxjs';
import { provideFirebaseApp, initializeApp, FirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, initializeFirestore } from '@angular/fire/firestore';

import { firebaseConfig } from './firebase.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([
        (req, next) => {
          console.log('Http Request Interceptor', req.params.get('q'));
          const router = inject(Router);
          if (req.params.get('q') === 'amber') {
            return throwError(
              () =>
                new Error('Amber is not allowed', { cause: 'Amber key-word is NOT allowed !!!!' })
            );
          }
          return next(req);
        },
      ])
    ),
    // --- Wait for config before bootstrapping ---

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),

    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
  ],
};
