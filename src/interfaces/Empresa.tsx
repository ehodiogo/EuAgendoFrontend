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

  horario_abertura_fim_de_semana: string;
  horario_fechamento_fim_de_semana: string;

  abre_sabado: boolean;
  abre_domingo: boolean;

  para_almoço: boolean;
  horario_pausa_inicio: string;
  horario_pausa_fim: string;

  assinatura_ativa: boolean;
  assinatura_vencimento: number;
}
