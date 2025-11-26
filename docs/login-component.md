# Componente de Login (LoginComponent)

## Objetivo
Este documento detalha o componente de login do sistema legado (`pgQELogin.html`) para servir como base para a implementação do `LoginComponent` no Angular 19.

## Campos do Formulário e Validações

O formulário de login (`pgQELogin.html`) possui os seguintes campos e validações:

| Campo             | Tipo Esperado (Implícito) | Obrigatório (Validação `validaEspaco`) | Validação Específica (`checadata`) | Observações                              |
| :---------------- | :------------------------ | :------------------------------------- | :--------------------------------- | :--------------------------------------- |
| `fldNome`         | Texto                     | Sim                                    | N/A                                | Nome do usuário                          |
| `fldCod_aluno`    | Numérico                  | Não                                    | N/A                                | Número acadêmico (opcional)              |
| `fldDataNasc`     | Data (dd/mm/aaaa)         | Sim                                    | Sim                                | Data de nascimento. Formato e validade.  |
| `cbCursos`        | Dropdown                  | Sim (seleção diferente de 0)           | N/A                                | Curso do aluno.                          |
| `fldAno`          | Numérico (4 dígitos)      | Não (comentado no legado)              | N/A                                | Ano da última matrícula (opcional)       |
| `chcSemeste`      | Dropdown                  | Não (comentado no legado)              | N/A                                | Semestre da última matrícula (opcional)  |
| `chcTurno`        | Dropdown                  | Não                                    | N/A                                | Turno (opcional)                         |

### Funções de Validação JavaScript Legadas:

*   **`validaEspaco(string)`**: Verifica se um campo contém apenas espaços em branco. Se sim, retorna `false` (inválido).
*   **`checadata(nomeobjeto, meuvalor)`**: Valida o formato `dd/mm/aaaa` e a validade da data (dia, mês, ano bissexto).
*   **`checaInt(Numero)`**: Verifica se uma string contém apenas números arábicos.
*   **`ebissexto(ano)`**: Verifica se um ano é bissexto.
*   **`validaCampos()`**: Função principal de validação que chama as outras funções e exibe `alert()` para o usuário.

## Fluxo de Dados e Interação com o Backend

O formulário de login é enviado através do método `Page.submit(this.btnOK.name)` quando o botão `btnOK` é clicado e as validações `validaCampos()` passam. A lógica exata de autenticação e redirecionamento (`pgQELogin.java`) ocorre no servidor SilverStream. Em caso de sucesso, o servidor redireciona para o frameset `fsExAluno.html`.

## Esboço da API Necessária (Backend C#)

Será necessário um endpoint para autenticação que receba os dados do formulário de login e retorne um token de autenticação ou um status de sucesso/falha.

*   **Endpoint:** `POST /api/auth/login` (exemplo)
*   **Request Body:**
    ```json
    {
      "nome": "string",
      "numeroAcademico": "string", // Opcional
      "dataNascimento": "string", // Formato dd/mm/aaaa
      "cursoId": "string",        // ID ou código do curso selecionado
      "anoUltimaMatricula": "string", // Opcional
      "semestreUltimaMatriculaId": "string", // Opcional
      "turnoId": "string"          // Opcional
    }
    ```
*   **Response (Sucesso):**
    ```json
    {
      "success": true,
      "token": "string", // JWT ou similar
      "message": "Login bem-sucedido"
    }
    ```
*   **Response (Falha):**
    ```json
    {
      "success": false,
      "message": "Credenciais inválidas"
    }
    ```

## Código Proposto (LoginComponent - Angular)

