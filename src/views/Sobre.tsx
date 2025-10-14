import Navbar from "../components/Navbar";
import { FaBuilding, FaBullseye, FaEye, FaUsers, FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Sobre() {
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
          --gradient-blue: linear-gradient(135deg, #003087, #0056b3);
          --border-light: #e0e0e0;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray-bg);
        }

        /* Hero Section - Destaque Principal */
        .hero-section {
          background: var(--gradient-blue);
          color: var(--white);
          padding: 5rem 0;
          text-align: center;
          position: relative;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .hero-section h1 {
          font-weight: 800;
          font-size: 3rem;
          margin-bottom: 1rem;
          text-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }
        .hero-section p.lead {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.35rem;
          max-width: 800px;
          margin: 0 auto 1.5rem;
          font-weight: 300;
        }

        /* Botão CTA */
        .custom-btn {
          background-color: var(--accent-yellow);
          color: var(--dark-gray);
          font-weight: 700;
          padding: 0.8rem 2.5rem;
          border-radius: 8px;
          border: none;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .custom-btn:hover {
          background-color: #e0a800;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
          color: var(--dark-gray);
        }

        /* Seções de Conteúdo */
        .content-section {
          padding: 4rem 0;
          text-align: center;
        }
        .content-section h2 {
          color: var(--primary-blue);
          font-weight: 800;
          font-size: 2.2rem;
          margin-bottom: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        /* Missão e Visão Cards */
        .mission-vision-card {
          border: 1px solid var(--border-light);
          border-radius: 12px;
          background-color: var(--white);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 2.5rem;
          height: 100%;
        }
        .mission-vision-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        .mission-vision-card .card-icon {
            font-size: 2.5rem;
            color: var(--accent-blue);
            margin-bottom: 1rem;
        }
        .mission-vision-card h3 {
          color: var(--dark-gray);
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .mission-vision-card p {
          color: var(--medium-gray);
          font-size: 1.05rem;
        }

        /* Equipe Card */
        .team-card-container {
            max-width: 300px;
            margin: 0 auto;
        }
        .team-card {
          border: none;
          border-radius: 12px;
          background-color: var(--white);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
          border-top: 5px solid var(--accent-yellow);
        }
        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        .team-card img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          filter: grayscale(10%); /* Efeito sutil */
        }
        .team-card .card-body {
          padding: 1.5rem;
          text-align: center;
        }
        .team-card h5 {
          color: var(--primary-blue);
          font-size: 1.4rem;
          font-weight: 700;
        }
        .team-card p {
          color: var(--medium-gray);
          font-size: 1rem;
          font-weight: 500;
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .hero-section {
            padding: 4rem 0;
          }
          .mission-vision-card {
            margin-bottom: 1.5rem;
          }
          .content-section {
            padding: 3rem 0;
          }
        }
        @media (max-width: 576px) {
          .hero-section h1 {
            font-size: 2.2rem;
          }
          .hero-section p.lead {
            font-size: 1.1rem;
          }
          .content-section h2 {
            font-size: 1.8rem;
          }
          .mission-vision-card h3 {
            font-size: 1.4rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />

        <section className="hero-section">
          <div className="container">
            <h1>
              <FaBuilding /> Sobre o VemAgendar
            </h1>
            <p className="lead">
              A plataforma que simplifica a gestão de agendamentos, tornando a vida de empresas e clientes mais fácil e eficiente.
            </p>
            <Link
              to="/empresas"
              className="custom-btn shadow-lg"
            >
              Comece a Agendar Agora <FaArrowRight />
            </Link>
          </div>
        </section>

        <section className="content-section container">
            <h2>Por que existimos?</h2>
            <div className="row justify-content-center">
                <div className="col-md-6 mb-4">
                <div className="mission-vision-card">
                    <FaBullseye className="card-icon text-accent-blue" />
                    <h3>Nossa Missão</h3>
                    <p>
                    Simplificar a gestão de agendamentos para negócios de todos os portes, <strong>reduzindo a burocracia administrativa</strong> e liberando tempo para que as empresas ofereçam o melhor serviço aos seus clientes.
                    </p>
                </div>
                </div>
                <div className="col-md-6 mb-4">
                <div className="mission-vision-card">
                    <FaEye className="card-icon text-accent-blue" />
                    <h3>Nossa Visão</h3>
                    <p>
                    Ser a plataforma de agendamento <strong>mais confiável, intuitiva e acessível</strong> do mercado global, liderando a transformação digital na forma como o mundo marca seus compromissos.
                    </p>
                </div>
                </div>
            </div>
        </section>

        <section className="content-section container" style={{ paddingTop: 0 }}>
            <h2><FaUsers /> Quem está por trás?</h2>
            <div className="row justify-content-center">
                <div className="col-md-4 col-sm-6 team-card-container">
                    <div className="team-card">
                        <img
                            src="https://eu-agendo.s3.us-east-1.amazonaws.com/imagens/minhaFoto_Diogo_vemagendargmail.com.jpeg"
                            className="card-img-top"
                            alt="Diogo Antonio"
                        />
                        <div className="card-body">
                            <h5>Diogo Antonio</h5>
                            <p>CEO & Fundador</p>
                            <p className="text-muted small">Apaixonado por tecnologia e otimização de processos.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
}

export default Sobre;