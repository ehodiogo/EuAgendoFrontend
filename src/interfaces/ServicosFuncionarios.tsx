
interface Servicos {
    id: number;
    nome: string;
    preco: number;
    duracao: string;
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
