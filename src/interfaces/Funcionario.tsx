export interface Funcionario {
  id?: number | null;
  nome: string;
  foto: string;
}

export interface FuncionarioCreate {
  nome: string;
  foto: string;
}
