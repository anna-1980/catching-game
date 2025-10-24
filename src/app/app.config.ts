import {
  
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { lastValueFrom, throwError } from 'rxjs';
import { provideFirebaseApp, initializeApp, FirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, initializeFirestore } from '@angular/fire/firestore';
import { ConfigService } from './services/config.service';
import { Config } from './services/config-model';

// export function initializeConfig(configService: ConfigService): () => Promise<Config> {
//   const config$ = configService.loadConfig();
//   const result = () => lastValueFrom(config$);
//   return result;
// }

// export function initializeConfig(configService: ConfigService): () => Promise<Config> {
//   return () => lastValueFrom(configService.loadConfig());
// }

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
    provideFirebaseApp(() => {
      const cfg = inject(ConfigService).config.firebase;
      return initializeApp(cfg);
    }),
    provideFirestore(() =>
      initializeFirestore(inject(FirebaseApp), { ...({ useFetchStreams: false } as any) })
    ),

    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
  ],
};
