import { useParams, Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import { Funcionario } from "../interfaces/Funcionario";
import Navbar from "../components/Navbar";
import {
  FaTools, FaCalendarAlt,
  FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaRegAddressCard,
  FaClipboardList, FaUsers, FaEye, FaTags, FaClock, FaExclamationCircle
} from "react-icons/fa";
import RatingStars from "../components/RatingStars.tsx";

interface Locacao {
    id: number;
    nome: string;
    descricao: string;
    duracao: string;
    preco: string;
}
interface Servico {
    nome: string;
    preco: number;
    duracao: string;
}

// =================================================================
// 1. COMPONENTE AUXILIAR: Skeleton Loader para a página de Detalhes
// =================================================================
const SkeletonLine: React.FC<{ width: string, height?: string, marginBottom?: string }> = ({ width, height = '1rem', marginBottom = '0.75rem' }) => (
    <div
        className="skeleton"
        style={{ width, height, marginBottom }}
    ></div>
);

const EmpresaDetailsSkeleton: React.FC = () => (
    <div className="main-content-wrapper">
        <aside className="sidebar">
            {/* Card de Identidade (Sidebar) */}
            <div className="identity-card">
                <div className="skeleton skeleton-logo-detail rounded-circle mx-auto"></div>
                <SkeletonLine width="80%" height="1.8rem" />
                <SkeletonLine width="50%" height="1rem" />
                <div className="d-flex justify-content-center mb-3">
                    <div className="skeleton-circle-small me-1"></div>
                    <div className="skeleton-circle-small me-1"></div>
                    <div className="skeleton-circle-small me-1"></div>
                </div>
            </div>

            {/* CTA Box */}
            <div className="cta-box" style={{ background: 'var(--border-light)' }}>
                <SkeletonLine width="90%" height="3.3rem" marginBottom="0" />
            </div>

            {/* Detalhes Corporativos */}
            <div className="info-card">
                <SkeletonLine width="60%" height="1.5rem" />
                <SkeletonLine width="95%" />
                <SkeletonLine width="85%" />
            </div>
        </aside>

        <div className="content">
            {/* Visão Geral e Contato */}
            <div className="info-card">
                <SkeletonLine width="70%" height="1.5rem" />
                <div className="row g-2">
                    <div className="col-lg-6">
                        <SkeletonLine width="90%" />
                        <SkeletonLine width="75%" />
                    </div>
                    <div className="col-lg-6">
                        <SkeletonLine width="90%" />
                        <SkeletonLine width="75%" />
                    </div>
                </div>
            </div>

            {/* Escopo de Serviços/Locações */}
            <div className="info-card">
                <SkeletonLine width="65%" height="1.5rem" />
                <SkeletonLine width="100%" />
                <SkeletonLine width="100%" />
                <SkeletonLine width="100%" />
            </div>

            {/* Funcionários (Se aplicável - para dar a visão completa) */}
            <div className="info-card funcionarios-card">
                <SkeletonLine width="75%" height="1.5rem" />
                <div className="row row-cols-4 g-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="col">
                            <div className="card member-card" style={{ height: '100%', boxShadow: 'none' }}>
                                <div className="skeleton skeleton-member-img rounded-circle mx-auto mt-3"></div>
                                <div className="card-body">
                                    <SkeletonLine width="80%" height="1rem" marginBottom="0" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);


function EmpresaDetails() {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const { data: empresasData, loading: empresasLoading } = useFetch<Empresa[]>(`/api/empresa/buscar/?q=${empresaNome}`);
  const { data: funcionariosData, loading: funcionariosLoading } = useFetch<Funcionario[]>(`/api/funcionario/?empresa_slug=${empresaNome}`);

  const empresa = empresasData?.find(
    (e) => e.slug.toLowerCase() === empresaNome?.toLowerCase()
  );

  if (!empresasLoading && !empresa) {
      return (
        <div className="message error">
            <FaExclamationCircle className="me-2" /> Empresa não encontrada.
        </div>
      );
  }

  const isLocacao = empresa && empresa.tipo.toLowerCase() === "locação";

  return (
    <div className="min-vh-100">
      <style>{`
        /* Paleta de Cores e Tipografia */
        :root {
          --primary-blue: #004c99; /* Azul Profundo e Sóbrio */
          --secondary-color: #f7f9fc; /* Fundo Leve */
          --card-bg: #ffffff;
          --text-dark: #333333;
          --text-muted: #888888;
          --accent-green: #10b981; /* Verde de Ação / Sucesso */
          --border-light: #e0e6ed;
          --danger-red: #e74c3c; /* Cor de erro */
        }

        /* Estilos do Spinner (Adicionado para garantir a rotação do ícone FaSpinner) */
        .fa-spin {
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Estilos Gerais */
        .custom-bg {
          background-color: var(--secondary-color);
        }

        /* Container Principal com Padding e Sombra */
        .empresa-details-container {
          padding: 3rem 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Layout de Duas Colunas (Lateral e Conteúdo) */
        .main-content-wrapper {
          display: flex;
          gap: 1.5rem; 
        }
        .sidebar {
          flex: 0 0 320px; 
        }
        .content {
          flex-grow: 1;
        }
        @media (max-width: 992px) {
          .main-content-wrapper {
            flex-direction: column;
          }
          .sidebar {
            flex: 0 0 auto;
          }
        }

        /* Cards em Geral - APLICANDO BORDA E REFORÇANDO A SOMBRA */
        .identity-card, .cta-box, .info-card {
            border: 1px solid var(--border-light); 
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); 
        }
        
        /* Header e Logo na Sidebar (Card de Identidade) */
        .identity-card {
          background-color: var(--card-bg);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          margin-bottom: 1rem; 
        }
        .identity-card h1 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.8rem;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
        }
        .identity-card p {
          color: var(--text-muted);
          font-style: italic;
          font-size: 1rem;
        }
        .identity-card .rating-container {
          margin-top: 1rem;
          margin-bottom: 0.5rem !important; /* Ajuste o margin-bottom para não conflitar */
        }
        .identity-card .stars-list {
          font-size: 1.1rem;
        }
        .empresa-logo {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 4px solid var(--primary-blue);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          object-fit: cover;
          margin: 0 auto;
        }

        /* CTA Fixo/Destaque */
        .cta-box {
          background-color: var(--primary-blue);
          color: var(--card-bg);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 6px 15px rgba(0, 76, 153, 0.4); 
          text-align: center;
          margin-bottom: 1rem; 
          border: none;
        }
        .cta-box .btn-cta {
          background-color: var(--accent-green);
          border-color: var(--accent-green);
          font-size: 1.15rem;
          font-weight: 700;
          padding: 0.75rem 2rem;
          transition: all 0.3s ease;
        }
        .cta-box .btn-cta:hover {
          background-color: #0d9472;
          border-color: #0d9472;
          transform: scale(1.02);
        }

        /* Cards de Conteúdo (Visão Geral, Detalhes, Serviços/Locações) */
        .info-card {
          background-color: var(--card-bg);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 1.5rem; 
        }
        .info-card h4 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        /* Ajustes na Visão Geral/Contato para ser mais compacta */
        .contact-item {
          padding: 0.5rem 0; 
          display: flex;
          align-items: center;
          font-size: 0.95rem; 
          color: var(--text-dark);
        }
        .contact-item strong {
            font-weight: 600;
            color: var(--primary-blue);
            margin-right: 0.5rem;
        }
        .contact-item a {
            color: var(--primary-blue);
            text-decoration: none;
        }

        /* Serviços e Locações */
        .list-items {
            list-style: none;
            padding: 0;
        }
        .list-items li {
            padding: 0.75rem 0; /* Aumentado o padding para melhor visualização */
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--text-dark);
            border-bottom: 1px dashed var(--border-light);
            font-size: 1rem;
        }
        .list-items li:last-child {
            border-bottom: none;
        }
        .list-items .item-icon {
            color: var(--accent-green);
            font-size: 1.1rem;
        }


        /* Funcionários (Equipe) */
        .funcionarios-card .member-card {
          border: 1px solid var(--border-light); 
          transition: all 0.3s ease;
          overflow: hidden;
          height: 100%;
          text-align: center;
          box-shadow: none;
        }
        .funcionarios-card .member-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .funcionarios-card .member-img {
          width: 90px;
          height: 90px;
          border: 3px solid var(--accent-green);
          padding: 2px;
          margin: 1rem auto 0.5rem;
          object-fit: cover;
        }
        .funcionarios-card .card-title {
          color: var(--primary-blue);
          font-weight: 600;
          font-size: 1.1rem;
        }

        /* Mensagens de Status */
        .message {
          font-size: 1.1rem;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 700px;
          margin: 4rem auto;
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
        
        /* ======================================= */
        /* --- ESTILOS DO SKELETON LOADER NOVO --- */
        /* ======================================= */
        @keyframes shimmer {
            0% { background-position: -468px 0; }
            100% { background-position: 468px 0; }
        }
        .skeleton {
            background-color: var(--border-light);
            border-radius: 4px;
            /* Efeito de brilho (Shimmer) */
            background-image: linear-gradient(to right, var(--border-light) 0%, #ececec 20%, var(--border-light) 40%, var(--border-light) 100%);
            background-repeat: no-repeat;
            background-size: 800px 100%;
            animation: shimmer 1.2s linear infinite;
        }
        .skeleton-logo-detail {
            width: 150px;
            height: 150px;
            margin-bottom: 1rem;
            border-radius: 50%;
        }
        .skeleton-circle-small {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            display: inline-block;
            background-color: var(--border-light);
        }
        .skeleton-member-img {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            margin: 1rem auto 0.5rem !important;
        }

      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="empresa-details-container container">
          {/* 2. LÓGICA DE EXIBIÇÃO DO SKELETON */}
          {empresasLoading || funcionariosLoading ? (
            <EmpresaDetailsSkeleton />
          ) : (
            // Exibir o conteúdo principal da página
            empresa && (
              <div className="main-content-wrapper">

                <aside className="sidebar">
                  <div className="identity-card">
                    <img
                      src={empresa.logo || "https://via.placeholder.com/150x150?text=LOGO"}
                      alt={`Logo da ${empresa.nome}`}
                      className="empresa-logo"
                    />
                    <h1>{empresa.nome}</h1>
                      <RatingStars
                          score={empresa.nota_empresa}
                          ratingCount={empresa.avaliacoes_empresa}
                        />
                    <p className="text-muted">
                        {isLocacao ? "Detalhes e Reserva" : "Detalhes e Agendamento"}
                    </p>
                  </div>

                  <div className="cta-box">
                      <p className="mb-3 fw-bold">Pronto para {isLocacao ? "reservar" : "começar"}?</p>
                      <Link
                          to={`/agendar/${empresa.slug}`}
                          className="btn btn-cta"
                      >
                          <FaCalendarAlt className="me-2" />
                          Ver Disponibilidade e Agendar
                      </Link>
                  </div>

                  <div className="info-card">
                      <h4>
                          <FaRegAddressCard /> Detalhes Corporativos
                      </h4>
                      <ul className="list-group info-list">
                          <li className="list-group-item">
                              <strong>Tipo:</strong> <span className="text-end">{empresa.tipo || "Não Informado"}</span>
                          </li>
                      </ul>
                  </div>
                </aside>

                <div className="content">

                  <div className="info-card">
                      <h4>
                          <FaEye /> Visão Geral e Contato
                      </h4>
                      <div className="row g-2">
                          <div className="col-lg-6">
                              <div className="contact-item">
                                  <strong><FaEnvelope className="me-1" /> Email:</strong>
                                  <a href={`mailto:${empresa.email}`} className="text-truncate">{empresa.email || "N/I"}</a>
                              </div>
                              <div className="contact-item">
                                  <strong><FaPhoneAlt className="me-1" /> Telefone:</strong>
                                  <a href={`tel:${empresa.telefone}`}>{empresa.telefone || "N/I"}</a>
                              </div>
                          </div>
                          <div className="col-lg-6">
                              <div className="contact-item">
                                  <strong><FaMapMarkerAlt className="me-1" /> Endereço:</strong>
                                  <span className="text-end">{empresa.endereco || "Não Informado"}</span>
                              </div>
                              <div className="contact-item invisible">.</div>
                          </div>
                      </div>
                  </div>

                  <div className="info-card">
                      <h4>
                          {isLocacao ? <><FaTags /> Escopo de Locações</> : <><FaClipboardList /> Escopo de Serviços</>}
                      </h4>

                      {isLocacao ? (
                          <ul className="list-items">
                              {empresa.locacoes && empresa.locacoes.length > 0 ? (
                                  (empresa.locacoes as Locacao[]).map((locacao, index) => (
                                      <li key={index}>
                                          <FaClock className="item-icon" />
                                          {locacao.nome} - Duração: {locacao.duracao} (R$ {locacao.preco})
                                      </li>
                                  ))
                              ) : (
                                  <li className="text-muted">Nenhum item de locação cadastrado no momento.</li>
                              )}
                          </ul>
                      ) : (
                          <ul className="list-items">
                              {empresa.servicos && empresa.servicos.length > 0 ? (
                                  (empresa.servicos as Servico[]).map((servico, index) => (
                                      <li key={index}>
                                          <FaTools className="item-icon" />
                                          {servico.nome} (R$ {servico.preco})
                                      </li>
                                  ))
                              ) : (
                                  <li className="text-muted">Nenhum serviço fundamental cadastrado no momento.</li>
                              )}
                          </ul>
                      )}
                  </div>

                  {!isLocacao && (
                      <div className="info-card funcionarios-card">
                          <h4>
                              <FaUsers /> Nossos Profissionais
                          </h4>
                          {funcionariosData && funcionariosData.length > 0 ? (
                              <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                                  {funcionariosData.slice(0, 8).map((funcionario) => (
                                      <div key={funcionario.id} className="col">
                                          <div className="card member-card">
                                              <img
                                                  src={funcionario.foto || "https://via.placeholder.com/90x90?text=USR"}
                                                  alt={funcionario.nome}
                                                  className="card-img-top rounded-circle member-img"
                                              />
                                              <div className="card-body">
                                                  <h5 className="card-title">{funcionario.nome}</h5>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                                  {funcionariosData.length > 8 && (
                                      <div className="col-12 text-center mt-4">
                                          <p className="text-muted">E mais {funcionariosData.length - 8} profissionais...</p>
                                      </div>
                                  )}
                              </div>
                          ) : (
                              <p className="text-muted">Nenhum profissional listado para esta unidade.</p>
                          )}
                      </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default EmpresaDetails;