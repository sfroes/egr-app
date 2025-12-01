import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, forkJoin, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { StepsModule } from 'primeng/steps';

// App Services and Models
import { AlunoService } from '../../../core/services/aluno.service';
import { AuthService } from '../../../core/services/auth.service';
import { Aluno, Curso, Endereco, Origem } from '../../../core/models/aluno.model';
import { DropdownOption } from '../../../core/services/auth.service';

@Component({
  selector: 'smc-egr-cadastro-aluno',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    InputMaskModule,
    StepsModule,
  ],
  templateUrl: './cadastro-aluno.component.html',
  styleUrls: ['./cadastro-aluno.component.scss'],
})
export class CadastroAlunoComponent implements OnInit {
  alunoForm!: FormGroup;
  isEditMode = false;
  alunoId: number | null = null;
  alunoPreenchido: Aluno | null = null; // Aluno vindo da busca
  isLoading = false;

  origens: Origem[] = [];
  cursos: Curso[] = [];
  semestres: DropdownOption[] = [];

  private fb = inject(FormBuilder);
  private alunoService = inject(AlunoService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.initForm();
    this.loadOrigens();
    this.loadSemestres();

    this.initializeComponentData();

    // Observa mudanças no campo 'origem' para carregar os cursos
    this.alunoForm.get('formacao.origem')?.valueChanges.subscribe((origem: Origem) => {
      this.alunoForm.get('formacao.curso')?.reset();
      if (origem && origem.id) {
        this.loadCursos(origem.id);
      } else {
        this.cursos = [];
      }
    });
  }

