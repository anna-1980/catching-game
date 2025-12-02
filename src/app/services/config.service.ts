import { inject, Injectable } from '@angular/core';
import { Config } from './config-model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  public config!: any;

  private http = inject(HttpClient);

  public loadConfig() {
    return this.http.get<Record<string, unknown>>('./config.json').pipe(
      map((config) => {
        Object.keys(config).forEach((key) => {
          if (key.startsWith('_')) {
            delete config[key];
          }
        });

        this.config = config as unknown as Config;
        return this.config;
      }),
      catchError(() => {
        console.log('ENV check on Netlify:', import.meta.env);
        console.log('Firebase cfg from env:', this.config.firebase);

        const env = import.meta.env;

        this.config = {
          firebase: {
            apiKey: env.NG_APP_FIREBASE_API_KEY,
            authDomain: env.NG_APP_FIREBASE_AUTH_DOMAIN,
            projectId: env.NG_APP_FIREBASE_PROJECT_ID,
            storageBucket: env.NG_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: env.NG_APP_FIREBASE_APP_ID,
          },
        } as Config;

        return of(this.config);
      })
    );
  }
}

//   public loadConfig() {
//     return this.http.get<Record<string, unknown>>('./config.json').pipe(
//       map((config) => {
//         // remove keys
//         Object.keys(config).forEach((key) => {
//           if (key.startsWith('_')) {
//             delete config[key];
//           }
//         });

//         this.config = config as unknown as Config;
//         return this.config;
//       }),
//       catchError(() => {
//         console.warn('No config.json found, using environment variables');
//         console.log('ENV check on Netlify:', import.meta.env);

//         this.config = {
//           firebase: {
//             apiKey: import.meta.env.NG_APP_FIREBASE_API_KEY,
//             authDomain: import.meta.env.NG_APP_FIREBASE_AUTH_DOMAIN,
//             projectId: import.meta.env.NG_APP_FIREBASE_PROJECT_ID,
//             storageBucket: import.meta.env.NG_APP_FIREBASE_STORAGE_BUCKET,
//             messagingSenderId: import.meta.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
//             appId: import.meta.env.NG_APP_FIREBASE_APP_ID,
//           },
//         };
//         return of(this.config);
//       })
//     );
//   }
// }