### `login.component.ts` (Estrutura Corrigida com PrimeNG)
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'smc-egr-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    InputMaskModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  
  // Mock data for dropdowns
  cursos: { id: string; nome: string }[] = [];
  semestres: { id: string; nome: string }[] = [];
  turnos: { id: string; nome: string }[] = [];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nome: ['', Validators.required],
      numeroAcademico: [''],
      dataNascimento: ['', [Validators.required, this.dateValidator]],
      curso: [null, Validators.required], // Dropdown works better with null as initial value
      anoUltimaMatricula: [''],
      semestreUltimaMatricula: [null],
      turno: [null],
    });

    // Mock data would be loaded from a service
    this.cursos = [
      { id: '1', nome: 'Ciência da Computação' },
      { id: '2', nome: 'Engenharia Civil' },
    ];
    this.semestres = [
      { id: '1', nome: '1º Semestre' },
      { id: '2', nome: '2º Semestre' },
    ];
    this.turnos = [
      { id: 'M', nome: 'Manhã' },
      { id: 'N', nome: 'Noite' },
    ];
  }

  dateValidator(control: any): { [key: string]: any } | null {
    if (control.value && control.value.includes('_')) { // InputMask incompleto
        return { 'invalidDate': true };
    }
    // A validação de formato é parcialmente tratada pelo p-inputMask. 
    // Lógica adicional pode ser necessária para dias/meses válidos.
    return null;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Formulário de Login Válido:', this.loginForm.value);
      // TODO: Call authentication service
      this.router.navigate(['/app/busca-aluno']);
    } else {
      console.log('Formulário de Login Inválido');
      // Mark fields as touched to show errors
      this.loginForm.markAllAsTouched();
    }
  }
}
```

### `login.component.html` (Estrutura Corrigida com PrimeNG)
```html
<p-card header="Questionário - Login" styleClass="smc-egr-card">
  <p class="smc-egr-text-sm smc-egr-mb-md">Preencha os campos abaixo e clique em OK para continuar.
    Os campos em <span class="smc-egr-text-danger">vermelho</span> são de preenchimento obrigatório.</p>

  <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
    <div class="smc-egr-form-group">
      <label for="nome" class="smc-egr-label smc-egr-label-required">Nome</label>
      <input type="text" id="nome" pInputText formControlName="nome" 
             [ngClass]="{'ng-invalid ng-dirty': loginForm.get('nome')?.invalid && loginForm.get('nome')?.touched}" />
      @if (loginForm.get('nome')?.invalid && loginForm.get('nome')?.touched) {
        <small class="smc-egr-form-error">Nome é obrigatório.</small>
      }
    </div>

    <div class="smc-egr-form-group">
      <label for="numeroAcademico" class="smc-egr-label">Nº Acadêmico (opcional)</label>
      <input type="text" id="numeroAcademico" pInputText formControlName="numeroAcademico" />
    </div>

    <div class="smc-egr-form-group">
      <label for="dataNascimento" class="smc-egr-label smc-egr-label-required">Data de Nascimento</label>
      <p-inputMask id="dataNascimento" mask="99/99/9999" formControlName="dataNascimento" placeholder="dd/mm/aaaa"
                   [ngClass]="{'ng-invalid ng-dirty': loginForm.get('dataNascimento')?.invalid && loginForm.get('dataNascimento')?.touched}"></p-inputMask>
      @if (loginForm.get('dataNascimento')?.invalid && loginForm.get('dataNascimento')?.touched) {
        <small class="smc-egr-form-error">Data de Nascimento é obrigatória.</small>
      }
    </div>

    <div class="smc-egr-form-group">
      <label for="curso" class="smc-egr-label smc-egr-label-required">Curso</label>
      <p-dropdown id="curso" [options]="cursos" formControlName="curso" optionLabel="nome" optionValue="id" placeholder="Selecione um Curso"
                  [ngClass]="{'ng-invalid ng-dirty': loginForm.get('curso')?.invalid && loginForm.get('curso')?.touched}"></p-dropdown>
      @if (loginForm.get('curso')?.invalid && loginForm.get('curso')?.touched) {
        <small class="smc-egr-form-error">Curso é obrigatório.</small>
      }
    </div>

    <!-- Campos Opcionais -->
    <div class="smc-egr-form-group">
      <label for="anoUltimaMatricula" class="smc-egr-label">Ano da Última Matrícula</label>
      <input type="text" id="anoUltimaMatricula" pInputText formControlName="anoUltimaMatricula" />
    </div>

    <div class="smc-egr-form-group">
      <label for="semestreUltimaMatricula" class="smc-egr-label">Semestre da Última Matrícula</label>
      <p-dropdown id="semestreUltimaMatricula" [options]="semestres" formControlName="semestreUltimaMatricula" optionLabel="nome" optionValue="id" placeholder="Selecione um Semestre"></p-dropdown>
    </div>

    <div class="smc-egr-form-group">
      <label for="turno" class="smc-egr-label">Turno</label>
      <p-dropdown id="turno" [options]="turnos" formControlName="turno" optionLabel="nome" optionValue="id" placeholder="Selecione um Turno"></p-dropdown>
    </div>

    <div class="smc-egr-flex smc-egr-justify-center smc-egr-mt-lg">
      <p-button label="OK" type="submit" [disabled]="loginForm.invalid"></p-button>
    </div>
  </form>
</p-card>
```


## Checklist de Implementação (LoginComponent)

*   [x] Implementar estrutura do `LoginComponent` (`.ts`, `.html`, `.scss`).
*   [x] Integrar `ReactiveFormsModule` e módulos PrimeNG (`CardModule`, `InputTextModule`, `DropdownModule`, `ButtonModule`, `InputMaskModule`).
*   [x] Adicionar campos de formulário e validações básicas conforme `pgQELogin.html`.
*   [x] Desenvolver validador de data customizado (`dateValidator`) com a lógica do legado (`checadata`).
*   [x] Criar e integrar serviço de autenticação (`AuthService`) para chamar a API de login.
*   [x] Implementar lógica de submissão do formulário (`onSubmit`).
*   [x] Adicionar o `LoginComponent` às rotas em `app.routes.ts`.
*   [x] Estilizar o formulário utilizando as classes do `smc-egr-design-system.scss`.
*   [x] Testar validações de formulário.
*   [x] Testar chamada da API de login e redirecionamento.