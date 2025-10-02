import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { FaStar, FaSpinner } from "react-icons/fa6"; // Atualizado para Fa6
import {FaCheckCircle, FaExclamationCircle, FaUserCircle as FaUserCircleSolid} from "react-icons/fa";
import { AvaliacaoAgendamento } from "../interfaces/AvaliacaoAgendamento";
import Navbar from "../components/Navbar";
import axios from "axios";

// Interface para o componente de Avaliação
const AvaliacaoAgendamentoView = () => {
  const { identificador } = useParams<{ identificador: string }>();
  const [nota, setNota] = useState<number>(0);
  const [descricao, setDescricao] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  // Busca de dados
  const { data: agendamentoData, loading } = useFetch<AvaliacaoAgendamento>(
    `/api/agendamento-avaliar/${identificador}`
  );

  // Preenche estados iniciais com dados existentes, se houver
  useEffect(() => {
    if (agendamentoData && agendamentoData.avaliacao_existente) {
      setNota(agendamentoData.nota_avaliacao || 0);
      setDescricao(agendamentoData.descricao_avaliacao || "");
    }
  }, [agendamentoData]);

  const handleStarClick = (valor: number) => {
    if (agendamentoData?.avaliacao_existente) return; // Impede alteração se já avaliado
    setNota(valor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nota === 0 || agendamentoData?.avaliacao_existente) return; // Impede submissão sem nota ou se já avaliado

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const url = import.meta.env.VITE_API_URL;

      const response = await axios.post(
        `${url}/api/agendamento-avaliar/${identificador}/avaliar/`,
        {
          nota_avaliacao: nota,
          descricao_avaliacao: descricao,
          compareceu_agendamento: true, // Assumimos que o cliente avaliando compareceu
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

  // Determina se a avaliação já existe para desabilitar a edição
  const avaliacaoExistente = agendamentoData?.avaliacao_existente || false;
  const isDisabled = isSubmitting || avaliacaoExistente;

  // Função para renderizar as estrelas (usando FaStar Solid)
  const renderStars = () => {
    const isEditing = !avaliacaoExistente;
    return (
      <div className="star-rating" id="star-rating">
        {[1, 2, 3, 4, 5].map((valor) => (
          <FaStar
            key={valor}
            className={`star ${valor <= nota ? "star-filled" : "text-gray-300"} ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={() => isEditing && handleStarClick(valor)}
            onKeyDown={(e) => isEditing && e.key === "Enter" && handleStarClick(valor)}
            aria-label={`Avaliar com ${valor} estrela${valor > 1 ? "s" : ""}`}
            tabIndex={isEditing ? 0 : -1}
          />
        ))}
      </div>
    );
  };


  return (
    <>
      <Navbar />
      <div className="avaliacao-container min-h-screen">
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
            --warning-orange: #ff9800; /* Laranja forte para estrelas */
            --shadow-color: rgba(0, 0, 0, 0.15);
          }

          .avaliacao-container {
            background-color: var(--light-gray-bg);
            background-image: linear-gradient(135deg, var(--light-gray-bg) 0%, var(--white) 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 5rem 1rem;
            min-height: calc(100vh - 56px); /* Ajuste para a navbar */
          }

          .avaliacao-card {
            background-color: var(--white);
            border: 1px solid rgba(0, 48, 135, 0.08);
            border-radius: 28px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
            padding: 3.5rem;
            max-width: 760px;
            width: 100%;
            text-align: center;
            transition: transform 0.4s ease, box-shadow 0.4s ease;
            border-top: 6px solid var(--primary-blue);
          }
          .avaliacao-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
          }

          .avaliacao-card h2 {
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
          .avaliacao-card h2 svg {
              color: var(--warning-orange);
              font-size: 3rem;
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
          .already-rated-message {
            color: var(--success-green);
            font-weight: 700;
            font-size: 1.25rem;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
          }

          .star-rating {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-bottom: 3rem;
          }
          .star {
            transition: color 0.3s ease, transform 0.3s ease;
            font-size: 3.25rem;
            color: var(--gray-300);
          }
          .star-filled {
            color: var(--warning-orange);
          }
          .star:not(.star-filled):hover {
            color: #ffc107; /* Cor de hover */
            transform: scale(1.1);
          }
          .star-rating .cursor-pointer:hover {
            transform: scale(1.15);
          }
          .star-rating .cursor-pointer:focus {
            outline: 3px solid var(--light-blue);
            outline-offset: 4px;
            border-radius: 6px;
          }


          .form-control {
            border: 1px solid #d1d5db;
            border-radius: 16px;
            padding: 1.5rem;
            font-size: 1.1rem;
            color: var(--dark-gray);
            width: 100%;
            resize: vertical;
            min-height: 180px;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }
          .form-control:focus {
            border-color: var(--primary-blue);
            box-shadow: 0 0 0 4px rgba(0, 48, 135, 0.2);
            outline: none;
          }
          .form-control:disabled {
              background-color: #f0f4f8;
              cursor: not-allowed;
          }
          .form-label-title {
              display: block; 
              color: var(--primary-blue); 
              font-weight: 700; 
              margin-bottom: 1rem; 
              font-size: 1.25rem;
          }

          .btn-submit {
            background: linear-gradient(135deg, var(--primary-blue), var(--accent-blue)); /* Gradiente Azul */
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
            box-shadow: 0 6px 16px rgba(0, 48, 135, 0.3);
          }
          .btn-submit:hover {
            background: linear-gradient(135deg, var(--accent-blue), var(--primary-blue));
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0, 48, 135, 0.4);
          }
          .btn-submit:disabled {
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

          @media (max-width: 768px) {
            .avaliacao-card {
              padding: 2.5rem;
            }
            .avaliacao-card h2 {
              font-size: 2.25rem;
            }
            .info-agendamento {
              padding: 2rem;
            }
            .info-agendamento p {
              font-size: 1.1rem;
            }
            .funcionario-foto, .funcionario-foto-placeholder {
              width: 90px;
              height: 90px;
              margin-bottom: 1rem;
            }
            .star {
              font-size: 2.75rem;
              gap: 1rem;
            }
            .btn-submit {
              font-size: 1.2rem;
              padding: 1.1rem 2.5rem;
            }
          }
          @media (max-width: 576px) {
            .avaliacao-card {
              padding: 1.5rem;
              border-radius: 20px;
            }
            .avaliacao-card h2 {
              font-size: 2rem;
              gap: 0.75rem;
            }
            .avaliacao-card h2 svg {
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
            .star {
              font-size: 2.25rem;
              gap: 0.75rem;
            }
            .form-control {
              min-height: 150px;
            }
            .btn-submit {
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
        <section className="avaliacao-card" aria-labelledby="avaliacao-title">
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
              <h2 id="avaliacao-title">
                <FaStar aria-hidden="true" /> {avaliacaoExistente ? "Avaliação Recebida" : "Avaliar Agendamento"}
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
                  <strong>Serviço:</strong> {agendamentoData.servico_nome}
                </p>
                <p>
                  <strong>Funcionário:</strong> {agendamentoData.funcionario.nome}
                </p>
                <p>
                  <strong>Data e Hora:</strong>{" "}
                  {new Date(agendamentoData.data).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })} às {agendamentoData.hora.slice(0, 5)}
                </p>
              </div>

              {avaliacaoExistente && (
                  <div className="already-rated-message">
                      <FaCheckCircle /> Sua avaliação já foi registrada!
                  </div>
              )}

              <form onSubmit={handleSubmit} aria-label="Formulário de avaliação do agendamento">
                <div className="mb-8">
                  <label className="form-label-title" htmlFor="star-rating">
                    Sua Nota (1 a 5 estrelas):
                  </label>
                  {renderStars()}
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="descricao"
                    className="form-label-title"
                  >
                    Comentários (Opcional):
                  </label>
                  <textarea
                    id="descricao"
                    className="form-control"
                    rows={5}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder={avaliacaoExistente ? "Seu comentário foi registrado." : "Descreva sua experiência, elogiando ou sugerindo melhorias..."}
                    aria-label="Descrição da avaliação"
                    disabled={isDisabled}
                  />
                </div>

                {!avaliacaoExistente && (
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={isSubmitting || nota === 0}
                        aria-label="Enviar avaliação"
                    >
                        {isSubmitting ? (
                            <>
                                <FaSpinner className="fa-spin inline" aria-hidden="true" /> Enviando...
                            </>
                        ) : (
                            "Enviar Avaliação"
                        )}
                    </button>
                )}
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