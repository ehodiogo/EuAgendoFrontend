import { Funcionario } from "./Funcionario";
import { Locacao} from "./Locacao.tsx";

interface Servico {
  id?: number | null;
  descricao: string |  null;
  nome: string;
  preco: number;
  duracao: string;
  funcionarios?: Funcionario[] | null;
    pontos_gerados?: string | number;
  pontos_resgate?: string | number;
}

export interface Empresa {
  id: number;
  nome: string;
  slug: string;

  tipo:  string;

  endereco: string;
  bairro:  string;
  cidade: string;
  pais: string;
  estado: string;

  telefone: string;
  email: string;
  servicos?: Servico[];
  locacoes?: Locacao[];
  logo: string;

  horario_abertura_dia_semana: string;
  horario_fechamento_dia_semana: string;

  horario_abertura_fim_de_semana: string;
  horario_fechamento_fim_de_semana: string;

  abre_sabado: boolean;
  abre_domingo: boolean;

  para_almoco: boolean;
  horario_pausa_inicio: string;
  horario_pausa_fim: string;

  assinatura_ativa: boolean;
  assinatura_vencimento: number;

  funcionarios?: Funcionario[];

  avaliacoes_empresa:  number;
  nota_empresa:  number;

  is_online: boolean;
}

export interface EmpresaCreate {
  nome: string;

  tipo:  string;

  endereco: string;
  bairro:  string;
  cidade: string;
  pais: string;
  estado: string;

  telefone: string;
  email: string;
  servicos?: Servico[];
  locacoes?: Locacao[];
  logo: string;

  horario_abertura_dia_semana: string;
  horario_fechamento_dia_semana: string;

  horario_abertura_fim_de_semana: string;
  horario_fechamento_fim_de_semana: string;

  abre_sabado: boolean;
  abre_domingo: boolean;

  para_almoco: boolean;
  horario_pausa_inicio: string;
  horario_pausa_fim: string;

  is_online: boolean;
}