import { Agendamento } from "../interfaces/Agendamento";
import { useFetch } from "../functions/GetData";
import { Funcionario } from "../interfaces/Funcionario";
import { Cliente } from "../interfaces/Cliente";
import { Servico } from "../interfaces/Servico";
import { FaUserTie, FaUser, FaToolbox, FaRegClock, FaSpinner, FaIdBadge } from "react-icons/fa6";

interface AgendamentoDadosProps {
  agendamento: Agendamento;
}

const AgendamentoDados = ({ agendamento }: AgendamentoDadosProps) => {
  const funcionario = useFetch<Funcionario>(`/api/funcionario/${agendamento.funcionario}`);
  const cliente = useFetch<Cliente>(`/api/cliente/${agendamento.cliente}`);
  const servico = useFetch<Servico>(`/api/servico/${agendamento.servico}`);

  const isLoading = funcionario.loading || cliente.loading || servico.loading;

  if (!servico.data || !funcionario.data || !cliente.data) {
    return <></>;
  }

  return (
    <div className="agendamento-dados-wrapper">
      <style>{`
        /* Paleta de cores (Consistente com o tema) */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --light-gray-bg: #f5f7fa;
          --white: #ffffff;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --shadow-color: rgba(0, 0, 0, 0.1);
        }

        /* Container Principal - Garante que o padding seja aplicado aqui */
        .agendamento-dados-wrapper {
            padding: 1rem 1.5rem; 
            width: 100%;
            margin: 0;
        }

        /* Card (Opcional, usado se o componente for standalone) */
        .agendamento-card-details {
          background-color: var(--white);
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 1.5rem;
          max-width: 700px;
          margin: 0 auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        /* Como o componente é usado dentro de uma tabela/timeline, a borda e sombra
           são aplicadas ao elemento pai, então vou usar um estilo de lista limpa aqui. */

        /* Lista de Detalhes */
        .agendamento-details {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 0.5rem 1.5rem;
        }
        .agendamento-details.list-style-display {
            display: block;
        }
        .agendamento-details li {
          display: flex;
          align-items: center;
          padding: 0.5rem 0;
          font-size: 1rem;
          color: var(--dark-gray);
          border-bottom: 1px solid #f0f4f8; /* Linha sutil */
        }
        .agendamento-details.list-style-display li {
             border-bottom: 1px dashed #e2e8f0;
        }
        .agendamento-details li:last-child {
          border-bottom: none;
        }
        .agendamento-details li strong {
          color: var(--primary-blue);
          font-weight: 700;
          min-width: 100px; 
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          flex-shrink: 0;
          margin-right: 0.5rem;
        }
        .agendamento-details li strong svg {
            color: var(--accent-blue);
            font-size: 1.15rem;
        }
        .agendamento-details li span {
          flex-grow: 1;
          font-weight: 500;
        }
        .agendamento-details li span.hora-destaque {
            color: var(--danger-red);
            font-weight: 700;
            font-size: 1.1rem;
        }
        .agendamento-details.list-style-display li span {
            font-size: 1rem;
        }


        /* Mensagens de Status */
        .message-status {
          font-size: 1rem;
          padding: 0.75rem;
          border-radius: 8px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 600;
        }
        .message-status.loading {
          color: var(--primary-blue);
          background-color: #e0e7ff;
        }
        .message-status.error {
          color: var(--danger-red);
          background-color: #fcebeb;
        }

        /* Responsividade */
        @media (max-width: 768px) {
            .agendamento-details {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 576px) {
          .agendamento-details li {
            padding: 0.5rem 0;
            font-size: 0.95rem;
          }
          .agendamento-details li strong {
            font-size: 0.9rem;
          }
          .message-status {
            font-size: 0.9rem;
            padding: 0.5rem;
          }
        }
      `}</style>
      {isLoading ? (
        <div className="message-status loading">
          <FaSpinner className="fa-spin" aria-hidden="true" /> Carregando detalhes...
        </div>
      ) : (
        <div className="agendamento-card-details">
          <ul className="agendamento-details">
             <li>
                <strong><FaIdBadge /> ID:</strong>
                <span>{agendamento.id}</span>
              </li>
            <li>
              <strong><FaRegClock /> Horário:</strong>
              <span className="hora-destaque">{agendamento.hora.slice(0, 5)}</span>
            </li>
            <li>
              <strong><FaUserTie /> Funcionário:</strong>
              <span>{funcionario.data.nome}</span>
            </li>
            <li>
              <strong><FaUser /> Cliente:</strong>
              <span>{cliente.data.nome}</span>
            </li>
            <li>
              <strong><FaToolbox /> Serviço:</strong>
              <span>{servico.data.nome} (Duração: {servico.data.duracao || '?'} min)</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AgendamentoDados;