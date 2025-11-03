export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  duracao: string;
  preco: string;
  funcionarios: number[];
  pontos_gerados?: string | number;
  pontos_resgate?: string | number;
}

export interface ServicoCreate {
  id?:  number | null;
  nome: string;
  descricao: string;
  duracao: string;
  preco: string;
  funcionarios: number[];
  pontos_gerados?: string | number;
  pontos_resgate?: string | number;
}
