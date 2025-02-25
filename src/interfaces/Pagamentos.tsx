
interface Pagamento {
    valor : number;
    data : string;
    status : string;
    tipo : string;
    plano : string;
}

export interface Pagamentos {
    pagamentos : Pagamento[]
}