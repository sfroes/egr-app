# Feature: Questionário de Ex-Alunos

## 📋 Visão Geral

A feature de Questionário permite que ex-alunos da PUC Minas respondam a uma pesquisa sobre sua trajetória profissional e experiência acadêmica. O questionário é acessado após a identificação do aluno através da tela de busca.

## 🎯 Objetivo

Coletar informações sobre:
- Situação profissional atual
- Inserção no mercado de trabalho
- Formação continuada (Pós-Graduação)
- Avaliação do curso
- Interesse em eventos institucionais

## 📊 Fluxo de Dados

```
1. Usuário preenche busca (BuscaAlunoComponent)
   ↓
2. Sistema busca aluno na API (GET /alunos?nome=...&origemId=...&cursoId=...)
   ↓
3. Se encontrado → Navega para /questionario?alunoId={id}
   Se não encontrado → Navega para /cadastro-aluno
   ↓
4. QuestionarioComponent carrega:
   - Estrutura do questionário (GET /questionario)
   - Dados do aluno (GET /alunos/{id})
   ↓
5. Usuário preenche o questionário
   ↓
6. Sistema salva respostas (POST /questionario-respostas)
   ↓
7. Redireciona para /aluno/busca com mensagem de sucesso
```

## 🗂️ Estrutura de Arquivos

```
src/app/
├── core/
│   ├── models/
│   │   └── questionario.model.ts       # Interfaces e tipos
│   └── services/
│       └── questionario.service.ts     # Serviço de API
└── features/
    └── questionario/
        ├── questionario.component.ts   # Lógica do componente
        ├── questionario.component.html # Template
        └── questionario.component.scss # Estilos
```

## 📦 Modelos de Dados

### Questionario

```typescript
interface Questionario {
  id: string;
  titulo: string;
  descricao: string;
  questoes: Questao[];
}
```

### Questao

```typescript
type TipoQuestao = 'radio' | 'textarea' | 'checkbox-with-text';

interface Questao {
  id: string;
  numero: number;
  texto: string;
  tipo: TipoQuestao;
  obrigatoria: boolean;
  opcoes?: OpcaoResposta[];
}
```

### QuestionarioResposta

```typescript
interface QuestionarioResposta {
  id?: string;
  alunoId: string;
  alunoNome: string;
  dataPreenchimento: Date;
  respostas: Resposta[];
}
```

## 🔌 Endpoints da API (JSON Server)

### GET /questionario
Retorna a estrutura do questionário com todas as questões.

**Resposta:**
```json
{
  "id": "1",
  "titulo": "Questionário de Ex-Alunos PUC Minas",
  "descricao": "Pesquisa para conhecer melhor a trajetória profissional dos ex-alunos",
  "questoes": [...]
}
```

### GET /alunos/{id}
Busca os dados do aluno por ID.

**Resposta:**
```json
{
  "id": 1,
  "nome": "Bruce Wayne",
  "dataNasc": "1972-02-19",
  ...
}
```

### POST /questionario-respostas
Salva as respostas do questionário.

**Requisição:**
```json
{
  "alunoId": "1",
  "alunoNome": "Bruce Wayne",
  "dataPreenchimento": "2025-12-01T10:30:00.000Z",
  "respostas": [
    {
      "questaoId": "1",
      "opcaoId": "sim"
    },
    {
      "questaoId": "5",
      "textoResposta": "Wayne Enterprises"
    }
  ]
}
```

## 🎨 Componentes UI (PrimeNG)

### Componentes Utilizados
- `p-card` - Container principal
- `p-radioButton` - Questões de múltipla escolha
- `p-checkbox` - Questões com múltiplas seleções
- `pInputTextarea` - Questões abertas
- `p-button` - Ações (Cancelar/Enviar)
- `p-progressSpinner` - Loading state

