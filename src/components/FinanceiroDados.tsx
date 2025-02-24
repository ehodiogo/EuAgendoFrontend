import { useFetch } from "../functions/GetData";
import { Financeiro } from "../interfaces/DashboardEarnings";

interface FinanceiroProps {
  empresa_id: number;
}

const FinanceiroDados = ({ empresa_id }: FinanceiroProps) => {
  const dadosFinanceiros = useFetch<Financeiro>(`api/financeiro/?empresa_id=${empresa_id}`);

  return (
    <div className="card shadow-lg p-4">
      <h4 className="card-title text-primary text-center mb-4">
        Informações Financeiras
      </h4>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <strong>Receita Total:</strong> R${" "}
          {dadosFinanceiros?.data?.total_ganhos || 0}
        </li>
        <li className="list-group-item">
          <strong>Receita Mensal:</strong> R${" "}
          {dadosFinanceiros?.data?.ganhos_por_mes || 0}
        </li>
        <li className="list-group-item">
          <strong>Receita Semanal:</strong> R${" "}
          {dadosFinanceiros?.data?.ganhos_por_semana || 0}
        </li>
        <li className="list-group-item">
          <strong>Funcionário que mais gerou receita:</strong>{" "}
          {dadosFinanceiros?.data?.funcionario_top?.funcionario__nome || "Nenhum"} -
          R$ {dadosFinanceiros?.data?.funcionario_top?.total || 0}
        </li>
        <li className="list-group-item">
          <strong>Serviço mais rentável:</strong>{" "}
          {dadosFinanceiros?.data?.servico_mais_rentavel?.servico__nome || "Nenhum"} -
          R$ {dadosFinanceiros?.data?.servico_mais_rentavel?.total || 0}
        </li>
        <li className="list-group-item">
          <strong>Serviço que menos gerou receita:</strong>{" "}
          {dadosFinanceiros?.data?.servico_menos_rentavel?.servico__nome || "Nenhum"}{" "}
          - R$ {dadosFinanceiros?.data?.servico_menos_rentavel?.total || 0}
        </li>
      </ul>
    </div>
  );
};

export default FinanceiroDados;
