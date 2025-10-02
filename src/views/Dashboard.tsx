import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { Empresa } from "../interfaces/Empresa";
import { useFetch } from "../functions/GetData";
import DashBoardDados from "../components/DashboardDados";
import { Modal } from "react-bootstrap";
import {
    FaChartLine,
    FaExclamationTriangle,
    FaClock,
    FaUserCircle,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaCheckSquare,
    FaEdit,
    FaSignInAlt,
    FaChevronDown,
    FaChevronUp,
    FaSpinner
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {

  const token = localStorage.getItem("access_token");
  // O token deve ser enviado de forma segura (ex: via cabeçalho Authorization), mas mantendo a lógica atual
  const empresas_usuario = useFetch<Empresa[]>(
    `/api/empresas-usuario/?usuario_token=${token}`
  );
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleToggleDropdown = async (empresaId: number) => {
    setDropdownAberto(dropdownAberto === empresaId ? null : empresaId);
  };

  const isPlanExpired = localStorage.getItem("is_expired_plan");
  const remainingTime = localStorage.getItem("tempo_restante");

  const formatTime = (seconds: number) => {
    if (seconds < 0) seconds = Math.abs(seconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const checkIfPlanExpiresTomorrow = () => {
    if (remainingTime) {
      const remainingTimeInSeconds = Number(remainingTime);
      // Considerando que o modal deve aparecer se faltar menos de 2 dias (48 horas)
      return remainingTimeInSeconds > 0 && remainingTimeInSeconds < (48 * 3600);
    }
    return false;
  };

  useEffect(() => {
    // Exibir modal se expirado ou se faltar menos de 48 horas
    if (isPlanExpired === "true" || checkIfPlanExpiresTomorrow()) {
      handleShowModal();
    }
  }, [isPlanExpired, remainingTime]);

  // Estrutura para os botões de navegação
  const navButtons = [
    { to: "/perfil", icon: FaUserCircle, label: "Perfil & Pagamentos", description: "Gerencie suas informações, histórico de pagamentos e planos ativos.", variant: "primary" },
    { to: "/financeiro", icon: FaMoneyBillWave, label: "Relatório Financeiro", description: "Acompanhe seu rendimento, serviços mais e menos rentáveis.", variant: "success" },
    { to: "/minhas-empresas", icon: FaCalendarAlt, label: "Agendamentos de Hoje", description: "Verifique os agendamentos de suas empresas para o dia atual.", variant: "warning" },
    { to: "/validar-plano", icon: FaCheckSquare, label: "Verificar Plano", description: "Verifique o status do seu plano se ele ainda não está ativo.", variant: "danger" },
    { to: "/cadastros-usuario", icon: FaEdit, label: "Cadastros & Serviços", description: "Crie, altere e exclua empresas, serviços e funcionários.", variant: "info" },
    { to: "/checkin", icon: FaSignInAlt, label: "Gerenciar Checkins", description: "Controle as entradas e saídas de clientes em suas empresas.", variant: "dark" },
  ];


  return (
    <div className="min-vh-100">
      <style>{`
        /* Paleta de cores */
        :root {
          --primary-blue: #003087; /* Foco Principal (Azul Escuro) */
          --accent-blue: #0056b3; /* Destaque (Azul Médio) */
          --light-blue-bg: #e0f2f7; /* Fundo de Seção (Azul Claro) */
          --dark-gray: #333333; /* Texto Principal */
          --medium-gray: #666666; /* Texto Secundário */
          --light-gray-bg: #f5f7fa; /* Fundo do Corpo (Neutro) */
          --white: #ffffff;
          --accent-yellow: #f6c107;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --warning-orange: #fd7e14;
          --border-light: #e0e0e0;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray-bg);
        }

        /* Container */
        .dashboard-container {
          padding: 3.5rem 0 5rem 0;
        }
        .dashboard-container h2 {
          color: var(--primary-blue);
          font-weight: 800;
          font-size: 2.8rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          text-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
        }
        .dashboard-container .lead {
          color: var(--medium-gray);
          font-size: 1.2rem;
          max-width: 900px;
          margin: 0 auto 3rem;
          text-align: center;
        }

        /* Seção de Navegação (Cards de Ação) */
        .nav-section {
            background-color: var(--white);
            border-radius: 18px;
            padding: 2.5rem;
            margin-bottom: 3rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* Sombra suave */
        }
        .nav-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .nav-button-card {
            display: block;
            text-align: center;
            padding: 1.5rem;
            border-radius: 12px;
            transition: all 0.3s ease;
            text-decoration: none;
            height: 100%;
            background-color: var(--light-gray-bg);
            border: 1px solid var(--border-light);
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        }
        .nav-button-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            border-color: var(--accent-blue);
        }
        .nav-button-card .icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: var(--primary-blue); /* Cor padrão dos ícones */
            transition: color 0.3s ease;
        }
        .nav-button-card h5 {
            font-weight: 700;
            font-size: 1.15rem;
            color: var(--dark-gray);
            margin-bottom: 0.5rem;
        }
        .nav-button-card p {
            color: var(--medium-gray);
            font-size: 0.9rem;
            margin: 0;
            line-height: 1.4;
        }
        
        /* Cores dos ícones baseadas no variant (Ajuste o CSS com base nos variants) */
        .nav-button-card .icon.primary { color: var(--primary-blue); }
        .nav-button-card .icon.success { color: var(--success-green); }
        .nav-button-card .icon.warning { color: var(--warning-orange); }
        .nav-button-card .icon.danger { color: var(--danger-red); }
        .nav-button-card .icon.info { color: var(--accent-blue); }
        .nav-button-card .icon.dark { color: var(--dark-gray); }

        /* Lista de Empresas para Dashboard de Dados */
        .empresas-dash-list h3 {
            color: var(--accent-blue);
            font-weight: 700;
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--border-light);
        }
        .empresa-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          border-left: 5px solid var(--primary-blue);
        }
        .empresa-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          border-left-color: var(--accent-blue);
        }
        .empresa-card.active {
            border-left: 5px solid var(--warning-orange);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
            background-color: var(--light-blue-bg);
        }
        .empresa-card .card-header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .empresa-card .card-title {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.4rem;
          margin: 0;
        }
        .empresa-card .card-text {
          color: var(--medium-gray);
          font-size: 0.95rem;
          margin-top: 0.25rem;
        }
        .empresa-card .toggle-icon {
            font-size: 1.2rem;
            color: var(--primary-blue);
            transition: transform 0.2s;
        }
        .empresa-card.active .toggle-icon {
            color: var(--warning-orange);
        }

        .dropdown-card {
          background-color: var(--white);
          border-radius: 12px;
          border: 1px solid var(--border-light);
          padding: 2rem;
          margin-top: -1rem; /* Aproxima do card de cima */
          margin-bottom: 1.5rem;
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-card .btn-primary {
          background-color: var(--primary-blue);
          border-color: var(--primary-blue);
          padding: 0.8rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .dropdown-card .btn-primary:hover {
          background-color: var(--accent-blue);
          border-color: var(--accent-blue);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Modal */
        .modal-header {
          background-color: var(--primary-blue);
          color: var(--white);
        }
        .modal-body .text-danger, .modal-body .text-warning {
            padding: 1rem;
            border-radius: 8px;
        }
        .modal-body .text-danger {
            background-color: #fcebeb;
            color: var(--danger-red);
        }
        .modal-body .text-warning {
            background-color: #fff8e1;
            color: var(--warning-orange);
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .dashboard-container h2 {
            font-size: 2.2rem;
          }
          .dashboard-container .lead {
            font-size: 1.1rem;
          }
          .nav-section {
            padding: 1.5rem;
          }
          .nav-buttons {
            grid-template-columns: 1fr;
          }
          .empresa-card {
            padding: 1.2rem;
          }
          .empresa-card .card-title {
            font-size: 1.2rem;
          }
          .dropdown-card {
            padding: 1.5rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="dashboard-container container">
          <h2 >
            <FaChartLine /> Painel Administrativo
          </h2>
          <p className="lead">
            Bem-vindo à sua central de gerenciamento. Utilize os atalhos para
            administrar suas empresas, finanças e cadastros.
          </p>

          {/* Seção 1: Atalhos de Navegação */}
          <section className="nav-section">
            <h3 className="text-center text-secondary mb-4" style={{fontWeight: 600}}>Ações Rápidas</h3>
            <div className="nav-buttons">
              {navButtons.map((button, index) => (
                <Link to={button.to} className="nav-button-card" key={index}>
                    <button.icon className={`icon ${button.variant}`} />
                    <h5>{button.label}</h5>
                    <p>{button.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Seção 2: Dashboards por Empresa */}
          <section className="empresas-dash-list">
             <h3>Dashboards Detalhados por Empresa</h3>
             <p className="text-muted mb-4">
                Selecione uma empresa para visualizar em tempo real suas métricas de agendamento e desempenho financeiro.
             </p>

            <div className="row justify-content-center">
              {empresas_usuario.loading && (
                 <div className="text-center p-5">
                    <FaSpinner className="fa-spin text-primary" size={30} />
                    <p className="text-muted mt-2">Carregando empresas...</p>
                 </div>
              )}

              {empresas_usuario.data?.map((empresa: Empresa) => (
                <div className="col-12" key={empresa.id}>
                  <div
                    className={`empresa-card ${dropdownAberto === empresa.id ? 'active' : ''}`}
                    onClick={() => handleToggleDropdown(empresa.id)}
                  >
                    <div className="card-header-content">
                        <div>
                            <h4 className="card-title">{empresa.nome}</h4>
                            <p className="card-text">CNPJ: {empresa.cnpj}</p>
                        </div>
                        <span className="toggle-icon">
                            {dropdownAberto === empresa.id ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                    </div>
                  </div>
                  {dropdownAberto === empresa.id && (
                    <div className="dropdown-card">
                      <DashBoardDados empresa_id={empresa.id} />
                      <Link
                        to={`/empresas/${empresa.nome}`}
                        className="btn btn-primary mt-4 w-100"
                      >
                        Acessar Página de Gerenciamento da Empresa
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              {empresas_usuario.data?.length === 0 && !empresas_usuario.loading && (
                <div className="alert alert-info text-center mt-3">
                    Você ainda não possui empresas cadastradas. <Link to="/cadastros-usuario">Cadastre sua primeira empresa!</Link>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Modal de Status de Plano */}
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaExclamationTriangle /> Alerta de Plano
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isPlanExpired === "true" ? (
              <div className="text-center">
                <p className="text-danger">
                  <FaExclamationTriangle className="me-1" /> Seu plano expirou há cerca de
                  <span className="fw-bold"> {formatTime(Number(remainingTime))}</span>.
                  A renovação é essencial para manter todas as funcionalidades!
                </p>
                <p className="text-muted mt-3">
                  <strong>Atenção:</strong> Algumas funcionalidades podem estar limitadas. No entanto, agendamentos já marcados e essenciais permanecem ativos por um período de carência.
                </p>
              </div>
            ) : checkIfPlanExpiresTomorrow() ? (
              <div className="text-center">
                <p className="text-warning">
                  <FaClock className="me-1" /> Seu plano está programado para vencer em menos de <span className="fw-bold">48 horas</span>.
                </p>
                <p className="text-muted mt-3">
                    O tempo restante estimado é de <strong>{formatTime(Number(remainingTime))}</strong>. Renove seu plano agora para evitar interrupções nos serviços.
                </p>
              </div>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Link to="/planos" className="btn btn-success">
              Renovar Plano Agora
            </Link>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Fechar
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Dashboard;