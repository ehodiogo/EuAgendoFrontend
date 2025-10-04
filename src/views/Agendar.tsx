import { useFetch } from "../functions/GetData";
import { ServicosFuncionariosEmpresa } from "../interfaces/ServicosFuncionarios";
import { useParams } from "react-router-dom";
import { useState } from "react";
// Importamos HorariosTabela e TabelaHorario (assumindo que são o mesmo componente)
import HorariosTabela from "../components/TabelaHorario";
import Navbar from "../components/Navbar";
import {
  FaCalendarAlt, FaUserTie, FaSpinner, FaExclamationCircle, FaTimesCircle,
  FaChevronRight, FaClock, FaDollarSign, FaHome, FaTag
} from "react-icons/fa";
// Importação redundante removida para limpeza
// import TabelaHorario from "../components/TabelaHorario";

// 1. Definição da Interface Locacao
export interface Locacao {
    id?: number;
    nome: string;
    descricao: string;
    duracao: string; // Ex: '6h', '1 dia'
    preco: string;
}

// 2. Interface Unificada
interface EmpresaGeral extends ServicosFuncionariosEmpresa {
    tipo: "Serviço" | "Locação";
    locacoes: Locacao[]; // Incluído para Locação
}


const Agendar = () => {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();

  // Estado para Serviço
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<number | null>(null);

  // NOVO Estado para Locação
  const [locacaoSelecionadaId, setLocacaoSelecionadaId] = useState<number | null>(null);

  const API_UNIFICADA = `/api/empresaservico/?empresa_nome=${empresaNome}`;
  const dadosAgendamento = useFetch<EmpresaGeral[]>(API_UNIFICADA);

  const empresaDataFinal = dadosAgendamento.data ? dadosAgendamento.data[0] : null;
  const loading = dadosAgendamento.loading;

  // Variáveis de Controle
  const isLocacao = empresaDataFinal?.tipo === "Locação";
  const shouldShowFuncionariosAndHorarios = !isLocacao;

  const handleClearSelection = () => {
    // Limpa a seleção dependendo do modo
    if (isLocacao) {
        setLocacaoSelecionadaId(null);
    } else {
        setFuncionarioSelecionado(null);
    }
  };

  // Encontra a locação selecionada (se houver)
  const locacaoSelecionada = locacaoSelecionadaId
    ? empresaDataFinal?.locacoes.find(l => l.id === locacaoSelecionadaId)
    : null;

  // No modo Locação, a lista de itens a ser passada para TabelaHorario é a lista
  // contendo apenas o item selecionado (ou vazia se nada foi selecionado)
  const locacoesParaTabela = locacaoSelecionada ? [locacaoSelecionada] : [];


  return (
    <div className="min-vh-100">
      <style>{`
        /* (CSS mantido) */
        :root {
          --primary-blue: #004c99; /* Azul Profundo */
          --secondary-bg: #f7f9fc; /* Fundo Leve */
          --card-bg: #ffffff;
          --text-dark: #333333;
          --text-muted: #888888;
          --accent-green: #10b981; /* Destaque Sucesso */
          --warning-orange: #f39c12; /* Atenção */
          --border-light: #e0e6ed;
          --selection-border: #3499db; /* Azul de seleção */
          --danger-red: #e74c3c; /* Adicionado para mensagem de erro */
        }

        /* Estilos gerais */
        .custom-bg { background-color: var(--secondary-bg); min-height: 100vh; }
        .agendar-container { padding: 0 0 3rem 0; }
        .agendar-header { background-color: var(--primary-blue); color: var(--card-bg); padding: 2rem 0; text-align: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
        .agendar-header h1 { font-weight: 700; font-size: 2rem; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
        .agendar-header .lead { font-size: 1.1rem; opacity: 0.9; }
        .section-heading { color: var(--primary-blue); font-weight: 700; font-size: 1.8rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; text-align: center; padding-top: 2rem; }
        .section-heading span { font-size: 1.2em; }


        /* Cards (Comum para Funcionario e Locação) */
        .cards-section {
          padding-bottom: 1.5rem;
        }
        .cards-section .card {
          background-color: var(--card-bg);
          border-radius: 12px;
          border: 1px solid var(--border-light);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          cursor: pointer;
          height: 100%;
          text-align: center;
        }
        .cards-section .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(0, 76, 153, 0.1);
          border-color: var(--selection-border);
        }
        .cards-section .card.selected {
          border: 3px solid var(--selection-border); /* Borda mais grossa ao selecionar */
          box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
        }
        .cards-section .card-img-top {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid var(--border-light);
          margin: 1.5rem auto 0.5rem;
        }
        .cards-section .card-title {
          color: var(--text-dark);
          font-weight: 700;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        .cards-section .card-body {
            padding: 1rem;
        }

        /* Lista de Itens dentro do Card */
        .items-list {
          font-size: 0.95rem;
          color: var(--text-dark);
          text-align: left;
          border-top: 1px solid var(--border-light);
          padding-top: 1rem;
          margin-top: 1rem;
        }
        .items-list li {
            padding: 0.25rem 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .items-info {
            display: flex;
            gap: 0.5rem;
            color: var(--text-muted);
            font-size: 0.85rem;
        }
        .items-info span {
            display: flex;
            align-items: center;
            gap: 0.2rem;
        }


        /* Horários Section */
        .horarios-section {
          padding-top: 3rem;
          padding-bottom: 3rem;
          text-align: center;
        }
        .horarios-content {
            background-color: var(--card-bg);
            border-radius: 12px;
            border: 1px solid var(--border-light);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            padding: 2rem;
        }
        
        /* Locação Section (reusa styles da section de funcionarios) */
        .locacao-section {
            padding-top: 0;
            padding-bottom: 3rem;
            text-align: center;
        }

        /* Botão Limpar Seleção */
        .btn-clear-selection {
          background: none;
          border: 1px solid var(--warning-orange);
          color: var(--warning-orange);
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }
        .btn-clear-selection:hover {
          background-color: var(--warning-orange);
          color: var(--card-bg);
          box-shadow: 0 4px 10px rgba(243, 156, 18, 0.4);
        }

        /* Mensagens de Status/Guia */
        .message {
          font-size: 1.1rem;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: 3rem auto;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: var(--card-bg);
          border: 1px solid var(--border-light);
        }
        .message.loading {
          color: var(--primary-blue);
          border-color: var(--primary-blue);
        }
        .message.error {
          color: var(--danger-red);
          border-color: var(--danger-red);
        }
        .message.warning {
          color: var(--warning-orange);
          border-color: var(--warning-orange);
        }

        /* Footer */
        .agendar-footer {
          background-color: var(--primary-blue);
          color: var(--card-bg);
          padding: 1rem 0;
          text-align: center;
          font-size: 0.9rem;
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="agendar-container">

          <header className="agendar-header">
            <div className="container">
              <h1>
                <FaCalendarAlt /> {isLocacao ? "Disponibilidade de Locação" : "Agendamento Online"}
              </h1>
              <p className="lead">
                {empresaNome ?
                    isLocacao ? `Verifique a disponibilidade de locação com ${empresaNome}.` : `Agende seu serviço com ${empresaNome} em duas etapas simples.`
                    : "Agende seu serviço em duas etapas simples."
                }
              </p>
            </div>
          </header>

          {/* === Mensagens de Carregamento/Erro === */}
          {loading ? (
            <div className="message loading">
              <FaSpinner className="fa-spin me-2" /> Carregando dados de {isLocacao ? "locação" : "agendamento"}...
            </div>
          ) : !empresaDataFinal || (shouldShowFuncionariosAndHorarios && (!empresaDataFinal.funcionarios || empresaDataFinal.funcionarios.length === 0)) ? (
            <div className="message error">
              <FaExclamationCircle /> Não foi possível carregar os dados de {isLocacao ? "locação" : "agendamento"} ou nenhum {isLocacao ? "item de locação" : "profissional"} encontrado.
            </div>
          ) : (
            <>
              {/* --- CONTEÚDO ESPECÍFICO DE LOCAÇÃO (isLocacao == true) --- */}
              {isLocacao && empresaDataFinal.locacoes && (
                <>
                  {/* === ETAPA 1: Escolha do Item de Locação === */}
                  <section className="cards-section container">
                    <h2 className="section-heading">
                      <span className="me-2 text-primary-blue">1.</span> <FaHome /> Escolha o Item de Locação
                    </h2>
                    <div className="row justify-content-center g-4">
                      {empresaDataFinal.locacoes.map((locacao) => (
                        <div
                          key={locacao.id}
                          className="col-12 col-sm-6 col-md-4 col-lg-3"
                        >
                          <div
                            className={`card ${locacaoSelecionadaId === locacao.id ? "selected" : ""}`}
                            onClick={() => setLocacaoSelecionadaId(locacao.id!)}
                          >
                            <img
                              src={"https://via.placeholder.com/100x100?text=LOC"} // TODO: colocar a imagem da locacao tb
                              alt={locacao.nome}
                              className="card-img-top"
                            />
                            <div className="card-body">
                              <h5 className="card-title">{locacao.nome}</h5>

                              <ul className="list-unstyled items-list">
                                <h6 className="fw-bold mb-2">Detalhes:</h6>
                                <li className="d-block text-muted text-center" style={{whiteSpace: 'normal'}}>
                                    {locacao.descricao.length > 80 ? locacao.descricao.substring(0, 80) + '...' : locacao.descricao}
                                </li>
                                <li className="mt-2">
                                    <span><FaTag /> Preço:</span>
                                    <div className="items-info">
                                        <span><FaDollarSign /> {locacao.preco}</span>
                                    </div>
                                </li>
                                <li>
                                    <span><FaClock /> Duração Mínima:</span>
                                    <div className="items-info">
                                        <span>{locacao.duracao}</span>
                                    </div>
                                </li>
                              </ul>
                            </div>
                            {/* Indicador de Seleção */}
                            {locacaoSelecionadaId === locacao.id && (
                                <div className="p-2 bg-success text-white fw-bold" style={{borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px'}}>
                                    SELECIONADO <FaChevronRight />
                                </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* === ETAPA 2: Horários de Locação === */}
                  <section className="horarios-section container">
                    <h2 className="section-heading">
                      <span className="me-2 text-primary-blue">2.</span> <FaCalendarAlt /> Selecione a Data de Retirada
                    </h2>

                    <div className="horarios-content">
                        {locacaoSelecionadaId ? (
                          <>
                            <HorariosTabela
                                // Passamos locacoes como um array contendo APENAS a locação selecionada
                                locacoes={locacoesParaTabela}
                                // Garantimos que funcionario_id NÃO seja passado
                                funcionario_id={null}
                                locacao_id={locacaoSelecionadaId}
                                key={locacaoSelecionadaId}
                            />
                            <button
                              className="btn-clear-selection"
                              onClick={handleClearSelection}
                            >
                              <FaTimesCircle className="me-1" /> Mudar Item
                            </button>
                          </>
                        ) : (
                          <div className="message warning">
                            <FaExclamationCircle /> Utilize a Etapa 1 para selecionar o item de locação e ver a disponibilidade.
                          </div>
                        )}
                    </div>
                  </section>
                </>
              )}


              {/* --- CONTEÚDO ESPECÍFICO DE SERVIÇO (isLocacao == false) --- */}
              {shouldShowFuncionariosAndHorarios && empresaDataFinal.funcionarios && (
                <>
                  {/* === ETAPA 1: Escolha do Profissional === */}
                  <section className="cards-section container">
                    <h2 className="section-heading">
                      <span className="me-2 text-primary-blue">1.</span> <FaUserTie /> Escolha o Profissional
                    </h2>
                    <div className="row justify-content-center g-4">
                      {empresaDataFinal.funcionarios.map((funcionario) => (
                        <div
                          key={funcionario.id}
                          className="col-12 col-sm-6 col-md-4 col-lg-3"
                        >
                          <div
                            className={`card ${funcionarioSelecionado === funcionario.id ? "selected" : ""}`}
                            onClick={() => setFuncionarioSelecionado(funcionario.id)}
                          >
                            <img
                              src={funcionario.foto_url || "https://via.placeholder.com/100x100?text=USR"}
                              alt={funcionario.nome}
                              className="card-img-top"
                            />
                            <div className="card-body">
                              <h5 className="card-title">{funcionario.nome}</h5>

                              <ul className="list-unstyled items-list">
                                <h6 className="fw-bold mb-2">Serviços Elegíveis:</h6>
                                {funcionario.servicos && funcionario.servicos.length > 0 ? (
                                  funcionario.servicos.map((servico, i) => (
                                    <li key={i}>
                                      <span>{servico.nome}</span>
                                      <div className="items-info">
                                        <span><FaDollarSign /> {servico.preco}</span>
                                        <span><FaClock /> {servico.duracao}min</span>
                                      </div>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-muted text-center">Nenhum serviço disponível</li>
                                )}
                              </ul>
                            </div>
                            {/* Indicador de Seleção */}
                            {funcionarioSelecionado === funcionario.id && (
                                <div className="p-2 bg-success text-white fw-bold" style={{borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px'}}>
                                    SELECIONADO <FaChevronRight />
                                </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* === ETAPA 2: Horários === */}
                  <section className="horarios-section container">
                    <h2 className="section-heading">
                      <span className="me-2 text-primary-blue">2.</span> <FaCalendarAlt /> Selecione o Horário
                    </h2>

                    <div className="horarios-content">
                        {funcionarioSelecionado ? (
                          <>
                            <HorariosTabela
                              funcionario_id={funcionarioSelecionado}
                              servicos={
                                empresaDataFinal.funcionarios.find(
                                  (f) => f.id === funcionarioSelecionado
                                )?.servicos || []
                              }
                              key={funcionarioSelecionado}
                            />
                            <button
                              className="btn-clear-selection"
                              onClick={handleClearSelection}
                            >
                              <FaTimesCircle className="me-1" /> Mudar Profissional
                            </button>
                          </>
                        ) : (
                          <div className="message warning">
                            <FaExclamationCircle /> Utilize a Etapa 1 para selecionar o profissional e ver os horários disponíveis.
                          </div>
                        )}
                    </div>
                  </section>
                </>
              )}
            </>
          )}
        </div>
        <footer className="agendar-footer">
          <p>
            {empresaNome ? `© ${new Date().getFullYear()} Agendamento para ${empresaNome}.` : `© ${new Date().getFullYear()} Agendamento Online.`} Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Agendar;