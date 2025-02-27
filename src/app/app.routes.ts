import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/main/main.routes')
      .then(r => r.routes),
  },
  {
    path: '**',
    redirectTo: ''
  }
];
