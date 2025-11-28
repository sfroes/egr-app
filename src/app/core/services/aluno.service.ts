import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Aluno, Curso, Endereco, Origem } from '../models/aluno.model';
import { API_URL } from '../../api-url.token';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {}

  getOrigens(): Observable<Origem[]> {
    return this.http.get<Origem[]>(`${this.apiUrl}/origens`);
  }

  getCursos(origemId: number): Observable<Curso[]> {
    const params = new HttpParams().set('origemId', origemId.toString());
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos`, { params });
  }

  getAlunoById(id: number): Observable<Aluno | null> {
    return this.http.get<Aluno>(`${this.apiUrl}/alunos/${id}`).pipe(
      catchError(() => of(null)) // Retorna nulo se o aluno não for encontrado
    );
  }

  createAluno(aluno: Omit<Aluno, 'id'>): Observable<Aluno> {
    return this.http.post<Aluno>(`${this.apiUrl}/alunos`, aluno);
  }

  updateAluno(id: number, aluno: Partial<Aluno>): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.apiUrl}/alunos/${id}`, aluno);
  }

  getEnderecoByCep(cep: string): Observable<Endereco | null> {
    // Para um cenário real, usaríamos um serviço externo como o ViaCEP:
    // return this.http.get<Endereco>(`https://viacep.com.br/ws/${cep}/json/`);

    // Para este projeto, vamos simular a busca no nosso db.json
    return this.http.get<Endereco[]>(`${this.apiUrl}/enderecos?cep=${cep}`).pipe(
      map(resultados => resultados.length > 0 ? resultados[0] : null),
      catchError(() => of(null))
    );
  }

  // O método de busca de alunos já deve existir em algum lugar ou será criado,
  // mas por agora não faz parte desta tarefa.
}
