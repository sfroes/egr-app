# Checklist de Implementação - Novo Fluxo de Navegação

## 📋 Visão Geral

Este documento contém o checklist detalhado para implementar o novo fluxo de navegação do sistema EGR-App, baseado na documentação de `fluxo-navegacao.md`.

---

## 🎯 FASE 1: Configuração Base

### 1.1 Rotas e Guards

#### ✅ Atualizar `app.routes.ts`
- [ ] Alterar rota padrão de `'login'` para `'busca-aluno'`
- [ ] Garantir que todas as rotas estão carregando os componentes corretos
- [ ] Adicionar `authGuard` na rota `/questionario`
- [ ] Adicionar rota `**` para redirecionar para `busca-aluno`

**Arquivo:** `src/app/app.routes.ts`

```typescript
// ANTES:
{
  path: '',
  redirectTo: 'login',
  pathMatch: 'full',
}

// DEPOIS:
{
  path: '',
  redirectTo: 'busca-aluno',
  pathMatch: 'full',
}
```

```typescript
// ADICIONAR authGuard:
{
  path: 'questionario',
  loadComponent: () =>
    import('./features/questionario/questionario.component').then(
      (m) => m.QuestionarioComponent
    ),
  canActivate: [authGuard], // ADICIONAR ESTA LINHA
},
```

#### 🆕 Criar `auth.guard.ts`
- [ ] Criar arquivo `src/app/core/guards/auth.guard.ts`
- [ ] Implementar lógica de verificação de autenticação
- [ ] Redirecionar para `/login` se não autenticado
- [ ] Permitir acesso ao questionário apenas para usuários autenticados

**Arquivo:** `src/app/core/guards/auth.guard.ts`

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redireciona para login se não estiver autenticado
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
```

---

## 🔧 FASE 2: Serviços (Services)

### 2.1 AlunoService

**Arquivo:** `src/app/core/services/aluno.service.ts`

#### ✅ Métodos Existentes (Verificar e Manter)
- [x] `buscarAluno(criterios)` - Já existe
- [x] `getAlunoById(id)` - Já existe
- [x] `updateAluno(id, aluno)` - Já existe
- [x] `createAluno(aluno)` - Já existe
- [x] `getOrigens()` - Já existe
- [x] `getCursos(origemId)` - Já existe
- [x] `getSemestres()` - Já existe
- [x] `getEnderecoByCep(cep)` - Já existe

#### 🆕 Métodos Novos a Implementar
- [ ] `verificarUserExiste(alunoId: number): Observable<boolean>`
  - Verifica se existe um user na tabela `users` relacionado ao aluno
  - Retorna `true` ou `false`

```typescript
verificarUserExiste(alunoId: number): Observable<boolean> {
  // Buscar na tabela users por algum critério que relacione com o aluno
  // Pode ser por nome, numeroAcademico, etc.
  return this.http.get<any[]>(`${this.apiUrl}/users?alunoId=${alunoId}`).pipe(
    map(users => users.length > 0),
    catchError(() => of(false))
  );
}
```

---

### 2.2 AuthService

**Arquivo:** `src/app/core/services/auth.service.ts`

#### ✅ Métodos Existentes (Atualizar)
- [x] `getLoginDropdownData()` - Manter
- [ ] `login(credentials)` - **ATUALIZAR** para armazenar sessão

#### 🆕 Métodos Novos a Implementar

**2.2.1 Gerenciamento de Sessão**
- [ ] `criarUser(userData): Observable<User>`
  - Cria novo registro na tabela `users`
  - Chamado após cadastro do aluno

```typescript
criarUser(userData: Omit<User, 'id'>): Observable<User> {
  return this.http.post<User>(`${this.apiUrl}/users`, userData);
}
```

- [ ] `autenticarUsuario(user: User): void`
  - Armazena dados do usuário autenticado (localStorage/sessionStorage)
  - Marca usuário como autenticado

```typescript
private currentUser: User | null = null;

