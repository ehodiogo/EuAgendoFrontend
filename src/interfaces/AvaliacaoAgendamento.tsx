import {Funcionario} from "./Funcionario.tsx";

export interface  AvaliacaoAgendamento {
    id: number;
    identificador: string;
    servico_nome?: string;
    cliente_nome: string;
    funcionario?: Funcionario;
    data: string;
    hora: string;
    locacao_nome?: string;
    locacao_foto?: string;
    is_continuacao: boolean;
    nota_avaliacao: number;
    descricao_avaliacao: string;
}