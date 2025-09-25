import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import { Agendamento } from "../interfaces/Agendamento";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import { FaSpinner, FaExclamationCircle, FaQrcode, FaCheckCircle, FaBuilding, FaCalendarDay, FaClock } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";

function CheckInEmpresa() {
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("access_token");
  const empresa = useFetch<Empresa>(`api/empresas-usuario/${id}?usuario_token=${token}`);
  const agendamentos = useFetch<Agendamento[]>(`api/agendamento?empresaId=${id}&usuario_token=${token}`);
  const [showQRCode, setShowQRCode] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<"today" | "pending">("pending");

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Obtém a data de hoje no formato YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0]; // e.g., "2025-09-25"

  // Filtra agendamentos com base no tipo de filtro
  const filteredAgendamentos = agendamentos.data?.filter((agendamento) => {
    if (!agendamento.compareceu_agendamento) {
      if (filterType === "today") {
        return agendamento.data === today;
      }
      return true; // Para "pending", mostra todos os não comparecidos
    }
    return false;
  });

  // Função para simular o check-in (substitua por chamada à API)
  const handleCheckIn = (agendamentoId: number) => {
    alert(`Check-in realizado para o agendamento ID ${agendamentoId}!`);
    setShowQRCode(null); // Esconde o QR code após o check-in
    // Exemplo de chamada à API:
    // fetch(`api/agendamento/${agendamentoId}/checkin`, {
    //   method: "PATCH",
    //   body: JSON.stringify({ compareceu_agendamento: true }),
    //   headers: { "Content-Type": "application/json" },
    // })
    //   .then(() => {
    //     alert("Check-in realizado com sucesso!");
    //     agendamentos.refetch(); // Atualiza a lista de agendamentos
    //   })
    //   .catch(() => alert("Erro ao realizar check-in."));
  };

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
          --gradient-blue: linear-gradient(135deg, #003087, #4dabf7);
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Header */
        .checkin-header {
          background: var(--gradient-blue);
          color: var(--white);
          padding: 4rem 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .checkin-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.2), transparent);
          opacity: 0.3;
        }
        .checkin-header h1 {
          font-weight: 800;
          font-size: 2.8rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        .checkin-header .lead {
          font-size: 1.3rem;
          max-width: 700px;
          margin: 0 auto;
          font-weight: 300;
          position: relative;
        }
        .checkin-header .empresa-info {
          font-size: 1rem;
          margin-top: 1rem;
          color: rgba(255, 255, 255, 0.9);
        }

        /* Seção de Filtros */
        .filter-section {
          padding: 2rem 0;
          text-align: center;
        }
        .filter-section .btn-group {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .filter-section .btn-filter {
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
          border: 1px solid var(--light-blue);
          background-color: var(--white);
          color: var(--primary-blue);
        }
        .filter-section .btn-filter.active {
          background-color: var(--primary-blue);
          color: var(--white);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .filter-section .btn-filter:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Container */
        .checkin-container {
          padding: 3rem 0;
        }
        .checkin-container h2 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Cartões de agendamento */
        .agendamento-card {
          background-color: var(--white);
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 2rem;
          padding: 1.5rem;
          position: relative;
          border: 1px solid rgba(77, 171, 247, 0.2);
        }
        .agendamento-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, #ffffff, #f8fbff);
        }
        .agendamento-card .card-title {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.6rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .agendamento-card .card-text {
          color: var(--dark-gray);
          font-size: 1rem;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .agendamento-card .btn-primary {
          background-color: var(--primary-blue);
          border-color: var(--primary-blue);
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 8px;
          margin: 0.5rem;
          transition: all 0.3s ease;
        }
        .agendamento-card .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .agendamento-card .btn-success {
          background-color: var(--success-green);
          border-color: var(--success-green);
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 8px;
          margin: 0.5rem;
          transition: all 0.3s ease;
        }
        .agendamento-card .btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .agendamento-card .qrcode-container {
          margin: 1.5rem auto;
          padding: 1rem;
          background-color: var(--white);
          border: 2px solid var(--light-blue);
          border-radius: 12px;
          max-width: 200px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Mensagens */
        .message {
          font-size: 1.1rem;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          background-color: var(--white);
        }
        .message.loading {
          color: var(--dark-gray);
        }
        .message.warning {
          color: var(--warning-orange);
        }

        /* Footer */
        .checkin-footer {
          background: var(--gradient-blue);
          color: var(--white);
          padding: 2rem 0;
          text-align: center;
          margin-top: 2rem;
        }
        .checkin-footer p {
          margin: 0;
          font-size: 1rem;
          font-weight: 300;
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .checkin-header, .filter-section, .checkin-container {
            padding: 2rem 1rem;
          }
          .filter-section .btn-group {
            flex-direction: column;
            gap: 0.5rem;
          }
          .agendamento-card .card-title {
            font-size: 1.4rem;
          }
        }
        @media (max-width: 576px) {
          .checkin-header h1 {
            font-size: 2.2rem;
          }
          .checkin-header .lead {
            font-size: 1.1rem;
          }
          .checkin-header .empresa-info {
            font-size: 0.9rem;
          }
          .checkin-container h2 {
            font-size: 1.8rem;
          }
          .agendamento-card .card-title {
            font-size: 1.2rem;
          }
          .agendamento-card .card-text {
            font-size: 0.9rem;
          }
          .agendamento-card .btn-primary, .agendamento-card .btn-success {
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
          }
          .agendamento-card .qrcode-container {
            max-width: 150px;
          }
          .message {
            font-size: 1rem;
            padding: 1rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <header className="checkin-header" data-aos="fade-down">
          <div className="container">
            {empresa.data ? (
              <>
                <h1>
                  <FaBuilding /> Check-In - {empresa.data.nome}
                </h1>
                <p className="lead">
                  Selecione um agendamento para realizar o check-in ou gerar um QR code.
                </p>
                <p className="empresa-info">
                  CNPJ: {empresa.data.cnpj} | {empresa.data.endereco}, {empresa.data.bairro}, {empresa.data.cidade}, {empresa.data.estado}, {empresa.data.pais}
                </p>
              </>
            ) : (
              <h1>
                <FaBuilding /> Carregando Empresa...
              </h1>
            )}
          </div>
        </header>
        <section className="filter-section container" data-aos="fade-up">
          <div className="btn-group">
            <button
              className={`btn-filter ${filterType === "pending" ? "active" : ""}`}
              onClick={() => setFilterType("pending")}
            >
              <FaClock /> Pendentes
            </button>
            <button
              className={`btn-filter ${filterType === "today" ? "active" : ""}`}
              onClick={() => setFilterType("today")}
            >
              <FaCalendarDay /> Hoje
            </button>
          </div>
        </section>
        <div className="checkin-container container">
          <h2 data-aos="fade-up">
            <FaCheckCircle /> Agendamentos {filterType === "today" ? "de Hoje" : "Pendentes"}
          </h2>
          {empresa.loading || agendamentos.loading ? (
            <div className="message loading" data-aos="fade-up">
              <FaSpinner className="fa-spin me-2" /> Carregando dados...
            </div>
          ) : filteredAgendamentos && filteredAgendamentos.length > 0 ? (
            <div className="row justify-content-center">
              {filteredAgendamentos.map((agendamento, index) => (
                <div
                  className="col-12 col-md-6 col-lg-4 mb-4"
                  key={agendamento.id}
                  data-aos="zoom-in"
                  data-aos-delay={100 * (index % 3)}
                >
                  <div className="agendamento-card">
                    <div className="card-body">
                      <h4 className="card-title">{agendamento.servico_nome}</h4>
                      <p className="card-text">
                        <strong>Cliente:</strong> {agendamento.cliente_nome}
                      </p>
                      <p className="card-text">
                        <strong>Funcionário:</strong> {agendamento.funcionario_nome}
                      </p>
                      <p className="card-text">
                        <strong>Data:</strong> {agendamento.data}
                      </p>
                      <p className="card-text">
                        <strong>Hora:</strong> {agendamento.hora}
                      </p>
                      <p className="card-text">
                        <strong>Duração:</strong> {agendamento.duracao_servico} minutos
                      </p>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={() => setShowQRCode(agendamento.id)}
                        >
                          <FaQrcode /> Gerar QR Code
                        </button>
                        <button
                          className="btn btn-success"
                          onClick={() => handleCheckIn(agendamento.id)}
                        >
                          <FaCheckCircle /> Fazer Check-In
                        </button>
                      </div>
                      {showQRCode === agendamento.id && (
                        <div className="qrcode-container">
                          <QRCodeCanvas
                            value={`https://vemagendar.com/checkin/${agendamento.id}`}
                            size={150}
                            level="H"
                            fgColor="#003087"
                            imageSettings={{
                              src: empresa.data?.logo || "https://via.placeholder.com/40",
                              height: 24,
                              width: 24,
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
            <div className="message warning" data-aos="fade-up">
              <FaExclamationCircle /> Nenhum agendamento {filterType === "today" ? "de hoje" : "pendente"} encontrado para esta empresa.
            </div>
          )}
        </div>
        <footer className="checkin-footer" data-aos="fade-up">
          <p>&copy; 2025 VemAgendar. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

export default CheckInEmpresa;