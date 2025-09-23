import {Servico} from "./Servico.tsx";
import {Cliente} from "./Cliente.tsx";
import {Funcionario} from "./Funcionario.tsx";

export interface  AvaliacaoAgendamento {
    id: number;
    identificador: string;
    servico_nome: string;
    cliente_nome: string;
    funcionario: Funcionario;
    data: string;
    hora: string;
    is_continuacao: boolean;
    nota_avaliacao: number;
    descricao_avaliacao: string;
}