import Navbar from "../components/Navbar";
import { FaBuilding, FaBullseye, FaEye, FaUsers, FaArrowRight, FaLinkedin, FaRocket, FaHandshake } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Sobre() {
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
          color: white;
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

        .mission-card {
          background: white;
          border-radius: var(--radius);
          padding: 2.5rem;
          height: 100%;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          border: 1px solid var(--gray-200);
          position: relative;
          overflow: hidden;
        }
        .mission-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 5px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
        }
        .mission-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-md);
        }
        .mission-icon {
          width: 70px; height: 70px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 6px 15px rgba(0,48,135,0.3);
        }

        .team-card {
          background: white;
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          border-top: 5px solid var(--accent);
          max-width: 320px;
          margin: 0 auto;
        }
        .team-card:hover {
          transform: translateY(-12px);
          box-shadow: var(--shadow-lg);
        }
        .team-card img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .team-card:hover img {
          transform: scale(1.05);
        }
        .team-links {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin-top: 1rem;
        }
        .team-links a {
          width: 40px; height: 40px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .team-links a:hover {
          background: var(--accent);
          color: #212529;
          transform: translateY(-3px);
        }

        .stats-bar {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255,255,255,0.2);
          padding: 1.5rem 0;
        }

        .final-cta {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 4rem 0;
          text-align: center;
        }
        .final-cta h3 {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="bg-light">
        <Navbar />

        <header className="hero-gradient text-white py-5 position-relative">
          <div className="container py-5">
            <div className="row align-items-center g-5">
              <div className="col-lg-7 animate-fadeInUp">
                <h1 className="display-4 fw-bold mb-4 lh-1">
                  <FaBuilding className="me-3" />
                  Conheça o VemAgendar
                </h1>
                <p className="lead mb-4 opacity-90 fs-5">
                  Uma plataforma <strong>nascida da dor real</strong> de quem vive de agendamentos.
                  Criada para <strong>eliminar no-shows, burocracia e perda de tempo</strong>.
                </p>
                <Link to="/empresas" className="btn-cta-primary d-inline-flex align-items-center">
                  Comece Grátis Agora <FaArrowRight className="ms-2" />
                </Link>
              </div>
              <div className="col-lg-5 text-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-4 p-4 shadow-lg">
                  <h3 className="fw-bold mb-3">Várias empresas</h3>
                  <p className="mb-0 opacity-90">já transformaram suas agendas</p>
                </div>
              </div>
            </div>
          </div>

]          <div className="stats-bar">
            <div className="container">
              <div className="row text-center text-white small">
                <div className="col-6 col-md-3">
                  <strong>Alta taxa de</strong><br />Satisfação
                </div>
                <div className="col-6 col-md-3">
                  <strong>Inúmeros</strong><br />agendamentos
                </div>
                <div className="col-6 col-md-3">
                  <strong>Alta taxa de</strong><br />Redução de faltas
                </div>
                <div className="col-6 col-md-3">
                  <strong>24/7</strong><br />Suporte
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="py-5 bg-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold" style={{ color: 'var(--primary)' }}>
                <FaRocket className="me-3" />Nossa Jornada
              </h2>
              <p className="text-muted lead">Valores que guiam cada linha de código</p>
            </div>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="mission-card animate-fadeInUp">
                  <div className="mission-icon">
                    <FaBullseye />
                  </div>
                  <h3 className="fw-bold fs-4 mb-3">Missão</h3>
                  <p className="text-muted">
                    Simplificar a gestão de agendamentos para <strong>negócios de todos os portes</strong>,
                    eliminando burocracia e liberando tempo para o que realmente importa:
                    <strong> atender com excelência</strong>.
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mission-card animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                  <div className="mission-icon">
                    <FaEye />
                  </div>
                  <h3 className="fw-bold fs-4 mb-3">Visão</h3>
                  <p className="text-muted">
                    Ser a <strong>plataforma #1 de agendamento no Brasil e no mundo</strong>,
                    reconhecida por sua <strong>intuitividade, confiabilidade e impacto real</strong>
                    na vida de empreendedores e clientes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5" style={{ background: 'var(--gray-100)' }}>
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold" style={{ color: 'var(--primary)' }}>
                <FaUsers className="me-3" />Quem Faz Acontecer
              </h2>
              <p className="text-muted lead">Uma equipe apaixonada por resultados</p>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-5 col-lg-4">
                <div className="team-card animate-fadeInUp">
                  <img
                    src="https://eu-agendo.s3.us-east-1.amazonaws.com/imagens/minhaFoto_Diogo_vemagendargmail.com.jpeg"
                    alt="Diogo Antonio"
                  />
                  <div className="p-4 text-center">
                    <h5 className="fw-bold fs-4" style={{ color: 'var(--primary)' }}>Diogo Antonio</h5>
                    <p className="text-muted mb-1">CEO & Fundador</p>
                    <p className="small text-muted mb-3">
                      Apaixonado por tecnologia, empreendedorismo e por <strong>transformar dores em soluções</strong>.
                    </p>
                    <div className="team-links">
                      <a href="https://linkedin.com/in/dabpereira" target="_blank" rel="noopener">
                        <FaLinkedin />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="container">
            <h3>
              <FaHandshake className="me-3" style={{ color: 'var(--accent)' }} />
              Pronto para fazer parte dessa história?
            </h3>
            <p className="text-muted lead mb-4">
              Milhares de empresas já estão economizando tempo e dinheiro.
            </p>
            <Link to="/empresas" className="btn-cta-primary d-inline-flex align-items-center">
              Teste Grátis por 7 Dias <FaArrowRight className="ms-2" />
            </Link>
            <p className="mt-3 text-muted small">
              Teste grátis SEM cartão • Cancele quando quiser
            </p>
          </div>
        </section>

        <footer className="bg-dark text-white py-4 text-center">
          <div className="container">
            <p className="mb-0">&copy; 2025 VemAgendar. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Sobre;