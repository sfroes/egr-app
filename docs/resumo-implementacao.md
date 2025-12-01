# 📋 Resumo Rápido - Implementação do Novo Fluxo

## 🎯 Objetivo
Implementar o novo fluxo de navegação com 3 pontos principais:
1. **Busca de Aluno** → Validação → Roteamento Inteligente
2. **Login** → Autenticação → Questionário
3. **Cadastro** → Criar User → Login

---

## 📊 Visão Geral do Fluxo

```
┌─────────────────┐
│  busca-aluno    │ (Ponto de Entrada 1)
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Buscar   │
    │ Alunos   │
    └────┬─────┘
         │
    ┌────▼──────────────────────┐
    │ Aluno encontrado?         │
    └───┬───────────────────┬───┘
        │ SIM               │ NÃO
        │                   └──► ❌ Erro: "Aluno não existe"
        │
    ┌───▼─────────────────┐
    │ User existe?        │
    └───┬─────────────┬───┘
        │ SIM         │ NÃO
        │             │
        │             └──► ┌──────────────────┐
        │                  │ cadastro-aluno   │
        │                  │ (Dados preench.) │
        │                  └────────┬─────────┘
        │                           │
        │                      ┌────▼─────────┐
        │                      │ Salvar Aluno │
        │                      │ Criar User   │
        │                      └────────┬─────┘
        │                               │
        │                          ✅ Sucesso
        │                               │
        └───────────┬───────────────────┘
                    │
              ┌─────▼──────┐
              │   login    │ (Ponto de Entrada 2)
              └─────┬──────┘
                    │
               ┌────▼─────┐
               │ Buscar   │
               │ Users    │
               └────┬─────┘
                    │
          ┌─────────▼──────────┐
          │ User encontrado?   │
          └──┬─────────────┬───┘
             │ SIM         │ NÃO
             │             └──► ❌ Erro: "Usuário não existe"
             │
        ✅ Autenticar
             │
      ┌──────▼──────────┐
      │  questionario   │ 🔒 Protegido por AuthGuard
      └─────────────────┘
```

---

## 🔧 Alterações Principais

### 1️⃣ **app.routes.ts**
```diff
  path: '',
- redirectTo: 'login',
+ redirectTo: 'busca-aluno',

  {
    path: 'questionario',
    loadComponent: ...,
+   canActivate: [authGuard],
  }
```

### 2️⃣ **AuthService** (6 novos métodos)
```typescript
✅ autenticarUsuario(user: User): void
✅ isAuthenticated(): boolean
✅ getCurrentUser(): User | null
✅ logout(): void
✅ criarUser(userData): Observable<User>
✅ login(): Observable<User | null> // Atualizado
```

### 3️⃣ **AlunoService** (1 novo método)
```typescript
✅ verificarUserExiste(alunoId): Observable<boolean>
```

### 4️⃣ **QuestionarioService** (novo arquivo)
```typescript
✅ obterQuestionario(): Observable<any>
✅ salvarRespostas(userId, respostas): Observable<any>
```

### 5️⃣ **AuthGuard** (novo arquivo)
```typescript
✅ Protege rota /questionario
✅ Redireciona para /login se não autenticado
```

---

## 📝 Alterações nos Componentes

### 🔍 **BuscaAlunoComponent**
```typescript
onBuscar() {
  buscarAluno(criterios)
    ├─ Não encontrou → ❌ Erro
    └─ Encontrou
        └─ verificarUserExiste()
            ├─ User existe → 🔄 Router.navigate(['/login'])
            └─ User não existe → 🔄 Router.navigate(['/cadastro-aluno'], { state: { aluno } })
}
```

### 🔐 **LoginComponent**
```typescript
onLogin() {
  login(credentials)
    ├─ Não encontrou → ❌ Erro: "Usuário não encontrado"
    └─ Encontrou
        ├─ AuthService.autenticarUsuario(user)
        └─ 🔄 Router.navigate(['/questionario'])
}

ngOnInit() {
  // Mostrar mensagem de contexto (ex: "Cadastro realizado com sucesso")
}
```

### 📝 **CadastroAlunoComponent**
```typescript
ngOnInit() {
  // Receber aluno do state e preencher formulário
}

onSalvar() {
  updateAluno(aluno)
    └─ criarUser(userData)
        ├─ ✅ Sucesso: "Cadastro realizado!"
        └─ 🔄 Router.navigate(['/login'], { state: { mensagem } })
}
```

