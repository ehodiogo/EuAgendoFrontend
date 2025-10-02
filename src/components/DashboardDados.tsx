import { useFetch } from "../functions/GetData";
import { Dashboard } from "../interfaces/DashboardEarnings";
import { FaUserTag, FaUserGroup, FaBriefcase, FaCalendarCheck, FaCalendarDays, FaChartLine, FaSpinner} from "react-icons/fa6"; // Atualizado para Fa6

interface DashBoardDadosProps {
  empresa_id: number;
}

const DashBoardDados = ({ empresa_id }: DashBoardDadosProps) => {
  const dadosDashboard = useFetch<Dashboard>(
    `/api/dashboard/?empresa_id=${empresa_id}`
  );

  // Mapeamento dos dados para exibição em cards KPI
  const kpiItems = dadosDashboard.data ? [
    {
      icon: FaBriefcase,
      title: "Serviços Prestados",
      value: dadosDashboard.data.total_servicos,
      color: "#0056b3", // Accent Blue
      bg: "#e0e7ff",
    },
    {
      icon: FaUserTag,
      title: "Total de Clientes",
      value: dadosDashboard.data.total_clientes,
      color: "#28a745", // Success Green
      bg: "#d4edda",
    },
    {
      icon: FaUserGroup,
      title: "Total de Funcionários",
      value: dadosDashboard.data.total_funcionarios,
      color: "#fd7e14", // Warning Orange
      bg: "#fff3cd",
    },
    {
      icon: FaCalendarCheck,
      title: "Agendamentos Hoje",
      value: dadosDashboard.data.agendamentos_hoje,
      color: "#003087", // Primary Blue
      bg: "#f0f4f8",
    },
    {
      icon: FaCalendarDays,
      title: "Agendamentos Futuros",
      value: dadosDashboard.data.agendamentos_pendentes,
      color: "#dc3545", // Danger Red
      bg: "#fcebeb",
    },
  ] : [];

  return (
    <div className="dashboard-dados-wrapper">
      <style>{`
        /* Paleta de cores (Consistente) */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --white: #ffffff;
          --shadow-color: rgba(0, 0, 0, 0.1);
          --danger-red: #dc3545;
        }

        .dashboard-dados-wrapper {
            padding: 1rem 0;
            width: 100%;
        }

        /* Título */
        .dashboard-header {
            color: var(--dark-gray);
            font-weight: 800;
            font-size: 1.75rem;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-bottom: 3px solid #e2e8f0;
            padding-bottom: 0.75rem;
        }
        .dashboard-header svg {
            color: var(--primary-blue);
        }

        /* Grade de KPIs */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        /* Cartão KPI individual */
        .kpi-card {
          background-color: var(--white);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-left: 5px solid var(--kpi-color, var(--primary-blue));
        }
        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        }

        .kpi-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--kpi-bg, #f0f4f8);
          margin-bottom: 0.75rem;
        }
        .kpi-icon-wrapper svg {
          color: var(--kpi-color, var(--primary-blue));
          font-size: 1.5rem;
        }

        .kpi-title {
          font-size: 0.95rem;
          color: var(--dark-gray);
          font-weight: 600;
          margin-bottom: 0.25rem;
          opacity: 0.8;
        }

        .kpi-value {
          font-size: 2rem;
          font-weight: 900;
          color: var(--dark-gray);
          line-height: 1.1;
        }

        /* Loading e erro */
        .message-status {
          text-align: center;
          font-size: 1.2rem;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          font-weight: 600;
        }
        .loading-container {
          color: var(--primary-blue);
          background-color: #e0e7ff;
        }
        .error-container {
          color: var(--danger-red);
          background-color: #fcebeb;
          border: 1px solid var(--danger-red);
          font-weight: 700;
        }

        /* Responsividade */
        @media (max-width: 576px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }
          .kpi-value {
            font-size: 1.75rem;
          }
          .dashboard-header {
            font-size: 1.5rem;
          }
          .kpi-card {
            padding: 1.25rem;
          }
        }
      `}</style>

      <h4 className="dashboard-header">
        <FaChartLine /> Painel de Métricas
      </h4>

      {dadosDashboard.loading ? (
        <div className="loading-container message-status">
          <FaSpinner className="fa-spin me-2" /> Carregando dados do painel...
        </div>
      ): (
        <div className="kpi-grid">
          {kpiItems.map((item) => (
            <div
              key={item.title}
              className="kpi-card"
              style={{
                "--kpi-color": item.color,
                "--kpi-bg": item.bg,
              } as React.CSSProperties}
            >
              <div className="kpi-icon-wrapper">
                <item.icon aria-hidden="true" />
              </div>
              <div className="kpi-title">{item.title}</div>
              <div className="kpi-value">{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashBoardDados;