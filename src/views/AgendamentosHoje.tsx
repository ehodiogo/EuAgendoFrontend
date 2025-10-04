import { useState } from "react";
import { Agendamento } from "../interfaces/Agendamento";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import AgendamentoDados from "../components/AgendamentoDados";
import FiltrosAgendamento from "../components/FiltrosAgendamentos";
import { FaTableList, FaCalendarDays, FaSpinner, FaPlus } from "react-icons/fa6";

interface AgendamentosHojeProps {
  empresa: Empresa;
}

export default function AgendamentosHoje({ empresa }: AgendamentosHojeProps) {
  const [visualizacao, setVisualizacao] = useState<"tabela" | "quadro">("tabela");
  const agendamentosHoje = useFetch<Agendamento[]>(
    `/api/agendamentos-hoje/?empresa_id=${empresa.id}`
  );

  const isLocacao = empresa.tipo === "Locação";

  const alternarVisualizacao = (tipo: "tabela" | "quadro") => {
    setVisualizacao(tipo);
  };

  const MINUTE_SCALE = 2;
  const HOUR_HEIGHT = 60 * MINUTE_SCALE;

    if(agendamentosHoje.loading || !agendamentosHoje.data) {
        return (
            <div className="agendamentos-view-wrapper">
                <div className="loading-container status-message">
                    <FaSpinner className="fa-spin me-3" /> Carregando agendamentos...
                </div>
            </div>
        );
    }

  return (
    <div className="agendamentos-view-wrapper">
      <style>{`
        /* Paleta de cores (Ajustada para o tema VemAgendar) */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --light-gray-bg: #f5f7fa;
          --white: #ffffff;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --warning-orange: #fd7e14;
        }

        /* Estilos do Container Principal (dentro do Dropdown da Empresa) */
        .agendamentos-view-wrapper {
          padding: 0; 
        }

        .agendamentos-header {
            margin-bottom: 1.5rem;
            text-align: center;
        }

        .agendamentos-header h4 {
          color: var(--dark-gray);
          font-weight: 700;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }
        .agendamentos-header h4 svg {
            color: var(--primary-blue);
        }

        .agendamentos-header p {
            font-size: 1.05rem;
            color: var(--dark-gray);
            opacity: 0.85;
            font-weight: 500;
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
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 2px solid var(--primary-blue);
        }
        .view-toggle-buttons .btn-primary {
          background-color: var(--primary-blue);
          border-color: var(--primary-blue);
          color: var(--white);
          box-shadow: 0 4px 10px rgba(0, 48, 135, 0.2);
        }
        .view-toggle-buttons .btn-outline-primary {
          background-color: var(--white);
          color: var(--primary-blue);
        }
        .view-toggle-buttons .btn:hover:not(.active) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .view-toggle-buttons .btn.active {
          background-color: var(--accent-blue);
          border-color: var(--accent-blue);
          color: var(--white);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 48, 135, 0.3);
        }

        /* Tabela */
        .table-responsive-view {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          background-color: var(--white);
        }
        .table-responsive-view .table {
            margin-bottom: 0;
        }
        .table-responsive-view .table thead th {
          background-color: var(--primary-blue);
          color: var(--white);
          font-weight: 600;
          text-align: left;
          padding: 1rem 1.5rem;
        }
        .table-responsive-view .table tbody td {
          vertical-align: top;
          padding: 0; /* O padding será inserido no componente AgendamentoDados */
          color: var(--dark-gray);
        }

        /* Quadro de Horários (Timeline) */
        .quadro-container {
          position: relative;
          background-color: var(--white);
          border-radius: 12px;
          padding-left: 70px; /* espaço à esquerda para labels das horas */
          padding-right: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          min-height: 24 * 120px; /* 24h x 120px (2px/min) */
          overflow-y: auto;
          margin-top: 1rem;
          border: 1px solid #e2e8f0;
        }
        
        .hora-bloco {
          position: relative;
          border-bottom: 1px dashed #e0e0e0;
          height: ${HOUR_HEIGHT}px; /* 1 hora = 120px */
        }
        .hora-bloco:last-child {
            border-bottom: none;
        }
        
        .hora-label {
          color: var(--dark-gray);
          font-size: 0.95rem;
          position: absolute;
          left: -70px;
          top: -10px; /* Alinhar com o início do bloco */
          width: 60px;
          text-align: right;
          padding-right: 10px;
          font-weight: 600;
          opacity: 0.7;
        }
        
        .card-agendamento {
            background-color: var(--accent-blue);
            color: var(--white);
            border-radius: 6px;
            overflow: hidden;
            position: absolute;
            left: 0;
            right: 0;
            z-index: 10;
            border: 2px solid rgba(255, 255, 255, 0.7);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
        }
        .card-agendamento:hover {
            z-index: 20;
            transform: scale(1.01);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .card-agendamento > div {
            /* Estilo para garantir que AgendamentoDados se encaixe bem */
            padding: 0.5rem;
            font-size: 0.9rem;
            line-height: 1.3;
        }
        
        .agendamento-dados-inline {
            /* Estilos mínimos para AgendamentoDados dentro do Quadro */
            color: var(--white);
            font-size: 0.85rem;
        }
        .agendamento-dados-inline strong {
            font-weight: 700;
        }

        /* Mensagens de Status */
        .status-message {
            text-align: center;
            font-size: 1.25rem;
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            margin-top: 2rem;
            font-weight: 600;
        }

        .loading-container {
          color: var(--primary-blue);
          background-color: #e0e7ff;
        }

        .empty-container {
          color: var(--dark-gray);
          background-color: var(--white);
          border: 1px solid #e2e8f0;
        }

        .error-container {
          color: var(--danger-red);
          background-color: #fcebeb;
          border: 1px solid var(--danger-red);
          font-weight: 700;
        }

        .btn-add-agendamento {
            background-color: var(--primary-blue);
            border: none;
            color: var(--white);
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 1.5rem;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        .btn-add-agendamento:hover {
            background-color: var(--accent-blue);
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 48, 135, 0.3);
        }

        @media (max-width: 768px) {
          .quadro-container {
            padding-left: 60px;
          }
          .hora-label {
            left: -60px;
            width: 50px;
          }
        }
        
        @media (max-width: 576px) {
          .agendamentos-header h4 {
            font-size: 1.5rem;
          }
          .view-toggle-buttons {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .view-toggle-buttons .btn {
            width: 100%;
          }
          .status-message {
            font-size: 1.1rem;
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="agendamentos-header">
          <h4>
            <FaCalendarDays /> Agendamentos de Hoje
          </h4>
          <p>
            Agenda diária para a empresa <strong>{empresa.nome}</strong> ({isLocacao ? "Locação" : "Serviços"}).
          </p>
      </div>

      <div className="view-toggle-buttons">
        <button
          className={`btn ${visualizacao === "tabela" ? "btn-primary active" : "btn-outline-primary"}`}
          onClick={() => alternarVisualizacao("tabela")}
          aria-label="Visualizar em Tabela"
        >
          <FaTableList /> Visualização em Tabela
        </button>
        <button
          className={`btn ${visualizacao === "quadro" ? "btn-primary active" : "btn-outline-primary"}`}
          onClick={() => alternarVisualizacao("quadro")}
          aria-label="Visualizar em Quadro de Horários"
        >
          <FaCalendarDays /> Quadro de Horários
        </button>
      </div>

      {agendamentosHoje.data.length === 0 ? (
        <div className="empty-container status-message">
          Não há agendamentos para hoje na empresa {empresa.nome}.
          <br />
          <a href="/cadastros-usuario" className="btn-add-agendamento">
            <FaPlus /> Criar Novo Agendamento
          </a>
        </div>
      ) : (
        <>
          {visualizacao === "tabela" ? (
            <div className="table-responsive-view">
              <div className="mb-3 p-3">
                <FiltrosAgendamento />
              </div>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Agendamentos ({agendamentosHoje.data.length})</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentosHoje.data.map((agendamento: Agendamento) => (
                    <tr key={agendamento.id}>
                      <td>
                        <AgendamentoDados agendamento={agendamento} empresaTipo={empresa.tipo} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="quadro-container">
              {[...Array(24)].map((_, hour) => {
                const horaLabel = hour.toString().padStart(2, "0") + ":00";

                // @ts-ignore
                  const agendamentosHora = agendamentosHoje.data.filter(ag => {
                    const [agHour] = ag.hora.split(":");
                    return parseInt(agHour, 10) === hour;
                });

                return (
                  <div key={hour} className="hora-bloco">
                    {hour % 1 === 0 && <div className="hora-label">{horaLabel}</div>}

                    {agendamentosHora.length > 0 &&
                      agendamentosHora.map(ag => {
                        const [ , startMin] = ag.hora.split(":").map(Number);
                        const duracao = Number(ag.duracao_servico);
                        const topOffsetPx = startMin * MINUTE_SCALE;
                        const alturaPx = duracao * MINUTE_SCALE;

                        const detalhePrincipal = isLocacao
                            ? ag.locacao_nome
                            : ag.servico_nome;

                        const detalheSecundario = isLocacao
                            ? ""
                            : `com ${ag.funcionario_nome}`;

                        return (
                          <div
                            key={ag.id}
                            className="card-agendamento"
                            style={{
                              top: `${topOffsetPx}px`,
                              height: `${alturaPx}px`,
                              backgroundColor: `hsl(${ag.id % 360}, 50%, 45%)`,
                            }}
                          >
                            <div className="agendamento-dados-inline">
                                <strong>{ag.hora.slice(0, 5)} - {ag.cliente_nome}</strong>
                                <div>{detalhePrincipal} {detalheSecundario}</div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}