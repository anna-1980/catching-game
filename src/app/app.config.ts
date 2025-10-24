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
import { provideFirebaseApp, initializeApp, FirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, initializeFirestore } from '@angular/fire/firestore';

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
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyDJPbv-o3WuQJn_vABXZ0TeddaGlcDoAFA',
        authDomain: 'catching-game-9d7fe.firebaseapp.com',
        projectId: 'catching-game-9d7fe',
        storageBucket: 'catching-game-9d7fe.appspot.app',
        messagingSenderId: '317410973570',
        appId: '1:317410973570:web:607e8d0fe2314d353ca19b',
      })
    ),
    provideFirestore(() =>
      initializeFirestore(inject(FirebaseApp), { ...({ useFetchStreams: false } as any) })
    ),

    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
  ],
};
