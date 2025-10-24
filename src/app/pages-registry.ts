// pages.registry.ts
import { Type } from '@angular/core';
import { Games } from './features/games/games';
import { Catching } from './features/games/catching/catching';

export type Page = { path: string; title: string; component: Type<any>; children?: Page[] };

export const PAGES: Page[] = [
  {
    path: 'games',
    title: 'Games',
    component: Games,
    children: [{ path: 'catching', title: 'Catching', component: Catching }],
  },
];
