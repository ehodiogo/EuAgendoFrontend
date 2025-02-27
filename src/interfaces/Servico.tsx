export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  duracao: string;
  preco: string;
  funcionarios: number[]; 
}

export interface ServicoCreate {
  nome: string;
  descricao: string;
  duracao: string;
  preco: string;
  funcionarios: number[]; 
}
