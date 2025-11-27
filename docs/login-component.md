# Componente de Login (LoginComponent) - Fase de Análise

## 1. Objetivo
Analisar o componente `pgQELogin.html` do sistema legado e propor uma implementação moderna em Angular 19, utilizando `json-server` para mock de dados e serviços.

## 2. Análise do Legado
O formulário de login (`pgQELogin.html`) e sua validação (`pgQELogin.java`) exigem os seguintes campos:
- **Obrigatórios**: `fldNome`, `fldDataNasc`, `cbCursos`.
- **Opcionais**: `fldCod_aluno`, `fldAno`, `chcSemeste`, `chcTurno`.
A validação principal ocorre no backend (Java) após um submit do formulário.

## 3. Esboço da API (JSON-SERVER)

Para simular o backend, o `json-server` servirá os seguintes endpoints a partir do `db.json`:

- **Dropdowns**:
  - `GET /cursos` -> Retorna a lista de cursos.
  - `GET /semestres` -> Retorna a lista de semestres.
  - `GET /turnos` -> Retorna a lista de turnos.

- **Autenticação**:
  - `GET /users?nome=<nome>&dataNascimento=<data>&cursoId=<id>` -> Busca por um usuário que corresponda aos três campos obrigatórios. Um retorno com um ou mais resultados é considerado um login bem-sucedido.

## 4. Código Proposto (Angular)

### `auth.service.ts` (Novo)
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { API_URL } from '../api-url.token';

// Interfaces para os dados
export interface DropdownOption {
  id: string;
  nome: string;
}

export interface User {
  id: number;
  nome: string;
  dataNascimento: string;
  cursoId: string;
  // Outros campos podem ser adicionados conforme necessário
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getLoginDropdownData(): Observable<{cursos: DropdownOption[], semestres: DropdownOption[], turnos: DropdownOption[]}> {
    return forkJoin({
      cursos: this.http.get<DropdownOption[]>(`${this.apiUrl}/cursos`),
      semestres: this.http.get<DropdownOption[]>(`${this.apiUrl}/semestres`),
      turnos: this.http.get<DropdownOption[]>(`${this.apiUrl}/turnos`),
    });
  }

