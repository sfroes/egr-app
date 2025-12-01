import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'busca-aluno',
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
      {
        path: 'cadastro-aluno',
        loadComponent: () =>
          import('./features/aluno/cadastro/cadastro-aluno.component').then(
            (m) => m.CadastroAlunoComponent
          ),
      },
      {
        path: 'cadastro-aluno/:id',
        loadComponent: () =>
          import('./features/aluno/cadastro/cadastro-aluno.component').then(
            (m) => m.CadastroAlunoComponent
          ),
      },
      {
        path: 'questionario',
        loadComponent: () =>
          import('./features/questionario/questionario.component').then(
            (m) => m.QuestionarioComponent
          ),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'busca-aluno',
  },
];
