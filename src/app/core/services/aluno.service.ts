import { Injectable } from '@angular/core';
import { Origem, Curso } from '../models/aluno.model';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private origens: Origem[] = [
    { id: 1, nome: 'Graduação' },
    { id: 2, nome: 'Pós-Graduação' },
    { id: 3, nome: 'Mestrado' },
    { id: 4, nome: 'Doutorado' },
  ];

  private cursos: (Curso & { origemId: number })[] = [
    // Graduação
    { id: 101, nome: 'Sistemas de Informação', origemId: 1 },
    { id: 102, nome: 'Ciência da Computação', origemId: 1 },
    { id: 103, nome: 'Direito', origemId: 1 },
    { id: 104, nome: 'Engenharia de Software', origemId: 1 },
    // Pós-Graduação
    { id: 201, nome: 'Especialização em Arquitetura de Software', origemId: 2 },
    { id: 202, nome: 'MBA em Gestão de Projetos', origemId: 2 },
    // Mestrado
    { id: 301, nome: 'Mestrado em Informática', origemId: 3 },
    // Doutorado
    { id: 401, nome: 'Doutorado em Bioinformática', origemId: 4 },
  ];

  constructor() {}

  getOrigens(): Origem[] {
    return this.origens;
  }

  getCursos(origemId: number): Curso[] {
    return this.cursos.filter((curso) => curso.origemId === origemId);
  }
}
