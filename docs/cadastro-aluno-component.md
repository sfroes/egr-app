# Cadastro Aluno Component

## 1. Análise da Tela `pgExCadastroAluno.html`

### Objetivo da Tela
A tela `pgExCadastroAluno.html` é responsável pelo cadastro e/ou edição das informações de um ex-aluno. Ela coleta dados pessoais, de contato, endereço, formação acadêmica e informações profissionais. Também possui uma funcionalidade de busca de endereço por CEP e uma seção de confirmação dos dados antes do envio final.

### Campos do Formulário e Validações

#### Seção de Dados Pessoais e Acadêmicos
*   **Nome (`fldNome`)**:
    *   **Obrigatório**: Sim.
    *   **Validação**: Não pode conter caracteres numéricos ou caracteres especiais `.,!@#$%¨&*()+-/<>;?[]{}\|§£¢`.
*   **Data de Nascimento (`fldDataNasc`)**:
    *   **Obrigatório**: Sim.
    *   **Validação**: Formato `dd/mm/aaaa`. Dia, mês e ano devem ser números válidos. Valida dias do mês (ex: 31 para jan, 28/29 para fev) e ano bissexto.
*   **Origem (`chOrigem`)**: (Dropdown/Select)
    *   **Obrigatório**: Sim (valor não pode ser 0).
*   **Curso / Campus ou Unidade (`chCurso`)**: (Dropdown/Select)
    *   **Obrigatório**: Sim (valor não pode ser 0).
*   **Ano de Formatura (`fldAnoFormado`)**:
    *   **Obrigatório**: Sim.
    *   **Validação**: Apenas números, 4 dígitos.
*   **Semestre de Formatura (`chSemestreFormado`)**: (Dropdown/Select)
    *   **Obrigatório**: Não explicitamente validado no `dadosValidos()`, mas presente.

#### Seção de Contato
*   **E-mail (`fldEmail`)**:
    *   **Obrigatório**: Sim.
    *   **Validação**: Formato de e-mail válido (contém `@`, `.`, não começa/termina com `@` ou `.`, sem espaços, sem múltiplos `@`, etc.). Convertido para minúsculas ao perder o foco (`onBlur`).
*   **DDD Contato (`fldDDDContato`)**:
    *   **Obrigatório**: Sim, se `fldTelContato` preenchido.
    *   **Validação**: Apenas números.
*   **Telefone Contato (`fldTelContato`)**:
    *   **Obrigatório**: Sim, se `fldDDDContato` preenchido.
    *   **Validação**: Apenas números (comentado na função original, mas inferido).
*   **DDD Celular (`fldDDDCelular`)**:
    *   **Obrigatório**: Não, mas se preenchido, `fldTelCelular` deve ser preenchido.
    *   **Validação**: Apenas números.
*   **Telefone Celular (`fldTelCelular`)**:
    *   **Obrigatório**: Não, mas se preenchido, `fldDDDCelular` deve ser preenchido.
    *   **Validação**: Apenas números (comentado na função original, mas inferido).

#### Seção de Endereço
*   **CEP (`fldCEP`)**:
    *   **Obrigatório**: Sim, para busca.
    *   **Validação**: Apenas números, 8 dígitos.
    *   **Funcionalidade**: Botão "Buscar Endereço" (`btnPsqEndereco`) aciona a busca de endereço.
*   **Rua / Avenida (`fldLogradouro`)**:
    *   **Obrigatório**: Sim.
    *   **Preenchimento**: Pode ser preenchido automaticamente pela busca de CEP.
*   **Número (`fldNumero`)**:
    *   **Obrigatório**: Sim.
    *   **Validação**: Apenas números (comentado na função original, mas inferido).
*   **Bairro (`fldBairro`)**:
    *   **Obrigatório**: Sim.
    *   **Preenchimento**: Pode ser preenchido automaticamente pela busca de CEP.
*   **Complemento (`fldCompl`)**:
    *   **Obrigatório**: Não.
*   **Estado (`fldUF`)**:
    *   **Obrigatório**: Sim.
    *   **Preenchimento**: Pode ser preenchido automaticamente pela busca de CEP.
*   **Cidade (`fldCidade`)**:
    *   **Obrigatório**: Sim.
    *   **Preenchimento**: Pode ser preenchido automaticamente pela busca de CEP.
*   **Código Cidade (`fldCodCidade`)**: (Hidden input)

#### Seção de Informações Profissionais
*   **Ocupação Atual (`fldOcupacao`)**:
    *   **Obrigatório**: Não.
*   **Nome da Empresa (`fldEmpresa`)**:
    *   **Obrigatório**: Não.
*   **DDD Comercial (`fldDDDComercial`)**:
    *   **Obrigatório**: Não.
