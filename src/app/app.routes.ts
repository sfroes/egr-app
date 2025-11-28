import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'busca-aluno',
        loadComponent: () =>
          import('./features/aluno/busca/busca-aluno.component').then(
            (m) => m.BuscaAlunoComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
