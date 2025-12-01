import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { QuestionarioService } from '../../core/services/questionario.service';
import { AlunoService } from '../../core/services/aluno.service';
import {
  Questionario,
  Questao,
  QuestionarioResposta,
  Resposta
} from '../../core/models/questionario.model';

@Component({
  selector: 'app-questionario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    RadioButtonModule,
    CheckboxModule,
    InputTextModule,
    ProgressSpinnerModule
  ],
  templateUrl: './questionario.component.html',
  styleUrl: './questionario.component.scss'
})
export class QuestionarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private questionarioService = inject(QuestionarioService);
  private alunoService = inject(AlunoService);
  private messageService = inject(MessageService);

  // Signals para gerenciar estado
  questionario = signal<Questionario | null>(null);
  alunoNome = signal<string>('');
  carregando = signal<boolean>(true);
  salvando = signal<boolean>(false);

  questionarioForm!: FormGroup;
  alunoId: string = '';

  ngOnInit(): void {
    // Buscar ID do aluno da rota
    this.alunoId = this.route.snapshot.queryParams['alunoId'];

    if (!this.alunoId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'ID do aluno não encontrado. Redirecionando para busca...'
      });
      this.router.navigate(['/aluno/busca']);
      return;
    }

    // Carregar dados
    this.carregarDados();
  }

  private carregarDados(): void {
    this.carregando.set(true);

    // Carregar estrutura do questionário e dados do aluno
    this.questionarioService.getQuestionario().subscribe({
      next: (quest) => {
        this.questionario.set(quest);
        this.construirFormulario(quest.questoes);
        this.carregarDadosAluno();
      },
      error: (error) => {
        console.error('Erro ao carregar questionário:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar o questionário'
        });
        this.carregando.set(false);
      }
    });
  }

  private carregarDadosAluno(): void {
    this.alunoService.getAlunoPorId(this.alunoId).subscribe({
      next: (aluno) => {
        this.alunoNome.set(aluno.nome);
        this.carregando.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar dados do aluno:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os dados do aluno'
        });
        this.carregando.set(false);
      }
    });
  }

  private construirFormulario(questoes: Questao[]): void {
    const formControls: any = {};

    questoes.forEach((questao) => {
      const validators = questao.obrigatoria ? [Validators.required] : [];

      if (questao.tipo === 'radio') {
        formControls[`q${questao.id}`] = [null, validators];
      } else if (questao.tipo === 'textarea') {
        formControls[`q${questao.id}`] = ['', validators];
      } else if (questao.tipo === 'checkbox-with-text') {
        // Para cada opção de checkbox, criar um control
        questao.opcoes?.forEach((opcao) => {
          formControls[`q${questao.id}_${opcao.id}`] = [false];
          if (opcao.permiteCampoTexto) {
            formControls[`q${questao.id}_${opcao.id}_texto`] = [''];
          }
        });
      }
    });

    this.questionarioForm = this.fb.group(formControls);
  }

  onSubmit(): void {
    if (this.questionarioForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Por favor, preencha todos os campos obrigatórios'
      });
      return;
    }

    this.salvando.set(true);

    const respostas: Resposta[] = this.construirRespostas();

    const questionarioResposta: QuestionarioResposta = {
      alunoId: this.alunoId,
      alunoNome: this.alunoNome(),
      dataPreenchimento: new Date(),
      respostas: respostas
    };

    this.questionarioService.salvarResposta(questionarioResposta).subscribe({
      next: (resposta) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Questionário enviado com sucesso!'
        });
        this.salvando.set(false);
        // Redirecionar para página de confirmação ou busca
        setTimeout(() => {
          this.router.navigate(['/aluno/busca']);
        }, 2000);
      },
      error: (error) => {
        console.error('Erro ao salvar questionário:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível salvar o questionário. Tente novamente.'
        });
        this.salvando.set(false);
      }
    });
  }

  private construirRespostas(): Resposta[] {
    const respostas: Resposta[] = [];
    const formValue = this.questionarioForm.value;
    const questoes = this.questionario()?.questoes || [];

    questoes.forEach((questao) => {
      if (questao.tipo === 'radio' || questao.tipo === 'textarea') {
        const valor = formValue[`q${questao.id}`];
        if (valor) {
          respostas.push({
            questaoId: questao.id,
            opcaoId: questao.tipo === 'radio' ? valor : undefined,
            textoResposta: questao.tipo === 'textarea' ? valor : undefined
          });
        }
      } else if (questao.tipo === 'checkbox-with-text') {
        const multiplas: { opcaoId: string; textoAdicional?: string }[] = [];

        questao.opcoes?.forEach((opcao) => {
          const checked = formValue[`q${questao.id}_${opcao.id}`];
          if (checked) {
            const item: { opcaoId: string; textoAdicional?: string } = {
              opcaoId: opcao.id
            };

            if (opcao.permiteCampoTexto) {
              const texto = formValue[`q${questao.id}_${opcao.id}_texto`];
              if (texto) {
                item.textoAdicional = texto;
              }
            }

            multiplas.push(item);
          }
        });

        if (multiplas.length > 0) {
          respostas.push({
            questaoId: questao.id,
            multiplas: multiplas
          });
        }
      }
    });

    return respostas;
  }

  cancelar(): void {
    this.router.navigate(['/aluno/busca']);
  }

  /**
   * Helper para verificar se um checkbox está marcado
   */
  isCheckboxChecked(questaoId: string, opcaoId: string): boolean {
    return this.questionarioForm.get(`q${questaoId}_${opcaoId}`)?.value || false;
  }

  /**
   * Helper para habilitar/desabilitar campo de texto quando checkbox é marcado
   */
  onCheckboxChange(questaoId: string, opcaoId: string, permiteCampoTexto: boolean): void {
    if (permiteCampoTexto) {
      const checkboxControl = this.questionarioForm.get(`q${questaoId}_${opcaoId}`);
      const textoControl = this.questionarioForm.get(`q${questaoId}_${opcaoId}_texto`);

      if (checkboxControl && textoControl) {
        if (checkboxControl.value) {
          textoControl.enable();
        } else {
          textoControl.disable();
          textoControl.setValue('');
        }
      }
    }
  }
}
