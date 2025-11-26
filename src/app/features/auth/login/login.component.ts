import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';

// Services
import { AuthService } from '../../../core/services/auth.service';

// Helper functions for date validation
function isLeapYear(year: number): boolean {
  return ((year % 4 === 0) && (year % 100 !== 0)) || ((year % 400 === 0));
}

function containsOnlyDigits(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const char = value.charAt(i);
    if (char < '0' || char > '9') {
      return false;
    }
  }
  return true;
}

export const dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value;

  if (!value) {
    return null; // Let Validators.required handle empty values
  }

  // Check for incomplete input mask (e.g., "dd/mm/____")
  if (value.includes('_')) {
    return { 'invalidDateFormat': true };
  }

  if (value.length !== 10) {
    return { 'invalidDateFormat': true };
  }

  if (value.substring(2, 3) !== '/' || value.substring(5, 6) !== '/') {
    return { 'invalidDateFormat': true };
  }

  const dayStr = value.substring(0, 2);
  const monthStr = value.substring(3, 5);
  const yearStr = value.substring(6, 10);

  if (!containsOnlyDigits(dayStr) || !containsOnlyDigits(monthStr) || !containsOnlyDigits(yearStr)) {
    return { 'invalidDateCharacters': true };
  }

  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return { 'invalidDate': true };
  }

  if (month < 1 || month > 12) {
    return { 'invalidDateMonth': true };
  }

  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeapYear(year)) {
    daysInMonth[2] = 29;
  }

  if (day < 1 || day > daysInMonth[month]) {
    return { 'invalidDateDay': true };
  }

  return null; // Date is valid
};


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
    InputMaskModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  
  // Mock data for dropdowns
  cursos: { id: string; nome: string }[] = [];
  semestres: { id: string; nome: string }[] = [];
  turnos: { id: string; nome: string }[] = [];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nome: ['', Validators.required],
      numeroAcademico: [''],
      dataNascimento: ['', [Validators.required, dateValidator]], // Using the custom date validator
      cursoId: [null, Validators.required], // Renamed to match API
      anoUltimaMatricula: [''],
      semestreUltimaMatriculaId: [null], // Renamed to match API
      turnoId: [null], // Renamed to match API
    });

    // Mock data would be loaded from a service
    this.cursos = [
      { id: '1', nome: 'Ciência da Computação' },
      { id: '2', nome: 'Engenharia Civil' },
    ];
    this.semestres = [
      { id: '1', nome: '1º Semestre' },
      { id: '2', nome: '2º Semestre' },
    ];
    this.turnos = [
      { id: 'M', nome: 'Manhã' },
      { id: 'N', nome: 'Noite' },
    ];
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Formulário de Login Válido. Enviando para o serviço de autenticação...');
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Login bem-sucedido:', response.message);
            this.router.navigate(['/app/busca-aluno']); // Navigate on success
          } else {
            console.error('Falha no login:', response.message);
            // Here you could display an error message to the user using a toast or dialog
          }
        },
        error: (err) => {
          console.error('Ocorreu um erro na autenticação:', err);
          // Handle HTTP error
        }
      });
    } else {
      console.log('Formulário de Login Inválido');
      // Mark fields as touched to show errors
      this.loginForm.markAllAsTouched();
    }
  }
}