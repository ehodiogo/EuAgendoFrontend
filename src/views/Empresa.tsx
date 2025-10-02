import { useParams, Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import { Funcionario } from "../interfaces/Funcionario";
import Navbar from "../components/Navbar";
import {
FaTools, FaCalendarAlt, FaSpinner,
  FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaRegAddressCard,
  FaClipboardList, FaUsers, FaEye
} from "react-icons/fa";

function EmpresaDetails() {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const { data: empresasData, loading: empresasLoading } = useFetch<Empresa[]>(`/api/empresa/?q=${empresaNome}`);
  const { data: funcionariosData, loading: funcionariosLoading } = useFetch<Funcionario[]>(`/api/funcionario/?empresa_nome=${empresaNome}`);

  const empresa = empresasData?.find(
    (e) => e.nome.toLowerCase() === empresaNome?.toLowerCase()
  );

  if (!empresa) {
      return <>SEM</>
  }

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
            border: 1px solid var(--border-light); /* Borda sutil */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* Sombra mais discreta no geral */
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

        /* Cards de Conteúdo (Visão Geral, Detalhes, Serviços) */
        .info-card {
          background-color: var(--card-bg);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 1.5rem; 
          /* REMOVIDO: height: 100%; para que os cards cresçam dinamicamente */
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
          padding: 0.5rem 0; /* Menos padding */
          display: flex;
          align-items: center;
          font-size: 0.95rem; /* Fonte um pouco menor */
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

        /* Serviços */
        .servicos-list {
            list-style: none;
            padding: 0;
        }
        .servicos-list li {
            padding: 0.5rem 0;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--text-dark);
            border-bottom: 1px dashed var(--border-light);
        }
        .servicos-list li:last-child {
            border-bottom: none;
        }
        .servicos-list .service-icon {
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
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="empresa-details-container container">
          {empresasLoading || funcionariosLoading ? (
            <div className="message loading">
              <FaSpinner className="fa-spin me-2" /> Carregando informações empresariais...
            </div>
          ) : (
            <div className="main-content-wrapper">

              {/* === BARRA LATERAL: Identidade e CTA === */}
              <aside className="sidebar">
                {/* Card de Identidade */}
                <div className="identity-card">
                  <img
                    src={empresa.logo || "https://via.placeholder.com/150x150?text=LOGO"}
                    alt={`Logo da ${empresa.nome}`}
                    className="empresa-logo"
                  />
                  <h1>{empresa.nome}</h1>
                  <p className="text-muted">Detalhes e Agendamento</p>
                </div>

                {/* Card CTA (Chamada para Ação) */}
                <div className="cta-box">
                    <p className="mb-3 fw-bold">Pronto para começar?</p>
                    <Link
                        to={`/agendar/${empresa.nome}`}
                        className="btn btn-cta"
                    >
                        <FaCalendarAlt className="me-2" /> Agendar Serviço
                    </Link>
                </div>

                {/* Card Detalhes Corporativos */}
                <div className="info-card">
                    <h4>
                        <FaRegAddressCard /> Detalhes Corporativos
                    </h4>
                    <ul className="list-group info-list">
                        <li className="list-group-item">
                            <strong>CNPJ:</strong> <span className="text-end">{empresa.cnpj || "Não Informado"}</span>
                        </li>
                    </ul>
                </div>
              </aside>

              {/* === CONTEÚDO PRINCIPAL === */}
              <div className="content">

                {/* Visão Geral (Contato e Localização) - Layout Compactado */}
                <div className="info-card">
                    <h4>
                        <FaEye /> Visão Geral e Contato
                    </h4>
                    <div className="row g-2"> {/* g-2 para reduzir o espaçamento entre colunas */}

                        {/* Email e Telefone */}
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

                        {/* Endereço */}
                        <div className="col-lg-6">
                            <div className="contact-item">
                                <strong><FaMapMarkerAlt className="me-1" /> Endereço:</strong>
                                <span className="text-end">{empresa.endereco || "Não Informado"}</span>
                            </div>
                            {/* Um espaço vazio para preencher a coluna, se necessário */}
                            <div className="contact-item invisible">.</div>
                        </div>
                    </div>
                </div>

                {/* Serviços Oferecidos */}
                <div className="info-card">
                    <h4>
                        <FaClipboardList /> Escopo de Serviços
                    </h4>
                    <ul className="servicos-list">
                        {empresa.servicos && empresa.servicos.length > 0 ? (
                          empresa.servicos.map((servico, index) => (
                            <li key={index}>
                              <FaTools className="service-icon" />
                              {servico.nome}
                            </li>
                          ))
                        ) : (
                          <li className="text-muted">Nenhum serviço fundamental cadastrado no momento.</li>
                        )}
                    </ul>
                </div>

                {/* Equipe (Funcionários) */}
                <div className="info-card funcionarios-card">
                    <h4>
                        <FaUsers /> Nossos Profissionais
                    </h4>
                    {funcionariosData && funcionariosData.length > 0 ? (
                      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                        {funcionariosData.slice(0, 8).map((funcionario) => (
                          <div
                            key={funcionario.id}
                            className="col"
                          >
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmpresaDetails;