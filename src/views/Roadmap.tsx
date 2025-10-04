import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import { FaCheck, FaHourglassHalf, FaRegClock } from "react-icons/fa6";
import {FaMapMarkerAlt} from "react-icons/fa";
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
    date: "Q1 2026",
    title: "Notificações Automáticas",
    description:
      "Envio automático de lembretes para clientes e funcionários sobre os agendamentos.",
    status: "Pendente",
  },
  {
    date: "Q2 2026",
    title: "Relatórios e Estatísticas",
    description:
      "Implementação de relatórios detalhados sobre agendamentos, cancelamentos e desempenho.",
    status: "Pendente",
  },
  {
    date: "Q3 2026",
    title: "Integração com Pagamentos",
    description:
      "Integração com sistemas de pagamento para facilitar o pagamento dos agendamentos.",
    status: "Pendente",
  },
  {
    date: "Futuro",
    title: "Aplicativo Mobile",
    description:
      "Desenvolvimento de um aplicativo mobile completo para facilitar o agendamento de qualquer lugar.",
    status: "Pendente",
  },
];

// Mapeamento de status para classes e ícones
const statusMap = {
    "Feito": {
        className: "status-feito",
        icon: <FaCheck size={14} style={{ color: 'var(--success-green)' }} />
    },
    "Em Progresso": {
        className: "status-progresso",
        icon: <FaHourglassHalf size={14} style={{ color: 'var(--warning-orange)' }} />
    },
    "Pendente": {
        className: "status-pendente",
        icon: <FaRegClock size={14} style={{ color: 'var(--danger-red)' }} />
    },
};

const Roadmap: React.FC = () => {

  return (
    <>
      <Navbar />
      <div className="roadmap-container">
        <style>{`
          /* Paleta de cores (Consistente com os outros componentes) */
          :root {
            --primary-blue: #003087;
            --accent-blue: #0056b3;
            --dark-gray: #212529;
            --light-gray-bg: #f5f7fa;
            --white: #ffffff;
            --success-green: #28aa45;
            --warning-orange: #ff9800;
            --danger-red: #dc3545;
            --shadow-color: rgba(0, 0, 0, 0.15);
          }

          /* Container */
          .roadmap-container {
            background-color: var(--light-gray-bg);
            padding: 5rem 1rem;
            min-height: calc(100vh - 56px);
          }

          /* Título */
          .roadmap-title {
            text-align: center;
            margin-bottom: 4rem;
            font-weight: 800;
            font-size: 3rem;
            color: var(--dark-gray);
            letter-spacing: -0.05em;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
          }
          .roadmap-title svg {
              color: var(--primary-blue);
              font-size: 2.5rem;
          }
          
          /* Timeline */
          .timeline {
            position: relative;
            max-width: 900px;
            margin: 0 auto;
            padding-left: 2.5rem; /* Espaço para a linha */
          }
          
          /* Linha Central da Timeline */
          .timeline::after {
            content: '';
            position: absolute;
            width: 4px;
            background-color: var(--primary-blue);
            top: 0;
            bottom: 0;
            left: 0.5rem;
            margin-left: -3px;
          }
          
          /* Timeline Item */
          .timeline-item {
            position: relative;
            margin-bottom: 3rem;
            padding-left: 2rem;
          }
          
          /* Ponto na Linha */
          .timeline-item::before {
            content: '';
            position: absolute;
            left: 0.5rem;
            top: 0.5rem;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            transform: translateX(-50%);
            border: 4px solid var(--white); /* Borda branca para destacar */
            box-shadow: 0 0 0 2px var(--primary-blue); /* Anel ao redor */
            background-color: var(--light-gray-bg); /* Cor base */
            z-index: 10;
          }
          /* Cor dos pontos */
          .timeline-item.status-feito::before {
            background-color: var(--success-green);
            box-shadow: 0 0 0 2px var(--success-green);
          }
          .timeline-item.status-progresso::before {
            background-color: var(--warning-orange);
            box-shadow: 0 0 0 2px var(--warning-orange);
          }
          .timeline-item.status-pendente::before {
            background-color: var(--danger-red);
            box-shadow: 0 0 0 2px var(--danger-red);
          }

          /* Card */
          .timeline-card {
            background-color: var(--white);
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-left: 5px solid var(--primary-blue);
          }
          .timeline-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
          .timeline-card .date {
            font-size: 1rem;
            font-weight: 700;
            color: var(--accent-blue);
            margin-bottom: 0.5rem;
          }
          .timeline-card h5 {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--dark-gray);
            margin-bottom: 0.5rem;
          }
          .timeline-card p {
            font-size: 1rem;
            color: var(--dark-gray);
            margin-bottom: 1rem;
          }
          
          /* Status Tag */
          .timeline-card .status-tag {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            padding: 0.5rem 1.25rem;
            border-radius: 50px;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          .status-feito {
            background-color: #e6ffed; /* Light Green */
            color: var(--success-green);
            border: 1px solid var(--success-green);
          }
          .status-progresso {
            background-color: #fff8e6; /* Light Orange */
            color: var(--warning-orange);
            border: 1px solid var(--warning-orange);
          }
          .status-pendente {
            background-color: #fcebeb; /* Light Red */
            color: var(--danger-red);
            border: 1px solid var(--danger-red);
          }

          /* Responsividade */
          @media (max-width: 768px) {
            .roadmap-container {
              padding: 3rem 1rem;
            }
            .roadmap-title {
              font-size: 2.25rem;
              margin-bottom: 3rem;
            }
            .roadmap-title svg {
                font-size: 2rem;
            }
            .timeline {
              max-width: 100%;
              padding-left: 1.5rem;
            }
            .timeline-item {
              padding-left: 1.5rem;
              margin-bottom: 2.5rem;
            }
            .timeline::after {
              left: 0;
            }
            .timeline-item::before {
              left: 0;
              width: 18px;
              height: 18px;
            }
            .timeline-card {
              padding: 1.25rem;
            }
            .timeline-card h5 {
                font-size: 1.3rem;
            }
            .timeline-card .date {
                font-size: 0.9rem;
            }
          }
        `}</style>
        <div className="container">
          <h1 className="roadmap-title">
            <FaMapMarkerAlt /> Roadmap do VemAgendar
          </h1>
          <div className="timeline">
            {roadmapData.map((item, index) => {
                const statusInfo = statusMap[item.status as keyof typeof statusMap] || statusMap["Pendente"];

                return (
                    <div
                        key={index}
                        className={`timeline-item ${statusInfo.className}`}
                    >
                        <div className="timeline-card">
                            <div className="date">{item.date}</div>
                            <h5>{item.title}</h5>
                            <p>{item.description}</p>
                            <span className={`status-tag ${statusInfo.className}`}>
                                {statusInfo.icon} {item.status}
                            </span>
                        </div>
                    </div>
                );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Roadmap;