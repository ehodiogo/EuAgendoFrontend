interface Servico {
  nome: string;
  preco: number;
  duracao: string;
}

export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  servicos: Servico[];
  logo: string;

  horario_abertura_dia_semana: string;
  horario_fechamento_dia_semana: string;

  horario_abertura_fim_semana: string;
  horario_fechamento_fim_semana: string;

  abre_sabado: boolean;
  abre_domingo: boolean;
}
