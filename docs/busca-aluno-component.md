# Documentação de Migração: BuscaAlunoComponent

## 1. Análise da Tela Legada (`pgExBuscaAluno`)

### Objetivo
A tela "Busca de Alunos" é o ponto de entrada principal para o usuário após o login. Ela funciona como um formulário para que o usuário possa se identificar no sistema, buscando por seus dados antes de prosseguir para a edição ou visualização do seu cadastro.

### Estrutura e Campos
- **Nome** (`fldNome`): Campo de texto obrigatório para o nome completo do ex-aluno.
- **Origem** (`chOrigem`): Campo de seleção (dropdown) obrigatório. A seleção deste campo habilita e popula o campo "Curso". Exemplos: "Graduação", "Pós-Graduação".
- **Curso** (`chCurso`): Campo de seleção (dropdown) obrigatório, dependente da "Origem". Exemplos: "Sistemas de Informação", "Direito".
- **Data de Nascimento** (`fldDataNascimento`): Campo de texto obrigatório com formato `dd/mm/aaaa`.

### Fluxo de Dados e Comportamento
1.  **Carregamento Inicial:** A tela exibe os campos "Nome", "Origem" e "Data de Nascimento". O campo "Curso" fica oculto/desabilitado.
2.  **Seleção de Origem:** Ao selecionar uma "Origem", uma chamada é feita ao servidor para buscar os cursos correspondentes. O campo "Curso" se torna visível e é populado com os dados retornados.
3.  **Submissão (Busca):** O usuário preenche todos os campos e clica em "Buscar".
4.  **Validação:** O sistema valida no client-side se todos os campos foram preenchidos.
5.  **Navegação:** Após a submissão, o sistema navega para a próxima tela (`pgExCadastroAluno`), enviando os dados do formulário para a próxima etapa do fluxo, independentemente se o aluno foi encontrado ou não.

### Esboço de API (Serviços Mockados)
Para suportar o frontend, os seguintes endpoints (mockados em um service Angular) serão necessários:

- `GET /api/origens`: Retorna uma lista de todas as origens de curso.
  ```json
  [
    { "id": 1, "nome": "Graduação" },
    { "id": 2, "nome": "Pós-Graduação" },
    { "id": 3, "nome": "Mestrado" }
  ]
  ```

- `GET /api/cursos?origemId={id}`: Retorna uma lista de cursos filtrada por `origemId`.
  ```json
  [
    { "id": 101, "nome": "Sistemas de Informação" },
    { "id": 102, "nome": "Ciência da Computação" }
  ]
  ```

- `POST /api/alunos/buscar`: Simula a busca do aluno.
  ```typescript
  // Request Body
  {
    nome: string;
    origemId: number;
    cursoId: number;
    dataNascimento: string; // "YYYY-MM-DD"
  }

  // Response (Exemplo: Aluno Encontrado)
  {
    encontrado: true;
    alunoId: 12345;
  }

  // Response (Exemplo: Aluno Não Encontrado)
  {
    encontrado: false;
    alunoId: null;
  }
  ```

---

## 2. Código Proposto (Angular 19 + PrimeNG 19)

### busca-aluno.component.ts
```typescript
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';

// App Services
import { AlunoService } from '../services/aluno.service'; // Mock Service
import { Origem, Curso } from '../models/aluno.model'; // Data Models

@Component({
  selector: 'smc-egr-busca-aluno',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    CardModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
  ],
  providers: [AlunoService], // Mock service provided here
  templateUrl: './busca-aluno.component.html',
  styleUrls: ['./busca-aluno.component.scss'],
})
export class BuscaAlunoComponent {
  private router = inject(Router);
  private alunoService = inject(AlunoService);

  // Form Signals
  nome = signal('');
  dataNascimento = signal<Date | null>(null);
  selectedOrigem = signal<Origem | null>(null);
  selectedCurso = signal<Curso | null>(null);

  // Data Signals for Dropdowns
  origens = signal<Origem[]>([]);
  cursos = signal<Curso[]>([]);

  // Computed Signals for UI State
  isCursoDisabled = computed(() => !this.selectedOrigem());
  isFormInvalid = computed(
    () =>
      !this.nome() ||
      !this.dataNascimento() ||
      !this.selectedOrigem() ||
      !this.selectedCurso()
  );

  constructor() {
    this.loadOrigens();
  }

  loadOrigens() {
    this.origens.set(this.alunoService.getOrigens());
  }



  onOrigemChange(): void {
    this.selectedCurso.set(null); // Reset curso selection
    const origem = this.selectedOrigem();
    if (origem) {
      this.cursos.set(this.alunoService.getCursos(origem.id));
    } else {
      this.cursos.set([]); // Clear cursos if origem is cleared
    }
  }

  buscarAluno(): void {
    if (this.isFormInvalid()) {
      // PrimeNG MessageService could be used here for a toast notification
      console.error('Formulário inválido!');
      return;
    }

    const formValue = {
      nome: this.nome(),
      dataNascimento: this.dataNascimento(),
      origem: this.selectedOrigem(),
      curso: this.selectedCurso(),
    };

    console.log('Buscando aluno com os dados:', formValue);
    
    // For now, just navigate to the next step as per legacy logic
    // The data will be passed via a service or state management in a real scenario
    this.router.navigate(['/cadastro-aluno']);
  }
}
```

