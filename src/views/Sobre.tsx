import Navbar from "../components/Navbar";

function Sobre() {
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

        /* Seções */
        .custom-section {
          padding: 4rem 0;
        }
        .custom-section h1 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2.75rem;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .custom-section p.lead {
          color: var(--dark-gray);
          font-size: 1.25rem;
          max-width: 700px;
          margin: 0 auto;
        }
        .custom-section h2 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }
        .custom-section h3 {
          color: var(--primary-blue);
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .custom-section p.text-muted {
          color: var(--dark-gray) !important;
          font-size: 1.1rem;
          max-width: 500px;
          margin: 0 auto;
        }

        /* Missão e Visão */
        .mission-vision-card {
          border: none;
          border-radius: 12px;
          background-color: var(--white);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 2rem;
          position: relative;
        }
        .mission-vision-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .mission-vision-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--light-blue), var(--primary-blue));
          border-radius: 12px 12px 0 0;
        }

        /* Equipe */
        .team-card {
          border: none;
          border-radius: 12px;
          background-color: var(--white);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }
        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .team-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          filter: brightness(0.95);
        }
        .team-card .card-body {
          padding: 1.5rem;
          text-align: center;
        }
        .team-card h5 {
          color: var(--primary-blue);
          font-size: 1.25rem;
          font-weight: 600;
        }
        .team-card p {
          color: var(--dark-gray);
          font-size: 1rem;
        }

        /* Botão CTA */
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

        /* Responsividade */
        @media (max-width: 991px) {
          .custom-section {
            padding: 2rem 0;
          }
          .mission-vision-card {
            margin-bottom: 1.5rem;
          }
          .team-card {
            margin-bottom: 1.5rem;
          }
        }
        @media (max-width: 576px) {
          .custom-section h1 {
            font-size: 2rem;
          }
          .custom-section h2 {
            font-size: 1.5rem;
          }
          .custom-section p.lead {
            font-size: 1.1rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />

        <div className="container">
          <section className="custom-section text-center">
            <h1>Sobre o EuAgendo</h1>
            <p className="lead">
              O EuAgendo é uma plataforma inovadora de agendamento que transforma a gestão de compromissos, oferecendo uma solução prática, eficiente e acessível para empresas de todos os tamanhos.
            </p>
            <button
              className="custom-btn btn btn-lg px-4 shadow-sm fw-semibold mt-3"
              onClick={() => window.location.href = "/empresas"}
            >
              Conheça mais
            </button>
          </section>

          <section className="custom-section row text-center">
            <div className="col-md-6">
              <div className="mission-vision-card">
                <h3>Nossa Missão</h3>
                <p className="text-muted">
                  Simplificar a gestão de agendamentos, reduzindo a sobrecarga administrativa e permitindo que empresas foquem no que realmente importa: seus clientes.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mission-vision-card">
                <h3>Nossa Visão</h3>
                <p className="text-muted">
                  Ser a plataforma de agendamento mais confiável e acessível do mercado, proporcionando uma experiência excepcional para empresas e clientes em todo o mundo.
                </p>
              </div>
            </div>
          </section>

          <section className="custom-section text-center">
            <h2>Nossa Equipe</h2>
            <div className="row justify-content-center">
              <div className="col-md-4 col-sm-6">
                <div className="team-card">
                  <img
                    src="https://eu-agendo.s3.us-east-1.amazonaws.com/imagens/Foto+Campe%C3%A3o+CodeRace24.jpg"
                    className="card-img-top"
                    alt="Diogo Antonio"
                  />
                  <div className="card-body">
                    <h5>Diogo Antonio</h5>
                    <p>CEO & Fundador</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Sobre;