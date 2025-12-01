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
  id?: number;
  alunoId?: number;
  nome: string;
  dataNascimento: string;
  cursoId: string;
  numeroAcademico?: string;
  anoUltimaMatricula?: string;
  semestreUltimaMatriculaId?: string;
  turnoId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'currentUser';

  /**
   * Verifica se existe um usuário autenticado
   */
  isAuthenticated(): boolean {
    if (this.currentUser) return true;

    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      return true;
    }

    return false;
  }

  /**
   * Retorna o usuário atualmente autenticado
   */
  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;

    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      return this.currentUser;
    }

    return null;
  }

  /**
   * Armazena dados do usuário autenticado
   */
  autenticarUsuario(user: User): void {
    this.currentUser = user;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  /**
   * Remove dados do usuário autenticado
   */
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Cria novo registro na tabela users
   */
  criarUser(userData: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData);
  }

  getLoginDropdownData(): Observable<{cursos: DropdownOption[], semestres: DropdownOption[], turnos: DropdownOption[]}> {
    return forkJoin({
      cursos: this.http.get<DropdownOption[]>(`${this.apiUrl}/cursos`),
      semestres: this.http.get<DropdownOption[]>(`${this.apiUrl}/semestres`),
      turnos: this.http.get<DropdownOption[]>(`${this.apiUrl}/turnos`),
    });
  }

  /**
   * Realiza login do usuário
   * Busca na tabela users e retorna o usuário se encontrado
   * Armazena a sessão automaticamente se encontrar o usuário
   */
  login(credentials: { nome: string; dataNascimento: string; cursoId: string }): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const foundUser = users.find(user =>
          user.nome.toLowerCase() === credentials.nome.toLowerCase() &&
          user.dataNascimento === credentials.dataNascimento &&
          user.cursoId === credentials.cursoId
        );

        if (foundUser) {
          this.autenticarUsuario(foundUser);
        }

        return foundUser || null;
      })
    );
  }
}
