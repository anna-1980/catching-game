import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ConfigService } from './app/services/config.service';
import { lastValueFrom } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

const configService = new ConfigService();

lastValueFrom(configService.loadConfig())
  .then(() => {
    return bootstrapApplication(App, {
      ...appConfig,
      providers: [provideHttpClient(), { provide: ConfigService, useValue: configService }],
    });
  })
  .catch((err) => console.error('❌ Config load failed', err));

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