### busca-aluno.component.html
```html
<p-card header="Identificação do Ex-Aluno" styleClass="smc-egr-card">
  <p>
    Para começar, por favor, preencha os campos abaixo para que possamos localizar
    seu cadastro.
  </p>

  <form #buscaForm="ngForm" class="smc-egr-form-grid">
    <!-- Nome -->
    <div class="smc-egr-form-field">
      <label for="nome">Nome Completo *</label>
      <input
        id="nome"
        pInputText
        type="text"
        [(ngModel)]="nome"
        name="nome"
        required
      />
    </div>

    <!-- Data de Nascimento -->
    <div class="smc-egr-form-field">
      <label for="dataNascimento">Data de Nascimento *</label>
      <p-calendar
        id="dataNascimento"
        [(ngModel)]="dataNascimento"
        name="dataNascimento"
        dateFormat="dd/mm/yy"
        [showIcon]="true"
        required
      ></p-calendar>
    </div>

    <!-- Origem -->
    <div class="smc-egr-form-field">
      <label for="origem">Origem *</label>
      <p-dropdown
        id="origem"
        [(ngModel)]="selectedOrigem"
        name="origem"
        [options]="origens()"
        optionLabel="nome"
        placeholder="Selecione sua origem"
        (onChange)="onOrigemChange()"
        required
      ></p-dropdown>
    </div>

    <!-- Curso -->
    <div class="smc-egr-form-field">
      <label for="curso">Curso em que se formou *</label>
      <p-dropdown
        id="curso"
        [(ngModel)]="selectedCurso"
        name="curso"
        [options]="cursos()"
        optionLabel="nome"
        placeholder="Selecione seu curso"
        [disabled]="isCursoDisabled()"
        required
      ></p-dropdown>
    </div>
  </form>

  <ng-template pTemplate="footer">
    <div class="smc-egr-form-actions">
      <p-button
        label="Buscar"
        icon="pi pi-search"
        (onClick)="buscarAluno()"
        [disabled]="isFormInvalid()"
      ></p-button>
    </div>
    <p class="smc-egr-required-notice">* Campos de preenchimento obrigatório.</p>
  </ng-template>
</p-card>
```

### busca-aluno.component.scss
```scss
// Adicionar estilos específicos do componente aqui.
// As classes `smc-egr-*` devem ser usadas para consistência.

:host {
  display: block;
  max-width: 800px;
  margin: 2rem auto;
}

.smc-egr-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.smc-egr-form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  // Garante que os componentes da PrimeNG preencham o espaço
  p-calendar,
  p-dropdown,
  input[pInputText] {
    width: 100%;
  }
}

.smc-egr-form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.smc-egr-required-notice {
  font-size: var(--smc-egr-font-size-sm);
  color: var(--smc-egr-text-color-secondary);
  margin-top: 1rem;
  text-align: right;
}
```

---

## 3. Checklist de Implementação

- [ ] Criar a pasta `features/aluno/busca` para o novo componente.
- [ ] Criar o arquivo `busca-aluno.component.ts`.
- [ ] Criar o arquivo `busca-aluno.component.html`.
- [ ] Criar o arquivo `busca-aluno.component.scss`.
- [ ] Criar a pasta `core/models` e definir os modelos `aluno.model.ts` (para `Origem` e `Curso`).
- [ ] Criar a pasta `core/services` e implementar o `aluno.service.ts` com os dados mockados.
- [x] Criar a pasta `features/aluno/busca` para o novo componente.
- [x] Criar o arquivo `busca-aluno.component.ts`.
- [x] Criar o arquivo `busca-aluno.component.html`.
- [x] Criar o arquivo `busca-aluno.component.scss`.
- [x] Criar a pasta `core/models` e definir os modelos `aluno.model.ts` (para `Origem` e `Curso`).
- [x] Criar a pasta `core/services` e implementar o `aluno.service.ts` com os dados mockados.
- [ ] Adicionar a nova rota `/busca-aluno` em `app.routes.ts`, apontando para `BuscaAlunoComponent`.
- [ ] Testar o fluxo de preenchimento do formulário e a navegação para a próxima rota.
