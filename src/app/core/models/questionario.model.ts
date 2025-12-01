/**
 * Modelo de dados para o Questionário de Ex-Alunos
 */

/**
 * Tipos de questões suportados no questionário
 */
export type TipoQuestao = 'radio' | 'textarea' | 'checkbox-with-text';

/**
 * Interface para uma opção de resposta (para questões de múltipla escolha)
 */
export interface OpcaoResposta {
  id: string;
  texto: string;
  permiteCampoTexto?: boolean; // Para opções tipo "Outros" que permitem texto adicional
}

/**
 * Interface para uma questão do questionário
 */
export interface Questao {
  id: string;
  numero: number;
  texto: string;
  tipo: TipoQuestao;
  obrigatoria: boolean;
  opcoes?: OpcaoResposta[]; // Apenas para questões tipo 'radio' ou 'checkbox'
}

/**
 * Interface para a resposta de uma questão
 */
export interface Resposta {
  questaoId: string;
  opcaoId?: string; // Para questões de múltipla escolha
  textoResposta?: string; // Para questões abertas ou campo "Outros"
  multiplas?: { // Para checkboxes que permitem múltiplas seleções
    opcaoId: string;
    textoAdicional?: string;
  }[];
}

/**
 * Interface para o questionário completo respondido
 */
export interface QuestionarioResposta {
  id?: string; // Gerado pelo backend/JSON Server
  alunoId: string;
  alunoNome: string;
  dataPreenchimento: Date;
  respostas: Resposta[];
}

/**
 * Interface para o modelo completo do questionário (estrutura)
 */
export interface Questionario {
  id: string;
  titulo: string;
  descricao: string;
  questoes: Questao[];
}
