
export interface Financeiro {
  tipo:  string;
  total_ganhos: number;
  ganhos_por_mes: number;
  ganhos_por_semana: number;
  funcionario_top?: {
    funcionario__nome: string | null;
    total: number;
  };
  servico_mais_rentavel?: {
    servico__nome: string | null;
    total: number;
  };
  servico_menos_rentavel?: {
    servico__nome: string | null;
    total: number;
  };

  locacao_mais_rentavel?: {
      locacao__nome: string | null;
      total: number;
  }

  locacao_menos_rentavel?: {
    locacao__nome: string | null;
    total: number;
  }
}


export interface Dashboard {
    empresa: string;
    tipo:  string;
    total_funcionarios: number;
    total_clientes: number;
    total_servicos: number;
    total_locacoes:  number;
    agendamentos_hoje: number;
    agendamentos_pendentes: number;
}