import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaMapMarkerAlt } from "react-icons/fa";

const roadmapData = [
  {
    date: "Setembro 2025",
    title: "Lançamento Inicial",
    description:
      "Disponibilização da versão inicial do VemAgendar com funcionalidades básicas de agendamento.",
    status: "Feito",
  },
  {
    date: "Novembro 2025",
    title: "Filtros para Agendamentos",
    description:
      "Adição de filtros para facilitar a busca por horários, funcionários e clientes.",
    status: "Em Progresso",
  },
  {
    date: "Dezembro 2025",
    title: "Quadro de Horários",
    description:
      "Visualização intuitiva do quadro de horários para um gerenciamento eficiente.",
    status: "Pendente",
  },
  {
    date: "? 2026",
    title: "Notificações Automáticas",
    description:
      "Envio automático de lembretes para clientes e funcionários sobre os agendamentos.",
    status: "Pendente",
  },
  {
    date: "? 2026",
    title: "Relatórios e Estatísticas",
    description:
      "Implementação de relatórios detalhados sobre agendamentos, cancelamentos e desempenho.",
    status: "Pendente",
  },
  {
    date: "? 2026",
    title: "Integração com Sistemas de Pagamentos",
    description:
      "Integração com sistemas de pagamento para facilitar o pagamento dos agendamentos.",
    status: "Pendente",
  },
  {
    date: "? 2026",
    title: "Aplicativo Mobile",
    description:
      "Desenvolvimento de um aplicativo mobile para facilitar o agendamento de qualquer lugar.",
    status: "Pendente",
  },
];

const Roadmap: React.FC = () => {
  React.useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <>
      <Navbar />
      <div className="roadmap-container">
        <style>{`
          /* Paleta de cores */
          :root {
            --primary-blue: #003087;
            --light-blue: #4dabf7;
            --dark-gray: #2d3748;
            --light-gray: #f7fafc;
            --white: #ffffff;
            --pastel-green: #b8e2c8; /* Feito */
            --pastel-red: #f4c7c3; /* Pendente */
            --warning-orange: #fd7e14; /* Em Progresso */
          }

          /* Container */
          .roadmap-container {
            background-color: var(--light-gray);
            padding: 3rem 1rem;
            margin: 0;
            min-height: calc(100vh - 56px); /* Adjust for Navbar height */
          }

          /* Título */
          .roadmap-title {
            text-align: center;
            margin-bottom: 3rem;
            font-weight: 700;
            font-size: 2.5rem;
            color: var(--primary-blue);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          /* Timeline */
          .timeline {
            position: relative;
            max-width: 900px;
            margin: 0 auto;
            padding-left: 2rem;
            border-left: 4px dashed var(--dark-gray);
          }

          /* Timeline Item */
          .timeline-item {
            position: relative;
            margin-bottom: 2rem;
            padding-left: 1.5rem;
          }
          .timeline-item::before {
            content: '';
            position: absolute;
            left: -0.75rem;
            top: 0.5rem;
            width: 1.25rem;
            height: 1.25rem;
            border-radius: 50%;
            border: 3px solid var(--white);
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          }
          .timeline-item.feito::before {
            background-color: var(--pastel-green);
          }
          .timeline-item.em-progresso::before {
            background-color: var(--warning-orange);
          }
          .timeline-item.pendente::before {
            background-color: var(--pastel-red);
          }

          /* Card */
          .timeline-card {
            background-color: var(--white);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .timeline-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          }
          .timeline-card .date {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--dark-gray);
            margin-bottom: 0.5rem;
          }
          .timeline-card h5 {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--primary-blue);
            margin-bottom: 0.5rem;
          }
          .timeline-card p {
            font-size: 1rem;
            color: var(--dark-gray);
            margin-bottom: 0.75rem;
          }
          .timeline-card .status {
            display: inline-block;
            font-size: 0.85rem;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            color: var(--white);
            font-weight: 600;
          }
          .timeline-card .status.feito {
            background-color: var(--pastel-green);
            color: var(--dark-gray);
          }
          .timeline-card .status.em-progresso {
            background-color: var(--warning-orange);
          }
          .timeline-card .status.pendente {
            background-color: var(--pastel-red);
            color: var(--dark-gray);
          }

          /* Responsividade */
          @media (max-width: 991px) {
            .roadmap-container {
              padding: 2rem 1rem;
            }
            .roadmap-title {
              font-size: 2rem;
            }
            .timeline {
              padding-left: 1.5rem;
            }
            .timeline-item {
              padding-left: 1rem;
            }
            .timeline-card {
              padding: 1rem;
            }
          }
          @media (max-width: 576px) {
            .roadmap-title {
              font-size: 1.75rem;
            }
            .timeline {
              padding-left: 1rem;
            }
            .timeline-item::before {
              width: 1rem;
              height: 1rem;
              left: -0.6rem;
            }
            .timeline-card .date {
              font-size: 0.85rem;
            }
            .timeline-card h5 {
              font-size: 1.1rem;
            }
            .timeline-card p {
              font-size: 0.9rem;
            }
            .timeline-card .status {
              font-size: 0.8rem;
              padding: 0.4rem 0.8rem;
            }
          }
        `}</style>
        <div className="roadmap-container">
          <h1 className="roadmap-title" data-aos="fade-up">
            <FaMapMarkerAlt /> Roadmap do VemAgendar
          </h1>
          <div className="timeline">
            {roadmapData.map((item, index) => (
              <div
                key={index}
                className={`timeline-item ${item.status.toLowerCase().replace(" ", "-")}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="timeline-card">
                  <div className="date">{item.date}</div>
                  <h5>{item.title}</h5>
                  <p>{item.description}</p>
                  <span className={`status ${item.status.toLowerCase().replace(" ", "-")}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Roadmap;