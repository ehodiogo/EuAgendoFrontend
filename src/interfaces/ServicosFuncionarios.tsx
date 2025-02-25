
export interface Servicos {
    id: number;
    nome: string;
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
    cnpj: string;
    funcionarios: FuncionarioServicos[];
}
