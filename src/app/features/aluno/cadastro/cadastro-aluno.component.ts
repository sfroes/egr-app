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