autenticarUsuario(user: User): void {
  this.currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(user));
}
```

- [ ] `isAuthenticated(): boolean`
  - Verifica se existe usuário autenticado
  - Usado pelo AuthGuard

```typescript
isAuthenticated(): boolean {
  if (this.currentUser) return true;
  
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    this.currentUser = JSON.parse(storedUser);
    return true;
  }
  
  return false;
}
```

- [ ] `getCurrentUser(): User | null`
  - Retorna usuário atualmente autenticado

```typescript
getCurrentUser(): User | null {
  if (this.currentUser) return this.currentUser;
  
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    this.currentUser = JSON.parse(storedUser);
    return this.currentUser;
  }
  
  return null;
}
```

- [ ] `logout(): void`
  - Remove dados do usuário autenticado
  - Limpa sessão

```typescript
logout(): void {
  this.currentUser = null;
  localStorage.removeItem('currentUser');
}
```

**2.2.2 Atualizar Método `login`**
- [ ] Modificar para armazenar sessão quando encontrar usuário
- [ ] Retornar o objeto `User` ao invés de apenas `boolean`

```typescript
login(credentials: { nome: string; dataNascimento: string; cursoId: string }): Observable<User | null> {
  return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
    map(users => {
      const foundUser = users.find(user =>
        user.nome.toLowerCase() === credentials.nome.toLowerCase() &&
        user.dataNascimento === credentials.dataNascimento &&
        user.cursoId === credentials.cursoId
      );
      
      if (foundUser) {
        this.autenticarUsuario(foundUser);
      }
      
      return foundUser || null;
    })
  );
}
```

---

### 2.3 QuestionarioService

**Arquivo:** `src/app/core/services/questionario.service.ts`

#### ✅ Verificar se Existe
- [ ] Se não existir, criar o arquivo

#### 🆕 Métodos a Implementar
- [ ] `obterQuestionario(): Observable<any>`
  - Busca o questionário do `db.json`

```typescript
obterQuestionario(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/questionario`);
}
```

- [ ] `salvarRespostas(respostas: any): Observable<any>`
  - Salva as respostas do questionário
  - Associa ao usuário autenticado

```typescript
salvarRespostas(userId: number, respostas: any): Observable<any> {
  const payload = {
    userId,
    respostas,
    dataResposta: new Date().toISOString()
  };
  return this.http.post<any>(`${this.apiUrl}/respostas`, payload);
}
```

---

## 🎨 FASE 3: Componentes (Features)

### 3.1 BuscaAlunoComponent

**Arquivo:** `src/app/features/aluno/busca/busca-aluno.component.ts`

#### 📝 Lógica a Implementar

**3.1.1 Atualizar método de busca**
- [ ] Implementar busca na tabela `alunos`
- [ ] Se encontrar aluno, verificar se existe `user` relacionado
- [ ] Implementar roteamento condicional baseado nos cenários

**Fluxo:**
```typescript
onBuscar() {
  const criterios = this.formularioBusca.value;
  
  this.alunoService.buscarAluno(criterios).subscribe({
    next: (alunos) => {
      if (alunos.length === 0) {
        // Cenário 1A: Aluno não encontrado
        this.exibirErro('Aluno não encontrado no sistema');
        return;
      }
      
      // Pega o primeiro aluno encontrado
      const aluno = alunos[0];
      
      // Verifica se existe user relacionado
      this.verificarUserERedireionar(aluno);
    },
    error: (error) => {
      this.exibirErro('Erro ao buscar aluno. Tente novamente.');
    }
  });
}

private verificarUserERedireionar(aluno: Aluno) {
  this.alunoService.verificarUserExiste(aluno.id).subscribe({
    next: (userExiste) => {
      if (userExiste) {
        // Cenário 1B: User existe - vai para login
        this.router.navigate(['/login'], {
          state: { mensagem: 'Por favor, faça login para continuar' }
        });
      } else {
        // Cenário 1C: User não existe - vai para cadastro
        this.router.navigate(['/cadastro-aluno'], {
          state: { aluno }
        });
      }
    }
  });
}
```

**3.1.2 Sistema de Mensagens**
- [ ] Implementar exibição de mensagens de erro
- [ ] Pode usar toast, alert ou component customizado

```typescript
private exibirErro(mensagem: string) {
  // Implementar conforme biblioteca de UI escolhida
  // Exemplo com alert simples:
  alert(mensagem);
  
  // Ou com biblioteca de toast/snackbar
  // this.toastService.error(mensagem);
}
```

**Checklist do Componente:**
- [ ] Atualizar lógica de busca
- [ ] Implementar verificação de user
- [ ] Implementar roteamento condicional
- [ ] Adicionar tratamento de erros
- [ ] Adicionar loading state durante busca
- [ ] Testar todos os cenários (1A, 1B, 1C)

---

### 3.2 LoginComponent

**Arquivo:** `src/app/features/auth/login/login.component.ts`

#### 📝 Lógica a Implementar

**3.2.1 Atualizar método de login**
- [ ] Buscar usuário na tabela `users`
- [ ] Se não encontrar, exibir erro
- [ ] Se encontrar, autenticar e redirecionar para questionário
- [ ] Suportar mensagens de contexto (ex: vindo do cadastro)

**Fluxo:**
```typescript
onLogin() {
  const credentials = this.formularioLogin.value;
  
  this.authService.login(credentials).subscribe({
    next: (user) => {
      if (!user) {
        // Cenário 2A: User não encontrado
        this.exibirErro('Usuário não encontrado no sistema');
        return;
      }
      
      // Cenário 2B: User encontrado
      // AuthService já autenticou o usuário internamente
      this.exibirSucesso('Login realizado com sucesso!');
      
      // Redirecionar para questionário
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/questionario';
      this.router.navigate([returnUrl]);
    },
    error: (error) => {
      this.exibirErro('Erro ao fazer login. Tente novamente.');
    }
  });
}
```

**3.2.2 Exibir Mensagens de Contexto**
- [ ] Mostrar mensagens passadas pela navegação (ex: "Cadastro realizado com sucesso")
- [ ] Limpar mensagem após exibição

```typescript
ngOnInit() {
  // Verificar se há mensagem vindo da navegação
  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras.state;
  
  if (state && state['mensagem']) {
    this.exibirInfo(state['mensagem']);
  }
}
```

**3.2.3 Sistema de Mensagens**
- [ ] Implementar exibição de mensagens de erro
- [ ] Implementar exibição de mensagens de sucesso
- [ ] Implementar exibição de mensagens informativas

**Checklist do Componente:**
- [ ] Atualizar lógica de login para usar novo método do AuthService
- [ ] Implementar exibição de mensagens de erro
- [ ] Implementar suporte para mensagens de contexto
- [ ] Adicionar loading state durante login
- [ ] Adicionar validações de formulário
- [ ] Testar cenário de sucesso (2B)
- [ ] Testar cenário de erro (2A)

---

### 3.3 CadastroAlunoComponent

**Arquivo:** `src/app/features/aluno/cadastro/cadastro-aluno.component.ts`

#### 📝 Lógica a Implementar

**3.3.1 Receber dados do aluno**
- [ ] Receber dados do aluno da navegação
- [ ] Preencher formulário automaticamente com esses dados

```typescript
ngOnInit() {
  // Receber dados da navegação
  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras.state;
  
  if (state && state['aluno']) {
    this.alunoPreenchido = state['aluno'];
    this.preencherFormulario(this.alunoPreenchido);
  }
}

private preencherFormulario(aluno: Aluno) {
  this.formularioCadastro.patchValue({
    nome: aluno.nome,
    dataNasc: aluno.dataNasc,
    origemId: aluno.origemId,
    cursoId: aluno.cursoId,
    email: aluno.email,
    // ... outros campos
  });
}
```

**3.3.2 Atualizar método de salvar**
- [ ] Salvar/atualizar dados na tabela `alunos`
- [ ] **Criar novo registro na tabela `users`**
- [ ] Exibir mensagem de sucesso
- [ ] Redirecionar para `/login`

**Fluxo:**
```typescript
onSalvar() {
  if (this.formularioCadastro.invalid) {
    this.exibirErro('Preencha todos os campos obrigatórios');
    return;
  }
  
  const dadosFormulario = this.formularioCadastro.value;
  const alunoId = this.alunoPreenchido?.id;
  
  // 1. Atualizar dados do aluno (se necessário)
  const atualizacaoAluno$ = alunoId 
    ? this.alunoService.updateAluno(alunoId, dadosFormulario)
    : this.alunoService.createAluno(dadosFormulario);
  
  atualizacaoAluno$.pipe(
    switchMap((aluno) => {
      // 2. Criar registro na tabela users
      const novoUser = {
        nome: dadosFormulario.nome,
        numeroAcademico: dadosFormulario.numeroAcademico || this.gerarNumeroAcademico(),
        dataNascimento: this.formatarData(dadosFormulario.dataNasc),
        cursoId: dadosFormulario.cursoId,
        anoUltimaMatricula: dadosFormulario.anoFormado,
        semestreUltimaMatriculaId: dadosFormulario.semestreFormado,
        turnoId: dadosFormulario.turnoId || 'N',
        alunoId: aluno.id // Relacionar com o aluno
      };
      
      return this.authService.criarUser(novoUser);
    })
  ).subscribe({
    next: (user) => {
      // 3. Exibir mensagem de sucesso
      this.exibirSucesso('Cadastro realizado com sucesso!');
      
      // 4. Redirecionar para login
      setTimeout(() => {
        this.router.navigate(['/login'], {
          state: { 
            mensagem: 'Cadastro realizado! Por favor, faça login para acessar o questionário.' 
          }
        });
      }, 1500);
    },
    error: (error) => {
      this.exibirErro('Erro ao salvar cadastro. Tente novamente.');
      console.error('Erro no cadastro:', error);
    }
  });
}

private gerarNumeroAcademico(): string {
  // Gerar número acadêmico único se não fornecido
  return `${Date.now()}`;
}

private formatarData(data: any): string {
  // Formatar data no formato esperado pela API
  if (typeof data === 'string') return data;
  const d = new Date(data);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}
```

**3.3.3 Validações do Formulário**
- [ ] Garantir que campos obrigatórios estão preenchidos
- [ ] Validar formato de email
- [ ] Validar formato de telefone
- [ ] Validar CEP

**Checklist do Componente:**
- [ ] Implementar recebimento de dados do aluno
- [ ] Implementar preenchimento automático do formulário
- [ ] Atualizar método de salvar para atualizar aluno
- [ ] Implementar criação de user no AuthService
- [ ] Adicionar mensagem de sucesso
- [ ] Implementar redirecionamento para login
- [ ] Adicionar loading state durante salvamento
- [ ] Adicionar validações de formulário
- [ ] Testar fluxo completo de cadastro

---

### 3.4 QuestionarioComponent

**Arquivo:** `src/app/features/questionario/questionario.component.ts`

#### 📝 Lógica a Implementar

**3.4.1 Verificar Autenticação**
- [ ] Garantir que componente só é acessado por usuários autenticados
- [ ] AuthGuard já deve estar protegendo a rota

**3.4.2 Carregar Questionário**
- [ ] Buscar questionário do db.json ao inicializar
- [ ] Exibir questões dinamicamente

```typescript
ngOnInit() {
  this.carregarQuestionario();
  this.carregarUsuarioAutenticado();
}

private carregarQuestionario() {
  this.questionarioService.obterQuestionario().subscribe({
    next: (questionario) => {
      this.questionario = questionario;
      this.inicializarFormulario();
    },
    error: (error) => {
      this.exibirErro('Erro ao carregar questionário');
    }
  });
}

private carregarUsuarioAutenticado() {
  this.usuarioAtual = this.authService.getCurrentUser();
}
```

**3.4.3 Salvar Respostas**
- [ ] Implementar salvamento das respostas
- [ ] Associar respostas ao usuário autenticado

```typescript
onSalvarRespostas() {
  if (this.formularioQuestionario.invalid) {
    this.exibirErro('Por favor, responda todas as questões obrigatórias');
    return;
  }
  
  const respostas = this.formularioQuestionario.value;
  const userId = this.usuarioAtual?.id;
  
  if (!userId) {
    this.router.navigate(['/login']);
    return;
  }
  
  this.questionarioService.salvarRespostas(userId, respostas).subscribe({
    next: () => {
      this.exibirSucesso('Respostas salvas com sucesso!');
      // Pode redirecionar para página de agradecimento ou logout
    },
    error: (error) => {
      this.exibirErro('Erro ao salvar respostas. Tente novamente.');
    }
  });
}
```

**3.4.4 Botão de Logout**
- [ ] Adicionar botão de logout no questionário
- [ ] Limpar sessão ao fazer logout

```typescript
onLogout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}
```

**Checklist do Componente:**
- [ ] Implementar carregamento do questionário
- [ ] Implementar exibição dinâmica das questões
- [ ] Implementar salvamento das respostas
- [ ] Adicionar botão de logout
- [ ] Adicionar validações de questões obrigatórias
- [ ] Adicionar loading state durante carregamento/salvamento
- [ ] Testar acesso protegido (sem autenticação)
- [ ] Testar fluxo completo de resposta

---

## 📊 FASE 4: Estrutura do db.json

### 4.1 Verificar Estrutura de Dados

**Arquivo:** `db.json`

#### ✅ Tabelas Necessárias
- [x] `alunos` - Já existe
- [x] `users` - Já existe
- [x] `questionario` - Já existe
- [ ] `respostas` - **CRIAR** para armazenar respostas do questionário

#### 🆕 Adicionar Tabela `respostas`

```json
{
  "respostas": [
    {
      "id": 1,
      "userId": 1,
      "questionarioId": "1",
      "respostas": {
        "1": "sim",
        "2": "",
        "3": "Desenvolvedor Full Stack"
      },
      "dataResposta": "2025-12-01T10:30:00Z"
    }
  ]
}
```

#### 🔄 Atualizar Estrutura de `users`
- [ ] Verificar se existe campo `alunoId` para relacionar com tabela `alunos`
- [ ] Se não existir, adicionar

```json
{
  "users": [
    {
      "id": 1,
      "alunoId": 1,
      "nome": "Tony Stark",
      "numeroAcademico": "12345",
      "dataNascimento": "29/05/1970",
      "cursoId": "1",
      "anoUltimaMatricula": "2023",
      "semestreUltimaMatriculaId": "2",
      "turnoId": "N"
    }
  ]
}
```

---

## 🧪 FASE 5: Testes

### 5.1 Testes de Fluxo de Navegação

#### Cenário 1: Busca de Aluno - Aluno Não Existe
- [ ] Preencher formulário de busca com dados inexistentes
- [ ] Verificar mensagem de erro: "Aluno não encontrado no sistema"
- [ ] Verificar que permanece na tela de busca

#### Cenário 2: Busca de Aluno - Aluno Existe + User Existe
- [ ] Preencher formulário de busca com dados do Bruce Wayne (id=1)
- [ ] Criar user para Bruce Wayne no db.json
- [ ] Verificar redirecionamento para `/login`
- [ ] Verificar mensagem informativa

#### Cenário 3: Busca de Aluno - Aluno Existe + User Não Existe
- [ ] Preencher formulário de busca com dados da Diana Prince (id=2)
- [ ] Garantir que Diana não tem user no db.json
- [ ] Verificar redirecionamento para `/cadastro-aluno`
- [ ] Verificar que formulário está preenchido automaticamente

#### Cenário 4: Cadastro de Aluno
- [ ] Preencher/completar formulário de cadastro
- [ ] Submeter formulário
- [ ] Verificar que dados foram salvos na tabela `alunos`
- [ ] Verificar que user foi criado na tabela `users`
- [ ] Verificar mensagem de sucesso
- [ ] Verificar redirecionamento para `/login`

#### Cenário 5: Login - User Não Existe
- [ ] Preencher formulário de login com dados inexistentes
- [ ] Verificar mensagem de erro: "Usuário não encontrado no sistema"
- [ ] Verificar que permanece na tela de login

#### Cenário 6: Login - User Existe
- [ ] Preencher formulário de login com dados do Tony Stark
- [ ] Verificar autenticação bem-sucedida
- [ ] Verificar redirecionamento para `/questionario`

#### Cenário 7: Acesso Protegido ao Questionário
- [ ] Tentar acessar `/questionario` diretamente sem estar autenticado
- [ ] Verificar redirecionamento para `/login`
- [ ] Verificar que queryParam `returnUrl` está presente

#### Cenário 8: Questionário - Responder
- [ ] Fazer login com usuário válido
- [ ] Acessar questionário
- [ ] Preencher respostas
- [ ] Submeter questionário
- [ ] Verificar que respostas foram salvas em `db.json`

#### Cenário 9: Logout
- [ ] Estar autenticado no questionário
- [ ] Clicar em logout
- [ ] Verificar que sessão foi limpa
- [ ] Verificar redirecionamento para `/login`
- [ ] Tentar acessar `/questionario` novamente
- [ ] Verificar que é redirecionado para login

---

## 📝 FASE 6: Melhorias e Refinamentos

### 6.1 UX/UI
- [ ] Adicionar loading spinners durante requisições
- [ ] Implementar sistema de toast/snackbar para mensagens
- [ ] Adicionar animações de transição entre rotas
- [ ] Melhorar feedback visual de validação de formulários
- [ ] Adicionar skeleton screens durante carregamento

### 6.2 Tratamento de Erros
- [ ] Implementar interceptor HTTP para erros globais
- [ ] Adicionar retry automático em falhas de rede
- [ ] Melhorar mensagens de erro para usuários
- [ ] Adicionar logging de erros

### 6.3 Validações
- [ ] Validação de CPF (se aplicável)
- [ ] Validação de CEP com consulta ViaCEP
- [ ] Validação de email duplicado
- [ ] Validação de número acadêmico único

### 6.4 Acessibilidade
- [ ] Adicionar labels descritivos em formulários
- [ ] Garantir navegação por teclado
- [ ] Adicionar mensagens de erro acessíveis
- [ ] Testar com screen readers

### 6.5 Performance
- [ ] Implementar lazy loading em todas as rotas
- [ ] Otimizar requisições HTTP (cache)
- [ ] Minimizar re-renderizações desnecessárias

---

## 🎯 Resumo de Arquivos a Criar/Modificar

### 🆕 Arquivos a CRIAR:
1. ✅ `src/app/core/guards/auth.guard.ts`
2. ❓ `src/app/core/services/questionario.service.ts` (se não existir)

### 📝 Arquivos a MODIFICAR:

#### Configuração:
1. ✅ `src/app/app.routes.ts`
2. ✅ `db.json` (adicionar tabela `respostas`, campo `alunoId` em users)

#### Services:
3. ✅ `src/app/core/services/aluno.service.ts`
4. ✅ `src/app/core/services/auth.service.ts`
5. ✅ `src/app/core/services/questionario.service.ts`

#### Components:
6. ✅ `src/app/features/aluno/busca/busca-aluno.component.ts`
7. ✅ `src/app/features/auth/login/login.component.ts`
8. ✅ `src/app/features/aluno/cadastro/cadastro-aluno.component.ts`
9. ✅ `src/app/features/questionario/questionario.component.ts`

---

## ✅ Status Geral

### Prioridade Alta (Crítico para Fluxo Funcionar)
- [ ] Atualizar rotas (`app.routes.ts`)
- [ ] Criar AuthGuard
- [ ] Atualizar AuthService (métodos de sessão)
- [ ] Atualizar BuscaAlunoComponent (lógica de roteamento)
- [ ] Atualizar LoginComponent (autenticação e redirect)
- [ ] Atualizar CadastroAlunoComponent (criar user)

### Prioridade Média (Importante mas não Bloqueante)
- [ ] Implementar QuestionarioService
- [ ] Atualizar QuestionarioComponent
- [ ] Adicionar tabela respostas no db.json
- [ ] Sistema de mensagens (toast/alert)

### Prioridade Baixa (Melhorias)
- [ ] Loading states
- [ ] Animações
- [ ] Tratamento de erros avançado
- [ ] Validações adicionais
- [ ] Acessibilidade
- [ ] Performance

---

## 📅 Estimativa de Tempo

- **FASE 1 (Configuração Base)**: 2-3 horas
- **FASE 2 (Serviços)**: 4-5 horas
- **FASE 3 (Componentes)**: 8-10 horas
- **FASE 4 (db.json)**: 1 hora
- **FASE 5 (Testes)**: 4-5 horas
- **FASE 6 (Melhorias)**: 4-6 horas

**TOTAL ESTIMADO**: 23-30 horas de desenvolvimento

---

## 🚀 Ordem Recomendada de Implementação

1. ✅ Atualizar `app.routes.ts` (rota padrão para busca-aluno)
2. ✅ Criar `auth.guard.ts`
3. ✅ Atualizar `AuthService` (adicionar métodos de sessão)
4. ✅ Atualizar `AlunoService` (adicionar `verificarUserExiste`)
5. ✅ Atualizar `BuscaAlunoComponent` (novo fluxo de validação)
6. ✅ Atualizar `CadastroAlunoComponent` (criar user no db)
7. ✅ Atualizar `LoginComponent` (autenticação com sessão)
8. ✅ Criar/Atualizar `QuestionarioService`
9. ✅ Atualizar `QuestionarioComponent` (proteção e logout)
10. ✅ Atualizar `db.json` (tabela respostas)
11. ✅ Testar todos os cenários
12. ✅ Implementar melhorias de UX

---

**Data de Criação**: 01/12/2025  
**Última Atualização**: 01/12/2025  
**Status**: 📋 Pronto para Implementação
