import { useFetch } from "../functions/GetData";
import { Dashboard } from "../interfaces/DashboardEarnings";

interface DashBoardDadosProps {
  empresa_id: number;
}

const DashBoardDados = ({ empresa_id }: DashBoardDadosProps) => {
  const dadosDashboard = useFetch<Dashboard>(
    `api/dashboard/?empresa_id=${empresa_id}`
  );

  return (
    <div className="card shadow-lg p-4">
      <h4 className="card-title text-primary text-center mb-4">
        Informações da Sua Empresa 
      </h4>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <strong>Total de Clientes:</strong> R$ {dadosDashboard.data?.total_clientes}
        </li>
        <li className="list-group-item">
            <strong>Total de Clientes:</strong>
            {dadosDashboard.data?.total_clientes}
        </li>
        <li className="list-group-item">
            <strong>Total de Funcionários:</strong>
            {dadosDashboard.data?.total_funcionarios}
        </li>
        <li className="list-group-item">
            <strong>Total de Agendamentos para Hoje:</strong>
            {dadosDashboard.data?.agendamentos_hoje}
        </li>
        <li className="list-group-item">
            <strong>Total de Agendamentos Futuros:</strong>
            {dadosDashboard.data?.agendamentos_pendentes}
        </li>
      </ul>
    </div>
  );
};

export default DashBoardDados;
