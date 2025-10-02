import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import { FaGithub, FaInstagram, FaLinkedin, FaRoad, FaUser } from "react-icons/fa";
import { BsFillFileLockFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useFetch } from "../functions/GetData.tsx";
import { Plano } from "../interfaces/Plano.tsx";

function Home() {
  const navigate = useNavigate();
  const { data, loading } = useFetch<Plano[]>("/api/planos");
  const [planos, setPlanos] = useState<Plano[]>([]);

  useEffect(() => {
    if (!loading && data) {
      // @ts-ignore
      const rawPlanos = Array.isArray(data) ? data : data.results;
      if (Array.isArray(rawPlanos)) {
        const mapped = rawPlanos
          .filter((plano: Plano) => plano.nome.toLowerCase() !== "free trial")
          .map((plano: Plano) => ({
            nome: plano.nome,
            valor: plano.valor,
            valor_cheio: plano.valor_cheio,
            is_promo: plano.is_promo,
            porcentagem_promo: plano.porcentagem_promo,
            duracao_em_dias: plano.duracao_em_dias,
            quantidade_empresas: plano.quantidade_empresas,
            quantidade_funcionarios: plano.quantidade_funcionarios,
            cor: getPlanColor(plano.nome),
            features: [
              `Até ${plano.quantidade_empresas} empresa${plano.quantidade_empresas > 1 ? "s" : ""}`,
              `Até ${plano.quantidade_funcionarios} funcionário${plano.quantidade_funcionarios > 1 ? "s" : ""} por empresa`,
            ],
            descricao: plano.descricao || "Plano ideal para seu negócio",
          }));
        setPlanos(mapped);
      }
    }
  }, [loading, data]);

  const getPlanColor = (nome: string) => {
    switch (nome.toLowerCase()) {
      case "free trial":
        return "#6c757d";
      case "plano básico":
        return "#28a745";
      case "plano profissional":
        return "#dc3545";
      case "plano corporativo":
        return "#003087";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="min-vh-100">
      <style>{`
        /* Paleta de cores */
        :root {
          --primary-blue: #003087;
          --light-blue: #4dabf7;
          --dark-gray: #2d3748;
          --light-gray: #f7fafc;
          --white: #ffffff;
          --accent-yellow: #f6c107;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Header */
        .custom-header {
          background: linear-gradient(135deg, var(--primary-blue) 60%, var(--light-blue) 100%);
          padding: 4rem 0;
          color: var(--white);
        }
        .custom-header h1 {
          font-size: 2.75rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .custom-header p {
          font-size: 1.25rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto 1.5rem;
        }
        .custom-header img {
          max-width: 320px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          border-radius: 12px;
        }
        .custom-btn {
          background-color: var(--accent-yellow);
          color: var(--dark-gray);
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .custom-btn:hover {
          background-color: #e0a800;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Seções */
        .custom-section {
          padding: 4rem 0;
        }
        .custom-section h2 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }
        .custom-section p.text-muted {
          color: var(--dark-gray) !important;
          font-size: 1.1rem;
          max-width: 700px;
          margin: 0 auto;
        }

        /* Benefícios */
        .benefit-card {
          border: none;
          border-radius: 12px;
          background-color: var(--white);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 2rem;
          position: relative;
          padding-top: 3rem;
        }
        .benefit-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .benefit-card h3 {
          color: var(--primary-blue);
          font-size: 1.5rem;
          font-weight: 600;
        }
        .benefit-card p {
          color: var(--dark-gray);
          font-size: 1rem;
        }
        .benefit-icon {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--light-blue);
          color: var(--white);
          border-radius: 50%;
          padding: 1rem;
          font-size: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        /* Avaliações */
        .review-card {
          border: none;
          border-radius: 12px;
          background-color: var(--white);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 2rem;
        }
        .review-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .review-card .avatar {
          width: 48px;
          height: 48px;
          background-color: var(--light-blue);
          color: var(--white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 0 auto 1rem;
        }
        .review-card p {
          font-style: italic;
          color: var(--dark-gray);
        }
        .review-card .text-warning {
          font-size: 1.5rem;
        }
        .review-card h5 {
          color: var(--dark-gray);
          font-size: 1rem;
          font-weight: 500;
        }

        /* Planos */
        .plan-row {
          display: flex;
          flex-wrap: nowrap;
          gap: 1.5rem;
          justify-content: center;
        }
        .plan-card {
          border: none;
          border-radius: 12px;
          background-color: var(--white);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 2rem;
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          flex: 1;
          max-width: 280px;
        }
        .plan-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        .plan-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--light-blue), var(--primary-blue));
          border-radius: 12px 12px 0 0;
        }
        .plan-card h4 {
          color: var(--primary-blue);
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .plan-card .plan-price {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-blue);
          margin-bottom: 0.5rem;
        }
        .plan-card .full-price {
          font-size: 1.25rem;
          color: #6c757d;
          text-decoration: line-through;
          margin-left: 0.5rem;
        }
        .plan-card .discount {
          font-size: 1rem;
          color: #dc3545;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .plan-card ul {
          list-style: none;
          padding: 0;
          margin-bottom: 1.5rem;
          color: var(--dark-gray);
          flex-grow: 1;
        }
        .plan-card ul li {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }
        .plan-card ul li::before {
          content: "✔";
          color: var(--light-blue);
          margin-right: 0.5rem;
        }
        .plan-card .plan-desc {
          color: var(--dark-gray);
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        /* Lançamentos Futuros */
        .roadmap-section {
          background: linear-gradient(135deg, var(--light-gray) 60%, var(--white) 100%);
          padding: 4rem 0;
        }
        .roadmap-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          margin-top: 2rem;
        }
        .roadmap-card ul {
          list-style: none;
          padding: 0;
          text-align: left;
        }
        .roadmap-card ul li {
          margin-bottom: 1rem;
          color: var(--dark-gray);
          display: flex;
          align-items: center;
        }
        .roadmap-card ul li::before {
          content: "→";
          color: var(--light-blue);
          margin-right: 0.5rem;
        }

        /* Footer */
        .custom-footer {
          background-color: var(--primary-blue);
          color: var(--white);
          padding: 3rem 0;
        }
        .custom-footer a {
          color: var(--white);
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .custom-footer a:hover {
          color: var(--light-blue);
        }
        .custom-footer .social-links {
          gap: 1.5rem;
        }

        /* Responsividade */
        @media (max-width: 1200px) {
          .plan-row {
            flex-wrap: wrap;
          }
          .plan-card {
            max-width: 45%;
            flex: 1 1 45%;
          }
        }
        @media (max-width: 991px) {
          .custom-header {
            flex-direction: column;
            text-align: center;
            padding: 2rem 0;
          }
          .custom-header img {
            margin-top: 2rem;
            max-width: 250px;
          }
          .custom-section {
            padding: 2rem 0;
          }
          .plan-card {
            max-width: 100%;
            flex: 1 1 100%;
            margin-bottom: 1.5rem;
          }
        }
        @media (max-width: 576px) {
          .custom-header h1 {
            font-size: 1.75rem;
          }
          .custom-header p {
            font-size: 1rem;
          }
          .custom-section h2 {
            font-size: 1.5rem;
          }
          .plan-card h4 {
            font-size: 1.25rem;
          }
          .plan-card .plan-price {
            font-size: 1.75rem;
          }
          .plan-card .full-price {
            font-size: 1rem;
          }
          .plan-card .discount {
            font-size: 0.9rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />

        <header className="custom-header d-flex align-items-center text-white">
          <div className="container d-flex align-items-center flex-wrap justify-content-center">
            <div className="text-center">
              <h1 className="display-4 fw-bold">Gerencie seus Agendamentos com Facilidade</h1>
              <p className="lead">Organize compromissos, reduza faltas e aumente sua produtividade.</p>
              <button
                className="custom-btn btn btn-lg px-4 shadow-sm fw-semibold"
                onClick={() => navigate("/empresas")}
              >
                Comece agora
              </button>
            </div>
            <div className="ms-lg-5 mt-4 mt-lg-0">
              <img
                src={"vem-agendar.png"}
                alt="Imagem do VemAgendar"
                className="img-fluid"
              />
            </div>
          </div>
        </header>

        <section className="custom-section container text-center">
          <h2 className="fw-bold">O que é o VemAgendar?</h2>
          <p className="text-muted mx-auto">
            O VemAgendar é uma plataforma inteligente que simplifica o agendamento de compromissos para empresas e clientes. Nossa ferramenta permite um gerenciamento eficiente, envio de lembretes automáticos e maior organização.
          </p>
        </section>

        <section className="custom-section container text-center">
          <h2 className="fw-bold">Benefícios para Você</h2>
          <div className="row mt-4">
            {[
              {
                title: "Para Empresas",
                desc: "Otimize sua agenda, automatize lembretes e elimine falhas na organização dos serviços.",
                icon: <FaUser size={24} />,
              },
              {
                title: "Para Clientes",
                desc: "Reserve horários em poucos cliques com confirmações instantâneas e notificações.",
                icon: <FaUser size={24} />,
              },
              {
                title: "Para Gestores",
                desc: "Maximize a produtividade com uma visão clara dos horários e relatórios detalhados.",
                icon: <FaUser size={24} />,
              },
            ].map((item, index) => (
              <div key={index} className="col-md-4 d-flex mb-4">
                <div className="benefit-card d-flex flex-column h-100">
                  <div className="benefit-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="custom-section bg-light">
          <div className="container">
            <h2 className="fw-bold text-center">O que nossos clientes dizem</h2>
            <div className="row mt-4 justify-content-center">
              {[
                {
                  name: "Helena D.",
                  review: "O VemAgendar revolucionou meu negócio! Nunca foi tão fácil organizar meus clientes.",
                  stars: "⭐⭐⭐⭐⭐",
                },
                {
                  name: "Paulo B.",
                  review: "Reduziu o tempo de organizar meus atendimentos em 90% com a facilidade para visualizar horários disponíveis!",
                  stars: "⭐⭐⭐⭐⭐",
                },
                {
                  name: "Luciana D.",
                  review: "Prático, eficiente e muito intuitivo. Recomendo para todos os autônomos!",
                  stars: "⭐⭐⭐⭐⭐",
                },
              ].map((item, index) => (
                <div key={index} className="col-md-4 d-flex mb-4">
                  <div className="review-card d-flex flex-column h-100 p-4">
                    <div className="avatar">
                      <FaUser />
                    </div>
                    <p className="fw-semibold">"{item.review}"</p>
                    <p className="text-warning fs-4">{item.stars}</p>
                    <h5>- {item.name}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="custom-section container text-center">
          <h2 className="fw-bold">Escolha seu Plano</h2>
          {loading ? (
            <p>Carregando planos...</p>
          ) : (
            <div className="plan-row">
              {planos.map((plano: Plano, index: number) => (
                <div key={index} className="plan-card">
                  <h4>{plano.nome}</h4>
                  <div className="plan-price">
                    R${plano.valor.toFixed(2)}
                    {plano.is_promo && (
                      <span className="full-price">
                        R${plano.valor_cheio.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {plano.is_promo && (
                    <div className="discount">
                      {plano.porcentagem_promo}% de desconto!
                    </div>
                  )}
                  <p className="plan-desc">{plano.descricao}</p>
                  <ul>
                    {plano.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                  <button
                    className="custom-btn"
                    onClick={() => navigate("/planos")}
                  >
                    Assine agora
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="custom-section roadmap-section">
          <div className="container text-center">
            <h2 className="fw-bold">Lançamentos Futuros</h2>
            <p className="text-muted">Descubra as próximas inovações do VemAgendar.</p>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="roadmap-card">
                  <ul>
                    <li>Integração com Google Calendar e Outlook para sincronização de eventos.</li>
                    <li>Aplicativo móvel para iOS e Android com notificações push.</li>
                    <li>Relatórios analíticos avançados com insights de agendamento.</li>
                    <li>Personalização de temas para a interface de agendamento.</li>
                  </ul>
                  <button
                    className="custom-btn btn mt-3 px-4 fw-semibold"
                    onClick={() => navigate("/roadmap")}
                  >
                    Ver Roadmap Completo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="custom-footer text-white text-center py-5">
          <div className="container">
            <p className="mb-0">&copy; 2025 VemAgendar. Todos os direitos reservados.</p>
            <div className="d-flex justify-content-center social-links mt-3">
              <a
                href="/termos"
                className="text-white text-decoration-none d-flex align-items-center"
              >
                <BsFillFileLockFill className="me-2" />
                Termos de Serviço
              </a>
              <a
                href="https://www.github.com/ehodiogo"
                className="text-white text-decoration-none d-flex align-items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="me-2" />
                GitHub
              </a>
              <a
                href="https://www.instagram.com/ehodiogo"
                className="text-white text-decoration-none d-flex align-items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="me-2" />
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/dabpereira"
                className="text-white text-decoration-none d-flex align-items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="me-2" />
                LinkedIn
              </a>
              <a
                href="/roadmap"
                className="text-white text-decoration-none d-flex align-items-center"
              >
                <FaRoad className="me-2" />
                Roadmap
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;