### Classes do Design System
- `.smc-egr-page-container` - Container da página
- `.smc-egr-page-header` - Cabeçalho da página
- `.smc-egr-card` - Estilização do card
- `.smc-egr-badge` - Badge "Pesquisa"
- `.smc-egr-form-actions` - Container dos botões de ação
- `.smc-egr-questao-item` - Container de cada questão
- `.smc-egr-questao-label` - Label da questão
- `.smc-egr-label-required` - Marcador de campo obrigatório

## 🧪 Tipos de Questões

### 1. Radio (Múltipla Escolha - Uma resposta)
```html
<p-radioButton
  [inputId]="'q1_sim'"
  value="sim"
  formControlName="q1"
></p-radioButton>
<label for="q1_sim">Sim</label>
```

### 2. Textarea (Resposta Aberta)
```html
<textarea
  id="q2"
  pInputTextarea
  formControlName="q2"
  rows="4"
></textarea>
```

### 3. Checkbox with Text (Múltiplas respostas com campo de texto)
```html
<p-checkbox
  [inputId]="'q10_mestrado'"
  formControlName="q10_mestrado"
  [binary]="true"
></p-checkbox>
<input
  type="text"
  pInputText
  formControlName="q10_mestrado_texto"
  placeholder="Especifique"
/>
```

## ✅ Validações

### Campos Obrigatórios
- Questões marcadas com `obrigatoria: true`
- Botão "Enviar" desabilitado se formulário inválido
- Mensagem de alerta ao tentar enviar formulário incompleto

### Lógica Condicional
- Campos de texto para checkboxes são habilitados apenas quando o checkbox está marcado
- Desabilitados automaticamente quando desmarcados

## 🔄 Estados do Componente

### Signals Utilizados
```typescript
carregando = signal<boolean>(true);    // Loading inicial
salvando = signal<boolean>(false);      // Loading ao salvar
questionario = signal<Questionario | null>(null); // Dados do questionário
alunoNome = signal<string>('');         // Nome do aluno
```

## 🚀 Integração com BuscaAlunoComponent

O componente de busca foi atualizado para:

1. Chamar o método `buscarAluno()` do `AlunoService`
2. Se o aluno for encontrado:
   - Navegar para `/questionario?alunoId={id}`
3. Se o aluno não for encontrado:
   - Navegar para `/cadastro-aluno` (fluxo de novo cadastro)

```typescript
buscarAluno(): void {
  this.alunoService.buscarAluno(formValue).subscribe({
    next: (alunos) => {
      if (alunos && alunos.length > 0) {
        const aluno = alunos[0];
        this.router.navigate(['/questionario'], {
          queryParams: { alunoId: aluno.id }
        });
      } else {
        this.router.navigate(['/cadastro-aluno']);
      }
    }
  });
}
```

## 📝 Questões do Questionário

O questionário contém **17 questões** divididas em:

### Situação Profissional (Q1-Q8)
1. Atualmente, você está trabalhando? (Radio)
2. Se não, qual o motivo? (Textarea)
3. Trabalha na área em que se formou? (Radio)
4. Se não, qual o motivo? (Textarea)
5. Qual o nome da empresa em que trabalha? (Textarea)
6. Qual o cargo que exerce? (Textarea)
7. Qual o ramo de atividade da empresa? (Textarea)
8. Quanto tempo depois de formado conseguiu seu primeiro emprego? (Radio)

### Formação Continuada (Q9-Q10)
9. Já fez algum curso de Pós-Graduação? (Radio)
10. Se sim, em qual nível? (Checkbox com texto - Especialização, Mestrado, Doutorado)

### Avaliação do Curso (Q11-Q15)
11. A formação na PUC Minas contribuiu para sua inserção no mercado de trabalho? (Radio)
12. Como você avalia o curso que frequentou na PUC Minas? (Radio)
13. Você recomendaria a PUC Minas para outras pessoas? (Radio)
14. Quais aspectos do curso você considera positivos? (Textarea)
15. Quais aspectos do curso você considera que poderiam ser melhorados? (Textarea)

