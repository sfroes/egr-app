import { Injectable, inject, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../api-url.token';
import {
  Questionario,
  QuestionarioResposta
} from '../models/questionario.model';

/**
 * Serviço responsável por gerenciar questionários e suas respostas
 */
@Injectable({
  providedIn: 'root'
})
export class QuestionarioService {
  private http = inject(HttpClient);

  constructor(@Inject(API_URL) private apiUrl: string) {}

  /**
   * Busca a estrutura do questionário (questões e opções)
   * @returns Observable com a estrutura do questionário
   */
  getQuestionario(): Observable<Questionario> {
    return this.http.get<Questionario>(`${this.apiUrl}/questionario`);
  }

  /**
   * Salva as respostas do questionário preenchido
   * @param resposta Dados do questionário respondido
   * @returns Observable com a resposta salva (incluindo ID gerado)
   */
  salvarResposta(resposta: QuestionarioResposta): Observable<QuestionarioResposta> {
    return this.http.post<QuestionarioResposta>(
      `${this.apiUrl}/questionario-respostas`,
      resposta
    );
  }

  /**
   * Busca respostas de um aluno específico
   * @param alunoId ID do aluno
   * @returns Observable com array de respostas do aluno
   */
  getRespostasPorAluno(alunoId: string): Observable<QuestionarioResposta[]> {
    return this.http.get<QuestionarioResposta[]>(
      `${this.apiUrl}/questionario-respostas?alunoId=${alunoId}`
    );
  }

  /**
   * Busca uma resposta específica por ID
   * @param respostaId ID da resposta
   * @returns Observable com a resposta encontrada
   */
  getRespostaPorId(respostaId: string): Observable<QuestionarioResposta> {
    return this.http.get<QuestionarioResposta>(
      `${this.apiUrl}/questionario-respostas/${respostaId}`
    );
  }

  /**
   * Alias para obterQuestionario (para manter compatibilidade)
   */
  obterQuestionario(): Observable<Questionario> {
    return this.getQuestionario();
  }

  /**
   * Salva respostas associadas ao usuário autenticado
   * @param userId ID do usuário
   * @param respostas Objeto com as respostas
   */
  salvarRespostas(userId: number, respostas: any): Observable<any> {
    const payload = {
      userId,
      respostas,
      dataResposta: new Date().toISOString()
    };
    return this.http.post<any>(`${this.apiUrl}/respostas`, payload);
  }
}
