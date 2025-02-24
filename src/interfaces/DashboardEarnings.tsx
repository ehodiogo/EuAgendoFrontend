
export interface Financeiro {
  total_ganhos: number;
  ganhos_por_mes: number;
  ganhos_por_semana: number;
  funcionario_top: {
    funcionario__nome: string | null;
    total: number;
  };
  servico_mais_rentavel: {
    servico__nome: string | null;
    total: number;
  };
  servico_menos_rentavel: {
    servico__nome: string | null;
    total: number;
  };
}


export interface Dashboard {
    empresa: string;
    total_funcionarios: number;
    total_clientes: number;
    total_servicos: number;
    agendamentos_hoje: number;
    agendamentos_pendentes: number;
}