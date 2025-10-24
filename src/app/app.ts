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

type TocItem = { path: string; title: string };
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, Button],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class App {
  public readonly router = inject(Router);

  // flatten + build absolute paths for nested routes
  private flatten = (routes: Route[], base = ''): Route[] =>
    routes.flatMap((r) => {
      const seg = r.path ? `${base}/${r.path}` : base;
      const here = [{ ...r, path: seg }];
      const kids = r.children ? this.flatten(r.children, seg) : [];
      return [...here, ...kids];
    });

  readonly toc = computed<TocItem[]>(() =>
    this.flatten(this.router.config)
      .filter(
        (r) =>
          !!r.path &&
          !r.redirectTo &&
          !r.path.includes(':') && // 🚫 exclude parameterized (child/detail) routes
          (!r.path.includes('/') || !r.path.startsWith('movie')) && // optional: exclude nested paths
          (r.component || r.loadComponent) // skip pure redirects
      )
      .map((r) => ({
        path: r.path!, // already absolute (starts with /)
        title: (r.data as any)?.title ?? r.path!.replace(/^\//, ''),
      }))
  );
}
