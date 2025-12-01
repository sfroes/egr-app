import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
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

    // NOVO FLUXO: Verificar se há aluno vindo da navegação
    this.checkNavigationState();

    this.checkRouteForEditMode();

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
        dddContato: [''],
        telContato: [''],
        dddCelular: ['', Validators.required],
        telCelular: ['', Validators.required]
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
        dddComercial: [''],
        telComercial: ['']
      })
    });
  }

  /**
   * NOVO: Verificar se há aluno vindo da navegação (da busca)
   */
  private checkNavigationState(): void {
    // Usar history.state ao invés de getCurrentNavigation()
    const state = history.state;

    console.log('Estado da navegação:', state);

    if (state && state['aluno']) {
      this.alunoPreenchido = state['aluno'];
      console.log('Aluno recebido da busca:', this.alunoPreenchido);

      // Aguardar carregamento dos dropdowns antes de preencher
      setTimeout(() => {
        if (this.alunoPreenchido) {
          this.populateFormFromAluno(this.alunoPreenchido);
        }
      }, 1000); // Aumentar tempo para garantir que dropdowns estejam carregados
    } else {
      console.log('Nenhum aluno recebido da navegação');
    }
  }

  /**
   * NOVO: Preenche o formulário com dados do aluno da busca
   */
  private populateFormFromAluno(aluno: Aluno): void {
    console.log('Iniciando preenchimento do formulário com aluno:', aluno);
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
            dataNasc: aluno.dataNasc,
          },
          formacao: {
            origem: origemEncontrada,
            curso: cursoEncontrado,
            anoFormado: aluno.anoFormado,
            semestreFormado: semestreEncontrado,
          },
          contato: {
            email: aluno.email,
            dddContato: aluno.dddContato || '',
            telContato: aluno.telContato || '',
            dddCelular: aluno.dddCelular || '',
            telCelular: aluno.telCelular || '',
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
            dddComercial: aluno.dddComercial || '',
            telComercial: aluno.telComercial || '',
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
          numeroAcademico: this.gerarNumeroAcademico(),
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
      dataNasc: formValue.pessoal.dataNasc,
      origemId: formValue.formacao.origem.id,
      cursoId: formValue.formacao.curso.id,
      anoFormado: formValue.formacao.anoFormado,
      semestreFormado: formValue.formacao.semestreFormado.id,
      email: formValue.contato.email,
      dddContato: formValue.contato.dddContato,
      telContato: formValue.contato.telContato,
      dddCelular: formValue.contato.dddCelular,
      telCelular: formValue.contato.telCelular,
      cep: formValue.endereco.cep,
      logradouro: formValue.endereco.logradouro,
      numero: formValue.endereco.numero,
      bairro: formValue.endereco.bairro,
      complemento: formValue.endereco.complemento,
      uf: formValue.endereco.uf,
      cidade: formValue.endereco.cidade,
      ocupacao: formValue.profissional.ocupacao,
      empresa: formValue.profissional.empresa,
      dddComercial: formValue.profissional.dddComercial,
      telComercial: formValue.profissional.telComercial,
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
            dataNasc: new Date(aluno.dataNasc), // Converter string para Date
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
            dddContato: aluno.dddContato,
            telContato: aluno.telContato,
            dddCelular: aluno.dddCelular,
            telCelular: aluno.telCelular,
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
            dddComercial: aluno.dddComercial,
            telComercial: aluno.telComercial,
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

  cancelar(): void {
    this.router.navigate(['/busca-aluno']);
  }
}