### Engajamento (Q16-Q17)
16. Você tem interesse em participar de eventos promovidos pela PUC Minas para ex-alunos? (Radio)
17. Comentários adicionais ou sugestões (Textarea)

## 🎨 Design e UX

### Características Visuais
- **Layout Clean**: Cada questão em um card separado com borda esquerda verde
- **Hierarquia Visual**: Número da questão + texto em negrito
- **Estados Hover**: Leve mudança de cor de fundo ao passar o mouse
- **Responsivo**: Grid adapta-se a dispositivos móveis
- **Loading States**: Spinner durante carregamento e salvamento

### Acessibilidade
- Labels associados aos inputs via `for` e `id`
- Campos obrigatórios marcados com `*` vermelho
- Estados de focus visíveis
- Mensagens de erro claras via PrimeNG Toast

## 🧪 Testes Manuais

### Cenário 1: Fluxo Completo - Aluno Encontrado
1. Acessar `/busca-aluno`
2. Preencher: Nome, Data de Nascimento, Origem, Curso
3. Clicar em "Buscar"
4. Verificar redirecionamento para `/questionario?alunoId=1`
5. Verificar que o nome do aluno aparece no cabeçalho
6. Preencher as questões obrigatórias
7. Clicar em "Enviar Questionário"
8. Verificar toast de sucesso
9. Verificar redirecionamento para `/aluno/busca`

### Cenário 2: Validação de Campos Obrigatórios
1. Acessar `/questionario?alunoId=1`
2. Tentar clicar em "Enviar" sem preencher
3. Verificar que o botão está desabilitado
4. Preencher apenas alguns campos obrigatórios
5. Verificar que o botão continua desabilitado
6. Preencher todos os campos obrigatórios
7. Verificar que o botão está habilitado

### Cenário 3: Checkbox com Campo de Texto
1. Acessar questão 10 (Pós-Graduação)
2. Marcar checkbox "Mestrado"
3. Verificar que campo de texto aparece
4. Desmarcar o checkbox
5. Verificar que campo de texto desaparece e é limpo

### Cenário 4: Aluno Não Encontrado
1. Acessar `/busca-aluno`
2. Preencher com dados inexistentes
3. Clicar em "Buscar"
4. Verificar redirecionamento para `/cadastro-aluno`

## ✅ Checklist de Implementação

- [x] Criar models e interfaces (questionario.model.ts)
- [x] Criar serviço QuestionarioService
- [x] Criar componente QuestionarioComponent (.ts, .html, .scss)
- [x] Popular db.json com estrutura do questionário (17 questões)
- [x] Adicionar rota `/questionario` em app.routes.ts
- [x] Atualizar BuscaAlunoComponent para integrar com questionário
- [x] Adicionar métodos `buscarAluno()` e `getAlunoPorId()` no AlunoService
- [x] Importar todos os módulos PrimeNG necessários
- [x] Implementar validação de campos obrigatórios
- [x] Implementar lógica de checkbox com campo de texto condicional
- [x] Adicionar loading states (carregando, salvando)
- [x] Implementar tratamento de erros
- [x] Criar estilos responsivos
- [x] Testar fluxo completo
- [x] Criar documentação

## 🎉 Conclusão

A feature de Questionário foi implementada com sucesso seguindo os padrões do projeto:
- ✅ Angular 19 com Standalone Components
- ✅ PrimeNG 19 para todos os elementos de UI
- ✅ Signals para gerenciamento de estado
- ✅ Design System (prefixo `smc-egr-`)
- ✅ JSON Server para mock de API
- ✅ Reactive Forms para formulários complexos
- ✅ Nova sintaxe de Control Flow (@if, @for)

A aplicação agora possui um fluxo completo de identificação e coleta de dados dos ex-alunos!
