import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products/:category',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { category: 'checking' },
      { category: 'savings-cds' },
      { category: 'credit-cards' },
      { category: 'home-loans' },
      { category: 'auto-loans' },
      { category: 'small-business' },
      { category: 'investing' },
      { category: 'students' },
    ],
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
