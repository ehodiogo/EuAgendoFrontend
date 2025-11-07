import { useFetch } from "../functions/GetData";
import { ServicosFuncionariosEmpresa } from "../interfaces/ServicosFuncionarios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import HorariosTabela from "../components/TabelaHorario";
import Navbar from "../components/Navbar";
import {
  FaUserTie, FaClock, FaDollarSign
} from "react-icons/fa6";
import {FaCalendarAlt, FaExclamationCircle, FaTimesCircle, FaHome, FaCheckCircle} from "react-icons/fa";

export interface Locacao {
  id?: number;
  nome: string;
  descricao: string;
  duracao: string;
  preco: string;
}

interface EmpresaGeral extends ServicosFuncionariosEmpresa {
  tipo: "Serviço" | "Locação";
  locacoes: Locacao[];
}

const CardSkeleton: React.FC = () => (
  <div className="col-12 col-sm-6 col-md-4 col-lg-3">
    <div className="card h-100">
      <div className="skeleton skeleton-img mx-auto"></div>
      <div className="card-body d-flex flex-column">
        <div className="skeleton skeleton-line-long mb-3"></div>
        <div className="skeleton skeleton-line-medium mb-2"></div>
        <div className="skeleton skeleton-line-short mb-2"></div>
        <div className="skeleton skeleton-line-medium mb-3"></div>
        <div className="skeleton mt-auto" style={{ height: '48px' }}></div>
      </div>
    </div>
  </div>
);

