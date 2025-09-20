import { useFetch } from "../functions/GetData";
import { Dashboard } from "../interfaces/DashboardEarnings";
import { FaUsers, FaBriefcase, FaCalendarCheck, FaCalendarAlt, FaChartLine, FaSpinner} from "react-icons/fa";
import "aos/dist/aos.css";

interface DashBoardDadosProps {
  empresa_id: number;
}

const DashBoardDados = ({ empresa_id }: DashBoardDadosProps) => {
  const dadosDashboard = useFetch<Dashboard>(
    `api/dashboard/?empresa_id=${empresa_id}`
  );

  return (
    <div>
      <style>{`
        /* Paleta de cores */
        :root {
          --primary-blue: #003087;
          --light-blue: #4dabf7;
          --dark-gray: #2d3748;
          --light-gray: #f7fafc;
          --white: #ffffff;
          --accent-yellow: #f6c107;
          --success-green: #28a745;
          --danger-red: #dc3545;
        }

        /* Cartão de dados */
        .dashboard-dados-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .dashboard-dados-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .dashboard-dados-card h4 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        /* Lista de itens */
        .dashboard-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e2e8f0;
          transition: background-color 0.3s ease;
        }
        .dashboard-item:last-child {
          border-bottom: none;
        }
        .dashboard-item:hover {
          background-color: rgba(77, 171, 247, 0.05);
        }
        .dashboard-item svg {
          color: var(--light-blue);
          font-size: 1.2rem;
        }
        .dashboard-item strong {
          color: var(--dark-gray);
          font-weight: 600;
          font-size: 1rem;
        }
        .dashboard-item span {
          color: var(--dark-gray);
          font-size: 1rem;
        }

        /* Loading e erro */
        .loading-container, .error-container {
          text-align: center;
          color: var(--dark-gray);
          font-size: 1.1rem;
          padding: 1rem;
        }
        .error-container {
          color: var(--danger-red);
          font-weight: 500;
        }

        /* Responsividade */
        @media (max-width: 576px) {
          .dashboard-dados-card {
            padding: 1.5rem;
          }
          .dashboard-dados-card h4 {
            font-size: 1.25rem;
          }
          .dashboard-item {
            font-size: 0.9rem;
          }
          .dashboard-item svg {
            font-size: 1rem;
          }
        }
      `}</style>
      <div className="dashboard-dados-card" data-aos="fade-up">
        <h4>
          <FaChartLine /> Informações da Empresa
        </h4>
        {dadosDashboard.loading ? (
          <div className="loading-container">
            <FaSpinner className="fa-spin me-2" /> Carregando dados...
          </div>
        ) : !dadosDashboard.data ? (
          <div className="error-container">
            Nenhum dado disponível para esta empresa.
          </div>
        ) : (
          <div className="list-group list-group-flush">
            <div className="dashboard-item">
              <FaBriefcase />
              <strong>Total de Serviços Prestados:</strong>
              <span>{dadosDashboard.data.total_servicos}</span>
            </div>
            <div className="dashboard-item">
              <FaUsers />
              <strong>Total de Clientes:</strong>
              <span>{dadosDashboard.data.total_clientes}</span>
            </div>
            <div className="dashboard-item">
              <FaUsers />
              <strong>Total de Funcionários:</strong>
              <span>{dadosDashboard.data.total_funcionarios}</span>
            </div>
            <div className="dashboard-item">
              <FaCalendarCheck />
              <strong>Agendamentos para Hoje:</strong>
              <span>{dadosDashboard.data.agendamentos_hoje}</span>
            </div>
            <div className="dashboard-item">
              <FaCalendarAlt />
              <strong>Agendamentos Futuros:</strong>
              <span>{dadosDashboard.data.agendamentos_pendentes}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoardDados;