import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { JsonPipe } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';

// App Services
import { AlunoService } from '../../../core/services/aluno.service';
import { Origem, Curso } from '../../../core/models/aluno.model';

@Component({
  selector: 'smc-egr-busca-aluno',
  standalone: true,
  imports: [
    FormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
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
