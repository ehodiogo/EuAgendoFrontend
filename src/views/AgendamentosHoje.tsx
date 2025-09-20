import { useState, useEffect } from "react";
import { Agendamento } from "../interfaces/Agendamento";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import AgendamentoDados from "../components/AgendamentoDados";
import FiltrosAgendamento from "../components/FiltrosAgendamentos";
import { FaTable, FaCalendar, FaSpinner } from "react-icons/fa";
import "aos/dist/aos.css";
import AOS from "aos";

interface AgendamentosHojeProps {
  empresa: Empresa;
}

export default function AgendamentosHoje({ empresa }: AgendamentosHojeProps) {
  const [visualizacao, setVisualizacao] = useState<"tabela" | "quadro">("tabela");
  const agendamentosHoje = useFetch<Agendamento[]>(
    `api/agendamentos-hoje/?empresa_id=${empresa.id}`
  );

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const alternarVisualizacao = (tipo: "tabela" | "quadro") => {
    console.log(`Visualização alterada para: ${tipo}`);
    setVisualizacao(tipo);
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
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Container */
        .agendamentos-container {
          padding: 3rem 0;
        }
        .agendamentos-container h1 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .agendamentos-container .lead {
          color: var(--dark-gray);
          font-size: 1.25rem;
          max-width: 800px;
          margin: 0 auto 2rem;
          text-align: center;
        }

        /* Botões de visualização */
        .view-toggle-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .view-toggle-buttons .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .view-toggle-buttons .btn-primary {
          background-color: var(--primary-blue);
          border-color: var(--primary-blue);
          color: var(--white);
        }
        .view-toggle-buttons .btn-outline-primary {
          border-color: var(--primary-blue);
          color: var(--primary-blue);
        }
        .view-toggle-buttons .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .view-toggle-buttons .btn.active {
          background-color: var(--light-blue);
          border-color: var(--light-blue);
          color: var(--white);
        }

        /* Tabela */
        .table-responsive {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          background-color: var(--white);
        }
        .table {
          margin-bottom: 0;
        }
        .table thead th {
          background-color: var(--primary-blue);
          color: var(--white);
          font-weight: 600;
          text-align: center;
          padding: 1rem;
        }
        .table tbody td {
          vertical-align: middle;
          padding: 1rem;
          color: var(--dark-gray);
        }

        /* Placeholder para quadro de horários */
        .quadro-placeholder {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          text-align: center;
        }
        .quadro-placeholder p {
          color: var(--dark-gray);
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        .quadro-placeholder .text-warning {
          color: var(--warning-orange);
          font-weight: 600;
        }
        .quadro-placeholder .btn {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .quadro-placeholder .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Loading e erro */
        .loading-container, .error-container, .empty-container {
          text-align: center;
          color: var(--dark-gray);
          font-size: 1.25rem;
          padding: 2rem;
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .error-container {
          color: var(--danger-red);
          font-weight: 500;
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .agendamentos-container {
            padding: 2rem 1rem;
          }
          .view-toggle-buttons {
            flex-direction: column;
            align-items: center;
          }
          .view-toggle-buttons .btn {
            width: 100%;
            max-width: 200px;
          }
        }
        @media (max-width: 576px) {
          .agendamentos-container h1 {
            font-size: 2rem;
          }
          .agendamentos-container .lead {
            font-size: 1.1rem;
          }
          .view-toggle-buttons .btn {
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
          }
          .table thead th, .table tbody td {
            font-size: 0.85rem;
            padding: 0.75rem;
          }
          .quadro-placeholder p {
            font-size: 1rem;
          }
          .loading-container, .error-container, .empty-container {
            font-size: 1.1rem;
            padding: 1.5rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <div className="agendamentos-container container">
          <h1 data-aos="fade-up">
            <FaCalendar /> Agendamentos para Hoje
          </h1>
          <p className="lead" data-aos="fade-up" data-aos-delay="100">
            Confira os agendamentos para hoje na empresa <strong>{empresa.nome}</strong>.
          </p>
          <div className="view-toggle-buttons" data-aos="fade-up" data-aos-delay="200">
            <button
              className={`btn ${visualizacao === "tabela" ? "btn-primary active" : "btn-outline-primary"}`}
              onClick={() => alternarVisualizacao("tabela")}
            >
              <FaTable /> Tabela
            </button>
            <button
              className={`btn ${visualizacao === "quadro" ? "btn-primary active" : "btn-outline-primary"}`}
              onClick={() => alternarVisualizacao("quadro")}
            >
              <FaCalendar /> Quadro de Horários
            </button>
          </div>
          {agendamentosHoje.loading ? (
            <div className="loading-container" data-aos="fade-up" data-aos-delay="300">
              <FaSpinner className="fa-spin me-2" /> Carregando agendamentos...
            </div>
          ) : agendamentosHoje.error ? (
            <div className="error-container" data-aos="fade-up" data-aos-delay="300">
              Erro ao carregar agendamentos: {agendamentosHoje.error}
            </div>
          ) : !agendamentosHoje.data || agendamentosHoje.data.length === 0 ? (
            <div className="empty-container" data-aos="fade-up" data-aos-delay="300">
              Não há agendamentos para hoje.
              <br />
              <a href="/cadastros-usuario" className="btn btn-primary mt-3">
                Criar Novo Agendamento
              </a>
            </div>
          ) : (
            visualizacao === "tabela" ? (
              <div className="table-responsive" data-aos="fade-up" data-aos-delay="400">
                <div className="mb-3">
                  <FiltrosAgendamento />
                </div>
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Detalhes dos Agendamentos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentosHoje.data.map((agendamento: Agendamento) => (
                      <tr key={agendamento.id}>
                        <td>
                          <AgendamentoDados agendamento={agendamento} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="quadro-placeholder" data-aos="fade-up" data-aos-delay="400">
                <p>
                  O quadro de horários está em{" "}
                  <span className="text-warning">desenvolvimento</span>.
                </p>
                <p className="text-muted">
                  Enquanto isso, use a visualização em tabela para gerenciar seus agendamentos.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => alternarVisualizacao("tabela")}
                >
                  Ver em Tabela
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}