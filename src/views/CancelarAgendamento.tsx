import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { FaSpinner, FaExclamationCircle, FaCheckCircle, FaUserCircle, FaTimesCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import axios from "axios";

interface Agendamento {
  cliente_nome: string;
  servico_nome: string;
  funcionario: { nome: string; foto?: string };
  data: string;
  hora: string;
}

const CancelarAgendamentoView = () => {
  const { identificador } = useParams<{ identificador: string }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const { data: agendamentoData, loading } = useFetch<Agendamento>(
    `/api/agendamento/detalhe/${identificador}`
  );

  console.log("Agendamento",  agendamentoData);

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const url = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `${url}/api/agendamento/${identificador}/cancelar/`,
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        setSubmitStatus("success");
      }
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="cancelamento-container min-h-screen bg-gradient-to-b from-light-gray via-white to-light-blue/10 flex items-center justify-center py-14">
        <style>{`
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

          .cancelamento-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 3rem 1rem;
          }

          .cancelamento-card {
            background-color: var(--white);
            border: 1px solid rgba(0, 48, 135, 0.08);
            border-radius: 24px;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.07);
            padding: 3.5rem;
            max-width: 720px;
            width: 100%;
            text-align: center;
            transition: transform 0.4s ease, box-shadow 0.4s ease;
          }
          .cancelamento-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
          }

          .cancelamento-card h2 {
            color: var(--primary-blue);
            font-weight: 800;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            font-family: 'Inter', sans-serif;
            letter-spacing: -0.03em;
          }

          .info-agendamento {
            background-color: var(--light-gray);
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 3rem;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.04);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }
          .info-agendamento p {
            color: var(--dark-gray);
            font-size: 1.2rem;
            margin-bottom: 1.25rem;
            font-family: 'Inter', sans-serif;
            line-height: 1.7;
          }
          .info-agendamento p strong {
            color: var(--primary-blue);
            font-weight: 700;
          }

          .funcionario-foto {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--light-blue);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }
          .funcionario-foto:hover {
            transform: scale(1.05);
          }
          .funcionario-foto-placeholder {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: var(--light-gray);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--light-blue);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            font-size: 3rem;
            color: var(--dark-gray);
          }

          .btn-cancel {
            background: linear-gradient(135deg, var(--danger-red), #b02a37);
            color: var(--white);
            padding: 1.1rem 3rem;
            border-radius: 14px;
            font-size: 1.25rem;
            font-weight: 700;
            font-family: 'Inter', sans-serif;
            transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            width: 100%;
            max-width: 360px;
            margin: 0 auto;
            box-shadow: 0 6px 16px rgba(220, 53, 69, 0.25);
          }
          .btn-cancel:hover {
            background: linear-gradient(135deg, #a12331, #9b1d2a);
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(220, 53, 69, 0.35);
          }
          .btn-cancel:disabled {
            background: #d1d5db;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
            animation: pulse 1.8s infinite;
          }
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.65; }
            100% { opacity: 1; }
          }

          .message {
            font-size: 1.2rem;
            padding: 1.75rem;
            border-radius: 14px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            background-color: var(--white);
            font-family: 'Inter', sans-serif;
            margin-top: 2.5rem;
            max-width: 560px;
            width: 100%;
            opacity: 0;
            transform: translateY(10px);
            animation: fadeIn 0.5s ease forwards;
          }
          .message.success {
            color: var(--success-green);
            border: 2px solid var(--success-green);
          }
          .message.error {
            color: var(--danger-red);
            border: 2px solid var(--danger-red);
          }
          .message.loading {
            color: var(--dark-gray);
            border: 2px solid var(--dark-gray);
          }
          @keyframes fadeIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            .cancelamento-container {
              padding: 2.5rem 1rem;
            }
            .cancelamento-card {
              padding: 2.5rem;
            }
            .cancelamento-card h2 {
              font-size: 2.25rem;
            }
            .info-agendamento {
              padding: 1.75rem;
            }
            .info-agendamento p {
              font-size: 1.1rem;
            }
            .funcionario-foto, .funcionario-foto-placeholder {
              width: 80px;
              height: 80px;
            }
            .btn-cancel {
              font-size: 1.15rem;
              padding: 1rem 2.5rem;
              max-width: 320px;
            }
            .message {
              font-size: 1.1rem;
              padding: 1.5rem;
            }
          }
          @media (max-width: 576px) {
            .cancelamento-container {
              padding: 2rem 0.75rem;
            }
            .cancelamento-card {
              padding: 2rem;
            }
            .cancelamento-card h2 {
              font-size: 1.875rem;
            }
            .info-agendamento {
              padding: 1.5rem;
            }
            .info-agendamento p {
              font-size: 1rem;
              margin-bottom: 0.875rem;
            }
            .funcionario-foto, .funcionario-foto-placeholder {
              width: 60px;
              height: 60px;
            }
            .btn-cancel {
              font-size: 1.05rem;
              padding: 0.875rem 2rem;
              max-width: 280px;
            }
            .message {
              font-size: 1rem;
              padding: 1.25rem;
              max-width: 100%;
            }
          }
        `}</style>
        <section className="cancelamento-card" aria-labelledby="cancelamento-title">
          {loading ? (
            <div className="message loading">
              <FaSpinner className="fa-spin text-xl" aria-hidden="true" /> Carregando agendamento...
            </div>
          ) : !agendamentoData ? (
            <div className="message error">
              <FaExclamationCircle className="text-xl" aria-hidden="true" /> Agendamento não encontrado.
            </div>
          ) : (
            <>
              <h2 id="cancelamento-title">
                <FaTimesCircle className="text-danger-red text-4xl" aria-hidden="true" /> Cancelar Agendamento
              </h2>
              <div className="info-agendamento">
                {agendamentoData.funcionario.foto ? (
                  <img
                    src={agendamentoData.funcionario.foto}
                    alt={`Foto de ${agendamentoData.funcionario.nome}`}
                    className="funcionario-foto"
                  />
                ) : (
                  <div className="funcionario-foto-placeholder">
                    <FaUserCircle />
                  </div>
                )}
                <p>
                  <strong>Cliente:</strong> {agendamentoData.cliente_nome}
                </p>
                <p>
                  <strong>Serviço:</strong> {agendamentoData.servico_nome}
                </p>
                <p>
                  <strong>Funcionário:</strong> {agendamentoData.funcionario.nome}
                </p>
                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(agendamentoData.data).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <strong>Hora:</strong> {agendamentoData.hora.slice(0, 5)}
                </p>
              </div>
              <form onSubmit={handleCancel} aria-label="Formulário de cancelamento do agendamento">
                <p className="text-dark-gray mb-8 text-lg">
                  Tem certeza de que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                </p>
                <button
                  type="submit"
                  className="btn-cancel"
                  disabled={isSubmitting}
                  aria-label="Confirmar cancelamento"
                >
                  {isSubmitting ? (
                    <FaSpinner className="fa-spin inline mr-2 text-xl" aria-hidden="true" />
                  ) : (
                    "Confirmar Cancelamento"
                  )}
                </button>
              </form>
              {submitStatus === "success" && (
                <div className="message success">
                  <FaCheckCircle className="text-xl" aria-hidden="true" /> Agendamento cancelado com sucesso!
                </div>
              )}
              {submitStatus === "error" && (
                <div className="message error">
                  <FaExclamationCircle className="text-xl" aria-hidden="true" /> Erro ao cancelar agendamento. Tente novamente.
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default CancelarAgendamentoView;