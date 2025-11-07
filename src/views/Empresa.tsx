import { useParams, Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import { Funcionario } from "../interfaces/Funcionario";
import Navbar from "../components/Navbar";
import RatingStars from "../components/RatingStars.tsx";
import {
  FaEnvelope, FaRegAddressCard, FaClipboardList, FaUsers, FaEye, FaTags,
  FaClock, FaGlobe, FaStore, FaChevronDown
} from "react-icons/fa6";
import { useState } from "react";
import { FaCalendarAlt, FaPhoneAlt, FaMapMarkerAlt, FaExclamationCircle, FaTools, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const SkeletonLine: React.FC<{ width?: string; height?: string; className?: string }> = ({
  width = "100%", height = "1rem", className = ""
}) => (
  <div className={`skeleton ${className}`} style={{ width, height }}></div>
);

const EmpresaDetailsSkeleton: React.FC = () => (
  <div className="empresa-details-container">
    <div className="main-content-wrapper">
      <aside className="sidebar">
        <div className="identity-card">
          <div className="skeleton skeleton-logo-detail rounded-circle mx-auto"></div>
          <SkeletonLine width="80%" height="2rem" className="mt-3" />
          <SkeletonLine width="60%" height="1.2rem" className="mt-2" />
          <div className="d-flex justify-content-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-circle-small"></div>
            ))}
            <SkeletonLine width="40%" height="1rem" className="ms-2" />
          </div>
        </div>

        <div className="cta-box skeleton mt-4" style={{ height: '80px' }}></div>

        <div className="info-card mt-4">
          <SkeletonLine width="60%" height="1.5rem" />
          <SkeletonLine width="90%" className="mt-3" />
          <SkeletonLine width="70%" className="mt-2" />
        </div>
      </aside>

      <div className="content">
        <div className="info-card">
          <SkeletonLine width="70%" height="1.5rem" />
          <div className="row g-3 mt-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="col-md-6">
                <SkeletonLine width="100%" />
                <SkeletonLine width="80%" className="mt-2" />
              </div>
            ))}
          </div>
        </div>

        <div className="info-card mt-4">
          <SkeletonLine width="65%" height="1.5rem" />
          <div className="list-items mt-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="d-flex align-items-center gap-3 py-3 border-bottom">
                <div className="skeleton" style={{ width: 24, height: 24, borderRadius: '50%' }}></div>
                <div className="flex-grow-1">
                  <SkeletonLine width="70%" />
                  <SkeletonLine width="50%" className="mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