  login(credentials: { nome: string; dataNascimento: string; cursoId: string }): Observable<boolean> {
    const params = new HttpParams()
      .set('nome', credentials.nome)
      .set('dataNascimento', credentials.dataNascimento)
      .set('cursoId', credentials.cursoId);

    return this.http.get<User[]>(`${this.apiUrl}/users`, { params }).pipe(
      map(users => users.length > 0) // Se encontrou algum usuário, o login é válido
    );
  }
}
```

### `login.component.ts` (Atualizado)
```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AuthService, DropdownOption } from '../../core/services/auth.service';

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
    InputMaskModule,
    ToastModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  loginForm!: FormGroup;
  
  cursos$!: Observable<DropdownOption[]>;
  semestres$!: Observable<DropdownOption[]>;
  turnos$!: Observable<DropdownOption[]>;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nome: ['Tony Stark', Validators.required],
      numeroAcademico: ['12345'],
      dataNascimento: ['29/05/1970', [Validators.required, this.dateValidator]],
      cursoId: ['1', Validators.required],
      anoUltimaMatricula: [''],
      semestreUltimaMatricula: [null],
      turno: [null],
    });

    this.loadDropdownData();
  }

  loadDropdownData(): void {
    const dropdownData$ = this.authService.getLoginDropdownData();
    this.cursos$ = dropdownData$.pipe(map(data => data.cursos));
    this.semestres$ = dropdownData$.pipe(map(data => data.semestres));
    this.turnos$ = dropdownData$.pipe(map(data => data.turnos));
  }

  dateValidator(control: any): { [key: string]: any } | null {
    if (control.value && control.value.length === 10 && control.value.includes('_')) {
        return { 'invalidDate': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    const credentials = {
      nome: this.loginForm.value.nome,
      dataNascimento: this.loginForm.value.dataNascimento,
      cursoId: this.loginForm.value.cursoId
    };

    this.authService.login(credentials).subscribe(isValid => {
      if (isValid) {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Login realizado!' });
        setTimeout(() => this.router.navigate(['/app/busca-aluno']), 1500);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Credenciais inválidas. Verifique os dados.' });
      }
    });
  }
}
```

### `login.component.html` (Atualizado para Observables)
```html
<p-toast></p-toast>
<p-card header="Questionário - Login" styleClass="smc-egr-card">
  <p class="smc-egr-text-sm smc-egr-mb-md">Preencha os campos abaixo e clique em OK para continuar.
    Os campos em <span class="smc-egr-text-danger">vermelho</span> são de preenchimento obrigatório.</p>

  <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
    <!-- Campos de Nome, Número Acadêmico e Data de Nascimento (sem alteração) -->
    <div class="smc-egr-form-group">
      <label for="nome" class="smc-egr-label smc-egr-label-required">Nome</label>
      <input type="text" id="nome" pInputText formControlName="nome" />
    </div>

    <div class="smc-egr-form-group">
      <label for="numeroAcademico" class="smc-egr-label">Nº Acadêmico (opcional)</label>
      <input type="text" id="numeroAcademico" pInputText formControlName="numeroAcademico" />
    </div>

    <div class="smc-egr-form-group">
      <label for="dataNascimento" class="smc-egr-label smc-egr-label-required">Data de Nascimento</label>
      <p-inputMask id="dataNascimento" mask="99/99/9999" formControlName="dataNascimento" placeholder="dd/mm/aaaa"></p-inputMask>
    </div>

    <!-- Dropdowns com async pipe -->
    <div class="smc-egr-form-group">
      <label for="curso" class="smc-egr-label smc-egr-label-required">Curso</label>
      <p-dropdown id="curso" [options]="(cursos$ | async)!" formControlName="cursoId" optionLabel="nome" optionValue="id" placeholder="Selecione um Curso"></p-dropdown>
    </div>

    <div class="smc-egr-form-group">
      <label for="semestreUltimaMatricula" class="smc-egr-label">Semestre da Última Matrícula</label>
      <p-dropdown id="semestreUltimaMatricula" [options]="(semestres$ | async)!" formControlName="semestreUltimaMatricula" optionLabel="nome" optionValue="id" placeholder="Selecione um Semestre"></p-dropdown>
    </div>

    <div class="smc-egr-form-group">
      <label for="turno" class="smc-egr-label">Turno</label>
      <p-dropdown id="turno" [options]="(turnos$ | async)!" formControlName="turno" optionLabel="nome" optionValue="id" placeholder="Selecione um Turno"></p-dropdown>
    </div>

    <div class="smc-egr-flex smc-egr-justify-center smc-egr-mt-lg">
      <p-button label="OK" type="submit"></p-button>
    </div>
  </form>
</p-card>
```

## 5. Checklist de Implementação

- [x] Criar o arquivo `db.json` com dados mockados para `users`, `cursos`, `semestres` e `turnos`.
- [x] Criar o arquivo `auth.service.ts` em `src/app/core/services/`.
- [x] Implementar os métodos `getLoginDropdownData()` e `login()` no `AuthService`.
- [x] Atualizar `login.component.ts` para usar o `AuthService` para carregar dados e autenticar.
- [x] Atualizar `login.component.html` para usar o `async` pipe com os `Observables` dos dropdowns.
- [x] Adicionar `ToastModule` e `MessageService` para feedback visual ao usuário.
- [x] Instalar e iniciar o `json-server`.
- [x] Testar o fluxo completo: carregamento dos dados, submissão do formulário, autenticação (sucesso e falha) e redirecionamento.
- [x] Estilizar o componente e os feedbacks (mensagens de erro/sucesso) conforme o Design System.
- [x] Adicionar o `LoginComponent` às rotas em `app.routes.ts`.
