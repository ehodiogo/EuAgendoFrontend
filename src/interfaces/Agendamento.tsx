export interface Agendamento {
  id: number;
  identificador:  string;
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

  cliente_pontos?: number;
  pontos_para_resgatar?: number;
}
