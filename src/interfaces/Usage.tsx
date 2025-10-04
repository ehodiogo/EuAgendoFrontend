interface FuncionariosPorEmpresa {
  empresa: string;
  total_funcionarios: number;
}

interface LocacoesPorEmpresa {
  empresa:  string;
  total_locativos:  number;
}

export interface Usage {
  plano_ativo: string;
  expira_em: string;
  quantia_empresas_criadas: number;
  limite_empresas: number;
  limite_funcionarios: number;
  limite_locacoes: number;
  funcionarios_por_empresa: FuncionariosPorEmpresa[];
  locacoes_por_empresa: LocacoesPorEmpresa[];
}