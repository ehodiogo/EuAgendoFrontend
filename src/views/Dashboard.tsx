"use client";
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
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { Empresa } from "../interfaces/Empresa";
import { useFetch } from "../functions/GetData";
import DashBoardDados from "../components/DashboardDados";
import { Modal } from "react-bootstrap";
import { FaChartLine, FaExclamationTriangle, FaClock  } from "react-icons/fa";

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
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const token = localStorage.getItem("access_token");
  const empresas_usuario = useFetch<Empresa[]>(
    `api/empresas-usuario/?usuario_token=${token}`
  );
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleToggleDropdown = async (empresaId: number) => {
    if (dropdownAberto === empresaId) {
      setDropdownAberto(null);
      return;
    }
    setDropdownAberto(empresaId);
  };

  const isPlanExpired = localStorage.getItem("is_expired_plan");
  const remainingTime = localStorage.getItem("tempo_restante");

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const checkIfPlanExpiresTomorrow = () => {
    if (remainingTime) {
      const remainingTimeInSeconds = Number(remainingTime);
      const remainingTimeInHours = remainingTimeInSeconds / 3600;
      const remainingTimeInDays = remainingTimeInHours / 24;
      return remainingTimeInDays < 2;
    }
    return false;
  };

  useEffect(() => {
    if (isPlanExpired === "true" || checkIfPlanExpiresTomorrow()) {
      handleShowModal();
    }
  }, []);

  return (
    <div className="min-vh-100">
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
          --warning-orange: #fd7e14;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Container */
        .dashboard-container {
          padding: 3rem 0;
        }
        .dashboard-container h2 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .dashboard-container .lead {
          color: var(--dark-gray);
          font-size: 1.25rem;
          max-width: 800px;
          margin: 0 auto 2rem;
          text-align: center;
        }

        /* Cartão principal */
        .dashboard-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        /* Botões de navegação */
        .nav-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .nav-button {
          flex: 1;
          min-width: 220px;
          max-width: 280px;
        }
        .nav-button .btn {
          width: 100%;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .nav-button .btn-primary {
          background-color: var(--primary-blue);
          border-color: var(--primary-blue);
        }
        .nav-button .btn-success {
          background-color: var(--success-green);
          border-color: var(--success-green);
        }
        .nav-button .btn-warning {
          background-color: var(--accent-yellow);
          border-color: var(--accent-yellow);
          color: var(--dark-gray);
        }
        .nav-button .btn-danger {
          background-color: var(--danger-red);
          border-color: var(--danger-red);
        }
        .nav-button .btn-info {
          background-color: var(--light-blue);
          border-color: var(--light-blue);
          color: var(--white);
        }
        .nav-button .btn-toggle-checkin {
          color: var(--white);
        }
        .nav-button .btn-toggle-checkin.stop {
          background-color: var(--danger-red);
          border-color: var(--danger-red);
        }
        .nav-button .btn-toggle-checkin.stop:hover {
          background-color: #c82333;
          border-color: #c82333;
        }
        .nav-button .btn-toggle-checkin.start {
          background-color: var(--success-green);
          border-color: var(--success-green);
        }
        .nav-button .btn-toggle-checkin.start:hover {
          background-color: #218838;
          border-color: #218838;
        }
        .nav-button .btn-toggle-checkin:disabled {
          background-color: #6c757d;
          border-color: #6c757d;
          cursor: not-allowed;
        }
        .nav-button .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .nav-button p {
          color: var(--dark-gray);
          font-size: 0.9rem;
          margin-top: 0.5rem;
          text-align: center;
        }

        /* Cartões de empresa */
        .empresa-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 1.5rem;
          padding: 1.5rem;
        }
        .empresa-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .empresa-card .card-title {
          color: var(--primary-blue);
          font-weight: 600;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .empresa-card .card-text {
          color: var(--dark-gray);
          font-size: 1rem;
        }
        .dropdown-card {
          background-color: var(--light-gray);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .dropdown-card .btn-primary {
          background-color: var(--primary-blue);
          border-color: var(--primary-blue);
          padding: 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .dropdown-card .btn-primary:hover {
          background-color: var(--light-blue);
          border-color: var(--light-blue);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(77, 171, 247, 0.3);
        }

        /* Modal */
        .modal-content {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .modal-header {
          background-color: var(--primary-blue);
          color: var(--white);
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
        .modal-title {
          font-weight: 700;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .modal-body {
          padding: 2rem;
        }
        .modal-body p {
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        .modal-body .text-danger {
          color: var(--danger-red);
          font-weight: 600;
        }
        .modal-body .text-warning {
          color: var(--warning-orange);
          font-weight: 600;
        }
        .modal-footer .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
        }
        .modal-footer .btn-success {
          background-color: var(--success-green);
          border-color: var(--success-green);
        }
        .modal-footer .btn-danger {
          background-color: var(--danger-red);
          border-color: var(--danger-red);
        }
        .modal-footer .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .dashboard-container {
            padding: 2rem 1rem;
          }
          .nav-buttons {
            flex-direction: column;
            align-items: center;
          }
          .nav-button {
            min-width: 100%;
            max-width: 100%;
          }
          .empresa-card .card-title {
            font-size: 1.25rem;
          }
        }
        @media (max-width: 576px) {
          .dashboard-container h2 {
            font-size: 2rem;
          }
          .dashboard-container .lead {
            font-size: 1.1rem;
          }
          .nav-button .btn {
            font-size: 0.9rem;
          }
          .nav-button p {
            font-size: 0.85rem;
          }
          .modal-title {
            font-size: 1.25rem;
          }
          .modal-body p {
            font-size: 1rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="dashboard-container container">
          <h2 data-aos="fade-up">
            <FaChartLine /> Painel do Usuário
          </h2>
          <p className="lead" data-aos="fade-up" data-aos-delay="100">
            Bem-vindo ao seu painel! Aqui você pode gerenciar suas configurações e
            visualizar seus dados.
          </p>
          <div className="dashboard-card" data-aos="fade-up" data-aos-delay="200">
            <div className="nav-buttons">
              <div className="nav-button">
                <Link to="/perfil" className="btn btn-primary">
                  Perfil e Pagamentos
                </Link>
                <p>Gerencie suas informações pessoais, histórico de pagamentos e planos ativos.</p>
              </div>
              <div className="nav-button">
                <Link to="/financeiro" className="btn btn-success">
                  Relatório Financeiro
                </Link>
                <p>Acompanhe seu rendimento, serviços mais e menos rentáveis.</p>
              </div>
              <div className="nav-button">
                <Link to="/minhas-empresas" className="btn btn-warning">
                  Agendamentos de Hoje
                </Link>
                <p>Verifique os agendamentos de suas empresas para hoje.</p>
              </div>
              <div className="nav-button">
                <Link to="/validar-plano" className="btn btn-danger">
                  Verificar Plano
                </Link>
                <p>Verifique o status do seu plano se ele ainda não está ativo.</p>
              </div>
              <div className="nav-button">
                <Link to="/cadastros-usuario" className="btn btn-info">
                  Cadastros
                </Link>
                <p>Crie, altere e exclua empresas, serviços e funcionários.</p>
              </div>
              <div className="nav-button">
                <Link to="/checkin" className="btn btn-dark">
                  Checkins
                </Link>
                <p>Gerencie os checkins das suas empresas.</p>
              </div>
            </div>
            <p className="lead" data-aos="fade-up" data-aos-delay="300">
              Selecione uma empresa para ver seus dados de Dashboard.
            </p>
            <div className="row justify-content-center">
              {empresas_usuario.data?.map((empresa: Empresa) => (
                <div
                  className="col-12 mb-4"
                  key={empresa.id}
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <div
                    className="empresa-card"
                    onClick={() => handleToggleDropdown(empresa.id)}
                  >
                    <div className="card-body text-center">
                      <h4 className="card-title">{empresa.nome}</h4>
                      <p className="card-text">{empresa.cnpj}</p>
                    </div>
                  </div>
                  {dropdownAberto === empresa.id && (
                    <div
                      className="dropdown-card"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <DashBoardDados empresa_id={empresa.id} />
                      <Link
                        to={`/empresas/${empresa.nome}`}
                        className="btn btn-primary mt-3 w-100"
                      >
                        Ver Detalhes da Empresa
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Modal
          show={
            (isPlanExpired === "true" || checkIfPlanExpiresTomorrow()) &&
            showModal
          }
          onHide={handleCloseModal}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaExclamationTriangle /> Status do Plano
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isPlanExpired === "true" ? (
              <div className="text-center">
                <p className="text-danger">
                  <FaExclamationTriangle className="me-1" /> Seu plano expirou há{" "}
                  <span className="fw-bold">
                    {formatTime(Math.abs(Number(remainingTime)))}
                  </span>
                  . Renovação necessária!
                </p>
                <p className="text-warning">
                  Não se preocupe! Você ainda pode acessar o painel, mas algumas
                  funcionalidades podem estar limitadas. Renove seu plano para
                  continuar usando a plataforma. Agendamentos seguem permitidos
                  para hoje e amanhã.
                </p>
              </div>
            ) : checkIfPlanExpiresTomorrow() ? (
              <div className="text-center">
                <p className="text-warning">
                  <FaClock className="me-1" /> Seu plano vencerá amanhã. Por
                  favor, renove-o em breve.
                </p>
              </div>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Link to="/planos" className="btn btn-success">
              Renovar Plano
            </Link>
            <button className="btn btn-danger" onClick={handleCloseModal}>
              Fechar
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Dashboard;