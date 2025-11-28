import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { API_URL } from '../../api-url.token';

// Interfaces para os dados
export interface DropdownOption {
  id: string;
  nome: string;
}

export interface User {
  id: number;
  nome: string;
  dataNascimento: string;
  cursoId: string;
  // Outros campos podem ser adicionados conforme necessário
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getLoginDropdownData(): Observable<{cursos: DropdownOption[], semestres: DropdownOption[], turnos: DropdownOption[]}> {
    return forkJoin({
      cursos: this.http.get<DropdownOption[]>(`${this.apiUrl}/cursos`),
      semestres: this.http.get<DropdownOption[]>(`${this.apiUrl}/semestres`),
      turnos: this.http.get<DropdownOption[]>(`${this.apiUrl}/turnos`),
    });
  }

  login(credentials: { nome: string; dataNascimento: string; cursoId: string }): Observable<boolean> {
    // Busca todos os usuários e filtra no client-side para fazer a comparação case-insensitive
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const foundUser = users.find(user =>
          user.nome.toLowerCase() === credentials.nome.toLowerCase() &&
          user.dataNascimento === credentials.dataNascimento &&
          user.cursoId === credentials.cursoId
        );
        return !!foundUser; // Retorna true se encontrou, false caso contrário
      })
    );
  }
}
