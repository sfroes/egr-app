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

  getSemestres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/semestres`);
  }

  getAlunoById(id: number): Observable<Aluno | null> {
    return this.http.get<Aluno>(`${this.apiUrl}/alunos/${id}`).pipe(
      catchError(() => of(null)) // Retorna nulo se o aluno não for encontrado
    );
  }

  getAlunoPorId(id: string): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/alunos/${id}`);
  }

  buscarAluno(criterios: any): Observable<Aluno[]> {
    console.log('Critérios de busca recebidos:', criterios);

    // Busca todos os alunos e filtra no lado do cliente
    // pois o JSON Server não suporta busca parcial (like)
    return this.http.get<Aluno[]>(`${this.apiUrl}/alunos`).pipe(
      map(alunos => {
        console.log('Total de alunos no banco:', alunos.length);
        console.log('RAW API Response - Primeiro aluno completo:', JSON.stringify(alunos[0], null, 2));

        const resultado = alunos.filter(aluno => {
          // Filtro por nome (case-insensitive, busca parcial)
          const nomeMatch = criterios.nome
            ? aluno.nome.toLowerCase().includes(criterios.nome.toLowerCase())
            : true;

          // Filtro por origem (comparação flexível de tipo)
          const origemMatch = criterios.origem?.id
            ? aluno.origemId == criterios.origem.id // Usar == para comparação flexível
            : true;

          // Filtro por curso (comparação flexível de tipo)
          const cursoMatch = criterios.curso?.id
            ? aluno.cursoId.toString() === criterios.curso.id.toString()
            : true;

          // Filtro por data de nascimento (se fornecida)
          const dataNascMatch = criterios.dataNascimento
            ? this.comparaDatas(aluno.dataNasc, criterios.dataNascimento)
            : true;

          // Debug logs
          if (aluno.nome.toLowerCase().includes((criterios.nome || '').toLowerCase())) {
            console.log(`Aluno: ${aluno.nome}`, {
              'aluno.origemId': aluno.origemId,
              'criterios.origem.id': criterios.origem?.id,
              'tipos': {
                alunoOrigemIdType: typeof aluno.origemId,
                criteriosOrigemIdType: typeof criterios.origem?.id
              },
              nomeMatch,
              origemMatch,
              cursoMatch,
              dataNascMatch,
              passa: nomeMatch && origemMatch && cursoMatch && dataNascMatch
            });
          }

          return nomeMatch && origemMatch && cursoMatch && dataNascMatch;
        });

        console.log('Alunos encontrados após filtro:', resultado.length);
        return resultado;
      })
    );
  }

  private comparaDatas(dataBD: string, dataForm: Date): boolean {
    // dataBD vem no formato YYYY-MM-DD (ex: "1972-02-19")
    // dataForm é um objeto Date
    const [ano, mes, dia] = dataBD.split('-').map(Number);
    const dataBDObj = new Date(ano, mes - 1, dia);

    // Normalizar ambas as datas para meia-noite (00:00:00)
    dataBDObj.setHours(0, 0, 0, 0);
    const dataFormNorm = new Date(dataForm);
    dataFormNorm.setHours(0, 0, 0, 0);

    console.log('Comparando datas:', {
      dataBD,
      dataBDObj: dataBDObj.toISOString(),
      dataForm: dataFormNorm.toISOString(),
      iguais: dataBDObj.getTime() === dataFormNorm.getTime()
    });

    return dataBDObj.getFullYear() === dataFormNorm.getFullYear() &&
           dataBDObj.getMonth() === dataFormNorm.getMonth() &&
           dataBDObj.getDate() === dataFormNorm.getDate();
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

  /**
   * Verifica se existe um user relacionado ao aluno
   * Busca na tabela users por alunoId
   */
  verificarUserExiste(alunoId: number): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}/users?alunoId=${alunoId}`).pipe(
      map(users => users.length > 0),
      catchError(() => of(false))
    );
  }
}
