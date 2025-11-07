import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import { Locacao } from "../interfaces/Locacao.tsx";
import Navbar from "../components/Navbar";
import {
  FaFilter,
  FaDollarSign,
  FaBuilding,
  FaTags,
  FaCheck
} from "react-icons/fa6";
import {
  FaSearch,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import RatingStars from "../components/RatingStars";

interface Servico {
  nome: string;
  preco: number;
  duracao: string;
}

interface FilterModalProps {
  show: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  cidade: string; setCidade: (c: string) => void;
  estado: string; setEstado: (e: string) => void;
  bairro: string; setBairro: (b: string) => void;
  pais: string; setPais: (p: string) => void;
  tipoEmpresa: string; setTipoEmpresa: (t: string) => void;
  abertoAgoraFilter: boolean; setAbertoAgoraFilter: (a: boolean) => void;
  tiposDisponiveis: string[];
  estados: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  show, onClose, onApply, onClear,
  cidade, setCidade, estado, setEstado, bairro, setBairro, pais, setPais,
  tipoEmpresa, setTipoEmpresa, abertoAgoraFilter, setAbertoAgoraFilter,
  tiposDisponiveis, estados,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose} aria-label="Fechar">×</button>
        <h3><FaFilter /> Filtros Avançados</h3>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Tipo de Empresa</label>
            <select className="form-select" value={tipoEmpresa} onChange={(e) => setTipoEmpresa(e.target.value)}>
              <option value="">Todos</option>
              {tiposDisponiveis.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Estado</label>
            <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos</option>
              {estados.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        <div className="row g-3 mt-2">
          <div className="col-md-6">
            <label className="form-label">Cidade</label>
            <input type="text" className="form-control" value={cidade} onChange={(e) => setCidade(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Bairro</label>
            <input type="text" className="form-control" value={bairro} onChange={(e) => setBairro(e.target.value)} />
          </div>
        </div>

        <div className="row g-3 mt-2">
          <div className="col-md-6">
            <label className="form-label">País</label>
            <input type="text" className="form-control" value={pais} onChange={(e) => setPais(e.target.value)} />
          </div>
        </div>

        <div className="form-check mt-4">
          <input
            type="checkbox"
            className="form-check-input"
            id="abertoAgoraCheck"
            checked={abertoAgoraFilter}
            onChange={(e) => setAbertoAgoraFilter(e.target.checked)}
          />
          <label className="form-check-label fw-bold" htmlFor="abertoAgoraCheck">
            Apenas empresas <span className="text-success">abertas agora</span>
          </label>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button className="btn btn-warning flex-fill" onClick={onClear}>Limpar</button>
          <button className="btn btn-success flex-fill" onClick={onApply}>Aplicar Filtros</button>
        </div>
      </div>
    </div>
  );
};

const EmpresaCardSkeleton: React.FC = () => (
  <div className="col-lg-4 col-md-6 mb-4">
    <div className="card h-100">
      <div className="card-img-container skeleton skeleton-logo"></div>
      <div className="card-body d-flex flex-column">
        <div className="skeleton skeleton-line-long mb-3" style={{ height: '2rem' }}></div>
        <div className="d-flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton-circle"></div>)}
          <div className="skeleton skeleton-line-short ms-2" style={{ width: '40%' }}></div>
        </div>
        <div className="skeleton skeleton-line-medium mb-2"></div>
        <div className="skeleton skeleton-line-long mb-2"></div>
        <div className="skeleton skeleton-line-medium mb-3"></div>
        <div className="skeleton skeleton-line-short mb-2" style={{ width: '50%' }}></div>
        <div className="skeleton mt-auto" style={{ height: '48px' }}></div>
      </div>
    </div>
  </div>
);

const ListaServicos: React.FC<{ servicos?: Servico[] }> = ({ servicos }) => (
  <div className="list-servicos">
    <h6><FaDollarSign /> Serviços Oferecidos:</h6>
    <ul className="list-unstyled mb-0">
      {servicos && servicos.length > 0 ? (
        servicos.slice(0, 3).map((s, i) => (
          <li key={i} className="d-flex align-items-center gap-2 text-success">
            <FaCheck style={{ fontSize: '0.8rem' }} />
            {s.nome} (R$ {s.preco.toFixed(2)})
          </li>
        ))
      ) : (
        <li className="text-muted">Nenhum serviço cadastrado</li>
      )}
      {servicos && servicos.length > 3 && (
        <li className="text-muted small d-flex align-items-center gap-2">
          <FaCheck style={{ fontSize: '0.7rem', opacity: 0.6 }} />
          e mais {servicos.length - 3} serviço(s)...
        </li>
      )}
    </ul>
  </div>
);

const ListaLocacoes: React.FC<{ locacoes?: Locacao[] }> = ({ locacoes }) => (
  <div className="list-servicos">
    <h6><FaTags /> Locações Disponíveis:</h6>
    <ul className="list-unstyled mb-0">
      {locacoes && locacoes.length > 0 ? (
        locacoes.slice(0, 3).map((l, i) => (
          <li key={i} className="d-flex align-items-center gap-2 text-success">
            <FaCheck style={{ fontSize: '0.8rem' }} />
            {l.nome} ({l.duracao})
          </li>
        ))
      ) : (
        <li className="text-muted">Nenhum item cadastrado</li>
      )}
      {locacoes && locacoes.length > 3 && (
        <li className="text-muted small d-flex align-items-center gap-2">
          <FaCheck style={{ fontSize: '0.7rem', opacity: 0.6 }} />
          e mais {locacoes.length - 3} item(s)...
        </li>
      )}
    </ul>
  </div>
);

function EmpresasSearch() {
  const [search, setSearch] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [pais, setPais] = useState("");
  const [tipoEmpresa, setTipoEmpresa] = useState("");
  const [abertoAgoraFilter, setAbertoAgoraFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const empresas = useFetch<Empresa[]>("/api/empresa");

  const tiposDisponiveis = ["Serviço", "Locação"];
  const estados = [
    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
    "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
    "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
    "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
    "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
  ];

  const filteredEmpresas = empresas.data?.filter((empresa: Empresa) => {
    const matchesSearch = empresa.nome.toLowerCase().includes(search.toLowerCase());
    const matchesCidade = cidade ? empresa.cidade.toLowerCase().includes(cidade.toLowerCase()) : true;
    const matchesEstado = estado ? empresa.estado.toLowerCase().includes(estado.toLowerCase()) : true;
    const matchesBairro = bairro ? empresa.bairro.toLowerCase().includes(bairro.toLowerCase()) : true;
    const matchesPais = pais ? empresa.pais.toLowerCase().includes(pais.toLowerCase()) : true;
    const matchesTipo = tipoEmpresa ? empresa.tipo === tipoEmpresa : true;
    const matchesAberto = abertoAgoraFilter ? empresa.aberto_agora : true;

    return matchesSearch && matchesCidade && matchesEstado && matchesBairro && matchesPais && matchesTipo && matchesAberto;
  });

  const clearFilters = () => {
    setSearch(""); setCidade(""); setEstado(""); setBairro(""); setPais(""); setTipoEmpresa(""); setAbertoAgoraFilter(false);
    setShowModal(false);
  };

  const applyFilters = () => setShowModal(false);

  return (
    <div className="min-vh-100">
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

        .search-header {
          padding: 4rem 1rem 3rem;
          text-align: center;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.8s ease-out;
        }
        .search-header h1 {
          color: white;
          font-weight: 800;
          font-size: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          text-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .search-header p {
          color: rgba(255,255,255,0.9);
          font-size: 1.2rem;
          max-width: 700px;
          margin: 1rem auto 0;
        }

        .search-bar-wrapper {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
          position: relative;
          z-index: 1;
        }
        .search-input-group {
          display: flex;
          gap: 1rem;
          background: white;
          border-radius: 16px;
          padding: 0.75rem;
          box-shadow: var(--shadow-lg);
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1.1rem;
          padding: 0.75rem 1rem;
          color: #212529;
        }
        .search-input::placeholder { color: var(--gray-600); }
        .btn-filter {
          background: linear-gradient(135deg, var(--info), var(--primary));
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: var(--transition);
          box-shadow: 0 6px 16px rgba(0, 48, 135, 0.25);
        }
        .btn-filter:hover {
          background: linear-gradient(135deg, var(--primary), var(--info));
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 48, 135, 0.35);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          backdrop-filter: blur(8px);
        }
        .modal-content {
          background: white;
          border-radius: var(--radius);
          padding: 2.5rem;
          max-width: 560px;
          width: 90%;
          box-shadow: var(--shadow-lg);
          animation: fadeInUp 0.4s ease-out;
          position: relative;
          border-top: 6px solid var(--accent);
        }
        .modal-content::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 6px;
          background: linear-gradient(90deg, var(--primary), var(--info), var(--accent));
        }
        .btn-close {
          position: absolute;
          top: 1rem; right: 1rem;
          background: none;
          border: none;
          font-size: 1.8rem;
          color: var(--gray-600);
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-close:hover { color: var(--danger); transform: rotate(90deg); }

        .form-label {
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        .form-control, .form-select {
          border: 2px solid var(--gray-200);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: var(--transition);
        }
        .form-control:focus, .form-select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(0, 48, 135, 0.15);
          outline: none;
        }
        .form-check-input:checked {
          background-color: var(--success);
          border-color: var(--success);
        }

        .empresas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2rem;
          padding: 3rem 1rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .empresa-card {
          background: white;
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: var(--transition);
          border-top: 6px solid var(--info);
          animation: fadeInUp 0.6s ease-out;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .empresa-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }
        .card-img-container {
          height: 180px;
          background: var(--gray-100);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .card-img-top {
          max-height: 90%;
          max-width: 90%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .empresa-card:hover .card-img-top { transform: scale(1.05); }

        .card-body {
          padding: 1.8rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .card-title {
          font-weight: 800;
          font-size: 1.6rem;
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          margin-bottom: 1rem;
        }
        .status-open {
          background: rgba(40,167,69,0.15);
          color: var(--success);
          border: 1px solid var(--success);
        }
        .status-closed {
          background: rgba(220,53,69,0.15);
          color: var(--danger);
          border: 1px solid var(--danger);
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
          color: var(--gray-600);
        }
        .info-item strong {
          color: var(--primary);
          min-width: 80px;
        }
        .info-icon {
          color: var(--info);
          font-size: 1.1rem;
          flex-shrink: 0;
          margin-top: 0.15rem;
        }

        .list-servicos h6 {
          color: var(--primary);
          font-weight: 700;
          font-size: 1.05rem;
          margin: 1.5rem 0 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-view {
          background: linear-gradient(135deg, var(--success), #1e7e34);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1.05rem;
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: var(--transition);
          box-shadow: 0 6px 16px rgba(40,167,69,0.25);
        }
        .btn-view:hover {
          background: linear-gradient(135deg, #1e7e34, var(--success));
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(40,167,69,0.35);
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          max-width: 600px;
          margin: 2rem auto;
          animation: fadeInUp 0.6s ease-out;
        }

        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        .skeleton-logo { height: 180px; border-radius: var(--radius) var(--radius) 0 0; }
        .skeleton-line-long { height: 1.6rem; width: 85%; margin-bottom: 1rem; }
        .skeleton-line-medium { height: 1.2rem; width: 70%; margin-bottom: 0.75rem; }
        .skeleton-line-short { height: 1rem; width: 50%; }
        .skeleton-circle { width: 20px; height: 20px; border-radius: 50%; display: inline-block; margin-right: 4px; }

        @media (max-width: 768px) {
          .search-header h1 { font-size: 2.2rem; }
          .search-input-group { flex-direction: column; padding: 0.5rem; }
          .btn-filter { padding: 0.75rem 1.5rem; }
          .empresas-grid { grid-template-columns: 1fr; padding: 2rem 1rem; }
        }
      `}</style>

      <div className="hero-bg">
        <Navbar />

        <header className="search-header">
          <div className="container">
            <h1><FaSearch /> Busca de Empresas</h1>
            <p>Encontre serviços e locações com agendamento instantâneo em todo o Brasil.</p>
          </div>
        </header>

        <div className="search-bar-wrapper">
          <div className="search-input-group">
            <input
              type="text"
              className="search-input"
              placeholder="Nome da empresa, serviço ou localização..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-filter" onClick={() => setShowModal(true)}>
              <FaFilter /> Filtros
            </button>
          </div>
        </div>

        <FilterModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onApply={applyFilters}
          onClear={clearFilters}
          cidade={cidade} setCidade={setCidade}
          estado={estado} setEstado={setEstado}
          bairro={bairro} setBairro={setBairro}
          pais={pais} setPais={setPais}
          tipoEmpresa={tipoEmpresa} setTipoEmpresa={setTipoEmpresa}
          abertoAgoraFilter={abertoAgoraFilter} setAbertoAgoraFilter={setAbertoAgoraFilter}
          tiposDisponiveis={tiposDisponiveis}
          estados={estados}
        />

        <div className="container">
          {empresas.loading ? (
            <div className="empresas-grid">
              {[...Array(6)].map((_, i) => <EmpresaCardSkeleton key={i} />)}
            </div>
          ) : filteredEmpresas && filteredEmpresas.length > 0 ? (
            <div className="empresas-grid">
              {filteredEmpresas.map((empresa, i) => (
                <div key={i} className="empresa-card">
                  <div className="card-img-container">
                    <img
                      src={empresa.logo || "https://via.placeholder.com/300x180?text=Sem+Logo"}
                      alt={empresa.nome}
                      className="card-img-top"
                      loading="lazy"
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{empresa.nome}</h5>

                    <div className="mb-3">
                      <RatingStars score={empresa.nota_empresa} ratingCount={empresa.avaliacoes_empresa} />
                    </div>

                    <div className={`status-badge ${empresa.aberto_agora ? 'status-open' : 'status-closed'}`}>
                      {empresa.aberto_agora ? <FaCheckCircle /> : <FaTimesCircle />}
                      {empresa.aberto_agora ? "Aberto Agora" : "Fechado"}
                    </div>

                    <div className="mb-3">
                      <div className="info-item">
                        <FaBuilding className="info-icon" />
                        <div><strong>Tipo:</strong> {empresa.tipo}</div>
                      </div>
                      <div className="info-item">
                        <FaMapMarkerAlt className="info-icon" />
                        <div><strong>Local:</strong> {empresa.cidade}, {empresa.estado}</div>
                      </div>
                      {empresa.telefone && (
                        <div className="info-item">
                          <FaPhoneAlt className="info-icon" />
                          <div><strong>Tel:</strong> {empresa.telefone}</div>
                        </div>
                      )}
                    </div>

                    {empresa.tipo === "Locação" ? (
                      <ListaLocacoes locacoes={empresa.locacoes} />
                    ) : (
                      <ListaServicos servicos={empresa.servicos} />
                    )}

                    <Link to={`/empresas/${empresa.slug}`} className="btn btn-view mt-3">
                      Ver Detalhes e Agendar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <FaExclamationCircle size={48} className="text-warning mb-3" />
              <h4>Nenhuma empresa encontrada</h4>
              <p>Tente ajustar os filtros ou a busca.</p>
            </div>
          )}
        </div>

        <footer className="text-center py-4 text-white" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
          Centenas de empresas • Agendamento online • Avaliações reais
        </footer>
      </div>
    </div>
  );
}

export default EmpresasSearch;