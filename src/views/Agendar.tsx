import { useFetch } from "../functions/GetData";
import { ServicosFuncionariosEmpresa } from "../interfaces/ServicosFuncionarios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import HorariosTabela from "../components/TabelaHorario";
import Navbar from "../components/Navbar";
import { FaCalendar, FaUserTie, FaSpinner, FaExclamationCircle, FaTimes } from "react-icons/fa";

const Agendar = () => {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const empresasData = useFetch<ServicosFuncionariosEmpresa[]>(
    `/api/empresaservico/?empresa_nome=${empresaNome}`
  );
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<number | null>(null);

  const handleClearSelection = () => {
    setFuncionarioSelecionado(null);
  };

  return (
    <div className="min-vh-100">
      <style>{`
        /* Reset global styles to prevent white bar */
        body {
          margin: 0;
          padding: 0;
        }

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

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
          margin: 0;
          padding: 0;
        }

        /* Container */
        .agendar-container {
          padding: 0 0 3rem 0;
          margin-top: 0;
        }

        /* Header */
        .agendar-header {
          background-color: var(--primary-blue);
          color: var(--white);
          padding: 3rem 0;
          text-align: center;
          margin-top: 0;
          border-top: none;
        }
        .agendar-header h1 {
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .agendar-header .lead {
          font-size: 1.25rem;
          max-width: 800px;
          margin: 0 auto;
        }

        /* Funcionários Section */
        .funcionarios-section {
          padding: 3rem 0;
          text-align: center;
        }
        .funcionarios-section h2 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .funcionarios-section .card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          cursor: pointer;
          height: 100%;
        }
        .funcionarios-section .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .funcionarios-section .card.selected {
          border: 2px solid blue;
        }
        .funcionarios-section .card-img-top {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 50%;
          margin: 1rem auto;
        }
        .funcionarios-section .card-title {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
        .funcionarios-section .card-body h6 {
          color: var(--danger-red);
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.75rem;
        }
        .funcionarios-section .list-unstyled {
          font-size: 1rem;
          color: var(--dark-gray);
        }
        .funcionarios-section .badge {
          background-color: var(--light-blue);
          color: var(--dark-gray);
          font-size: 0.9rem;
          padding: 0.5rem;
          border-radius: 6px;
        }

        /* Horários Section */
        .horarios-section {
          padding-bottom: 3rem;
          text-align: center;
        }
        .horarios-section .btn-clear {
          background-color: var(--warning-orange);
          border-color: var(--warning-orange);
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 8px;
          color: var(--white);
          transition: all 0.3s ease;
        }
        .horarios-section .btn-clear:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
        }
        .message.loading {
          color: var(--dark-gray);
          background-color: var(--white);
        }
        .message.error {
          color: var(--danger-red);
          background-color: var(--white);
        }
        .message.warning {
          color: var(--warning-orange);
          background-color: var(--white);
        }

        /* Footer */
        .agendar-footer {
          background-color: var(--primary-blue);
          color: var(--white);
          padding: 1.5rem 0;
          text-align: center;
        }
        .agendar-footer p {
          margin: 0;
          font-size: 1rem;
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .agendar-container, .funcionarios-section, .horarios-section {
            padding: 2rem 1rem;
          }
          .agendar-header h1 {
            font-size: 2rem;
          }
          .agendar-header .lead {
            font-size: 1.1rem;
          }
          .funcionarios-section h2 {
            font-size: 1.5rem;
          }
        }
        @media (max-width: 576px) {
          .agendar-header h1 {
            font-size: 1.75rem;
          }
          .funcionarios-section .card {
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
          }
          .funcionarios-section .card-img-top {
            width: 100px;
            height: 100px;
          }
          .funcionarios-section .card-title {
            font-size: 1.1rem;
          }
          .funcionarios-section .list-unstyled, .funcionarios-section .badge {
            font-size: 0.9rem;
          }
          .message {
            font-size: 1rem;
            padding: 1rem;
          }
          .horarios-section .btn-clear {
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="agendar-container">
          {empresasData.loading ? (
            <div className="message loading" data-aos="fade-up">
              <FaSpinner className="fa-spin me-2" /> Carregando dados da empresa...
            </div>
          ) : !empresasData.data || empresasData.data.length === 0 ? (
            <div className="message error" data-aos="fade-up">
              <FaExclamationCircle /> Empresa não encontrada.
            </div>
          ) : (
            <>
              <header className="agendar-header" data-aos="fade-down">
                <div className="container">
                  <h1>
                    <FaCalendar /> Agendamento de Serviços
                  </h1>
                  <p className="lead">
                    Escolha um funcionário e marque seu horário facilmente.
                  </p>
                </div>
              </header>
              <section className="funcionarios-section container" data-aos="fade-up">
                <h2>
                  <FaUserTie /> Escolha um Funcionário
                </h2>
                <div className="row justify-content-center mt-4">
                  {empresasData.data[0].funcionarios.length > 0 ? (
                    empresasData.data[0].funcionarios.map((funcionario, index) => (
                      <div
                        key={index}
                        className="col-md-4 mb-4"
                        data-aos="zoom-in"
                        data-aos-delay={index * 100}
                      >
                        <div
                          className={`card ${funcionarioSelecionado === funcionario.id ? "selected" : ""}`}
                          onClick={() => setFuncionarioSelecionado(funcionario.id)}
                        >
                          <img
                            src={funcionario.foto_url || "https://via.placeholder.com/120x120?text=Sem+Foto"}
                            alt={funcionario.nome}
                            className="card-img-top"
                          />
                          <div className="card-body">
                            <h5 className="card-title">{funcionario.nome}</h5>
                            <h6>Serviços:</h6>
                            <ul className="list-unstyled">
                              {funcionario.servicos && funcionario.servicos.length > 0 ? (
                                funcionario.servicos.map((servico, i) => (
                                  <li
                                    key={i}
                                    className="d-flex justify-content-between align-items-center"
                                  >
                                    <span>{servico.nome}</span>
                                    <span className="badge">
                                      R${servico.preco} | {servico.duracao}min
                                    </span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-muted">Nenhum serviço disponível</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="message warning" data-aos="fade-up">
                      <FaExclamationCircle /> Nenhum funcionário disponível no momento.
                    </div>
                  )}
                </div>
              </section>
              <section className="horarios-section container" data-aos="fade-up">
                {funcionarioSelecionado ? (
                  <>
                    <HorariosTabela
                      funcionario_id={funcionarioSelecionado}
                      servicos={
                        empresasData.data[0].funcionarios.find(
                          (f) => f.id === funcionarioSelecionado
                        )?.servicos || []
                      }
                      key={funcionarioSelecionado}
                    />
                    <button
                      className="btn-clear mt-3"
                      onClick={handleClearSelection}
                    >
                      <FaTimes /> Limpar Seleção
                    </button>
                  </>
                ) : (
                  <div className="message warning">
                    <FaExclamationCircle /> Selecione um funcionário para ver os horários disponíveis.
                  </div>
                )}
              </section>
              <footer className="agendar-footer">
                <p>&copy; 2025 VemAgendar. Todos os direitos reservados.</p>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agendar;