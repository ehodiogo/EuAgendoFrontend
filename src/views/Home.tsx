import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import {
  FaGithub, FaInstagram, FaLinkedin, FaRoad, FaBuilding, FaClock, FaRocket, FaStar,
  FaMobileScreenButton, FaChartLine, FaArrowRight, FaCalendarCheck,
  FaWhatsapp, FaHeadset
} from "react-icons/fa6";
import {FaCheckCircle, FaShieldAlt} from "react-icons/fa";
import { BsPatchCheckFill, BsFillFileLockFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useFetch } from "../functions/GetData.tsx";
import { Plano } from "../interfaces/Plano.tsx";

type CompanyType = 'servico' | 'locacao';

const PlanCardPlaceholder = ({ count }: { count: number }) => (
  <div className="row g-4 justify-content-center">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="col-md-4">
        <div className="plan-card placeholder-card p-4 rounded-4">
          <div className="placeholder-glow mx-auto mb-3" style={{ height: '2rem', width: '70%' }}></div>
          <div className="placeholder-glow mx-auto mb-4" style={{ height: '1rem', width: '50%' }}></div>
          <div className="placeholder-glow mx-auto my-4" style={{ height: '3rem', width: '60%' }}></div>
          <div className="placeholder-glow" style={{ height: '1rem', width: '100%' }}></div>
          <div className="placeholder-glow mt-2" style={{ height: '1rem', width: '85%' }}></div>
          <div className="placeholder-glow mt-2" style={{ height: '1rem', width: '70%' }}></div>
          <div className="placeholder-glow mt-4 custom-btn-hero" style={{ height: '3rem' }}></div>
        </div>
      </div>
    ))}
  </div>
);

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
            .filter((p: Plano) => p.nome.toLowerCase() !== "free trial")
            .map((p: Plano) => {
              let capacity = '';
              if (companyType === 'servico') {
                capacity = `Até ${p.quantidade_funcionarios} funcionário${p.quantidade_funcionarios > 1 ? 's' : ''}`;
              } else {
                capacity = `Até ${p.quantidade_locacoes} locaç${p.quantidade_locacoes > 1 ? 'ões' : 'ão'} ativa${p.quantidade_locacoes > 1 ? 's' : ''}`;
              }

              return {
                duracao_em_dias: p.duracao_em_dias,
                quantidade_empresas: p.quantidade_empresas,
                quantidade_funcionarios: p.quantidade_funcionarios,
                quantidade_locacoes: p.quantidade_locacoes,

                nome: p.nome,
                valor: p.valor,
                valor_cheio: p.valor_cheio,
                is_promo: p.is_promo,
                porcentagem_promo: p.porcentagem_promo,
                cor: getPlanColor(p.nome),
                features: [
                  `Até ${p.quantidade_empresas} empresa${p.quantidade_empresas > 1 ? 's' : ''}`,
                  capacity,
                  "Agendamento 24/7",
                  "Lembretes por Email",
                  "Gestão completa de clientes",
                  "Relatórios em tempo real"
                ].filter(Boolean),
                descricao: p.descricao || "Ideal para quem quer crescer sem complicação"
              } as Plano;
            });

          setPlanos(mapped);
        }
      }
    }, [loading, data, companyType]);

  const getPlanColor = (nome: string) => {
    const n = nome.toLowerCase();
    if (n.includes("básico")) return "#28a745";
    if (n.includes("profissional")) return "#fd7e14";
    if (n.includes("corporativo")) return "#003087";
    return "#6c757d";
  };

  return (
    <div className="min-vh-100">
      <style>{`
        :root {
          --primary: #003087;
          --primary-dark: #00205b;
          --accent: #f6c107;
          --success: #28a745;
          --warning: #fd7e14;
          --danger: #dc3545;
          --gray-100: #f8f9fa;
          --gray-200: #e9ecef;
          --gray-600: #6c757d;
          --gray-800: #343a40;
          --white: #ffffff;
          --shadow-sm: 0 4px 12px rgba(0,0,0,0.08);
          --shadow-md: 0 8px 25px rgba(0,0,0,0.15);
          --shadow-lg: 0 15px 40px rgba(0,0,0,0.25);
          --radius: 16px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }

        .hero-gradient {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-gradient::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(246,193,7,0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .btn-cta-primary {
          background: var(--accent);
          color: #212529;
          font-weight: 700;
          padding: 1rem 2.8rem;
          border-radius: 14px;
          font-size: 1.15rem;
          border: none;
          box-shadow: 0 6px 20px rgba(246, 193, 7, 0.4);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }
        .btn-cta-primary::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 0; height: 0;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .btn-cta-primary:hover::after {
          width: 300px; height: 300px;
        }
        .btn-cta-primary:hover {
          background: #e0a800;
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(246, 193, 7, 0.5);
        }

        .btn-cta-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
          font-weight: 600;
          padding: 0.9rem 2.2rem;
          border-radius: 14px;
          transition: var(--transition);
        }
        .btn-cta-secondary:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-3px);
        }

        .highlight-badge {
          position: absolute;
          top: -14px;
          right: 20px;
          background: var(--warning);
          color: white;
          padding: 0.5rem 1.2rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 700;
          box-shadow: var(--shadow-sm);
          z-index: 10;
          animation: pulse 2s infinite;
        }

        .plan-card {
          transition: var(--transition);
          position: relative;
          overflow: hidden;
          border: 1px solid var(--gray-200) !important;
        }
        .plan-card:hover {
          transform: translateY(-12px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary) !important;
        }
        .plan-card.highlight {
          transform: scale(1.06);
          z-index: 5;
          border: 2px solid var(--warning) !important;
        }

        .star {
          color: #ffc107;
          animation: starPulse 1.5s infinite;
        }
        @keyframes starPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        .badge-promo {
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
          color: #155724;
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .timeline::before {
          background: var(--accent);
          width: 5px;
          left: 0.15rem;
        }
        .timeline-item::before {
          background: var(--accent);
          border: 4px solid white;
          box-shadow: 0 0 0 4px var(--accent);
          left: -2.5rem;
          width: 18px;
          height: 18px;
        }

        .trust-bar {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255,255,255,0.2);
        }

        .metric-card {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          transition: var(--transition);
        }
        .metric-card:hover {
          background: rgba(255,255,255,0.25);
          transform: translateY(-5px);
        }

        .placeholder-glow {
          background: linear-gradient(90deg, #e9ecef 0%, #f8f9fa 50%, #e9ecef 100%);
          background-size: 200px 100%;
          animation: pulse 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes pulse {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }

        .guarantee-badge {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(40,167,69,0.3);
        }
      `}</style>

      <div className="bg-light">
        <Navbar />

        <header className="hero-gradient text-white position-relative">
          <div className="container py-5">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 animate-fadeInUp">
                <h1 className="display-3 fw-bold mb-4 lh-1">
                  Pare de Perder <span style={{ color: 'var(--accent)' }}>R$ 3.000/mês</span><br />
                  em Faltas e Desorganização
                </h1>
                <p className="lead mb-4 opacity-90 fs-5">
                  <strong>87% dos clientes</strong> agendam fora do horário comercial.
                  Com <strong>VemAgendar</strong>, você captura todos — 24h por dia.
                </p>

                <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
                  <button className="btn-cta-primary d-flex align-items-center justify-content-center" onClick={() => navigate("/empresas")}>
                    <FaCalendarCheck className="me-2" /> Teste 7 Dias Grátis
                  </button>
                  <button className="btn-cta-secondary d-flex align-items-center justify-content-center" onClick={() => navigate("/demo")}>
                    Ver Demo ao Vivo <FaArrowRight className="ms-2" />
                  </button>
                </div>

                <div className="d-flex flex-wrap gap-3 align-items-center">
                  <div className="guarantee-badge">
                    <FaShieldAlt /> Garantia de 30 dias
                  </div>
                  <small className="text-white-75">Teste grátis SEM cartão • Cancele quando quiser</small>
                </div>
              </div>
              <div className="col-lg-6 text-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <img
                  src="vem-agendar.png"
                  alt="Dashboard VemAgendar"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxWidth: '520px', border: '10px solid rgba(255,255,255,0.25)' }}
                />
              </div>
            </div>
          </div>

          <div className="trust-bar py-3 mt-5">
            <div className="container">
              <div className="row text-center text-white small">
                <div className="col-6 col-md-3">
                  <strong>2.847</strong><br />empresas ativas
                </div>
                <div className="col-6 col-md-3">
                  <strong>94,2%</strong><br />de satisfação
                </div>
                <div className="col-6 col-md-3">
                  <strong>1.2M+</strong><br />agendamentos
                </div>
                <div className="col-6 col-md-3">
                  <strong>24/7</strong><br />suporte humano
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="py-5 bg-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold" style={{ color: 'var(--primary)' }}>Uma Plataforma. Todos Ganham.</h2>
              <p className="text-muted lead">Do dono ao cliente final — todos saem ganhando</p>
            </div>
            <div className="row g-4">
              {[
                { icon: <FaBuilding size={42} />, title: "Para Empresas", text: "Reduza faltas em 80% com lembretes automáticos por Email.", color: "#003087" },
                { icon: <FaWhatsapp size={42} />, title: "Para Clientes", text: "Agende em 15 segundos, 24h por dia, sem ligar.", color: "#25d366" },
                { icon: <FaChartLine size={42} />, title: "Para Gestores", text: "Veja ocupação, faturamento e previsões em tempo real.", color: "#fd7e14" }
              ].map((item, i) => (
                <div key={i} className="col-md-4">
                  <div className="text-center p-5 rounded-4 h-100 animate-fadeInUp" style={{ background: 'var(--gray-100)', animationDelay: `${i * 0.1}s` }}>
                    <div className="mb-4" style={{ color: item.color }}>{item.icon}</div>
                    <h5 className="fw-bold">{item.title}</h5>
                    <p className="text-muted small">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
          <div className="container">
            <h2 className="text-center fw-bold mb-5" style={{ color: 'var(--primary)' }}>Empresas que Transformaram</h2>
            <div className="row g-4">
              {[
                { name: "Helena D.", role: "Salão Beleza Plena", text: "Reduzimos faltas de 40% para 6% em 2 semanas. Meus clientes amam o VemAgendar!", avatar: "H", color: "#fd7e14" },
                { name: "Pietro P.", role: "Consultor", text: "Economizo 4h por dia. A interface é tão boa que até minha mãe usa sozinha.", avatar: "P", color: "#003087" },
                { name: "Yasmin P.", role: "Esteticista", text: "Paguei o plano no 1º dia com novos clientes. Melhor ROI da vida!", avatar: "Y", color: "#28a745" }
              ].map((item, i) => (
                <div key={i} className="col-md-4">
                  <div className="bg-white p-4 rounded-4 shadow-sm h-100 animate-fadeInUp" style={{ animationDelay: `${i * 0.15}s` }}>
                    <div className="d-flex mb-3">
                      {[...Array(5)].map((_, s) => <FaStar key={s} className="star me-1" size={22} />)}
                    </div>
                    <p className="fst-italic text-muted lh-lg">"{item.text}"</p>
                    <div className="d-flex align-items-center mt-4">
                      <div className="rounded-circle d-flex align-items-center justify-content-center me-3 text-white fw-bold" style={{ width: 50, height: 50, background: item.color }}>
                        {item.avatar}
                      </div>
                      <div>
                        <strong>{item.name}</strong><br />
                        <small className="text-muted">{item.role}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-5 bg-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold" style={{ color: 'var(--primary)' }}>Escolha Seu Plano</h2>
              <p className="text-muted lead">Comece grátis. Cresça sem limites.</p>
              <div className="d-inline-flex gap-2 bg-light p-1 rounded-pill shadow-sm">
                <button className={`btn btn-sm rounded-pill px-4 ${companyType === 'servico' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setCompanyType('servico')}>
                  Serviços
                </button>
                <button className={`btn btn-sm rounded-pill px-4 ${companyType === 'locacao' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setCompanyType('locacao')}>
                  Locações
                </button>
              </div>
            </div>

            {loading ? (
              <PlanCardPlaceholder count={3} />
            ) : (
              <div className="row g-4 justify-content-center">
                {planos.map((plano, i) => (
                  <div key={i} className="col-md-4">
                    <div className={`plan-card p-5 rounded-4 h-100 position-relative animate-fadeInUp`} style={{ animationDelay: `${i * 0.1}s` }}>
                      {plano.nome.toLowerCase().includes('profissional') && <div className="highlight-badge">MAIS VENDIDO</div>}

                      <h4 className="fw-bold fs-3" style={{ color: plano.cor }}>{plano.nome}</h4>
                      <p className="text-muted small mb-4">{plano.descricao}</p>

                      <div className="my-4 text-center">
                        <div className="d-flex align-items-end justify-content-center mb-2">
                          <span className="fs-1 fw-bold" style={{ color: 'var(--primary)' }}>R${plano.valor.toFixed(2)}</span>
                          <span className="text-muted ms-1 fs-5">/mês</span>
                        </div>
                        {plano.is_promo && (
                          <>
                            <small className="text-decoration-line-through text-danger d-block">R${plano.valor_cheio.toFixed(2)}</small>
                            <div className="badge-promo d-inline-block mt-2">
                              <BsPatchCheckFill /> Economize {plano.porcentagem_promo}%
                            </div>
                          </>
                        )}
                      </div>

                      <ul className="list-unstyled mb-4 flex-grow-1">
                        {plano.features.map((f, j) => (
                          <li key={j} className="d-flex align-items-center mb-3 text-muted">
                            <FaCheckCircle className="text-success me-2" size={20} />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        className="btn w-100 fw-bold mt-auto"
                        style={{
                          backgroundColor: plano.nome.toLowerCase().includes('profissional') ? 'var(--warning)' : 'var(--primary)',
                          color: 'white',
                          padding: '1rem',
                          borderRadius: '14px',
                          fontSize: '1.1rem'
                        }}
                        onClick={() => navigate("/planos")}
                      >
                        Começar Agora <FaArrowRight className="ms-2" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-5" style={{ background: 'var(--primary)' }}>
          <div className="container text-white">
            <h2 className="text-center fw-bold mb-4" style={{ color: 'var(--accent)' }}>O Futuro do Agendamento</h2>
            <p className="text-center text-white-75 lead mb-5">Lançamos novidades todo mês</p>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="bg-white text-dark p-5 rounded-4 shadow-lg">
                  <div className="timeline">
                    {[
                      { icon: <FaClock />, text: "Google Calendar + Outlook", done: true },
                      { icon: <FaMobileScreenButton />, text: "App iOS & Android", done: false },
                      { icon: <FaChartLine />, text: "IA para prever demanda", done: false },
                      { icon: <FaRocket />, text: "Página personalizada com domínio", done: false }
                    ].map((item, i) => (
                      <div key={i} className="timeline-item d-flex align-items-center mb-4">
                        <div className="me-3" style={{ color: item.done ? 'var(--success)' : 'var(--primary)' }}>
                          {item.icon}
                        </div>
                        <span className={`fw-medium ${item.done ? 'text-success' : ''}`}>
                          {item.text} {item.done && 'Disponível'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <Link to="/roadmap" className="btn btn-outline-primary fw-bold px-5">
                      <FaRoad className="me-2" /> Ver Roadmap
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-dark text-white py-5">
          <div className="container text-center">
            <h4 className="fw-bold mb-3">VemAgendar</h4>
            <p className="mb-4 text-white-50">&copy; 2025 VemAgendar. Todos os direitos reservados.</p>
            <div className="d-flex justify-content-center gap-4 flex-wrap mb-3">
              <Link to="/termos" className="text-white text-decoration-none d-flex align-items-center">
                <BsFillFileLockFill className="me-2" /> Termos
              </Link>
              <a href="https://github.com/ehodiogo" target="_blank" className="text-white text-decoration-none d-flex align-items-center">
                <FaGithub className="me-2" /> GitHub
              </a>
              <a href="https://instagram.com/vemagendarapp" target="_blank" className="text-white text-decoration-none d-flex align-items-center">
                <FaInstagram className="me-2" /> Instagram
              </a>
              <a href="https://linkedin.com/in/dabpereira" target="_blank" className="text-white text-decoration-none d-flex align-items-center">
                <FaLinkedin className="me-2" /> LinkedIn
              </a>
            </div>
            <small className="text-white-50">
              <FaHeadset className="me-1" /> Suporte 24h: contato@vemagendar.com
            </small>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;