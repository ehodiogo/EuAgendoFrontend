
export interface Servicos {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
}
export interface FuncionarioServicos {
    id: number;
    nome: string;
    foto_url: string;
    servicos: Servicos[];
}
export interface ServicosFuncionariosEmpresa {
    nome: string;
    funcionarios: FuncionarioServicos[];
}
