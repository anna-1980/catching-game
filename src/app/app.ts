import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Route, Router, RouterLink, RouterOutlet } from '@angular/router';
import { interval } from 'rxjs';
import { Button } from './components/utils/button/button';
import { FirebaseTestService } from './services/firebase-test.service';
import { ConfigService } from './services/config.service';

type TocItem = {
  path: string;
  title: string;
  children?: TocItem[];
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, Button],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class App {
  configService = inject(ConfigService);

  public readonly router = inject(Router);
  readonly toc = computed<TocItem[]>(() => this.buildToc(this.router.config));

  private buildToc(routes: Route[], parentPath: string = ''): TocItem[] {
    return routes
      .filter(
        (r) =>
          !!r.path &&
          !r.redirectTo &&
          !r.path.includes(':') && // skip param routes
          (r.component || r.loadComponent || r.children?.length)
      )
      .map((r) => {
        const fullPath = [parentPath, r.path].filter(Boolean).join('/');
        const title = (r.data as any)?.title ?? r.path!.split('/').pop() ?? '';
        const children = r.children?.length ? this.buildToc(r.children, fullPath) : undefined;
        return {
          path: '/' + fullPath.replace(/^\/+/, ''), // ensure leading slash
          title,
          children,
        };
      });
  }
}
