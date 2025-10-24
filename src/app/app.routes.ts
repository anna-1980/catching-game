import { Routes } from '@angular/router';
import { Page, PAGES } from './pages-registry';

export function generateRoutes(pages: Page[]): Routes {
  return pages.map((page) => {
    const route = {
      path: page.path,
      component: page.component,
      data: { title: page.title },
      children: page.children ? generateRoutes(page.children) : [],
    };
    return route;
  });
}

export const routes: Routes = generateRoutes(PAGES);
