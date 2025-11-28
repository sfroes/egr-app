// Data Models
export interface Origem {
  id: number;
  nome: string;
}

export interface Curso {
  id: number;
  nome: string;
}

export interface Aluno {
  id: number;
  nome: string;
  dataNasc: string; // YYYY-MM-DD
  origemId: number;
  cursoId: number;
  anoFormado: number;
  semestreFormado: string;
  email: string;
  dddContato: string;
  telContato: string;
  dddCelular?: string;
  telCelular?: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento?: string;
  uf: string;
  cidade: string;
  ocupacao?: string;
  empresa?: string;
  dddComercial?: string;
  telComercial?: string;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}
