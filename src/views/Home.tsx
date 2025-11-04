import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import { FaGithub, FaInstagram, FaLinkedin, FaRoad, FaUser, FaBuilding, FaClipboardCheck, FaClock, FaRocket, FaStar, FaMobileScreenButton, FaChartLine } from "react-icons/fa6";
import { BsFillFileLockFill, BsPatchCheckFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useFetch } from "../functions/GetData.tsx";
import { Plano } from "../interfaces/Plano.tsx";

type CompanyType = 'servico' | 'locacao';


const PlanCardPlaceholder = ({ count }: { count: number }) => {
    const placeholders = Array.from({ length: count });

    return (
        <div className="plan-row">
            {placeholders.map((_, index) => (
                <div key={index} className="plan-card placeholder-card" style={{ cursor: 'default', borderTop: '5px solid #e9ecef' }}>
                    <div className="placeholder-glow mx-auto mb-4 mt-2" style={{ height: '1.8rem', width: '70%' }}></div>
                    <div className="placeholder-glow mx-auto mb-3" style={{ height: '1rem', width: '85%' }}></div>

                    <div className="plan-price-group">
                        <div className="placeholder-glow mx-auto" style={{ height: '3.5rem', width: '60%' }}></div>
                        <div className="placeholder-glow mx-auto mt-2" style={{ height: '1rem', width: '35%' }}></div>
                    </div>

                    <ul style={{textAlign: 'left'}}>
                        {[...Array(4)].map((_, i) => (
                            <li key={i} className="mb-3 d-flex align-items-center">
                                <div className="placeholder-glow me-3" style={{ height: '1.1rem', width: '1.1rem', borderRadius: '50%' }}></div>
                                <div className="placeholder-glow" style={{ height: '0.9rem', width: `${60 + (i * 8)}%` }}></div>
                            </li>
                        ))}
                    </ul>

                    <div className="placeholder-glow custom-btn-hero btn mt-auto" style={{ height: '3rem', width: '100%' }}></div>
                </div>
            ))}
        </div>
    );
};

