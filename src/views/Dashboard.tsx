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
  FaMoneyBillWave,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
  FaBuilding,
} from "react-icons/fa6";
import {FaCalendarAlt, FaUserCircle, FaCheckSquare, FaEdit, FaSignInAlt} from "react-icons/fa";

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
  const empresas_usuario = useFetch<Empresa[]>(
    `/api/empresas-usuario/?usuario_token=${token}`
  );
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleToggleDropdown = (empresaId: number) => {
    setDropdownAberto(prev => prev === empresaId ? null : empresaId);
  };

  const isPlanExpired = localStorage.getItem("is_expired_plan");
  const remainingTime = localStorage.getItem("tempo_restante");

  const formatTime = (seconds: number) => {
    if (seconds < 0) seconds = Math.abs(seconds);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const checkIfPlanExpiresSoon = () => {
    if (!remainingTime) return false;
    const secs = Number(remainingTime);
    return secs > 0 && secs < 172800; // < 48h
  };

  useEffect(() => {
    if (isPlanExpired === "true" || checkIfPlanExpiresSoon()) {
      handleShowModal();
    }
  }, [isPlanExpired, remainingTime]);

  const navButtons = [
    { to: "/perfil", icon: FaUserCircle, label: "Perfil & Pagamentos", desc: "Gerencie dados, histórico e planos ativos.", color: "#003087" },
    { to: "/financeiro", icon: FaMoneyBillWave, label: "Relatório Financeiro", desc: "Rendimento, serviços mais rentáveis.", color: "#28a745" },
    { to: "/minhas-empresas", icon: FaCalendarAlt, label: "Agendamentos de Hoje", desc: "Veja os compromissos do dia.", color: "#fd7e14" },
    { to: "/validar-plano", icon: FaCheckSquare, label: "Verificar Plano", desc: "Confirme se seu plano está ativo.", color: "#dc3545" },
    { to: "/cadastros", icon: FaEdit, label: "Cadastros & Serviços", desc: "Crie e gerencie empresas e serviços.", color: "#0056b3" },
    { to: "/checkin", icon: FaSignInAlt, label: "Gerenciar Checkins", desc: "Controle de entrada e saída de clientes.", color: "#343a40" },
  ];

  return (
    <div className="min-vh-100">
      <style>{`
        :root {
          --primary: #003087;
          --primary-dark: #00205b;
          --accent: #f6c107;
          --success: #28a745;
          --warning: #fd7e14;
          --danger: #dc3545;
          --info: #0056b3;
          --dark: #343a40;
          --gray-100: #f8f9fa;
          --gray-200: #e9ecef;
          --gray-600: #6c757d;
          --white: #ffffff;
          --shadow-sm: 0 4px 12px rgba(0,0,0,0.08);
          --shadow-md: 0 8px 25px rgba(0,0,0,0.15);
          --shadow-lg: 0 15px 40px rgba(0,0,0,0.25);
          --radius: 20px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }

        .hero-gradient {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 4rem 0 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero-gradient::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 80%, rgba(246,193,7,0.15), transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1), transparent 50%);
          pointer-events: none;
        }
        .hero-gradient h2 {
          font-size: 3rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          animation: fadeInUp 0.8s ease-out;
        }
        .hero-gradient .lead {
          font-size: 1.25rem;
          max-width: 900px;
          margin: 1rem auto 0;
          opacity: 0.95;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .nav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 2rem 0;
        }
        .nav-card {
          background: white;
          border-radius: var(--radius);
          padding: 1.8rem;
          text-decoration: none;
          color: inherit;
          box-shadow: var(--shadow-md);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
          border: 1px solid var(--gray-200);
        }
        .nav-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 6px;
          background: var(--card-color);
          border-radius: var(--radius) var(--radius) 0 0;
        }
        .nav-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }
        .nav-card .icon {
          font-size: 2.8rem;
          margin-bottom: 1rem;
          color: var(--card-color);
          transition: var(--transition);
        }
        .nav-card:hover .icon {
          animation: pulse 1s infinite;
        }
        .nav-card h5 {
          font-weight: 700;
          font-size: 1.2rem;
          color: #212529;
          margin-bottom: 0.5rem;
        }
        .nav-card p {
          color: var(--gray-600);
          font-size: 0.92rem;
          line-height: 1.5;
        }

        .empresas-section {
          padding: 3rem 0;
        }
        .empresas-section h3 {
          color: var(--primary);
          font-weight: 800;
          font-size: 2rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .empresas-section .subtitle {
          color: var(--gray-600);
          font-size: 1.05rem;
          margin-bottom: 2rem;
        }

        .empresa-item {
          background: white;
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          margin-bottom: 1.5rem;
          border: 1px solid var(--gray-200);
          transition: var(--transition);
        }
        .empresa-header {
          padding: 1.5rem 2rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: var(--transition);
        }
        .empresa-header:hover {
          background: var(--gray-100);
        }
        .empresa-header.active {
          background: linear-gradient(90deg, #e0f2f7, #f0f8ff);
          border-left: 6px solid var(--accent);
        }
        .empresa-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--primary);
        }
        .empresa-title .building-icon {
          color: var(--accent);
        }
        .toggle-btn {
          background: none;
          border: none;
          font-size: 1.4rem;
          color: var(--primary);
          transition: var(--transition);
        }
        .toggle-btn.active {
          color: var(--accent);
          transform: rotate(180deg);
        }

        .dropdown-content {
          padding: 2rem;
          background: white;
          border-top: 1px dashed var(--gray-200);
          animation: fadeInUp 0.4s ease-out;
        }
        .dashboard-placeholder {
          min-height: 300px;
          background: var(--gray-100);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gray-600);
          font-style: italic;
          margin-bottom: 1.5rem;
        }
        .btn-full {
          background: var(--primary);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1.05rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: var(--transition);
        }
        .btn-full:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          background: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
        }
        .empty-state h4 {
          color: var(--info);
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .modal-content {
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
        }
        .modal-header {
          background: var(--danger);
          color: white;
          border-radius: var(--radius) var(--radius) 0 0;
        }
        .modal-header.warning {
          background: var(--warning);
        }
        .modal-body {
          padding: 2rem;
        }
        .alert-box {
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
        }
        .alert-danger { background: #fcebeb; color: var(--danger); }
        .alert-warning { background: #fff8e1; color: var(--warning); }
        .btn-renew {
          background: var(--success);
          color: white;
          padding: 0.9rem 2rem;
          border-radius: 12px;
          font-weight: 700;
        }
        .btn-renew:hover {
          background: #218838;
          transform: translateY(-2px);
        }

        .spinner-container {
          text-align: center;
          padding: 4rem 2rem;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 992px) {
          .nav-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }
        }
        @media (max-width: 768px) {
          .hero-gradient h2 { font-size: 2.2rem; }
          .nav-grid { grid-template-columns: 1fr; }
          .empresa-title { font-size: 1.2rem; }
          .empresa-header { padding: 1.2rem 1.5rem; }
          .dropdown-content { padding: 1.5rem; }
        }
      `}</style>

      <div className="bg-light min-vh-100">
        <Navbar />

        {/* HERO */}
        <header className="hero-gradient">
          <div className="container">
            <h2>Painel Administrativo</h2>
            <p className="lead">
              Gerencie suas empresas, acompanhe métricas em tempo real e otimize seus resultados com inteligência.
            </p>
          </div>
        </header>

        {/* NAV CARDS */}
        <section className="container">
          <div className="nav-grid">
            {navButtons.map((btn, i) => (
              <Link
                key={i}
                to={btn.to}
                className="nav-card"
                style={{ '--card-color': btn.color } as React.CSSProperties}
              >
                <btn.icon className="icon" />
                <h5>{btn.label}</h5>
                <p>{btn.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* EMPRESAS */}
        <section className="container empresas-section">
          <h3>Selecione uma Empresa</h3>
          <p className="subtitle">
            Clique para visualizar dashboards completos com agendamentos, receita e performance.
          </p>

          {empresas_usuario.loading ? (
            <div className="spinner-container">
              <FaSpinner className="spinner" size={40} />
              <p className="mt-3 text-muted">Carregando suas empresas...</p>
            </div>
          ) : empresas_usuario.data?.length ? (
            empresas_usuario.data.map(empresa => (
              <div key={empresa.id} className="empresa-item">
                <div
                  className={`empresa-header ${dropdownAberto === empresa.id ? 'active' : ''}`}
                  onClick={() => handleToggleDropdown(empresa.id)}
                >
                  <div className="empresa-title">
                    <FaBuilding className="building-icon" />
                    {empresa.nome}
                  </div>
                  <button className={`toggle-btn ${dropdownAberto === empresa.id ? 'active' : ''}`}>
                    {dropdownAberto === empresa.id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>

                {dropdownAberto === empresa.id && (
                  <div className="dropdown-content">
                    <div className="dashboard-placeholder">
                      <DashBoardDados empresa_id={empresa.id} />
                    </div>
                    <Link to={`/empresas/${empresa.slug}`} className="btn-full">
                      Gerenciar Empresa
                    </Link>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h4>Nenhuma empresa cadastrada</h4>
              <p>Comece agora e crie sua primeira empresa para gerenciar.</p>
              <Link to="/cadastros" className="btn btn-primary mt-3">
                Cadastrar Empresa
              </Link>
            </div>
          )}
        </section>

        {/* MODAL ALERTA PLANO */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <div className={`modal-header ${isPlanExpired === "true" ? '' : 'warning'}`}>
            <Modal.Title>
              {isPlanExpired === "true" ? (
                <>Plano Expirado</>
              ) : (
                <>Plano Próximo do Vencimento</>
              )}
            </Modal.Title>
          </div>
          <Modal.Body>
            <div className={`alert-box ${isPlanExpired === "true" ? 'alert-danger' : 'alert-warning'}`}>
              {isPlanExpired === "true" ? (
                <>
                  <p><strong>Seu plano expirou há {formatTime(Number(remainingTime))}</strong></p>
                  <p>Funcionalidades limitadas. Renove para continuar com acesso total.</p>
                </>
              ) : (
                <>
                  <p><strong>Faltam menos de 48h para vencer</strong></p>
                  <p>Tempo restante: <strong>{formatTime(Number(remainingTime))}</strong></p>
                </>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center gap-3">
            <Link to="/planos" className="btn-renew">
              Renovar Agora
            </Link>
            <button className="btn btn-outline-secondary" onClick={handleCloseModal}>
              Fechar
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Dashboard;