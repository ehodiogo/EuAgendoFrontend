import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { FaSpinner, FaBan } from "react-icons/fa6";
import {FaCheckCircle, FaExclamationCircle, FaUserCircle as FaUserCircleSolid}  from "react-icons/fa";
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
      setTimeout(() => setSubmitStatus(null), 3500);
    }
  };

  return (
    <>
      <Navbar />
      <div className="cancelamento-container min-h-screen">
        <style>{`
          /* Paleta de Cores (Consistente) */
          :root {
            --primary-blue: #003087;
            --accent-blue: #0056b3;
            --dark-gray: #212529;
            --light-gray-bg: #f5f7fa;
            --white: #ffffff;
            --success-green: #28a745;
            --danger-red: #dc3545;
            --shadow-color: rgba(0, 0, 0, 0.15);
          }

          .cancelamento-container {
            background-color: var(--light-gray-bg);
            background-image: linear-gradient(135deg, var(--light-gray-bg) 0%, var(--white) 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 5rem 1rem;
            min-height: calc(100vh - 56px);
          }

          .cancelamento-card {
            background-color: var(--white);
            border: 1px solid rgba(0, 48, 135, 0.08);
            border-radius: 28px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
            padding: 3.5rem;
            max-width: 760px;
            width: 100%;
            text-align: center;
            transition: transform 0.4s ease, box-shadow 0.4s ease;
            border-top: 6px solid var(--danger-red); /* Borda vermelha para indicar cancelamento */
          }
          .cancelamento-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
          }

          .cancelamento-card h2 {
            color: var(--dark-gray);
            font-weight: 800;
            font-size: 2.75rem;
            margin-bottom: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            letter-spacing: -0.05em;
          }
          .cancelamento-card h2 svg {
              color: var(--danger-red);
              font-size: 3rem;
          }
          .cancelamento-card p.alert-message {
            color: var(--dark-gray);
            font-size: 1.15rem;
            margin-bottom: 2.5rem;
            font-weight: 500;
          }
          .cancelamento-card p.alert-message strong {
              color: var(--danger-red);
              font-weight: 700;
          }

          .info-agendamento {
            background-color: var(--light-gray-bg);
            border-radius: 20px;
            padding: 2.5rem;
            margin-bottom: 3rem;
            box-shadow: inset 0 3px 10px rgba(0, 0, 0, 0.08);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            border: 1px solid rgba(0, 48, 135, 0.1);
          }
          .info-agendamento p {
            color: var(--dark-gray);
            font-size: 1.15rem;
            margin: 0;
            line-height: 1.6;
          }
          .info-agendamento p strong {
            color: var(--primary-blue);
            font-weight: 700;
            margin-right: 0.5rem;
          }

          .funcionario-foto {
            width: 110px;
            height: 110px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid var(--accent-blue);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            margin-bottom: 1.5rem;
          }
          .funcionario-foto-placeholder {
            width: 110px;
            height: 110px;
            border-radius: 50%;
            background-color: #e0e7ff;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 4px solid var(--accent-blue);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            font-size: 3.5rem;
            color: var(--primary-blue);
            margin-bottom: 1.5rem;
          }

          .btn-cancel {
            background: linear-gradient(135deg, var(--danger-red), #a12331);
            color: var(--white);
            padding: 1.2rem 3rem;
            border-radius: 16px;
            font-size: 1.3rem;
            font-weight: 800;
            transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
            box-shadow: 0 6px 16px rgba(220, 53, 69, 0.3);
            border: none;
          }
          .btn-cancel:hover {
            background: linear-gradient(135deg, #a12331, var(--danger-red));
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(220, 53, 69, 0.4);
          }
          .btn-cancel:disabled {
            background: #d1d5db;
            color: var(--dark-gray);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
            opacity: 0.8;
          }

          .message {
            font-size: 1.2rem;
            padding: 1.75rem;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            font-weight: 600;
            margin-top: 2.5rem;
            max-width: 600px;
            width: 100%;
            opacity: 0;
            transform: translateY(10px);
            animation: fadeIn 0.5s ease forwards;
          }
          .message.success {
            color: var(--success-green);
            background-color: #d4edda;
            border: 2px solid var(--success-green);
          }
          .message.error {
            color: var(--danger-red);
            background-color: #fcebeb;
            border: 2px solid var(--danger-red);
          }
          .message.loading {
            color: var(--dark-gray);
            background-color: #f0f4f8;
            border: 2px solid var(--dark-gray);
          }
          @keyframes fadeIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Responsividade */
          @media (max-width: 768px) {
            .cancelamento-card {
              padding: 2.5rem;
            }
            .cancelamento-card h2 {
              font-size: 2.25rem;
            }
            .info-agendamento {
              padding: 2rem;
            }
            .funcionario-foto, .funcionario-foto-placeholder {
              width: 90px;
              height: 90px;
              margin-bottom: 1rem;
            }
            .btn-cancel {
              font-size: 1.2rem;
              padding: 1.1rem 2.5rem;
            }
          }
          @media (max-width: 576px) {
            .cancelamento-card {
              padding: 1.5rem;
              border-radius: 20px;
            }
            .cancelamento-card h2 {
              font-size: 2rem;
              gap: 0.75rem;
            }
            .cancelamento-card h2 svg {
                font-size: 2.25rem;
            }
            .info-agendamento {
              padding: 1.5rem;
            }
            .info-agendamento p {
              font-size: 1rem;
            }
            .funcionario-foto, .funcionario-foto-placeholder {
              width: 70px;
              height: 70px;
              font-size: 3rem;
            }
            .btn-cancel {
              font-size: 1.1rem;
              padding: 1rem 2rem;
              max-width: 100%;
            }
            .message {
              font-size: 1.05rem;
              padding: 1.25rem;
              max-width: 100%;
            }
          }
        `}</style>
        <section className="cancelamento-card" aria-labelledby="cancelamento-title">
          {loading ? (
            <div className="message loading">
              <FaSpinner className="fa-spin text-xl" aria-hidden="true" /> Carregando detalhes do agendamento...
            </div>
          ) : !agendamentoData ? (
            <div className="message error">
              <FaExclamationCircle className="text-xl" aria-hidden="true" /> Agendamento não encontrado ou link inválido.
            </div>
          ) : (
            <>
              <h2 id="cancelamento-title">
                <FaBan aria-hidden="true" /> Cancelar Agendamento
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
                    <FaUserCircleSolid />
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
                <p className="alert-message">
                  Atenção: Tem certeza de que deseja <strong>cancelar</strong> este agendamento? Esta ação não poderá ser desfeita.
                </p>
                <button
                  type="submit"
                  className="btn-cancel"
                  disabled={isSubmitting}
                  aria-label="Confirmar cancelamento"
                >
                  {isSubmitting ? (
                    <>
                        <FaSpinner className="fa-spin inline" aria-hidden="true" /> Processando...
                    </>
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
                  <FaExclamationCircle className="text-xl" aria-hidden="true" /> Erro ao cancelar agendamento. O agendamento pode já ter sido cancelado ou concluído.
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