*   **Telefone Comercial (`fldTelcomercial`)**:
    *   **Obrigatório**: Não.

### Fluxo de Dados e Esboço da API

A tela interage com o backend para:
1.  **Buscar Endereço por CEP**: Quando o botão `btnPsqEndereco` é clicado, um evento "ENDERECO" é enviado ao servidor.
    *   **Endpoint Sugerido (GET)**: `/api/endereco?cep={cep}`
    *   **Resposta Esperada**: Objeto contendo `logradouro`, `bairro`, `cidade`, `uf`.
2.  **Enviar Dados do Aluno**: Após preencher e validar os dados, o botão `btnEnviar` envia um evento "ENVIAR" ou "SALVAR" (ambos parecem estar presentes no código legado) com os dados do formulário.
    *   **Endpoint Sugerido (POST/PUT)**: `/api/alunos`
    *   **Dados Enviados**: Todos os campos do formulário (Nome, DataNasc, Origem, Curso, AnoFormado, SemestreFormado, Email, DDDContato, TelContato, DDDCelular, TelCelular, CEP, Logradouro, Numero, Bairro, Compl, UF, Cidade, Ocupacao, Empresa, DDDComercial, Telcomercial).
    *   **Resposta Esperada**: Confirmação de sucesso ou erros de validação/negócio.
3.  **Listar Cursos/Origens**: Os dropdowns `chOrigem` e `chCurso` provavelmente são preenchidos por dados do servidor.
    *   **Endpoint Sugerido (GET)**: `/api/origens` e `/api/cursos`
    *   **Resposta Esperada**: Array de objetos `{ id: number, nome: string }`.

### Seção de Confirmação (`tabConfere`)
Esta seção parece ser uma exibição dos dados preenchidos antes da submissão final, possivelmente em um modo de "revisão" ou "confirmação". Os labels (`lblConfNome`, etc.) refletem os campos de entrada.

### Ações
*   **Enviar (`btnEnviar`)**: Submete o formulário com o evento "ENVIAR".
*   **Salvar (`btnSalvar`)**: Submete o formulário com o evento "SALVAR". (Aparentemente uma duplicação ou um botão para um estado específico da tela de confirmação).
*   **Cancelar (`btnCancelar`)**: Envia o evento "CANCELAR", provavelmente redirecionando para a tela de busca.
*   **Sair (`btnSair`)**: Redireciona para `pgExLogout.html`.

## 2. Código Proposto (Angular)

### `cadastro-aluno.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { MessagesModule } from 'primeng/messages'; // Para mensagens de validação
import { Message } from 'primeng/api'; // Para mensagens de validação
import { AlunoService } from '../../core/services/aluno.service'; // Assumindo a criação
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs'; // Para mocking
import { catchError, tap } from 'rxjs/operators';

interface Origem {
  id: number;
  nome: string;
}

interface Curso {
  id: number;
  nome: string;
}

