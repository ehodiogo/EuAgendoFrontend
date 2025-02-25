interface FuncionariosPorEmpresa {
  empresa: string;
  total_funcionarios: number;
}

export interface Usage {
  plano_ativo: string;
  expira_em: string;
  quantia_empresas_criadas: number;
  limite_empresas: number;
  limite_funcionarios: number;
  funcionarios_por_empresa: FuncionariosPorEmpresa[];
}