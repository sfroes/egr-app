import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AuthService, DropdownOption } from '../../../core/services/auth.service';

// --- Validação de Data ---
function isLeapYear(year: number): boolean {
  return ((year % 4 === 0) && (year % 100 !== 0)) || ((year % 400 === 0));
}

function containsOnlyDigits(value: string): boolean {
  if (!value) return false;
  return /^\d+$/.test(value);
}

export const dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value;
  if (!value) {
    return null; // Handled by Validators.required
  }
  if (value.includes('_') || value.length !== 10) {
    return { 'invalidDate': 'Formato da data é inválido.' };
  }
  const [dayStr, monthStr, yearStr] = value.split('/');
  if (!containsOnlyDigits(dayStr) || !containsOnlyDigits(monthStr) || !containsOnlyDigits(yearStr)) {
    return { 'invalidDate': 'Data deve conter apenas números.' };
  }
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  if (isNaN(day) || isNaN(month) || isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
    return { 'invalidDate': 'Data fora do intervalo permitido.' };
  }
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
    return { 'invalidDate': 'Dia ou mês inválido.' };
  }
  return null;
};
// -------------------------


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
      nome: ['', Validators.required],
      numeroAcademico: [''],
      dataNascimento: ['', [Validators.required, dateValidator]],
      cursoId: ['', Validators.required],
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