@Component({
  selector: 'smc-egr-cadastro-aluno',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    InputMaskModule,
    MessagesModule,
  ],
  templateUrl: './cadastro-aluno.component.html',
  styleUrls: ['./cadastro-aluno.component.scss'],
})
export class CadastroAlunoComponent implements OnInit {
  cadastroForm!: FormGroup;
  origens: Origem[] = [];
  cursos: Curso[] = [];
  semestres: { label: string; value: string }[] = [
    { label: '1º Semestre', value: '1' },
    { label: '2º Semestre', value: '2' },
  ];
  messages: Message[] = [];
  editMode: boolean = false;
  alunoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private alunoService: AlunoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDropdownData();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.alunoId = +id;
        this.editMode = true;
        this.loadAlunoData(this.alunoId);
      }
    });
  }

  initializeForm(): void {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, this.nomeValidator]],
      dataNasc: ['', [Validators.required, this.dataNascimentoValidator]],
      origem: [null, Validators.required],
      curso: [null, Validators.required],
      anoFormado: [
        '',
        [Validators.required, Validators.pattern(/^\d{4}$/)],
      ],
      semestreFormado: [null],
      email: ['', [Validators.required, Validators.email]],
      dddContato: ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
      telContato: ['', [Validators.required, Validators.pattern(/^\d{8,9}$/)]], // 8 ou 9 dígitos para telefone
      dddCelular: ['', Validators.pattern(/^\d{2}$/)],
      telCelular: ['', Validators.pattern(/^\d{8,9}$/)],
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      logradouro: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      bairro: ['', Validators.required],
      complemento: [''],
      uf: ['', Validators.required],
      cidade: ['', Validators.required],
      ocupacao: [''],
      empresa: [''],
      dddComercial: [''],
      telComercial: [''],
    });

    // Validadores condicionais para telefones
    this.cadastroForm
      .get('dddCelular')
      ?.valueChanges.subscribe((value) =>
        this.setConditionalRequired(
          value,
          'telCelular',
          'dddCelular',
          'Telefone Celular'
        )
      );
    this.cadastroForm
      .get('telCelular')
      ?.valueChanges.subscribe((value) =>
        this.setConditionalRequired(
          value,
          'dddCelular',
          'telCelular',
          'DDD Celular'
        )
      );
  }

  setConditionalRequired(
    controlValue: any,
    targetControlName: string,
    sourceControlName: string,
    message: string
  ): void {
    const targetControl = this.cadastroForm.get(targetControlName);
    const sourceControl = this.cadastroForm.get(sourceControlName);

    if (controlValue && !targetControl?.value) {
      targetControl?.setValidators(Validators.required);
      this.messages.push({
        severity: 'error',
        summary: 'Campo Obrigatório',
        detail: `${message} é obrigatório se o ${sourceControlName.includes('ddd') ? 'DDD' : 'número'} for preenchido.`,
      });
    } else if (!controlValue && targetControl?.hasValidator(Validators.required)) {
      targetControl?.clearValidators();
      this.messages = this.messages.filter(
        (msg) => !msg.detail?.includes(message)
      );
    }
    targetControl?.updateValueAndValidity();
    sourceControl?.updateValueAndValidity(); // Update validity of source control as well
  }


  nomeValidator(control: AbstractControl): { [key: string]: any } | null {
    const forbiddenChars = /[0-9.,!@#$%¨&*()+\-/<>;?\[\]{}\|§£¢]/;
    if (control.value && forbiddenChars.test(control.value)) {
      return { invalidNome: true };
    }
    return null;
  }

  dataNascimentoValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }
    const date = new Date(control.value);
    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }
    // Adicionar validação de dia/mês/ano conforme a lógica do legado se necessário,
    // mas o PrimeNG Calendar já ajuda muito aqui.
    return null;
  }

  loadDropdownData(): void {
    // Mock de dados para Origem
    of([
      { id: 1, nome: 'Unidade 1' },
      { id: 2, nome: 'Unidade 2' },
      { id: 3, nome: 'Unidade 3' },
    ])
      .subscribe((data) => (this.origens = data));

    // Mock de dados para Curso
    of([
      { id: 101, nome: 'Engenharia de Software' },
      { id: 102, nome: 'Sistemas de Informação' },
      { id: 103, nome: 'Ciência da Computação' },
    ])
      .subscribe((data) => (this.cursos = data));
  }

  loadAlunoData(id: number): void {
    this.alunoService
      .getAlunoById(id)
      .pipe(
        tap((aluno) => {
          if (aluno) {
            this.cadastroForm.patchValue({
              nome: aluno.nome,
              dataNasc: new Date(aluno.dataNasc), // Converter string para Date
              origem: this.origens.find((o) => o.id === aluno.origemId),
              curso: this.cursos.find((c) => c.id === aluno.cursoId),
              anoFormado: aluno.anoFormado,
              semestreFormado: this.semestres.find(
                (s) => s.value === aluno.semestreFormado
              ),
              email: aluno.email,
              dddContato: aluno.dddContato,
              telContato: aluno.telContato,
              dddCelular: aluno.dddCelular,
              telCelular: aluno.telCelular,
              cep: aluno.cep,
              logradouro: aluno.logradouro,
              numero: aluno.numero,
              bairro: aluno.bairro,
              complemento: aluno.complemento,
              uf: aluno.uf,
              cidade: aluno.cidade,
              ocupacao: aluno.ocupacao,
              empresa: aluno.empresa,
              dddComercial: aluno.dddComercial,
              telComercial: aluno.telComercial,
            });
          }
        }),
        catchError((error) => {
          console.error('Erro ao carregar dados do aluno', error);
          this.messages = [
            {
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível carregar os dados do aluno.',
            },
          ];
          return of(null);
        })
      )
      .subscribe();
  }

  buscarEnderecoPorCep(): void {
    const cep = this.cadastroForm.get('cep')?.value;
    if (cep && this.cadastroForm.get('cep')?.valid) {
      this.alunoService
        .getEnderecoByCep(cep)
        .pipe(
          tap((endereco) => {
            if (endereco) {
              this.cadastroForm.patchValue({
                logradouro: endereco.logradouro,
                bairro: endereco.bairro,
                uf: endereco.uf,
                cidade: endereco.cidade,
              });
              this.messages = [
                {
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: 'Endereço preenchido automaticamente.',
                },
              ];
            } else {
              this.messages = [
                {
                  severity: 'warn',
                  summary: 'Atenção',
                  detail: 'CEP não encontrado.',
                },
              ];
            }
          }),
          catchError((error) => {
            console.error('Erro ao buscar endereço por CEP', error);
            this.messages = [
              {
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível buscar o endereço.',
              },
            ];
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.messages = [
        { severity: 'error', summary: 'Erro', detail: 'Informe um CEP válido.' },
      ];
    }
  }

  onSubmit(): void {
    if (this.cadastroForm.valid) {
      const formValue = this.cadastroForm.value;
      const alunoData = {
        ...formValue,
        origemId: formValue.origem.id,
        cursoId: formValue.curso.id,
        semestreFormado: formValue.semestreFormado?.value,
        dataNasc: formValue.dataNasc.toISOString().split('T')[0], // Formatar data para YYYY-MM-DD
      };
      delete alunoData.origem; // Remover objetos aninhados para envio à API
      delete alunoData.curso;
      delete alunoData.semestreFormado;

      if (this.editMode && this.alunoId) {
        this.alunoService
          .updateAluno(this.alunoId, alunoData)
          .pipe(
            tap(() => {
              this.messages = [
                {
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: 'Dados do aluno atualizados com sucesso!',
                },
              ];
              this.router.navigate(['/busca-aluno']); // Redirecionar após sucesso
            }),
            catchError((error) => {
              console.error('Erro ao atualizar aluno', error);
              this.messages = [
                {
                  severity: 'error',
                  summary: 'Erro',
                  detail: 'Não foi possível atualizar os dados do aluno.',
                },
              ];
              return of(null);
            })
          )
          .subscribe();
      } else {
        this.alunoService
          .createAluno(alunoData)
          .pipe(
            tap(() => {
              this.messages = [
                {
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: 'Aluno cadastrado com sucesso!',
                },
              ];
              this.cadastroForm.reset(); // Limpar formulário
              this.router.navigate(['/busca-aluno']); // Redirecionar após sucesso
            }),
            catchError((error) => {
              console.error('Erro ao cadastrar aluno', error);
              this.messages = [
                {
                  severity: 'error',
                  summary: 'Erro',
                  detail: 'Não foi possível cadastrar o aluno.',
                },
              ];
              return of(null);
            })
          )
          .subscribe();
      }
    } else {
      this.messages = [
        {
          severity: 'error',
          summary: 'Erro de Validação',
          detail: 'Por favor, preencha todos os campos obrigatórios corretamente.',
        },
      ];
      this.cadastroForm.markAllAsTouched(); // Marca todos os campos como "touched" para exibir erros
    }
  }

  onCancel(): void {
    this.router.navigate(['/busca-aluno']);
  }

  onLogout(): void {
    // Implementar lógica de logout se necessário, ou redirecionar para tela de login
    this.router.navigate(['/login']);
  }
}
```

### `cadastro-aluno.component.html`
```html
<p-card class="smc-egr-card">
  <ng-template pTemplate="header">
    <div class="smc-egr-card-header">
      <h2 class="smc-egr-card-title">
        {{ editMode ? 'Editar Cadastro de Aluno' : 'Cadastro de Aluno' }}
      </h2>
      <p-messages [(value)]="messages" [enableService]="false"></p-messages>
    </div>
  </ng-template>
  <div class="smc-egr-form-container">
    <form [formGroup]="cadastroForm" (ngSubmit)="onSubmit()">
      <p-card class="smc-egr-subsection-card">
        <ng-template pTemplate="header">
          <h3 class="smc-egr-subsection-title">Dados Pessoais e Acadêmicos</h3>
        </ng-template>
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-12 p-md-6">
            <label for="nome" class="smc-egr-form-label">* Nome</label>
            <input
              id="nome"
              type="text"
              pInputText
              formControlName="nome"
              class="smc-egr-input"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('nome')?.invalid &&
                  cadastroForm.get('nome')?.touched
              }"
            />
            @if (cadastroForm.get('nome')?.hasError('required') && cadastroForm.get('nome')?.touched) {
              <small class="p-error">Nome é obrigatório.</small>
            }
            @if (cadastroForm.get('nome')?.hasError('invalidNome') && cadastroForm.get('nome')?.touched) {
              <small class="p-error">Nome contém caracteres inválidos.</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label for="dataNasc" class="smc-egr-form-label"
              >* Data de Nascimento</label
            >
            <p-calendar
              id="dataNasc"
              formControlName="dataNasc"
              dateFormat="dd/mm/yy"
              [showIcon]="true"
              class="smc-egr-calendar"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('dataNasc')?.invalid &&
                  cadastroForm.get('dataNasc')?.touched
              }"
            ></p-calendar>
            @if (cadastroForm.get('dataNasc')?.hasError('required') && cadastroForm.get('dataNasc')?.touched) {
              <small class="p-error">Data de Nascimento é obrigatória.</small>
            }
            @if (cadastroForm.get('dataNasc')?.hasError('invalidDate') && cadastroForm.get('dataNasc')?.touched) {
              <small class="p-error">Data de Nascimento inválida.</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label for="origem" class="smc-egr-form-label">* Origem</label>
            <p-dropdown
              id="origem"
              [options]="origens"
              formControlName="origem"
              optionLabel="nome"
              placeholder="Selecione uma Origem"
              class="smc-egr-dropdown"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('origem')?.invalid &&
                  cadastroForm.get('origem')?.touched
              }"
            ></p-dropdown>
            @if (cadastroForm.get('origem')?.hasError('required') && cadastroForm.get('origem')?.touched) {
              <small class="p-error">Origem é obrigatória.</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label for="curso" class="smc-egr-form-label">* Curso</label>
            <p-dropdown
              id="curso"
              [options]="cursos"
              formControlName="curso"
              optionLabel="nome"
              placeholder="Selecione um Curso"
              class="smc-egr-dropdown"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('curso')?.invalid &&
                  cadastroForm.get('curso')?.touched
              }"
            ></p-dropdown>
            @if (cadastroForm.get('curso')?.hasError('required') && cadastroForm.get('curso')?.touched) {
              <small class="p-error">Curso é obrigatório.</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label for="anoFormado" class="smc-egr-form-label"
              >* Ano de Formatura</label
            >
            <input
              id="anoFormado"
              type="text"
              pInputText
              formControlName="anoFormado"
              class="smc-egr-input"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('anoFormado')?.invalid &&
                  cadastroForm.get('anoFormado')?.touched
              }"
            />
            @if (cadastroForm.get('anoFormado')?.hasError('required') && cadastroForm.get('anoFormado')?.touched) {
              <small class="p-error">Ano de Formatura é obrigatório.</small>
            }
            @if (cadastroForm.get('anoFormado')?.hasError('pattern') && cadastroForm.get('anoFormado')?.touched) {
              <small class="p-error">Ano de Formatura deve ter 4 dígitos numéricos.</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label for="semestreFormado" class="smc-egr-form-label"
              >Semestre de Formatura</label
            >
            <p-dropdown
              id="semestreFormado"
              [options]="semestres"
              formControlName="semestreFormado"
              optionLabel="label"
              placeholder="Selecione um Semestre"
              class="smc-egr-dropdown"
            ></p-dropdown>
          </div>
        </div>
      </p-card>

      <p-card class="smc-egr-subsection-card smc-egr-mt-3">
        <ng-template pTemplate="header">
          <h3 class="smc-egr-subsection-title">Dados de Contato</h3>
        </ng-template>
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-12">
            <label for="email" class="smc-egr-form-label">* E-mail</label>
            <input
              id="email"
              type="email"
              pInputText
              formControlName="email"
              class="smc-egr-input"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('email')?.invalid &&
                  cadastroForm.get('email')?.touched
              }"
            />
            @if (cadastroForm.get('email')?.hasError('required') && cadastroForm.get('email')?.touched) {
              <small class="p-error">E-mail é obrigatório.</small>
            }
            @if (cadastroForm.get('email')?.hasError('email') && cadastroForm.get('email')?.touched) {
              <small class="p-error">E-mail inválido.</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label for="dddContato" class="smc-egr-form-label"
              >* Telefone Contato (DDD)</label
            >
            <input
              id="dddContato"
              type="text"
              pInputText
              formControlName="dddContato"
              maxlength="2"
              class="smc-egr-input smc-egr-input-ddd"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('dddContato')?.invalid &&
                  cadastroForm.get('dddContato')?.touched
              }"
            />
            @if (cadastroForm.get('dddContato')?.hasError('required') && cadastroForm.get('dddContato')?.touched) {
              <small class="p-error">DDD é obrigatório.</small>
            }
            @if (cadastroForm.get('dddContato')?.hasError('pattern') && cadastroForm.get('dddContato')?.touched) {
              <small class="p-error">DDD inválido (apenas 2 dígitos numéricos).</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label for="telContato" class="smc-egr-form-label"
              >* Telefone Contato (Número)</label
            >
            <p-inputMask
              id="telContato"
              formControlName="telContato"
              mask="99999-9999"
              class="smc-egr-input"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('telContato')?.invalid &&
                  cadastroForm.get('telContato')?.touched
              }"
            ></p-inputMask>
            @if (cadastroForm.get('telContato')?.hasError('required') && cadastroForm.get('telContato')?.touched) {
              <small class="p-error">Número de telefone é obrigatório.</small>
            }
            @if (cadastroForm.get('telContato')?.hasError('pattern') && cadastroForm.get('telContato')?.touched) {
              <small class="p-error">Número de telefone inválido (8 ou 9 dígitos).</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label for="dddCelular" class="smc-egr-form-label"
              >Telefone Celular (DDD)</label
            >
            <input
              id="dddCelular"
              type="text"
              pInputText
              formControlName="dddCelular"
              maxlength="2"
              class="smc-egr-input smc-egr-input-ddd"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('dddCelular')?.invalid &&
                  cadastroForm.get('dddCelular')?.touched
              }"
            />
            @if (cadastroForm.get('dddCelular')?.hasError('pattern') && cadastroForm.get('dddCelular')?.touched) {
              <small class="p-error">DDD inválido (apenas 2 dígitos numéricos).</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label for="telCelular" class="smc-egr-form-label"
              >Telefone Celular (Número)</label
            >
            <p-inputMask
              id="telCelular"
              formControlName="telCelular"
              mask="99999-9999"
              class="smc-egr-input"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('telCelular')?.invalid &&
                  cadastroForm.get('telCelular')?.touched
              }"
            ></p-inputMask>
            @if (cadastroForm.get('telCelular')?.hasError('pattern') && cadastroForm.get('telCelular')?.touched) {
              <small class="p-error">Número de celular inválido (8 ou 9 dígitos).</small>
            }
          </div>
        </div>
      </p-card>

      <p-card class="smc-egr-subsection-card smc-egr-mt-3">
        <ng-template pTemplate="header">
          <h3 class="smc-egr-subsection-title">Endereço</h3>
        </ng-template>
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-12 p-md-4">
            <label for="cep" class="smc-egr-form-label">* CEP</label>
            <div class="p-inputgroup">
              <p-inputMask
                id="cep"
                formControlName="cep"
                mask="99999-999"
                class="smc-egr-input"
                [ngClass]="{
                  'ng-invalid ng-dirty':
                    cadastroForm.get('cep')?.invalid &&
                    cadastroForm.get('cep')?.touched
                }"
              ></p-inputMask>
              <button
                type="button"
                pButton
                pRipple
                label="Buscar Endereço"
                (click)="buscarEnderecoPorCep()"
                class="p-button-secondary smc-egr-btn"
              ></button>
            </div>
            @if (cadastroForm.get('cep')?.hasError('required') && cadastroForm.get('cep')?.touched) {
              <small class="p-error">CEP é obrigatório.</small>
            }
            @if (cadastroForm.get('cep')?.hasError('pattern') && cadastroForm.get('cep')?.touched) {
              <small class="p-error">CEP inválido (formato 99999-999).</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-8">
            <label for="logradouro" class="smc-egr-form-label"
              >* Rua / Avenida</label
            >
            <input
              id="logradouro"
              type="text"
              pInputText
              formControlName="logradouro"
              class="smc-egr-input"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('logradouro')?.invalid &&
                  cadastroForm.get('logradouro')?.touched
              }"
            />
            @if (cadastroForm.get('logradouro')?.hasError('required') && cadastroForm.get('logradouro')?.touched) {
              <small class="p-error">Rua / Avenida é obrigatório.</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-4">
            <label for="numero" class="smc-egr-form-label">* Número</label>
            <input
              id="numero"
              type="text"
              pInputText
              formControlName="numero"
              class="smc-egr-input"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('numero')?.invalid &&
                  cadastroForm.get('numero')?.touched
              }"
            />
            @if (cadastroForm.get('numero')?.hasError('required') && cadastroForm.get('numero')?.touched) {
              <small class="p-error">Número é obrigatório.</small>
            }
            @if (cadastroForm.get('numero')?.hasError('pattern') && cadastroForm.get('numero')?.touched) {
              <small class="p-error">Número inválido (apenas dígitos numéricos).</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-8">
            <label for="bairro" class="smc-egr-form-label">* Bairro</label>
            <input
              id="bairro"
              type="text"
              pInputText
              formControlName="bairro"
              class="smc-egr-input"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('bairro')?.invalid &&
                  cadastroForm.get('bairro')?.touched
              }"
            />
            @if (cadastroForm.get('bairro')?.hasError('required') && cadastroForm.get('bairro')?.touched) {
              <small class="p-error">Bairro é obrigatório.</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label for="complemento" class="smc-egr-form-label"
              >Complemento</label
            >
            <input
              id="complemento"
              type="text"
              pInputText
              formControlName="complemento"
              class="smc-egr-input"
            />
          </div>
          <div class="p-field p-col-12 p-md-3">
            <label for="uf" class="smc-egr-form-label">* Estado (UF)</label>
            <input
              id="uf"
              type="text"
              pInputText
              formControlName="uf"
              maxlength="2"
              class="smc-egr-input smc-egr-input-uf"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('uf')?.invalid &&
                  cadastroForm.get('uf')?.touched
              }"
            />
            @if (cadastroForm.get('uf')?.hasError('required') && cadastroForm.get('uf')?.touched) {
              <small class="p-error">Estado é obrigatório.</small>
            }
          </div>
          <div class="p-field p-col-12 p-md-3">
            <label for="cidade" class="smc-egr-form-label">* Cidade</label>
            <input
              id="cidade"
              type="text"
              pInputText
              formControlName="cidade"
              class="smc-egr-input"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  cadastroForm.get('cidade')?.invalid &&
                  cadastroForm.get('cidade')?.touched
              }"
            />
            @if (cadastroForm.get('cidade')?.hasError('required') && cadastroForm.get('cidade')?.touched) {
              <small class="p-error">Cidade é obrigatória.</small>
            }
          </div>
        </div>
      </p-card>

      <p-card class="smc-egr-subsection-card smc-egr-mt-3">
        <ng-template pTemplate="header">
          <h3 class="smc-egr-subsection-title">Informações Profissionais</h3>
        </ng-template>
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-12">
            <label for="ocupacao" class="smc-egr-form-label"
              >Ocupação Atual</label
            >
            <input
              id="ocupacao"
              type="text"
              pInputText
              formControlName="ocupacao"
              class="smc-egr-input"
            />
          </div>
          <div class="p-field p-col-12">
            <label for="empresa" class="smc-egr-form-label"
              >Nome da Empresa</label
            >
            <input
              id="empresa"
              type="text"
              pInputText
              formControlName="empresa"
              class="smc-egr-input"
            />
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label for="dddComercial" class="smc-egr-form-label"
              >Telefone Comercial (DDD)</label
            >
            <input
              id="dddComercial"
              type="text"
              pInputText
              formControlName="dddComercial"
              maxlength="2"
              class="smc-egr-input smc-egr-input-ddd"
            />
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label for="telComercial" class="smc-egr-form-label"
              >Telefone Comercial (Número)</label
            >
            <p-inputMask
              id="telComercial"
              formControlName="telComercial"
              mask="9999-9999"
              class="smc-egr-input"
            ></p-inputMask>
          </div>
        </div>
      </p-card>

      <div class="smc-egr-form-actions smc-egr-mt-4">
        <p-button
          label="Cancelar"
          icon="pi pi-times"
          styleClass="p-button-secondary smc-egr-btn smc-egr-btn-cancel"
          (onClick)="onCancel()"
        ></p-button>
        <p-button
          label="{{ editMode ? 'Atualizar' : 'Cadastrar' }}"
          icon="pi pi-save"
          type="submit"
          styleClass="p-button-primary smc-egr-btn smc-egr-btn-submit"
          [disabled]="cadastroForm.invalid"
        ></p-button>
      </div>
    </form>
  </div>
