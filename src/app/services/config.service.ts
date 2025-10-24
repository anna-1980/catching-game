import { inject, Injectable } from '@angular/core';
import { Config } from './config-model';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  public config!: Config;

  private http = inject(HttpClient);

  public loadConfig() {
    return this.http.get<Record<string, unknown>>('./config.json').pipe(
      map((config) => {
        // remove keys
        Object.keys(config).forEach((key) => {
          if (key.startsWith('_')) {
            delete config[key];
          }
        });

        this.config = config as unknown as Config;
        return this.config;
      }),
      catchError((error) => {
        throw error;
      })
    );
  }
}
