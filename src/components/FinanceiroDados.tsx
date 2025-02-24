import { useFetch } from "../functions/GetData";
import { Financeiro } from "../interfaces/DashboardEarnings";

interface FinanceiroDados {
    empresa_id: number;
}

const FinanceiroDados = ({ empresa_id }: FinanceiroDados) => {
  const dadosFinanceiros = useFetch<Financeiro>(
    `api/financeiro/?empresa_id=${empresa_id}`
  );

  return (
    <div className="card shadow-lg p-4">
      <h4 className="card-title text-primary text-center mb-4">
        Informações Financeiras
      </h4>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <strong>Receita:</strong> R$ {dadosFinanceiros.data?.total_ganhos}
        </li>
        <li className="list-group-item">
          <strong>Receita Mensal:</strong> R${" "}
          {dadosFinanceiros.data?.ganhos_por_mes}
        </li>
        <li className="list-group-item">
          <strong>Receita Semanal:</strong> R${" "}
          {dadosFinanceiros.data?.ganhos_por_semana}
        </li>
      </ul>
    </div>
  );
};

export default FinanceiroDados;