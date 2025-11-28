import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Origem, Curso } from '../models/aluno.model';
import { API_URL } from '../../api-url.token';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getOrigens(): Observable<Origem[]> {
    return this.http.get<Origem[]>(`${this.apiUrl}/origens`);
  }

  getCursos(origemId: number): Observable<Curso[]> {
    const params = new HttpParams().set('origemId', origemId.toString());
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos`, { params });
  }
}
