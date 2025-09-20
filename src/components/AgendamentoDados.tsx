import { Agendamento } from "../interfaces/Agendamento";
import { useFetch } from "../functions/GetData";
import { Funcionario } from "../interfaces/Funcionario";
import { Cliente } from "../interfaces/Cliente";
import { Servico } from "../interfaces/Servico";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaUserTie, FaUser, FaTools, FaClock, FaSpinner, FaExclamationCircle } from "react-icons/fa";

interface AgendamentoDadosProps {
  agendamento: Agendamento;
}

const AgendamentoDados = ({ agendamento }: AgendamentoDadosProps) => {
  const funcionario = useFetch<Funcionario>(`api/funcionario/${agendamento.funcionario}`);
  const cliente = useFetch<Cliente>(`api/cliente/${agendamento.cliente}`);
  const servico = useFetch<Servico>(`api/servico/${agendamento.servico}`);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

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
          --success-green: #28a745;
          --danger-red: #dc3545;
          --warning-orange: #fd7e14;
        }

        /* Card */
        .agendamento-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          max-width: 600px;
          margin: 0 auto;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .agendamento-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        /* Lista de Detalhes */
        .agendamento-details {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .agendamento-details li {
          display: flex;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--light-blue);
          font-size: 1rem;
          color: var(--dark-gray);
        }
        .agendamento-details li:last-child {
          border-bottom: none;
        }
        .agendamento-details li strong {
          color: var(--primary-blue);
          font-weight: 600;
          width: 150px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .agendamento-details li span {
          flex-grow: 1;
        }

        /* Mensagens */
        .message {
          font-size: 1.1rem;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: var(--white);
        }
        .message.loading {
          color: var(--dark-gray);
        }
        .message.error {
          color: var(--danger-red);
        }

        /* Responsividade */
        @media (max-width: 576px) {
          .agendamento-card {
            padding: 1rem;
          }
          .agendamento-details li {
            font-size: 0.9rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
          .agendamento-details li strong {
            width: auto;
          }
          .message {
            font-size: 1rem;
            padding: 1rem;
          }
        }
      `}</style>
      {funcionario.loading || cliente.loading || servico.loading ? (
        <div className="message loading" data-aos="fade-up">
          <FaSpinner className="fa-spin me-2" /> Carregando detalhes do agendamento...
        </div>
      ) : funcionario.error || cliente.error || servico.error ? (
        <div className="message error" data-aos="fade-up">
          <FaExclamationCircle /> Erro ao carregar detalhes: {funcionario.error || cliente.error || servico.error}
        </div>
      ) : !funcionario.data || !cliente.data || !servico.data ? (
        <div className="message error" data-aos="fade-up">
          <FaExclamationCircle /> Dados do agendamento não disponíveis.
        </div>
      ) : (
        <div className="agendamento-card" data-aos="fade-up">
          <ul className="agendamento-details">
            <li>
              <strong><FaUserTie /> Funcionário:</strong>
              <span>{funcionario.data.nome}</span>
            </li>
            <li>
              <strong><FaUser /> Cliente:</strong>
              <span>{cliente.data.nome}</span>
            </li>
            <li>
              <strong><FaTools /> Serviço:</strong>
              <span>{servico.data.nome}</span>
            </li>
            <li>
              <strong><FaClock /> Hora:</strong>
              <span>{agendamento.hora}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AgendamentoDados;