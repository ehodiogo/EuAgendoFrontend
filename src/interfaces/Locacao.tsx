export interface Locacao {
    id?: number | null;
    nome: string;
    descricao: string;
    duracao: string;
    preco: string;
    pontos_gerados?: string | number;
    pontos_resgate?: string | number;
}