  private initForm(): void {
    this.alunoForm = this.fb.group({
      // Dados Pessoais
      pessoal: this.fb.group({
        nome: ['', Validators.required],
        dataNasc: ['', Validators.required]
      }),
      // Formação
      formacao: this.fb.group({
        origem: [null, Validators.required],
        curso: [null, Validators.required],
        anoFormado: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
        semestreFormado: [null, Validators.required]
      }),
      // Contato
      contato: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        telContato: [''], // Campo unificado
        telCelular: ['', Validators.required] // Campo unificado
      }),
      // Endereço
      endereco: this.fb.group({
        cep: ['', Validators.required],
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        bairro: ['', Validators.required],
        complemento: [''],
        uf: ['', Validators.required],
        cidade: ['', Validators.required]
      }),
      // Profissional
      profissional: this.fb.group({
        ocupacao: [''],
        empresa: [''],
        telComercial: [''] // Campo unificado
      })
    });
  }

  /**
   * NOVO: Verifica o modo de operação (edição ou novo cadastro vindo da busca)
   * e carrega os dados necessários de forma segura.
   */
  private initializeComponentData(): void {
    const state = history.state; // Captura o estado da navegação

    // Verifica se estamos no fluxo de cadastro vindo da busca (Cenário 1C)
    if (state && state.aluno) {
      this.alunoPreenchido = state.aluno;
      console.log('Aluno recebido da busca:', this.alunoPreenchido);

      // Garante que origens e semestres estejam carregados antes de popular o form
      forkJoin({
        origens: this.alunoService.getOrigens(),
        semestres: this.alunoService.getSemestres()
      }).subscribe(({ origens, semestres }) => {
        this.origens = origens;
        this.semestres = semestres;
        if (this.alunoPreenchido) {
          this.populateFormFromAluno(this.alunoPreenchido);
        }
      });
    } else {
      // Se não veio da busca, verifica se é modo de edição pela URL
      this.checkRouteForEditMode();
    }
  }

  /**
   * NOVO: Preenche o formulário com dados do aluno da busca
   */
  private populateFormFromAluno(aluno: Aluno): void {
    console.log('Iniciando preenchimento do formulário com aluno:', aluno);
    console.log('Telefones do aluno:', {
      'dddContato': aluno.dddContato,
      'telContato': aluno.telContato,
      'dddCelular': aluno.dddCelular,
      'telCelular': aluno.telCelular,
      'dddComercial': aluno.dddComercial,
      'telComercial': aluno.telComercial
    });
    console.log('Origens disponíveis:', this.origens);
    console.log('Semestres disponíveis:', this.semestres);

    // Carrega os cursos da origem do aluno
    if (aluno.origemId) {
      console.log('Carregando cursos para origem ID:', aluno.origemId);

      this.alunoService.getCursos(aluno.origemId).pipe(
        tap(cursos => {
          this.cursos = cursos;
          console.log('Cursos carregados:', this.cursos);
        })
      ).subscribe(() => {
        // Encontrar objetos correspondentes nos dropdowns
        const origemEncontrada = this.origens.find((o) => o.id == aluno.origemId);
        const cursoEncontrado = this.cursos.find((c) => c.id == aluno.cursoId);
        const semestreEncontrado = this.semestres.find((s) => s.id === aluno.semestreFormado || s.id === aluno.semestreFormado?.toString());

        console.log('Mapeamento de dados:', {
          origemEncontrada,
          cursoEncontrado,
          semestreEncontrado,
          'aluno.origemId': aluno.origemId,
          'aluno.cursoId': aluno.cursoId,
          'aluno.semestreFormado': aluno.semestreFormado
        });

        this.alunoForm.patchValue({
          pessoal: {
            nome: aluno.nome,
            dataNasc: this.converterDataParaDDMMYYYY(aluno.dataNasc),
          },
          formacao: {
            origem: origemEncontrada,
            curso: cursoEncontrado,
            anoFormado: aluno.anoFormado,
            semestreFormado: semestreEncontrado,
          },
          contato: {
            email: aluno.email,
            telContato: this.formatarTelefone(aluno.dddContato, aluno.telContato),
            telCelular: this.formatarTelefone(aluno.dddCelular, aluno.telCelular),
          },
          endereco: {
            cep: aluno.cep,
            logradouro: aluno.logradouro,
            numero: aluno.numero,
            bairro: aluno.bairro,
            complemento: aluno.complemento || '',
            uf: aluno.uf,
            cidade: aluno.cidade,
          },
          profissional: {
            ocupacao: aluno.ocupacao || '',
            empresa: aluno.empresa || '',
            telComercial: this.formatarTelefone(aluno.dddComercial, aluno.telComercial),
          }
        });

        console.log('Formulário preenchido com valores:', this.alunoForm.value);

        this.messageService.add({
          severity: 'info',
          summary: 'Informação',
          detail: 'Dados preenchidos automaticamente. Complete as informações e salve.'
        });
      });
    } else {
      console.warn('Aluno sem origemId:', aluno);
    }
  }

  private checkRouteForEditMode(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode = true;
          this.alunoId = +id;
          return this.alunoService.getAlunoById(this.alunoId);
        }
        return of(null);
      })
    ).subscribe(aluno => {
      if (aluno) {
        this.populateForm(aluno);
      }
    });
  }

  private loadOrigens(): void {
    this.alunoService.getOrigens().subscribe(data => {
      this.origens = data;
    });
  }

  private loadSemestres(): void {
    this.alunoService.getSemestres().subscribe(data => {
      this.semestres = data;
    });
  }

  private loadCursos(origemId: number): void {
    this.alunoService.getCursos(origemId).subscribe(data => {
      this.cursos = data;
    });
  }

  buscarCep(): void {
    const cep = this.alunoForm.get('endereco.cep')?.value;
    if (cep && cep.length === 8) {
      this.alunoService.getEnderecoByCep(cep).subscribe(endereco => {
        if (endereco) {
          this.patchEndereco(endereco);
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'CEP não encontrado.' });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.alunoForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Formulário inválido. Verifique os campos.'
      });
      this.alunoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const alunoData = this.prepareSaveData();

    if (this.isEditMode && this.alunoId) {
      // Modo de edição (rota com ID)
      this.alunoService.updateAluno(this.alunoId, alunoData).subscribe(() => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Aluno atualizado com sucesso!'
        });
        this.router.navigate(['/busca-aluno']);
      });
    } else {
      // NOVO FLUXO: Criar/atualizar aluno E criar user
      this.salvarAlunoECriarUser(alunoData);
    }
  }

  /**
   * NOVO: Salva/atualiza aluno e cria user na tabela users
   */
  private salvarAlunoECriarUser(alunoData: any): void {
    // Determinar se é update ou create
    const alunoObservable = this.alunoPreenchido?.id
      ? this.alunoService.updateAluno(this.alunoPreenchido.id, alunoData)
      : this.alunoService.createAluno(alunoData);

    alunoObservable.pipe(
      switchMap((aluno: Aluno) => {
        console.log('Aluno salvo:', aluno);

        // Criar user na tabela users
        const userData = {
          alunoId: aluno.id,
          nome: aluno.nome,
          numeroAcademico: this.gerarNumeroAcademico(), // Corrigido: chamada de método
          dataNascimento: this.formatarDataParaUser(aluno.dataNasc),
          cursoId: aluno.cursoId.toString(),
          anoUltimaMatricula: aluno.anoFormado.toString(),
          semestreUltimaMatriculaId: aluno.semestreFormado.toString(),
          turnoId: 'N' // Padrão noturno
        };

        console.log('Criando user:', userData);
        return this.authService.criarUser(userData);
      }),
      catchError(error => {
        console.error('Erro ao criar user:', error);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao salvar cadastro. Tente novamente.'
        });
        return EMPTY;
      })
    ).subscribe({
      next: (user) => {
        this.isLoading = false;
        console.log('User criado com sucesso:', user);

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cadastro realizado com sucesso!'
        });

        // Redirecionar para login após 1.5 segundos
        setTimeout(() => {
          this.router.navigate(['/login'], {
            state: {
              mensagem: 'Cadastro realizado! Por favor, faça login para acessar o questionário.'
            }
          });
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro no fluxo de cadastro:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao salvar cadastro. Tente novamente.'
        });
      }
    });
  }

  /**
   * Gera número acadêmico único baseado em timestamp
   */
  private gerarNumeroAcademico(): string {
    return `${Date.now()}`;
  }

  /**
   * Formata data para o formato esperado pela tabela users
   */
  /**
   * Formata telefone no formato (99) 9999-9999 ou (99) 99999-9999
   * @param ddd DDD do telefone (ex: "21")
   * @param telefone Número do telefone (ex: "987654321")
   * @returns Telefone formatado (ex: "(21) 98765-4321")
   */
  private formatarTelefone(ddd?: string, telefone?: string): string {
    if (!ddd && !telefone) {
      return '';
    }

    const dddLimpo = (ddd || '').replace(/\D/g, '');
    const telLimpo = (telefone || '').replace(/\D/g, '');

    if (!telLimpo) {
      return '';
    }

    let resultado = '';

    // Se o telefone tiver 9 dígitos, é celular: (99) 99999-9999
    if (telLimpo.length === 9) {
      if (dddLimpo) {
        resultado = `(${dddLimpo}) ${telLimpo.substring(0, 5)}-${telLimpo.substring(5)}`;
      } else {
        // Sem DDD, retorna apenas o número formatado
        resultado = `${telLimpo.substring(0, 5)}-${telLimpo.substring(5)}`;
      }
    }
    // Se tiver 8 dígitos, é fixo: (99) 9999-9999
    else if (telLimpo.length === 8) {
      if (dddLimpo) {
        resultado = `(${dddLimpo}) ${telLimpo.substring(0, 4)}-${telLimpo.substring(4)}`;
      } else {
        // Sem DDD, retorna apenas o número formatado
        resultado = `${telLimpo.substring(0, 4)}-${telLimpo.substring(4)}`;
      }
    }
    // Caso contrário, retorna como está
    else {
      if (dddLimpo) {
        resultado = `(${dddLimpo}) ${telLimpo}`;
      } else {
        resultado = telLimpo;
      }
    }

    return resultado;
  }

  private formatarDataParaUser(data: any): string {
    if (typeof data === 'string') {
      // Se já está em formato string (YYYY-MM-DD), converter para DD/MM/YYYY
      if (data.includes('-')) {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
      }
      return data;
    }

    // Se é Date object
    if (data instanceof Date) {
      const dia = data.getDate().toString().padStart(2, '0');
      const mes = (data.getMonth() + 1).toString().padStart(2, '0');
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }

    return '';
  }

  private prepareSaveData(): any {
    // Mapeia os dados do formulário para o formato esperado pela API
    const formValue = this.alunoForm.getRawValue();
    return {
      nome: formValue.pessoal.nome,
      dataNasc: this.converterDataParaYYYYMMDD(formValue.pessoal.dataNasc),
      origemId: formValue.formacao.origem.id,
      cursoId: formValue.formacao.curso.id,
      anoFormado: formValue.formacao.anoFormado,
      semestreFormado: formValue.formacao.semestreFormado.id,
      email: formValue.contato.email,
      telContato: formValue.contato.telContato,
      telCelular: formValue.contato.telCelular,
      cep: formValue.endereco.cep,
      logradouro: formValue.endereco.logradouro,
      numero: formValue.endereco.numero,
      bairro: formValue.endereco.bairro,
      cidade: formValue.endereco.cidade,
      uf: formValue.endereco.uf,
      complemento: formValue.endereco.complemento,
      ocupacao: formValue.profissional.ocupacao,
      empresa: formValue.profissional.empresa,
      telComercial: formValue.profissional.telComercial,
      // Manter a estrutura original com ddd/telefone separado para a API mock
      dddContato: formValue.contato.telContato.substring(1, 3),
      dddCelular: formValue.contato.telCelular.substring(1, 3),
      dddComercial: formValue.profissional.telComercial.substring(1, 3)
    };
  }

  private populateForm(aluno: Aluno): void {
    // Carrega os cursos primeiro, depois preenche o formulário
    if (aluno.origemId) {
      this.alunoService.getCursos(aluno.origemId).pipe(
        tap(cursos => this.cursos = cursos)
      ).subscribe(() => {
        this.alunoForm.patchValue({
          pessoal: {
            nome: aluno.nome,
            dataNasc: this.converterDataParaDDMMYYYY(aluno.dataNasc),
          },
          formacao: {
            origem: this.origens.find((o) => o.id === aluno.origemId),
            curso: this.cursos.find((c) => c.id == aluno.cursoId), // Use '==' para comparação de tipo flexível
            anoFormado: aluno.anoFormado,
            semestreFormado: this.semestres.find(
              (s) => s.id === aluno.semestreFormado
            ),
          },
          contato: {
            email: aluno.email,
            telContato: this.formatarTelefone(aluno.dddContato, aluno.telContato),
            telCelular: this.formatarTelefone(aluno.dddCelular, aluno.telCelular),
          },
          endereco: {
            cep: aluno.cep,
            logradouro: aluno.logradouro,
            numero: aluno.numero,
            bairro: aluno.bairro,
            complemento: aluno.complemento,
            uf: aluno.uf,
            cidade: aluno.cidade,
          },
          profissional: {
            ocupacao: aluno.ocupacao,
            empresa: aluno.empresa,
            telComercial: this.formatarTelefone(aluno.dddComercial, aluno.telComercial),
          }
        });
      });
    }
  }

  private patchEndereco(endereco: Endereco): void {
    this.alunoForm.get('endereco')?.patchValue({
      logradouro: endereco.logradouro,
      bairro: endereco.bairro,
      uf: endereco.uf,
      cidade: endereco.cidade,
    });
  }

  /**
   * Converte data de YYYY-MM-DD para DD/MM/YYYY
   */
  private converterDataParaDDMMYYYY(dataString: string): string {
    if (!dataString) {
      return '';
    }

    // Formato: YYYY-MM-DD (ex: "1972-02-19")
    const [ano, mes, dia] = dataString.split('-');

    if (!ano || !mes || !dia) {
      return '';
    }

    // Retorna no formato DD/MM/YYYY
    return `${dia}/${mes}/${ano}`;
  }

  /**
   * Converte data de DD/MM/YYYY para YYYY-MM-DD
   */
  private converterDataParaYYYYMMDD(dataString: string): string {
    if (!dataString) {
      return '';
    }

    // Formato: DD/MM/YYYY (ex: "19/02/1972")
    const [dia, mes, ano] = dataString.split('/');

    if (!dia || !mes || !ano) {
      return '';
    }

    // Retorna no formato YYYY-MM-DD
    return `${ano}-${mes}-${dia}`;
  }

  cancelar(): void {
    this.router.navigate(['/busca-aluno']);
  }
}