const Agendar = () => {
  const { empresa: empresaSlug } = useParams<{ empresa: string }>();
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<number | null>(null);
  const [locacaoSelecionadaId, setLocacaoSelecionadaId] = useState<number | null>(null);

  const API_UNIFICADA = `/api/empresaservico/?empresa_slug=${empresaSlug}`;
  const { data, loading } = useFetch<EmpresaGeral[]>(API_UNIFICADA);

  const empresa = data?.[0] || null;
  const isLocacao = empresa?.tipo === "Locação";

  const handleClearSelection = () => {
    if (isLocacao) setLocacaoSelecionadaId(null);
    else setFuncionarioSelecionado(null);
  };

  const locacaoSelecionada = locacaoSelecionadaId
    ? empresa?.locacoes.find(l => l.id === locacaoSelecionadaId)
    : null;

  return (
    <div className="hero-bg min-vh-100">
      <style>{`
        :root {
          --primary: #003087;
          --primary-dark: #00205b;
          --accent: #f6c107;
          --success: #28a745;
          --danger: #dc3545;
          --info: #0056b3;
          --gray-100: #f8f9fa;
          --gray-200: #e9ecef;
          --gray-600: #6c757d;
          --white: #ffffff;
          --shadow-sm: 0 4px 12px rgba(0,0,0,0.08);
          --shadow-md: 0 8px 25px rgba(0,0,0,0.15);
          --shadow-lg: 0 15px 40px rgba(0,0,0,0.25);
          --radius: 20px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }

        .hero-bg {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 80%, rgba(246,193,7,0.15), transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1), transparent 50%);
          pointer-events: none;
        }

        .agendar-container {
          padding: 3rem 1rem;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .agendar-header {
          text-align: center;
          color: white;
          margin-bottom: 3rem;
          animation: fadeInUp 0.8s ease-out;
        }
        .agendar-header h1 {
          font-weight: 800;
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          text-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .agendar-header p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 700px;
          margin: 1rem auto 0;
        }

        .step-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        @media (max-width: 992px) {
          .step-grid { grid-template-columns: 1fr; }
        }

        .step-card {
          background: white;
          border-radius: var(--radius);
          padding: 2rem;
          box-shadow: var(--shadow-md);
          border-top: 6px solid var(--accent);
          animation: fadeInUp 0.6s ease-out;
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--primary);
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--gray-200);
        }
        .step-number {
          background: var(--info);
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
        }

        .item-card {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          cursor: pointer;
          background: white;
          border: 1px solid var(--gray-200);
          height: 100%;
          text-align: center;
        }
        .item-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
          border-color: var(--info);
        }
        .item-card.selected {
          border: 3px solid var(--info);
          box-shadow: 0 8px 25px rgba(0, 86, 179, 0.3);
        }
        .item-img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 50%;
          border: 4px solid var(--gray-200);
          margin: 1.5rem auto 0.5rem;
        }
        .item-title {
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--primary);
          margin-bottom: 0.75rem;
        }
        .item-desc {
          color: var(--gray-600);
          font-size: 0.9rem;
          margin-bottom: 1rem;
          padding: 0 1rem;
          line-height: 1.4;
        }
        .item-details {
          padding: 1rem;
          border-top: 1px dashed var(--gray-200);
          font-size: 0.9rem;
        }
        .item-details li {
          display: flex;
          justify-content: space-between;
          padding: 0.4rem 0;
        }
        .item-details .icon {
          color: var(--success);
        }

        .selected-badge {
          background: linear-gradient(135deg, var(--success), #1e7e34);
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .message-box {
          background: white;
          border-radius: var(--radius);
          padding: 2rem;
          text-align: center;
          box-shadow: var(--shadow-md);
          border: 1px dashed var(--gray-200);
          color: var(--gray-600);
        }
        .message-box.warning {
          border-color: #f59e0b;
          color: #d97706;
        }

        .btn-clear {
          background: none;
          border: 2px solid #f59e0b;
          color: #d97706;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 1rem auto 0;
          transition: var(--transition);
        }
        .btn-clear:hover {
          background: #f59e0b;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(245, 158, 11, 0.3);
        }

        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }
        .skeleton-img { width: 100px; height: 100px; border-radius: 50%; margin: 1.5rem auto; }
        .skeleton-line-long { height: 1.5rem; width: 80%; margin: 0 auto 1rem; }
        .skeleton-line-medium { height: 1.2rem; width: 65%; margin: 0 auto 0.75rem; }
        .skeleton-line-short { height: 1rem; width: 50%; margin: 0 auto 0.5rem; }

        .no-results {
          text-align: center;
          padding: 5rem 2rem;
          background: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          max-width: 600px;
          margin: 3rem auto;
          animation: fadeInUp 0.6s ease-out;
        }

        .floating-cta {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          animation: fadeInUp 0.6s ease-out;
        }
        .floating-cta .btn {
          background: linear-gradient(135deg, var(--success), #1e7e34);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          box-shadow: 0 8px 25px rgba(40,167,69,0.4);
          animation: pulse 2s infinite;
        }

        @media (max-width: 768px) {
          .agendar-header h1 { font-size: 2rem; }
          .step-card { padding: 1.5rem; }
          .item-card { margin-bottom: 1rem; }
        }
      `}</style>

      <Navbar />

      <div className="agendar-container container">
        <header className="agendar-header">
          <h1>
            <FaCalendarAlt /> {isLocacao ? "Reserva de Locação" : "Agendamento Online"}
          </h1>
          <p>
            {empresaSlug
              ? `${isLocacao ? 'Reserve' : 'Agende'} com ${empresaSlug} em duas etapas simples.`
              : "Escolha o profissional ou item e confirme seu horário."}
          </p>
        </header>

        {loading ? (
          <div className="step-grid">
            <div className="step-card">
              <div className="step-header">
                <div className="step-number">1</div>
                <span>Carregando...</span>
              </div>
              <div className="row g-3">
                {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
              </div>
            </div>
            <div className="step-card">
              <div className="step-header">
                <div className="step-number">2</div>
                <span>Horários</span>
              </div>
              <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }}></div>
            </div>
          </div>
        ) : !empresa ? (
          <div className="no-results">
            <FaExclamationCircle size={56} className="text-danger mb-3" />
            <h3>Empresa não encontrada</h3>
            <p>Verifique o link ou volte à busca.</p>
          </div>
        ) : (
          <div className="step-grid">
            {/* Etapa 1: Seleção */}
            <div className="step-card">
              <div className="step-header">
                <div className="step-number">1</div>
                <span>{isLocacao ? "Escolha o Item" : "Escolha o Profissional"}</span>
                {isLocacao ? <FaHome /> : <FaUserTie />}
              </div>

              <div className="row g-3">
                {isLocacao && empresa.locacoes?.length > 0 ? (
                  empresa.locacoes.map((locacao) => (
                    <div key={locacao.id} className="col-12 col-sm-6 col-md-4 col-lg-6">
                      <div
                        className={`item-card ${locacaoSelecionadaId === locacao.id ? "selected" : ""}`}
                        onClick={() => setLocacaoSelecionadaId(locacao.id!)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setLocacaoSelecionadaId(locacao.id!)}
                      >
                        <img
                          src="https://via.placeholder.com/100x100?text=LOC"
                          alt={locacao.nome}
                          className="item-img"
                          loading="lazy"
                        />
                        <h5 className="item-title">{locacao.nome}</h5>
                        <p className="item-desc">
                          {locacao.descricao.length > 70 ? locacao.descricao.substring(0, 70) + '...' : locacao.descricao}
                        </p>
                        <ul className="item-details list-unstyled mb-0">
                          <li><span className="icon"><FaDollarSign /></span> R$ {locacao.preco}</li>
                          <li><span className="icon"><FaClock /></span> {locacao.duracao}</li>
                        </ul>
                        {locacaoSelecionadaId === locacao.id && (
                          <div className="selected-badge">
                            <FaCheckCircle /> SELECIONADO
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : !isLocacao && empresa.funcionarios?.length > 0 ? (
                  empresa.funcionarios.map((func) => (
                    <div key={func.id} className="col-12 col-sm-6 col-md-4 col-lg-6">
                      <div
                        className={`item-card ${funcionarioSelecionado === func.id ? "selected" : ""}`}
                        onClick={() => setFuncionarioSelecionado(func.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setFuncionarioSelecionado(func.id)}
                      >
                        <img
                          src={func.foto_url || "https://via.placeholder.com/100x100?text=USR"}
                          alt={func.nome}
                          className="item-img"
                          loading="lazy"
                        />
                        <h5 className="item-title">{func.nome}</h5>
                        <ul className="item-details list-unstyled mb-0">
                          {func.servicos?.slice(0, 2).map((s, i) => (
                            <li key={i}>
                              <span>{s.nome}</span>
                              <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                                <FaDollarSign /> {s.preco} • <FaClock /> {s.duracao}min
                              </div>
                            </li>
                          ))}
                          {func.servicos && func.servicos.length > 2 && (
                            <li className="text-muted small">+ {func.servicos.length - 2} serviços</li>
                          )}
                        </ul>
                        {funcionarioSelecionado === func.id && (
                          <div className="selected-badge">
                            <FaCheckCircle /> SELECIONADO
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="message-box warning">
                    <FaExclamationCircle /> Nenhum {isLocacao ? "item" : "profissional"} disponível.
                  </div>
                )}
              </div>
            </div>

            {/* Etapa 2: Horários */}
            <div className="step-card">
              <div className="step-header">
                <div className="step-number">2</div>
                <span>Selecione o Horário</span>
                <FaCalendarAlt />
              </div>

              {isLocacao && locacaoSelecionadaId ? (
                <>
                  <HorariosTabela
                    locacoes={[locacaoSelecionada!]}
                    funcionario_id={null}
                    locacao_id={locacaoSelecionadaId}
                    key={locacaoSelecionadaId}
                  />
                  <button className="btn-clear" onClick={handleClearSelection}>
                    <FaTimesCircle /> Mudar Item
                  </button>
                </>
              ) : !isLocacao && funcionarioSelecionado ? (
                <>
                  <HorariosTabela
                    funcionario_id={funcionarioSelecionado}
                    servicos={empresa.funcionarios.find(f => f.id === funcionarioSelecionado)?.servicos || []}
                    key={funcionarioSelecionado}
                  />
                  <button className="btn-clear" onClick={handleClearSelection}>
                    <FaTimesCircle /> Mudar Profissional
                  </button>
                </>
              ) : (
                <div className="message-box warning">
                  <FaExclamationCircle /> Selecione um {isLocacao ? "item" : "profissional"} na Etapa 1 para ver os horários.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA Flutuante (Mobile) */}
      {(locacaoSelecionadaId || funcionarioSelecionado) && (
        <div className="floating-cta">
          <button className="btn">
            <FaCalendarAlt /> Confirmar Horário
          </button>
        </div>
      )}

      <footer className="text-center py-4 text-white" style={{ opacity: 0.7, fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>
        Agendamento instantâneo • Sem taxas • Em todo o Brasil
      </footer>
    </div>
  );
};

export default Agendar;