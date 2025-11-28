import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlunoService } from '../../../core/services/aluno.service';
import { Aluno, Curso, Endereco, Origem } from '../../../core/models/aluno.model';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { MessageService } from 'primeng/api';

interface Semestre {
  label: string;
  value: number;
}

@Component({
  selector: 'app-cadastro-aluno',
  template: `<!-- O HTML do seu componente vai aqui -->`,
  styleUrls: ['./cadastro-aluno.component.scss'],
  providers: [MessageService] // Adicionado para o serviço de mensagens do PrimeNG
})
export class CadastroAlunoComponent implements OnInit {
  alunoForm!: FormGroup;
  isEditMode = false;
  alunoId: number | null = null;

  origens: Origem[] = [];
  cursos: Curso[] = [];
  semestres: Semestre[] = [
    { label: '1º Semestre', value: 1 },
    { label: '2º Semestre', value: 2 }
  ];

  constructor(
    private fb: FormBuilder,
    private alunoService: AlunoService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadOrigens();
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
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Formulário inválido. Verifique os campos.' });
      return;
    }

    // Lógica para salvar ou atualizar
    const alunoData = this.prepareSaveData();

    if (this.isEditMode && this.alunoId) {
      this.alunoService.updateAluno(this.alunoId, alunoData).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aluno atualizado com sucesso!' });
        this.router.navigate(['/alunos']); // Navegar para a lista
      });
    } else {
      this.alunoService.createAluno(alunoData).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aluno cadastrado com sucesso!' });
        this.router.navigate(['/alunos']); // Navegar para a lista
      });
    }
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
      semestreFormado: formValue.formacao.semestreFormado.value,
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
            curso: this.cursos.find((c) => c.id === aluno.cursoId),
            anoFormado: aluno.anoFormado,
            semestreFormado: this.semestres.find(
              (s) => s.value === +aluno.semestreFormado
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
    this.router.navigate(['/alunos']); // Ou para a rota que fizer mais sentido
  }
}