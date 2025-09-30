import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { FaStar, FaSpinner, FaExclamationCircle, FaCheckCircle, FaUserCircle } from "react-icons/fa";
import { AvaliacaoAgendamento } from "../interfaces/AvaliacaoAgendamento";
import Navbar from "../components/Navbar";
import axios from "axios";

const AvaliacaoAgendamentoView = () => {
  const { identificador } = useParams<{ identificador: string }>();
  const [nota, setNota] = useState<number>(0);
  const [descricao, setDescricao] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const { data: agendamentoData, loading } = useFetch<AvaliacaoAgendamento>(
    `api/agendamento-avaliar/${identificador}`
  );

  useEffect(() => {
    if (agendamentoData) {
      setNota(agendamentoData.nota_avaliacao || 0);
      setDescricao(agendamentoData.descricao_avaliacao || "");
    }
  }, [agendamentoData]);

  const handleStarClick = (valor: number) => {
    setNota(valor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const url = import.meta.env.VITE_API_URL;

      const response = await axios.post(
        `${url}/api/agendamento-avaliar/${identificador}/avaliar/`,
        {
          nota_avaliacao: nota,
          descricao_avaliacao: descricao,
          compareceu_agendamento: true,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        setSubmitStatus("success");
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };


  return (
    <>
      <Navbar />
      <div className="avaliacao-container min-h-screen bg-gradient-to-b from-light-gray via-white to-light-blue/10 flex items-center justify-center py-14">
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

          .avaliacao-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 3rem 1rem;
          }

          .avaliacao-card {
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
          .avaliacao-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
          }

          .avaliacao-card h2 {
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

          .star-rating {
            display: flex;
            justify-content: center;
            gap: 1.25rem;
            margin-bottom: 3rem;
          }
          .star {
            cursor: pointer;
            transition: color 0.3s ease, transform 0.3s ease;
            font-size: 2.75rem;
          }
          .star:hover {
            transform: scale(1.2);
          }
          .star.active {
            color: var(--warning-orange);
            transform: scale(1.15);
          }
          .star:focus {
            outline: 2px solid var(--light-blue);
            outline-offset: 3px;
            border-radius: 6px;
          }

          .form-control {
            border: 1px solid var(--light-blue);
            border-radius: 14px;
            padding: 1.5rem;
            font-size: 1.1rem;
            color: var(--dark-gray);
            width: 100%;
            resize: vertical;
            min-height: 160px;
            font-family: 'Inter', sans-serif;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }
          .form-control:focus {
            border-color: var(--primary-blue);
            box-shadow: 0 0 12px rgba(0, 48, 135, 0.3);
            outline: none;
          }

          .btn-submit {
            background: linear-gradient(135deg, var(--primary-blue), #0053a0);
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
            box-shadow: 0 6px 16px rgba(0, 48, 135, 0.25);
          }
          .btn-submit:hover {
            background: linear-gradient(135deg, #002070, #003f87);
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0, 48, 135, 0.35);
          }
          .btn-submit:disabled {
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
            .avaliacao-container {
              padding: 2.5rem 1rem;
            }
            .avaliacao-card {
              padding: 2.5rem;
            }
            .avaliacao-card h2 {
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
            .star {
              font-size: 2.5rem;
            }
            .form-control {
              font-size: 1.05rem;
              padding: 1.25rem;
            }
            .btn-submit {
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
            .avaliacao-container {
              padding: 2rem 0.75rem;
            }
            .avaliacao-card {
              padding: 2rem;
            }
            .avaliacao-card h2 {
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
            .star {
              font-size: 2.25rem;
            }
            .form-control {
              font-size: 1rem;
              padding: 1rem;
              min-height: 140px;
            }
            .btn-submit {
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
        <section className="avaliacao-card" aria-labelledby="avaliacao-title">
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
              <h2 id="avaliacao-title">
                <FaStar className="text-warning-orange text-4xl" aria-hidden="true" /> Avaliar Agendamento
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
              <form onSubmit={handleSubmit} aria-label="Formulário de avaliação do agendamento">
                <div className="mb-8">
                  <label className="block text-primary-blue font-semibold mb-4 text-xl" htmlFor="star-rating">
                    Sua Avaliação (1 a 5 estrelas):
                  </label>
                  <div className="star-rating" id="star-rating">
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <FaStar
                        key={valor}
                        className={`star ${valor <= nota ? "active" : "text-gray-300"}`}
                        onClick={() => handleStarClick(valor)}
                        onKeyDown={(e) => e.key === "Enter" && handleStarClick(valor)}
                        aria-label={`Avaliar com ${valor} estrela${valor > 1 ? "s" : ""}`}
                        tabIndex={0}
                      />
                    ))}
                  </div>
                </div>
                <div className="mb-8">
                  <label
                    htmlFor="descricao"
                    className="block text-primary-blue font-semibold mb-4 text-xl"
                  >
                    Comentários:
                  </label>
                  <textarea
                    id="descricao"
                    className="form-control"
                    rows={5}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva sua experiência..."
                    aria-label="Descrição da avaliação"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting || nota === 0}
                  aria-label="Enviar avaliação"
                >
                  {isSubmitting ? (
                    <FaSpinner className="fa-spin inline mr-2 text-xl" aria-hidden="true" />
                  ) : (
                    "Enviar Avaliação"
                  )}
                </button>
              </form>
              {submitStatus === "success" && (
                <div className="message success">
                  <FaCheckCircle className="text-xl" aria-hidden="true" /> Avaliação enviada com sucesso!
                </div>
              )}
              {submitStatus === "error" && (
                <div className="message error">
                  <FaExclamationCircle className="text-xl" aria-hidden="true" /> Erro ao enviar avaliação. Tente novamente.
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default AvaliacaoAgendamentoView;