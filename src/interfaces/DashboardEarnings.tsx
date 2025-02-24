
export interface Financeiro {
    total_ganhos: number;
    ganhos_por_mes: number;
    ganhos_por_semana: number;
}

export interface Dashboard {
    empresa: string;
    total_funcionarios: number;
    total_clientes: number;
    total_servicos: number;
    agendamentos_hoje: number;
    agendamentos_pendentes: number;
}