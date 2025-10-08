export interface Agendamento {
  id: number;
  servico: string;
  servico_nome?: string;
  cliente: string;
  cliente_nome?: string;
  funcionario: number;
  funcionario_nome: number;
  locacao_nome?: string;
  duracao_locacao?: number;
  data: string; 
  hora: string; 
  duracao_servico: number;
  compareceu_agendamento: boolean;
  observacao?: string;
}
