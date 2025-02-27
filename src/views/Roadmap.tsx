import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";

const roadmapData = [
  {
    date: "Fevereiro 2025",
    title: "Lançamento Inicial",
    description:
      "Disponibilização da versão inicial do Agendo com funcionalidades básicas de agendamento.",
    status: "Feito",
  },
  {
    date: "Março 2025",
    title: "Filtros para Agendamentos",
    description:
      "Adição de filtros para facilitar a busca por horários, funcionários e clientes.",
    status: "Em Progresso",
  },
  {
    date: "Abril 2025",
    title: "Quadro de Horários",
    description:
      "Visualização intuitiva do quadro de horários para um gerenciamento eficiente.",
    status: "Pendente",
  },
  {
    date: "Maio 2025",
    title: "Notificações Automáticas",
    description:
      "Envio automático de lembretes para clientes e funcionários sobre os agendamentos.",
    status: "Pendente",
  },
  {
    date: "Junho 2025",
    title: "Relatórios e Estatísticas",
    description:
      "Implementação de relatórios detalhados sobre agendamentos, cancelamentos e desempenho.",
    status: "Pendente",
  },
  {
    date: "Julho 2025",
    title: "Integração com Sistemas de Pagamentos",
    description:
      "Integração com sistemas de pagamento para facilitar o pagamento dos agendamentos.",
    status: "Pendente",
  },
  {
    date: "Agosto 2025",
    title: "Aplicativo Mobile",
    description:
        "Desenvolvimento de um aplicativo mobile para facilitar o agendamento de qualquer lugar.",
    status: "Pendente",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Feito":
      return "#198754"; // Verde
    case "Em Progresso":
      return "#ffc107"; // Amarelo
    case "Pendente":
      return "#0d6efd"; // Azul
    default:
      return "#6c757d"; // Cinza
  }
};

const Roadmap: React.FC = () => {
  return (
    <>
    <Navbar />
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
          fontWeight: "bold",
        }}
      >
        <span style={{ color: "#6c757d" }}>📍</span> Roadmap do EuAgendo
      </h1>

      <div
        style={{
          position: "relative",
          paddingLeft: "40px",
          borderLeft: "4px dashed #6c757d",
        }}
      >
        {roadmapData.map((item, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              marginBottom: "40px",
              paddingLeft: "20px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "-12px",
                top: "5px",
                width: "20px",
                height: "20px",
                backgroundColor: getStatusColor(item.status),
                border: "4px solid white",
                borderRadius: "50%",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
              }}
            ></div>

            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#6c757d",
                marginBottom: "5px",
              }}
            >
              {item.date}
            </div>

            <div
              style={{
                background: "#f8f9fa",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h5 style={{ fontWeight: "bold" }}>{item.title}</h5>
              <p style={{ marginBottom: "10px" }}>{item.description}</p>
              <span
                style={{
                  fontSize: "0.8rem",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  backgroundColor: getStatusColor(item.status),
                  color: "#fff",
                }}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Roadmap;