function EmpresaDetails() {
  const { empresa: empresaSlug } = useParams<{ empresa: string }>();
  const { data: empresasData, loading: empresasLoading } = useFetch<Empresa[]>(`/api/empresa/buscar/?q=${empresaSlug}`);
  const { data: funcionariosData, loading: funcionariosLoading } = useFetch<Funcionario[]>(`/api/funcionario/?empresa_slug=${empresaSlug}`);

  const [showAllItems, setShowAllItems] = useState(false);

  const empresa = empresasData?.find(e => e.slug.toLowerCase() === empresaSlug?.toLowerCase());
  const isLocacao = empresa?.tipo.toLowerCase() === "locação";

  if (!empresasLoading && !empresa) {
    return (
      <div className="no-results">
        <FaExclamationCircle size={56} className="text-warning mb-3" />
        <h3>Empresa não encontrada</h3>
        <p>Tente voltar à busca ou verificar o link.</p>
        <Link to="/busca" className="btn btn-primary mt-3">Voltar à Busca</Link>
      </div>
    );
  }

  const items = isLocacao ? empresa?.locacoes : empresa?.servicos;
  const displayedItems = showAllItems ? items : items?.slice(0, 3);

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

        .empresa-details-container {
          padding: 4rem 1rem 3rem;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.8s ease-out;
        }

        .main-content-wrapper {
          display: flex;
          gap: 2.5rem;
          flex-wrap: wrap;
          background: white;
          border-radius: var(--radius);
          padding: 2.5rem;
          box-shadow: var(--shadow-lg);
          border-top: 6px solid var(--accent);
        }
        .sidebar { flex: 0 0 380px; }
        .content { flex: 1; min-width: 300px; }

        @media (max-width: 992px) {
          .main-content-wrapper { 
            flex-direction: column; 
            padding: 2rem;
          }
          .sidebar { flex: 0 0 auto; }
        }

        .identity-card, .info-card, .cta-box {
          background: var(--white);
          border-radius: var(--radius);
          padding: 2rem;
          box-shadow: var(--shadow-md);
          animation: fadeInUp 0.6s ease-out;
        }

        .identity-card {
          text-align: center;
          position: relative;
          overflow: hidden;
          border: none;
        }
        .empresa-logo {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          object-fit: cover;
          border: 6px solid white;
          box-shadow: 0 0 25px rgba(0, 48, 135, 0.3);
          transition: var(--transition);
        }
        .empresa-logo:hover { transform: scale(1.05); }

        .identity-card h1 {
          font-weight: 800;
          font-size: 1.9rem;
          color: var(--primary);
          margin: 1rem 0 0.5rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          animation: ${empresa?.aberto_agora ? 'pulse 2s infinite' : 'none'};
        }
        .status-open { background: rgba(40,167,69,0.15); color: var(--success); border: 1px solid var(--success); }
        .status-closed { background: rgba(220,53,69,0.15); color: var(--danger); border: 1px solid var(--danger); }

        .cta-box {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          text-align: center;
          margin: 1.5rem 0;
          position: relative;
          overflow: hidden;
          border: none;
        }
        .cta-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at center, rgba(255,255,255,0.1), transparent);
          pointer-events: none;
        }
        .btn-cta {
          background: linear-gradient(135deg, var(--success), #1e7e34);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: var(--transition);
          box-shadow: 0 6px 16px rgba(40,167,69,0.3);
          width: 100%;
          animation: pulse 2s infinite;
        }
        .btn-cta:hover {
          background: linear-gradient(135deg, #1e7e34, var(--success));
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(40,167,69,0.4);
        }

        .info-card h4 {
          color: var(--primary);
          font-weight: 700;
          font-size: 1.4rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--gray-200);
        }

        .contact-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.9rem 0;
          font-size: 1rem;
          color: var(--gray-600);
          border-bottom: 1px dashed var(--gray-200);
        }
        .contact-item:last-child { border-bottom: none; }
        .contact-item strong {
          color: var(--primary);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .contact-item a {
          color: var(--info);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
        }
        .contact-item a:hover { color: var(--primary); text-decoration: underline; }

        .list-items li {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.1rem 0;
          border-bottom: 1px dashed var(--gray-200);
          transition: var(--transition);
        }
        .list-items li:hover {
          background: rgba(0, 48, 135, 0.03);
          border-radius: 12px;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }
        .item-icon {
          color: var(--success);
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .item-details strong {
          font-size: 1.1rem;
          color: var(--primary);
        }
        .item-details small {
          color: var(--gray-600);
        }

        .see-more-btn {
          background: none;
          border: none;
          color: var(--info);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 1rem auto 0;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          transition: var(--transition);
        }
        .see-more-btn:hover {
          background: rgba(0, 86, 179, 0.1);
          transform: translateY(-1px);
        }

        .member-card {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          text-align: center;
          background: white;
          border: 1px solid var(--gray-200);
        }
        .member-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
        }
        .member-img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          margin: 1rem auto 0.5rem;
          border: 4px solid var(--success);
        }

        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }
        .skeleton-logo-detail { width: 160px; height: 160px; }
        .skeleton-circle-small { width: 20px; height: 20px; border-radius: 50%; }

        .no-results {
          text-align: center;
          padding: 5rem 2rem;
          background: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          max-width: 600px;
          margin: 3rem auto;
          animation: fadeInUp 0.6s ease-out;
          position: relative;
          z-index: 1;
        }

        .floating-cta {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          animation: fadeInUp 0.6s ease-out;
        }
        .floating-cta .btn-cta {
          padding: 1rem 1.5rem;
          border-radius: 50px;
          font-size: 1rem;
          box-shadow: 0 8px 25px rgba(40,167,69,0.4);
        }

        @media (max-width: 768px) {
          .empresa-details-container { padding: 3rem 1rem 2rem; }
          .identity-card h1 { font-size: 1.6rem; }
          .main-content-wrapper { padding: 1.5rem; }
          .cta-box { display: none; }
          .floating-cta { display: block; }
        }
        @media (min-width: 769px) {
          .floating-cta { display: none; }
        }
      `}</style>

      <Navbar />

      <div className="empresa-details-container container">
        {empresasLoading || funcionariosLoading ? (
          <EmpresaDetailsSkeleton />
        ) : (
          empresa && (
            <>
              <div className="main-content-wrapper">
                {/* Sidebar */}
                <aside className="sidebar">
                  <div className="identity-card">
                    <img
                      src={empresa.logo || "https://via.placeholder.com/160x160/003087/ffffff?text=LOGO"}
                      alt={`Logo da ${empresa.nome}`}
                      className="empresa-logo"
                      loading="lazy"
                    />
                    <h1>{empresa.nome}</h1>
                    <RatingStars score={empresa.nota_empresa} ratingCount={empresa.avaliacoes_empresa} />
                    <p className="text-muted mt-2 fw-medium">
                      {isLocacao ? "Espaços para reserva" : "Serviços com agendamento"}
                    </p>

                    <div className={`status-badge mt-3 ${empresa.aberto_agora ? 'status-open' : 'status-closed'}`}>
                      {empresa.aberto_agora ? <FaCheckCircle /> : <FaTimesCircle />}
                      {empresa.aberto_agora ? "Aberta Agora" : "Fechada"}
                    </div>
                  </div>

                  <div className="cta-box">
                    <p className="mb-3 fw-bold">Pronto para {isLocacao ? "reservar" : "agendar"}?</p>
                    <Link to={`/agendar/${empresa.slug}`} className="btn btn-cta">
                      <FaCalendarAlt /> Ver Disponibilidade
                    </Link>
                  </div>

                  <div className="info-card">
                    <h4><FaStore /> Informações</h4>
                    <div className="contact-item">
                      <strong><FaRegAddressCard /> Tipo</strong>
                      <span className="badge-custom" style={{
                        background: isLocacao ? '#fef3c7' : '#dbeafe',
                        color: isLocacao ? '#92400e' : '#1e40af',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '50px',
                        fontWeight: 600
                      }}>
                        {empresa.tipo}
                      </span>
                    </div>
                  </div>
                </aside>

                {/* Conteúdo Principal */}
                <div className="content">
                  {/* Visão Geral */}
                  <div className="info-card">
                    <h4><FaEye /> Visão Geral</h4>
                    <div className="row g-3">
                      <div className="col-lg-6">
                        <div className="contact-item">
                          <strong><FaEnvelope /> Email</strong>
                          <a href={`mailto:${empresa.email}`}>{empresa.email || "N/I"}</a>
                        </div>
                        <div className="contact-item">
                          <strong><FaPhoneAlt /> Telefone</strong>
                          <a href={`tel:${empresa.telefone}`}>{empresa.telefone || "N/I"}</a>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="contact-item">
                          <strong><FaMapMarkerAlt /> Endereço</strong>
                          <span>{empresa.endereco || "Não informado"}</span>
                        </div>
                        <div className="contact-item">
                          <strong><FaGlobe /> Atendimento</strong>
                          <span className={`badge-custom ${empresa.is_online ? 'badge-online' : 'badge-presencial'}`}>
                            {empresa.is_online ? 'Online' : 'Presencial'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Serviços / Locações */}
                  <div className="info-card">
                    <h4>
                      {isLocacao ? <><FaTags /> Locações Disponíveis</> : <><FaClipboardList /> Serviços Oferecidos</>}
                    </h4>

                    <ul className="list-items mb-0">
                      {displayedItems && displayedItems.length > 0 ? (
                        displayedItems.map((item: any, i: number) => (
                          <li key={i}>
                            {isLocacao ? <FaClock className="item-icon" /> : <FaTools className="item-icon" />}
                            <div className="item-details">
                              <strong>{item.nome}</strong><br />
                              <small className="text-muted">
                                {isLocacao
                                  ? `Duração: ${item.duracao} • R$ ${item.preco}`
                                  : `R$ ${item.preco.toFixed(2)} • ${item.duracao}`
                                }
                              </small>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted fst-italic">Nenhum item cadastrado.</li>
                      )}
                    </ul>

                    {items && items.length > 3 && (
                      <button
                        className="see-more-btn"
                        onClick={() => setShowAllItems(!showAllItems)}
                        aria-expanded={showAllItems}
                      >
                        {showAllItems ? "Mostrar menos" : `Ver mais ${items.length - 3} itens`}
                        <FaChevronDown style={{ transform: showAllItems ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                      </button>
                    )}
                  </div>

                  {/* Equipe (apenas serviços) */}
                  {!isLocacao && (
                    <div className="info-card">
                      <h4><FaUsers /> Nossa Equipe</h4>
                      {funcionariosData && funcionariosData.length > 0 ? (
                        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                          {funcionariosData.slice(0, 8).map((funcionario) => (
                            <div key={funcionario.id} className="col">
                              <div className="member-card">
                                <img
                                  src={funcionario.foto || "https://via.placeholder.com/90x90/003087/ffffff?text=USR"}
                                  alt={funcionario.nome}
                                  className="member-img"
                                  loading="lazy"
                                />
                                <div className="p-3">
                                  <h5 className="card-title mb-0">{funcionario.nome}</h5>
                                </div>
                              </div>
                            </div>
                          ))}
                          {funcionariosData.length > 8 && (
                            <div className="col-12 text-center mt-3">
                              <p className="text-muted">
                                E mais <strong>{funcionariosData.length - 8}</strong> profissionais...
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted fst-italic">Nenhum profissional cadastrado.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Flutuante (Mobile) */}
              <div className="floating-cta">
                <Link to={`/agendar/${empresa.slug}`} className="btn btn-cta">
                  <FaCalendarAlt /> Agendar
                </Link>
              </div>
            </>
          )
        )}
      </div>

      {/* Footer sutil */}
      <footer className="text-center py-4 text-white" style={{ opacity: 0.7, fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>
        Agendamento instantâneo • Avaliações reais • Em todo o Brasil
      </footer>
    </div>
  );
}

export default EmpresaDetails;