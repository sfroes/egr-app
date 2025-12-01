import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { JsonPipe } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';

// App Services
import { AlunoService } from '../../../core/services/aluno.service';
import { Origem, Curso, Aluno } from '../../../core/models/aluno.model';

@Component({
  selector: 'smc-egr-busca-aluno',
  standalone: true,
  imports: [
    FormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    InputMaskModule,
    ButtonModule,
  ],
  templateUrl: './busca-aluno.component.html',
  styleUrls: ['./busca-aluno.component.scss'],
})
export class BuscaAlunoComponent {
  private router = inject(Router);
  private alunoService = inject(AlunoService);

  // Form Signals
  nome = signal('');
  dataNascimento = signal<string>('');
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

  // Loading and Error States
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.loadOrigens();
  }

  loadOrigens() {
    this.alunoService.getOrigens().subscribe((data) => this.origens.set(data));
  }

  onOrigemChange(): void {
    this.selectedCurso.set(null); // Reset curso selection
    const origem = this.selectedOrigem();
    if (origem) {
      this.alunoService.getCursos(origem.id).subscribe((data) =>
        this.cursos.set(data)
      );
    } else {
      this.cursos.set([]); // Clear cursos if origem is cleared
    }
  }

  buscarAluno(): void {
    if (this.isFormInvalid()) {
      this.errorMessage.set('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    // Converter data de dd/mm/aaaa para Date
    const dataNascimentoDate = this.converterDataParaDate(this.dataNascimento());

    const formValue = {
      nome: this.nome(),
      dataNascimento: dataNascimentoDate,
      origem: this.selectedOrigem(),
      curso: this.selectedCurso(),
    };

    console.log('Buscando aluno com os dados:', formValue);

    // NOVO FLUXO: Buscar aluno no backend
    this.alunoService.buscarAluno(formValue).subscribe({
      next: (alunos) => {
        this.isLoading.set(false);

        if (alunos && alunos.length > 0) {
          // Cenário: Aluno encontrado
          const aluno = alunos[0];
          console.log('Aluno encontrado:', aluno);

          // Verificar se existe user relacionado
          this.verificarUserERedireionar(aluno);
        } else {
          // Cenário 1A: Aluno NÃO encontrado
          console.log('Aluno não encontrado no sistema');
          this.errorMessage.set('Aluno não encontrado no sistema. Verifique os dados e tente novamente.');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Erro ao buscar aluno:', error);
        this.errorMessage.set('Erro ao buscar aluno. Tente novamente.');
      }
    });
  }

  /**
   * Verifica se o aluno tem user cadastrado e redireciona para o destino apropriado
   */
  private verificarUserERedireionar(aluno: Aluno): void {
    this.alunoService.verificarUserExiste(aluno.id).subscribe({
      next: (userExiste) => {
        if (userExiste) {
          // Cenário 1B: User existe - redirecionar para login
          console.log('User já cadastrado. Redirecionando para login...');
          this.router.navigate(['/login'], {
            state: {
              mensagem: 'Por favor, faça login para continuar',
              alunoNome: aluno.nome
            }
          });
        } else {
          // Cenário 1C: User não existe - redirecionar para cadastro
          console.log('User não cadastrado. Redirecionando para cadastro...');
          this.router.navigate(['/cadastro-aluno'], {
            state: { aluno }
          });
        }
      },
      error: (error) => {
        console.error('Erro ao verificar user:', error);
        this.errorMessage.set('Erro ao verificar cadastro. Tente novamente.');
      }
    });
  }

  /**
   * Converte data de dd/mm/aaaa para Date
   */
  private converterDataParaDate(dataString: string): Date | null {
    if (!dataString || dataString.length !== 10) {
      return null;
    }

    const [dia, mes, ano] = dataString.split('/').map(Number);

    if (!dia || !mes || !ano) {
      return null;
    }

    return new Date(ano, mes - 1, dia);
  }
}
