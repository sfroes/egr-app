# Fluxo de Navegação do Sistema Legado

## Objetivo
Documentar o fluxo de navegação do sistema legado (SilverStream) para servir como base para a migração para Angular 19.

## Análise do Fluxo de Navegação
O sistema legado utiliza um modelo de frameset (`fsExAluno.html`) para estruturar a interface após o login, carregando diferentes páginas HTML em cada frame. A navegação entre as funcionalidades é predominantemente baseada em submissões de formulários (`Page.submit()`) e redirecionamentos no lado do servidor, ao invés de links de navegação diretos.

### Páginas Identificadas:
*   `pgQELogin.html`: Página de login inicial.
*   `fsExAluno.html`: Frameset principal que define o layout da aplicação após o login.
*   `pgExTopo.html`: Frame superior com um banner estático.
*   `pgExLateral.html`: Frame lateral com branding e informações estáticas.
*   `pgExBuscaAluno.html`: Página de formulário de busca de ex-alunos, carregada inicialmente no frame principal (`main_frame`).
*   `pgExCadastroAluno.html`: Página de formulário para cadastro/edição de informações de ex-alunos.
*   `pgQEMsgPesquisa.html` (inferido): Página de resultados da busca, ou mensagem de "não encontrado".
*   `pgExLogout.html`: Página de logout.

### Diagrama de Fluxo de Navegação (Mermaid)

```mermaid
graph TD
    A[Início / URL Base] --> B{pgQELogin.html};
    B -- Submeter Login --> C{Autenticação Server-side};
    C -- Login Sucesso --> D[fsExAluno.html (Frameset)];

    D -- Carrega top_frame --> E[pgExTopo.html (Banner)];
    D -- Carrega left_frame --> F[pgExLateral.html (Branding)];
    D -- Carrega main_frame --> G[pgExBuscaAluno.html (Form. Busca)];

    G -- Submeter Busca --> H{Processamento Busca Server-side};
    H -- Resultados Encontrados --> I[pgQEMsgPesquisa.html (Lista Resultados - Inferido)];
    H -- Sem Resultados / Redirecionar --> J[pgExCadastroAluno.html (Form. Cadastro)];

    I -- Selecionar Item / Editar --> J;
    J -- Submeter Salvar --> K{Processamento Salvar Server-side};
    K -- Sucesso / Voltar --> G;
    J -- Cancelar --> G;

    J -- Clicar Sair --> L[pgExLogout.html];
    I -- Clicar Sair --> L;
    G -- Clicar Sair (se disponível) --> L; // Possível botão de logout em outras páginas

    L -- Logout Completo --> A;
```

## Código Proposto (Angular Routes - `app.routes.ts`)

Com base na nova arquitetura que centraliza um `LayoutComponent`, as rotas foram redefinidas da seguinte forma:

```typescript
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
      // Outras rotas da aplicação serão adicionadas aqui como filhas do LayoutComponent
    ],
  },
  {
    path: '**',
    redirectTo: '', // Redireciona para a rota padrão (login)
  },
];
```

## Checklist de Implementação (Navegação Inicial)

*   [x] Criar componente `LoginComponent` para `pgQELogin.html`.
*   [x] Criar componente `LayoutComponent` para ser o shell principal da aplicação.
*   [x] Criar componente `BuscaAlunoComponent` para `pgExBuscaAluno.html`.
*   [x] Criar componente `CadastroAlunoComponent` para `pgExCadastroAluno.html`.
*   [ ] Criar componente `ResultadosBuscaComponent` (se distinto de BuscaAlunoComponent).
*   [ ] Criar componente `LogoutComponent`.
*   [x] Configurar as rotas iniciais em `app.routes.ts` conforme proposto.
*   [x] Implementar redirecionamento de `/` para `/login`.
*   [x] Testar navegação básica entre `login`, `busca-aluno` e `cadastro-aluno`.
