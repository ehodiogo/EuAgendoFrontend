export interface Plano {
  nome: string;
  valor: number;
  valor_cheio: number;
  descricao: string;
  is_promo: boolean;
  porcentagem_promo: number;
  duracao_em_dias: number;
  quantidade_empresas: number;
  quantidade_funcionarios: number;
  quantidade_locacoes:  number;
  cor: string;
  features: string[];
}