function Home() {
  const navigate = useNavigate();
  const { data, loading } = useFetch<Plano[]>("/api/planos");
  const [planos, setPlanos] = useState<Plano[]>([]);

  const [companyType, setCompanyType] = useState<CompanyType>('servico');

  useEffect(() => {
    if (!loading && data) {
      // @ts-ignore
      const rawPlanos = Array.isArray(data) ? data : data.results;
      if (Array.isArray(rawPlanos)) {
        const mapped = rawPlanos
          .filter((plano: Plano) => plano.nome.toLowerCase() !== "free trial")
          .map((plano: Plano) => {

            let capacityFeature = '';
            if (companyType === 'servico') {
                const count = plano.quantidade_funcionarios;
                capacityFeature = `Até ${count} funcionário${count !== 1 ? "s" : ""} por empresa`;
            } else if (companyType === 'locacao') {
                const count = plano.quantidade_locacoes;
                capacityFeature = `Até ${count} locaç${count !== 1 ? "ões" : "ão"} ativa${count !== 1 ? "s" : ""}`;
            }

            return {
                nome: plano.nome,
                valor: plano.valor,
                valor_cheio: plano.valor_cheio,
                is_promo: plano.is_promo,
                porcentagem_promo: plano.porcentagem_promo,
                duracao_em_dias: plano.duracao_em_dias,
                quantidade_empresas: plano.quantidade_empresas,
                quantidade_funcionarios: plano.quantidade_funcionarios,
                quantidade_locacoes: plano.quantidade_locacoes,
                cor: getPlanColor(plano.nome),
                features: [
                    `Até ${plano.quantidade_empresas} empresa${plano.quantidade_empresas !== 1 ? "s" : ""}`,
                    capacityFeature,
                    "Agendamento Online 24/7",
                    "Lembretes Automáticos",
                    "Gestão de Clientes",
                ].filter(Boolean),
                descricao: plano.descricao || "Plano ideal para o crescimento do seu negócio",
            };
          });
        setPlanos(mapped);
      }
    }
  }, [loading, data, companyType]);

  const getPlanColor = (nome: string) => {
    switch (nome.toLowerCase()) {
      case "plano básico":
        return "#28a745";
      case "plano profissional":
        return "#fd7e14";
      case "plano corporativo":
        return "#003087";
      default:
        return "#6c757d";
    }
  };

  const getBenefitIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case "para empresas":
        return <FaBuilding />;
      case "para clientes":
        return <FaUser />;
      case "para gestores":
        return <FaChartLine />;
      default:
        return <FaClipboardCheck />;
    }
  };

  return (
    <div className="min-vh-100">
      <style>{`
        /* Paleta de cores (Consistente) */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --medium-gray: #6c757d;
          --light-gray-bg: #f5f7fa;
          --white: #ffffff;
          --accent-yellow: #f6c107;
          --success-green: #28aa45;
          --warning-orange: #fd7e14;
          --danger-red: #dc3545;
          --gradient-blue: linear-gradient(135deg, #003087, #0056b3);
          --border-light: #e0e0e0;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray-bg);
        }

        /* Header (Hero Section) */
        .custom-header {
          background: var(--gradient-blue);
          padding: 6rem 0;
          color: var(--white);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }
        .custom-header h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
        }
        .custom-header p {
          font-size: 1.4rem;
          opacity: 0.95;
          max-width: 700px;
          margin: 0 auto 2.5rem;
          font-weight: 300;
        }
        .custom-header img {
          max-width: 400px;
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
          border-radius: 12px;
          border: 5px solid var(--white);
        }
        .custom-btn-hero {
          background-color: var(--accent-yellow);
          color: var(--dark-gray);
          font-weight: 700;
          padding: 1rem 3rem;
          border-radius: 10px;
          font-size: 1.25rem;
          transition: all 0.3s ease;
          border: none;
        }
        .custom-btn-hero:hover {
          background-color: #e0a800;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }

        /* Seções */
        .custom-section {
          padding: 5rem 0;
        }
        .custom-section h2 {
          color: var(--primary-blue);
          font-weight: 800;
          font-size: 2.5rem;
          margin-bottom: 2rem;
        }
        .custom-section p.text-muted-lg {
          color: var(--medium-gray) !important;
          font-size: 1.2rem;
          max-width: 800px;
          margin: 0 auto 3rem;
        }

        /* Benefícios */
        .benefit-card {
          border: 1px solid var(--border-light);
          border-radius: 12px;
          background-color: var(--white);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 2rem;
          text-align: center;
          height: 100%;
        }
        .benefit-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        .benefit-icon {
          background-color: var(--accent-blue);
          color: var(--white);
          border-radius: 50%;
          padding: 1.25rem;
          font-size: 1.8rem;
          margin: 0 auto 1rem;
          display: inline-flex;
        }
        .benefit-card h3 {
          color: var(--dark-gray);
          font-size: 1.5rem;
          font-weight: 700;
        }
        .benefit-card p {
          color: var(--medium-gray);
          font-size: 1rem;
        }

        /* Planos - REVISADO (Ajustado) */
        .plan-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: center;
        }
        .plan-card {
          border-radius: 12px;
          background-color: var(--white);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 2.5rem 1.5rem; /* Ajuste: Diminuído o padding lateral para otimizar o espaço */
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          flex: 1;
          max-width: 320px;
          border-top: 5px solid var(--primary-blue);
          text-align: center;
        }
        .plan-card:not(.placeholder-card):hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        /* Destaque para o Plano Profissional */
        .plan-card.highlight {
            transform: scale(1.05);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            border-top: 5px solid var(--warning-orange);
            z-index: 10;
        }
        .plan-card.highlight .ribbon {
            position: absolute;
            top: 0;
            right: 15px;
            background-color: var(--warning-orange);
            color: var(--white);
            padding: 0.25rem 0.75rem;
            font-size: 0.9rem;
            font-weight: 700;
            border-radius: 0 0 4px 4px;
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
        }

        .plan-card h4 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--dark-gray);
        }
        .plan-card .plan-price-group {
            margin-bottom: 1.5rem;
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-light);
            /* Ajuste: Garantir que o grupo de preço ocupe a largura total */
            width: 100%; 
        }
        .plan-card .plan-price {
          /* Ajuste: Redução da fonte para evitar quebra de linha */
          font-size: 2.8rem; 
          font-weight: 800;
          color: var(--primary-blue);
          line-height: 1.1; /* Ajuste: linha um pouco maior para espaçamento */
          /* Adiciona um espaço para que R$ e o preço não fiquem colados */
          white-space: nowrap; 
          display: inline-block; 
        }
        .plan-card .plan-price small {
            font-size: 0.9rem; /* Levemente menor */
            font-weight: 600;
            color: var(--medium-gray);
            margin-left: 0.25rem;
        }
        .plan-card .full-price {
          font-size: 1rem; /* Levemente menor */
          color: var(--danger-red);
          text-decoration: line-through;
          margin-top: 0.5rem; /* Mais espaçamento */
          display: block;
        }
        .plan-card .discount {
          font-size: 1rem;
          color: var(--success-green);
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .plan-card ul {
          list-style: none;
          padding: 0 0.5rem; /* Ajuste: Padding interno para as features */
          margin-bottom: 2rem;
          color: var(--medium-gray);
          flex-grow: 1;
          text-align: left;
        }
        .plan-card ul li {
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          font-size: 0.95rem; /* Levemente menor para caber mais texto */
        }
        .plan-card ul li svg {
          color: var(--success-green);
          margin-right: 0.75rem;
          flex-shrink: 0;
        }
        .plan-card .plan-desc {
            color: var(--dark-gray);
            font-style: italic;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        /* Estilos Placeholder (Reaproveitados ou Ajustados para a Home) */
        @keyframes pulse {
            0% { background-position: -200px 0; }
            100% { background-position: calc(200px + 100%) 0; }
        }
        .placeholder-glow {
            background-color: #e9ecef;
            background-image: linear-gradient(90deg, #e9ecef 0%, #f9f9f9 50%, #e9ecef 100%);
            background-size: 200px 100%;
            background-repeat: no-repeat;
            animation: pulse 1.5s infinite linear;
            border-radius: 6px;
        }
        .plan-card.placeholder-card {
            background-color: #f7f7f7;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border: 1px solid #e9ecef;
        }


        /* Roadmap */
        .roadmap-section {
          background-color: var(--primary-blue);
          color: var(--white);
          padding: 5rem 0;
        }
        .roadmap-section h2 {
            color: var(--accent-yellow);
        }
        .roadmap-card {
          background-color: rgba(255, 255, 255, 0.95);
          color: var(--dark-gray);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
          margin-top: 2rem;
        }
        .roadmap-card ul {
          list-style: none;
          padding: 0;
          text-align: left;
        }
        .roadmap-card ul li {
          margin-bottom: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          font-size: 1.1rem;
        }
        .roadmap-card ul li svg {
          color: var(--primary-blue);
          margin-right: 0.75rem;
          flex-shrink: 0;
        }
        .custom-btn-roadmap {
            background-color: var(--primary-blue);
            color: var(--white);
            font-weight: 600;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        .custom-btn-roadmap:hover {
            background-color: var(--accent-blue);
        }

        /* Footer */
        .custom-footer {
          background-color: var(--dark-gray);
          color: var(--white);
          padding: 3rem 0;
        }
        .custom-footer a {
          color: var(--white);
          opacity: 0.8;
          transition: color 0.3s ease;
        }
        .custom-footer a:hover {
          color: var(--accent-yellow);
          opacity: 1;
        }
        .custom-footer .social-links {
          gap: 1.5rem;
        }

        /* Reviews */
        .review-card {
            background-color: var(--white);
            border: 1px solid var(--border-light);
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            padding: 2rem;
            text-align: center;
        }
        .review-card .avatar svg {
            font-size: 2rem;
            color: var(--medium-gray);
            margin-bottom: 0.5rem;
        }

        /* Responsividade */
        @media (max-width: 1200px) {
          .plan-card {
            max-width: 48%;
            flex: 1 1 48%;
          }
        }
        @media (max-width: 991px) {
          .custom-header {
            padding: 4rem 0;
          }
          .custom-header h1 {
            font-size: 2.5rem;
          }
          .custom-header img {
            margin-top: 3rem;
            max-width: 80%;
          }
          .plan-card {
            max-width: 100%;
            flex: 1 1 100%;
            margin-bottom: 1.5rem;
          }
        }
        @media (max-width: 576px) {
          .custom-header h1 {
            font-size: 2rem;
          }
          .custom-header p {
            font-size: 1.1rem;
          }
          .custom-btn-hero {
            padding: 0.8rem 2rem;
            font-size: 1.1rem;
          }
          .custom-section h2 {
            font-size: 2rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />

        <header className="custom-header d-flex align-items-center text-white">
          <div className="container d-flex align-items-center flex-wrap-reverse justify-content-center">
            <div className="text-center text-lg-start col-lg-7 me-lg-4">
              <h1 className="fw-bold">A Nova Era da Gestão de Agendamentos</h1>
              <p className="lead">
                Otimize sua agenda, reduza <strong>no-shows</strong> e liberte sua equipe. O <strong>VemAgendar</strong> é a ferramenta inteligente para o sucesso do seu negócio.
              </p>
              <button
                className="custom-btn-hero btn px-4 shadow-lg fw-semibold"
                onClick={() => navigate("/empresas")}
              >
                Começar a Organizar Agora
              </button>
              <p className="mt-3 small text-white-50">Teste grátis no plano Free Trial.</p>
            </div>
            <div className="ms-lg-5 col-lg-4 mt-4 mt-lg-0 text-center">
              <img
                src={"vem-agendar.png"}
                alt="Interface do Sistema VemAgendar"
                className="img-fluid"
              />
            </div>
          </div>
        </header>

        <section className="custom-section container text-center">
          <h2 className="fw-bold">Para quem o VemAgendar foi criado?</h2>
          <p className="text-muted-lg">
            Nossa plataforma é modular e pensada para atender às necessidades específicas de todos os envolvidos no processo de agendamento.
          </p>
          <div className="row mt-5 justify-content-center">
            {["Para Empresas", "Para Clientes", "Para Gestores"].map((title, index) => (
              <div key={index} className="col-md-4 d-flex mb-4">
                <div className="benefit-card d-flex flex-column h-100">
                  <div className="benefit-icon">{getBenefitIcon(title)}</div>
                  <h3>{title}</h3>
                  <p>
                    {title === "Para Empresas" && "Organize horários de funcionários, serviços e utilize lembretes automáticos para diminuir drasticamente as faltas."}
                    {title === "Para Clientes" && "Agende serviços em poucos cliques, 24 horas por dia, 7 dias por semana, e receba notificações instantâneas."}
                    {title === "Para Gestores" && "Obtenha uma visão macro da operação, maximize a produtividade da equipe e tome decisões baseadas em dados com nossos relatórios."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="custom-section bg-light" style={{paddingTop: '3rem', paddingBottom: '3rem'}}>
          <div className="container">
            <h2 className="fw-bold text-center">O que nossos clientes dizem</h2>
            <div className="row mt-4 justify-content-center">
              {[
                { name: "Helena D. (CEO, Salão)", review: "O VemAgendar revolucionou meu negócio! Nunca foi tão fácil organizar meus clientes.", stars: 5 },
                { name: "Pietro P. (Consultor)", review: "Reduziu o tempo de organizar meus atendimentos em 90% com a facilidade para visualizar horários.", stars: 5 },
                { name: "Yasmin P. (Esteticista)", review: "Prático, eficiente e muito intuitivo. A melhor ferramenta para autônomos!", stars: 5 },
              ].map((item, index) => (
                <div key={index} className="col-md-4 d-flex mb-4">
                  <div className="review-card d-flex flex-column h-100 p-4">
                    <div className="avatar">
                      <FaUser />
                    </div>
                    <p className="fw-semibold text-dark-gray fst-italic">"{item.review}"</p>
                    <p className="text-warning fs-4">
                        {[...Array(item.stars)].map((_, i) => <FaStar key={i} className="me-1" size={18} style={{color: '#ffc107'}} />)}
                    </p>
                    <h5 className="text-dark-gray">- {item.name}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="custom-section container text-center">
          <h2 className="fw-bold">Escolha seu Plano Ideal</h2>
          <p className="text-muted-lg">
            Planos flexíveis que se ajustam ao tamanho do seu negócio. Comece com o que é essencial e cresça conosco.
          </p>
            <div className="mb-4">
                <button
                    className={`btn btn-sm me-2 ${companyType === 'servico' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setCompanyType('servico')}
                >
                    Plano para Agendamento de Serviço
                </button>
                <button
                    className={`btn btn-sm ${companyType === 'locacao' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setCompanyType('locacao')}
                >
                    Plano para Locação de Quadras, Vagas, etc.
                </button>
            </div>

          {loading ? (
            <PlanCardPlaceholder count={3} />
          ) : (
            <div className="plan-row">
              {planos.map((plano: Plano, index: number) => (
                <div
                    key={index}
                    className={`plan-card ${plano.nome.toLowerCase().includes('profissional') ? 'highlight' : ''}`}
                >
                  {plano.nome.toLowerCase().includes('profissional') && (
                      <div className="ribbon">MAIS POPULAR</div>
                  )}

                  <h4 style={{ color: plano.cor }}>{plano.nome}</h4>
                  <p className="plan-desc">{plano.descricao}</p>

                  <div className="plan-price-group">
                    <div className="plan-price">
                      R${plano.valor.toFixed(2)}
                      <small>/mês</small>
                    </div>
                    {plano.is_promo && (
                      <span className="full-price">
                        De R${plano.valor_cheio.toFixed(2)}
                      </span>
                    )}
                    {plano.is_promo && (
                      <div className="discount">
                        <BsPatchCheckFill className="me-2" style={{color: plano.cor}} /> Economize **{plano.porcentagem_promo}%**!
                      </div>
                    )}
                  </div>

                  <ul>
                    {plano.features.map((feature, idx) => (
                      <li key={idx}>
                        <BsPatchCheckFill size={18} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="custom-btn-hero btn"
                    style={{
                        backgroundColor: plano.nome.toLowerCase().includes('profissional') ? 'var(--warning-orange)' : 'var(--primary-blue)',
                        color: 'var(--white)',
                        fontWeight: 700
                    }}
                    onClick={() => navigate("/planos")}
                  >
                    Assine agora
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="roadmap-section">
          <div className="container text-center">
            <h2 className="fw-bold">Junte-se à Nossa Jornada</h2>
            <p className="text-muted-lg text-white-50">Estamos em constante evolução. Veja o que está por vir!</p>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="roadmap-card">
                  <h4 className="fw-bold text-primary-blue mb-4">Próximos Lançamentos (Roadmap)</h4>
                  <ul>
                    <li><FaClock /> Integração com Google Calendar e Outlook.</li>
                    <li><FaMobileScreenButton /> Aplicativo móvel nativo para iOS e Android.</li>
                    <li><FaChartLine /> Relatórios e análises de desempenho avançados.</li>
                    <li><FaRocket /> Personalização avançada da página de agendamento.</li>
                  </ul>
                  <Link
                    to="/roadmap"
                    className="custom-btn-roadmap btn mt-3 px-4 fw-semibold"
                  >
                    <FaRoad className="me-2" /> Ver Roadmap Completo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="custom-footer text-center py-5">
          <div className="container">
            <h5 className="fw-bold mb-3">VemAgendar | Simplificando o futuro.</h5>
            <p className="mb-4">&copy; 2025 VemAgendar. Todos os direitos reservados.</p>
            <div className="d-flex justify-content-center social-links">
                <Link to="/termos" className="text-decoration-none d-flex align-items-center me-3">
                    <BsFillFileLockFill className="me-2" /> Termos de Serviço
                </Link>
                <a href="https://www.github.com/ehodiogo" target="_blank" rel="noopener noreferrer" className="text-decoration-none d-flex align-items-center me-3">
                    <FaGithub className="me-2" /> GitHub
                </a>
                <a href="https://www.instagram.com/vemagendarapp" target="_blank" rel="noopener noreferrer" className="text-decoration-none d-flex align-items-center me-3">
                    <FaInstagram className="me-2" /> Instagram
                </a>
                <a href="https://www.linkedin.com/in/dabpereira" target="_blank" rel="noopener noreferrer" className="text-decoration-none d-flex align-items-center">
                    <FaLinkedin className="me-2" /> LinkedIn
                </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;