</p-card>
```

### `cadastro-aluno.component.scss`
```scss
@import 'src/assets/styles/smc-egr-design-system.scss';

:host {
  display: block;
  padding: var(--smc-egr-spacing-4); // Exemplo de uso de token
}

.smc-egr-card {
  width: 100%;
  max-width: 900px;
  margin: var(--smc-egr-spacing-auto);
  box-shadow: var(--smc-egr-shadow-md);
  border-radius: var(--smc-egr-border-radius-lg);

  .smc-egr-card-header {
    padding: var(--smc-egr-spacing-3);
    background-color: var(--smc-egr-color-primary-dark);
    color: var(--smc-egr-color-white);
    border-top-left-radius: var(--smc-egr-border-radius-lg);
    border-top-right-radius: var(--smc-egr-border-radius-lg);
    text-align: center;
  }

  .smc-egr-card-title {
    font-size: var(--smc-egr-font-size-2xl);
    margin: var(--smc-egr-spacing-0);
  }

  .smc-egr-form-container {
    padding: var(--smc-egr-spacing-4);
  }

  .smc-egr-subsection-card {
    border: var(--smc-egr-border-width-xs) solid var(--smc-egr-color-gray-300);
    margin-bottom: var(--smc-egr-spacing-3);
    border-radius: var(--smc-egr-border-radius-md);

    .smc-egr-subsection-title {
      font-size: var(--smc-egr-font-size-xl);
      color: var(--smc-egr-color-primary);
      margin: var(--smc-egr-spacing-0);
      padding: var(--smc-egr-spacing-2) var(--smc-egr-spacing-3);
      background-color: var(--smc-egr-color-gray-100);
      border-bottom: var(--smc-egr-border-width-xs) solid var(--smc-egr-color-gray-300);
      border-top-left-radius: var(--smc-egr-border-radius-md);
      border-top-right-radius: var(--smc-egr-border-radius-md);
    }

    .p-card-content {
      padding: var(--smc-egr-spacing-3);
    }
  }

  .smc-egr-form-label {
    font-weight: var(--smc-egr-font-weight-medium);
    margin-bottom: var(--smc-egr-spacing-1);
    display: block;
    color: var(--smc-egr-color-text-dark);
  }

  .smc-egr-input {
    width: 100%;
    padding: var(--smc-egr-spacing-2);
    border: var(--smc-egr-border-width-xs) solid var(--smc-egr-color-gray-300);
    border-radius: var(--smc-egr-border-radius-sm);
    font-size: var(--smc-egr-font-size-base);
    transition: var(--smc-egr-transition-duration) ease-in-out;

    &:focus {
      border-color: var(--smc-egr-color-primary);
      box-shadow: var(--smc-egr-shadow-focus);
    }
  }

  .smc-egr-input-ddd,
  .smc-egr-input-uf {
    width: 60px; // Largura menor para DDD e UF
    flex-shrink: 0;
  }

  p-calendar,
  p-dropdown,
  p-inputmask {
    width: 100%;
    .p-calendar,
    .p-dropdown,
    .p-inputmask {
      width: 100%;
    }
  }

  .p-inputgroup {
    display: flex;
    .smc-egr-input {
      flex-grow: 1;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .p-button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      flex-shrink: 0;
    }
  }

  .smc-egr-btn {
    padding: var(--smc-egr-spacing-2) var(--smc-egr-spacing-3);
    border-radius: var(--smc-egr-border-radius-sm);
    font-size: var(--smc-egr-font-size-base);
    cursor: pointer;
    transition: var(--smc-egr-transition-duration) ease-in-out;

    &.p-button-primary {
      background-color: var(--smc-egr-color-primary);
      color: var(--smc-egr-color-white);
      border: var(--smc-egr-border-width-xs) solid var(--smc-egr-color-primary);

      &:hover {
        background-color: var(--smc-egr-color-primary-dark);
        border-color: var(--smc-egr-color-primary-dark);
      }
    }

    &.p-button-secondary {
      background-color: var(--smc-egr-color-gray-200);
      color: var(--smc-egr-color-text-dark);
      border: var(--smc-egr-border-width-xs) solid var(--smc-egr-color-gray-300);

      &:hover {
        background-color: var(--smc-egr-color-gray-300);
      }
    }

    &.smc-egr-btn-cancel {
      margin-right: var(--smc-egr-spacing-2);
    }
  }

  .smc-egr-form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: var(--smc-egr-spacing-3);
    border-top: var(--smc-egr-border-width-xs) solid var(--smc-egr-color-gray-200);
    margin-top: var(--smc-egr-spacing-4);
  }

  .smc-egr-mt-3 {
    margin-top: var(--smc-egr-spacing-3);
  }

  .smc-egr-mt-4 {
    margin-top: var(--smc-egr-spacing-4);
  }

  .p-error {
    color: var(--smc-egr-color-danger);
    font-size: var(--smc-egr-font-size-sm);
    margin-top: var(--smc-egr-spacing-1);
    display: block;
  }

  .ng-invalid.ng-dirty {
    border-color: var(--smc-egr-color-danger);
  }
}
```

### 3. Checklist de Implementação

*   [ ] Criar o arquivo `src/app/features/aluno/cadastro/cadastro-aluno.component.ts`.
*   [ ] Criar o arquivo `src/app/features/aluno/cadastro/cadastro-aluno.component.html`.
*   [ ] Criar o arquivo `src/app/features/aluno/cadastro/cadastro-aluno.component.scss`.
*   [ ] Adicionar a rota para `CadastroAlunoComponent` em `app.routes.ts`.
    *   `path: 'cadastro-aluno', loadComponent: () => import('./features/aluno/cadastro/cadastro-aluno.component').then(m => m.CadastroAlunoComponent)`
    *   Considerar rota com parâmetro `id` para edição: `path: 'cadastro-aluno/:id', ...`
*   [ ] Implementar o `AlunoService` para lidar com as chamadas de API (buscar por CEP, criar/atualizar aluno, buscar aluno por ID, buscar origens e cursos).
*   [ ] Atualizar `db.json` com dados mockados para `origens`, `cursos` e uma estrutura para `alunos`.
*   [ ] Testar as validações de formulário.
*   [ ] Testar a funcionalidade de busca de endereço por CEP.
*   [ ] Testar o fluxo de cadastro e edição de aluno.
*   [ ] Testar o cancelamento e redirecionamento para a tela de busca.

---

**PARE E PERGUNTE:** "A documentação, o código proposto e o checklist refletem o esperado? Podemos prosseguir?"
