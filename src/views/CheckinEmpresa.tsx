import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import { Agendamento } from "../interfaces/Agendamento";
import Navbar from "../components/Navbar";
import { FaSpinner, FaQrcode, FaBuilding, FaCalendarDay, FaClock, FaUser, FaToolbox, FaArrowRightToBracket } from "react-icons/fa6";
import { QRCodeCanvas } from "qrcode.react";
import {FaExclamationCircle} from "react-icons/fa";

function CheckInEmpresa() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const empresa = useFetch<Empresa>(`/api/empresa/${empresaId}`);
  const agendamentos = useFetch<Agendamento[]>(`/api/agendamento-avaliar/sem-comparecimento/?empresa_id=${empresaId}`);

  const [showQRCode, setShowQRCode] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<"today" | "pending">("pending");
  const [isCheckingIn, setIsCheckingIn] = useState<number | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const filteredAgendamentos = agendamentos.data?.filter((agendamento) => {
    if (!agendamento.compareceu_agendamento) {
      if (filterType === "today") {
        return agendamento.data === today;
      }
      return true;
    }
    return false;
  }).sort((a, b) => {
      const dateA = new Date(`${a.data}T${a.hora}`);
      const dateB = new Date(`${b.data}T${b.hora}`);
      return dateA.getTime() - dateB.getTime();
  });

  const handleCheckIn = async (agendamentoIdentificador: string, agendamentoId: number) => {
    setIsCheckingIn(agendamentoId);
    setShowQRCode(null);

    const baseUrl = import.meta.env.VITE_API_URL;
    const endpointPath = `/api/agendamento-avaliar/${agendamentoIdentificador}/marcar-compareceu/`;
    const checkinUrl = `${baseUrl}${endpointPath}`;

    try {
      console.log(`Iniciando check-in para o identificador ${agendamentoIdentificador} na URL: ${checkinUrl}`);

      const response = await fetch(checkinUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Check-in Response:", data.message);

        alert("Check-in realizado com sucesso! Atualizando lista...");

        window.location.reload();

      } else {
        const errorData = await response.json();
        console.error("Erro no check-in:", errorData);
        alert(`Erro ao realizar check-in: ${errorData.message || response.statusText}`);
      }

    } catch (error) {
      console.error("Erro de Rede/Fetch:", error);
      alert(`Erro inesperado ao realizar check-in para o identificador ${agendamentoIdentificador}.`);
    } finally {
      setIsCheckingIn(null);
    }
  };

  return (
    <div className="min-vh-100">
      <style>{`
        /* Paleta de cores (Ajustada) */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --light-gray: #f5f7fa;
          --white: #ffffff;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --warning-orange: #fd7e14;
          --gradient-blue: linear-gradient(135deg, #003087, #0056b3);
          --border-light: #e0e0e0;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Header */
        .checkin-header {
          background: var(--gradient-blue);
          color: var(--white);
          padding: 3rem 0;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .checkin-header h1 {
          font-weight: 800;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .checkin-header .lead {
          font-size: 1.2rem;
          font-weight: 300;
        }
        .checkin-header .empresa-info {
          font-size: 0.9rem;
          margin-top: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
        }

        /* Seção de Filtros */
        .filter-section {
          padding: 1.5rem 0;
          text-align: center;
          background-color: var(--white);
          border-bottom: 1px solid var(--border-light);
        }
        .filter-section .btn-group {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .filter-section .btn-filter {
          padding: 0.6rem 1.2rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
          border: 2px solid var(--primary-blue);
          background-color: var(--white);
          color: var(--primary-blue);
        }
        .filter-section .btn-filter.active {
          background-color: var(--primary-blue);
          color: var(--white);
          box-shadow: 0 4px 10px rgba(0, 48, 135, 0.3);
        }
        .filter-section .btn-filter:hover {
          background-color: var(--accent-blue);
          color: var(--white);
        }

        /* Container Principal */
        .checkin-container {
          padding: 3rem 0;
        }
        .checkin-container h2 {
          color: var(--dark-gray);
          font-weight: 700;
          font-size: 1.8rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        /* Cartões de agendamento (Novo Layout) */
        .agendamento-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          border-left: 5px solid var(--primary-blue);
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .agendamento-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        .agendamento-info {
            flex-grow: 1;
        }

        .agendamento-card .card-title {
          color: var(--dark-gray);
          font-weight: 700;
          font-size: 1.4rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 0.5rem;
          text-align: left;
        }

        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          font-size: 1rem;
          color: var(--dark-gray);
        }
        .info-item svg {
          color: var(--primary-blue);
          font-size: 1.2rem;
          margin-right: 0.75rem;
          flex-shrink: 0;
        }
        .info-item strong {
            font-weight: 600;
            color: var(--accent-blue);
        }

        /* Ações e QR Code */
        .agendamento-actions {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px dashed var(--border-light);
            text-align: center;
        }
        .agendamento-card .btn-checkin {
          background-color: var(--success-green);
          border-color: var(--success-green);
          padding: 0.8rem 1.5rem;
          font-weight: 700;
          border-radius: 8px;
          margin: 0.5rem;
          transition: all 0.3s ease;
        }
        .agendamento-card .btn-checkin:hover {
          background-color: #218838;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
        }
        .agendamento-card .btn-qrcode {
          background-color: var(--primary-blue);
          border-color: var(--primary-blue);
          padding: 0.8rem 1.5rem;
          font-weight: 600;
          border-radius: 8px;
          margin: 0.5rem;
        }
        .agendamento-card .btn-qrcode:hover {
          background-color: var(--accent-blue);
        }
        .agendamento-card .qrcode-container {
          margin: 1.5rem auto 0;
          padding: 1rem;
          background-color: var(--light-gray);
          border: 2px solid var(--primary-blue);
          border-radius: 12px;
          max-width: 220px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Mensagens (Loading, Vazio, Erro) */
        .message {
          font-size: 1.1rem;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          background-color: var(--white);
        }
        .message.loading {
          color: var(--primary-blue);
          border: 1px solid var(--border-light);
        }
        .message.warning {
          color: var(--warning-orange);
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
        }

        /* Responsividade */
        @media (max-width: 576px) {
          .checkin-header h1 { font-size: 2rem; }
          .checkin-header .lead { font-size: 1rem; }
          .agendamento-card .card-title { font-size: 1.25rem; }
          .info-item { font-size: 0.9rem; }
          .agendamento-actions .btn { width: 100%; margin: 0.5rem 0; }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <header className="checkin-header">
          <div className="container">
            {empresa.loading ? (
                 <h1><FaBuilding /> Carregando Empresa...</h1>
            ) : (
              <>
                <h1>
                  <FaBuilding /> Check-In - {empresa.data?.nome || "Empresa Desconhecida"}
                </h1>
                <p className="lead">
                  Gerencie os agendamentos pendentes da sua empresa com facilidade.
                </p>
                <p className="empresa-info">
                  {empresa.data?.cnpj} | {empresa.data?.cidade}, {empresa.data?.estado}
                </p>
              </>
            )}
          </div>
        </header>

        <section className="filter-section container">
          <div className="btn-group">
            <button
              className={`btn-filter ${filterType === "pending" ? "active" : ""}`}
              onClick={() => setFilterType("pending")}
            >
              <FaClock className="me-2" /> Agendamentos Pendentes
            </button>
            <button
              className={`btn-filter ${filterType === "today" ? "active" : ""}`}
              onClick={() => setFilterType("today")}
            >
              <FaCalendarDay className="me-2" /> Agendamentos de Hoje
            </button>
          </div>
        </section>

        <div className="checkin-container container">
          <h2>
            {filterType === "today" ? "Próximos Agendamentos de Hoje" : "Todos os Agendamentos Pendentes"}
          </h2>

          {agendamentos.loading ? (
            <div className="message loading">
              <FaSpinner className="fa-spin me-2" /> Carregando lista de agendamentos...
            </div>
          ) : filteredAgendamentos && filteredAgendamentos.length > 0 ? (

            <div className="row justify-content-center">
              {filteredAgendamentos.map((agendamento) => (
                <div
                  className="col-12 col-md-6 col-lg-4 d-flex"
                  key={agendamento.id}
                >
                  <div className="agendamento-card w-100">
                    <div className="agendamento-info">
                      <h4 className="card-title">{agendamento.servico_nome}</h4>

                      <div className="info-item">
                        <FaUser />
                        <span><strong>Cliente</strong>: <strong>{agendamento.cliente_nome}</strong></span>
                      </div>

                      <div className="info-item">
                        <FaToolbox />
                        <span><strong>Funcionário:</strong> {agendamento.funcionario_nome}</span>
                      </div>

                      <div className="info-item">
                        <FaCalendarDay />
                        <span><strong>Data:</strong> {agendamento.data}</span>
                      </div>

                      <div className="info-item">
                        <FaClock />
                        <span><strong>Hora:</strong> {agendamento.hora} (Duração: {agendamento.duracao_servico} min)</span>
                      </div>
                    </div>

                    <div className="agendamento-actions">
                      <button
                        className="btn btn-checkin"
                        onClick={() => handleCheckIn(agendamento.identificador, agendamento.id)}
                        disabled={isCheckingIn === agendamento.id}
                      >
                        {isCheckingIn === agendamento.id ? (
                          <>
                            <FaSpinner className="fa-spin me-2" /> Registrando...
                          </>
                        ) : (
                          <>
                            <FaArrowRightToBracket /> Fazer Check-In
                          </>
                        )}
                      </button>

                      <button
                        className={`btn btn-qrcode ${showQRCode === agendamento.id ? 'active' : ''}`}
                        onClick={() => setShowQRCode(showQRCode === agendamento.id ? null : agendamento.id)}
                        disabled={isCheckingIn !== null}
                      >
                        <FaQrcode /> {showQRCode === agendamento.id ? 'Fechar QR Code' : 'Gerar QR Code'}
                      </button>

                      {showQRCode === agendamento.id && (
                        <div className="qrcode-container">
                          <QRCodeCanvas
                            value={`https://vemagendar.com.br/agendamento/${agendamento.identificador}/avaliar`}
                            size={180}
                            level="H"
                            fgColor="#003087"
                            imageSettings={{
                              src: empresa.data?.logo || "https://via.placeholder.com/40",
                              height: 30,
                              width: 30,
                              excavate: true,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="message warning">
              <FaExclamationCircle className="me-2" /> Nenhum agendamento <strong>{filterType === "today" ? "de hoje" : "pendente"}</strong> encontrado para esta empresa.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckInEmpresa;