export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  servicos: number[]; 
}