### 📊 **QuestionarioComponent**
```typescript
ngOnInit() {
  obterQuestionario()
  getCurrentUser()
}

onSalvarRespostas() {
  salvarRespostas(userId, respostas)
}

onLogout() {
  AuthService.logout()
  Router.navigate(['/login'])
}
```

---

## 🗄️ Alterações no db.json

### ✅ Adicionar Campo em `users`
```json
{
  "users": [
    {
      "id": 1,
      "alunoId": 1,  // ← ADICIONAR para relacionar com aluno
      "nome": "...",
      "..."
    }
  ]
}
```

### ✅ Adicionar Tabela `respostas`
```json
{
  "respostas": [
    {
      "id": 1,
      "userId": 1,
      "questionarioId": "1",
      "respostas": { ... },
      "dataResposta": "2025-12-01T10:30:00Z"
    }
  ]
}
```

---

## ✅ Checklist de Validação

### Cenários de Teste:

#### ✅ Busca de Aluno
- [ ] Aluno não existe → ❌ Mensagem de erro
- [ ] Aluno existe + User existe → 🔄 Vai para `/login`
- [ ] Aluno existe + User não existe → 🔄 Vai para `/cadastro-aluno`

#### ✅ Cadastro
- [ ] Formulário preenchido automaticamente
- [ ] Salvar aluno → Criar user → Mensagem de sucesso → Vai para `/login`

#### ✅ Login
- [ ] User não existe → ❌ Mensagem de erro
- [ ] User existe → 🔄 Vai para `/questionario`
- [ ] Mensagem de contexto exibida

#### ✅ Questionário
- [ ] Só acessa se autenticado (AuthGuard)
- [ ] Questionário carregado do db.json
- [ ] Respostas salvas com userId
- [ ] Logout funciona

---

## 📁 Arquivos a Criar/Modificar

### 🆕 CRIAR (2 arquivos)
```
src/app/core/guards/auth.guard.ts
src/app/core/services/questionario.service.ts (se não existir)
```

### ✏️ MODIFICAR (9 arquivos)
```
src/app/app.routes.ts
db.json

src/app/core/services/aluno.service.ts
src/app/core/services/auth.service.ts

src/app/features/aluno/busca/busca-aluno.component.ts
src/app/features/aluno/cadastro/cadastro-aluno.component.ts
src/app/features/auth/login/login.component.ts
src/app/features/questionario/questionario.component.ts
```

---

## ⏱️ Estimativa de Tempo

| Fase | Tempo Estimado |
|------|----------------|
| FASE 1: Configuração (rotas, guard) | 2-3h |
| FASE 2: Services (atualizar métodos) | 4-5h |
| FASE 3: Components (lógica de navegação) | 8-10h |
| FASE 4: db.json (estrutura de dados) | 1h |
| FASE 5: Testes (todos os cenários) | 4-5h |
| FASE 6: Melhorias (UX, loading, etc) | 4-6h |
| **TOTAL** | **23-30h** |

---

## 🚀 Ordem de Implementação Recomendada

1. ✅ `app.routes.ts` (rota padrão)
2. ✅ `auth.guard.ts` (criar)
3. ✅ `AuthService` (métodos de sessão)
4. ✅ `AlunoService` (verificarUserExiste)
5. ✅ `BuscaAlunoComponent` (fluxo de validação)
6. ✅ `CadastroAlunoComponent` (criar user)
7. ✅ `LoginComponent` (autenticação)
8. ✅ `QuestionarioService` (criar)
9. ✅ `QuestionarioComponent` (proteção)
10. ✅ `db.json` (respostas)
11. ✅ Testar todos cenários
12. ✅ Melhorias de UX

---

## 🎯 Prioridades

### 🔴 **CRÍTICO** (Bloqueante)
- Rotas
- AuthGuard
- AuthService (sessão)
- BuscaAlunoComponent (roteamento)
- LoginComponent (autenticação)
- CadastroAlunoComponent (criar user)

### 🟡 **IMPORTANTE** (Não Bloqueante)
- QuestionarioService
- QuestionarioComponent
- db.json (respostas)
- Sistema de mensagens

### 🟢 **MELHORIA** (Incremental)
- Loading states
- Animações
- Validações avançadas
- Tratamento de erros
- Acessibilidade

---

**Veja o checklist detalhado em:** `docs/checklist-implementacao-fluxo.md`  
**Veja o fluxo de navegação em:** `docs/fluxo-navegacao.md`

---

**Status**: 📋 Pronto para Implementação  
**Data**: 01/12/2025
