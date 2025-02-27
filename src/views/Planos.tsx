import {
  FaPix,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmazonPay,
  FaCcApplePay,
  FaCreditCard,
  FaCcAmex,
  FaCcJcb,
  FaRegCreditCard,
} from "react-icons/fa6";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Planos() {
  const navigate = useNavigate();

  interface Plano {
    nome: string;
    preco: number;
    duracao: number;
    empresas: number;
    funcionarios: string;
    cor: string;
  }

  const adicionarAoCarrinho = (plano: Plano) => {
    console.log(`Adicionando ao carrinho: ${plano.nome} - R$${plano.preco}`);
    const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    carrinho.push(plano);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    navigate("/carrinho");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div
        className="container"
        style={{ marginTop: "5rem", textAlign: "center" }}
      >
        <h1
          style={{ fontSize: "2.5rem", fontWeight: "bold" }}
          className="text-primary"
        >
          Nossos Planos
        </h1>
        <p style={{ color: "#777" }}>Escolha o plano ideal para você.</p>

        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            marginTop: "2rem",
          }}
        >
          {[
            {
              nome: "Free Trial",
              preco: 0,
              duracao: 7,
              empresas: 1,
              funcionarios: "1",
              cor: "gray",
            },
            {
              nome: "Plano Básico",
              preco: 49,
              duracao: 30,
              empresas: 1,
              funcionarios: "15",
              cor: "#28a745",
            },
            {
              nome: "Plano Profissional",
              preco: 149,
              duracao: 30,
              empresas: 5,
              funcionarios: "25",
              cor: "#dc3545",
            },
            {
              nome: "Plano Corporativo",
              preco: 299,
              duracao: 30,
              empresas: 20,
              funcionarios: "1000",
              cor: "#007bff",
            },
          ].map((plano, index) => (
            <div
              key={index}
              className="col-md-4"
              style={{
                marginBottom: "2rem",
                maxWidth: "300px",
                flex: "1",
                display: "flex",
                flexDirection: "column",
                height: "100%", 
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  height: "100%",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  className="card-body"
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <h4 style={{ color: plano.cor, fontWeight: "bold" }}>
                    {plano.nome}
                  </h4>
                  <p style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                    R${plano.preco}/mês
                  </p>
                  <ul
                    style={{ listStyle: "none", padding: "0", color: "#777" }}
                  >
                    <li>
                      <strong>Duração:</strong> {plano.duracao} dias
                    </li>
                    <li>
                      <strong>Empresas:</strong> {plano.empresas}
                    </li>
                    <li>
                      <strong>Funcionários/empresa:</strong>{" "}
                      {plano.funcionarios}
                    </li>
                    <li>Suporte via e-mail</li>
                    <li>Relatórios avançados</li>
                    <li>Painel financeiro</li>
                    <li>Agendamentos de hoje com visualização simplificada</li>
                  </ul>
                  {plano.preco !== 0 ? (
                    <button
                      style={{
                        backgroundColor: plano.cor,
                        color: "#fff",
                        padding: "10px",
                        width: "100%", 
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginTop: "auto", 
                      }}
                      onClick={() => adicionarAoCarrinho(plano)}
                    >
                      Adquirir
                    </button>
                  ) : (
                    <button
                      style={{
                        backgroundColor: "gray",
                        color: "#fff",
                        padding: "10px",
                        width: "100%", 
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "not-allowed",
                        marginTop: "auto", 
                      }}
                      onClick={() => adicionarAoCarrinho(plano)}
                      disabled
                    >
                      Crie sua conta para obter!
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "5rem", textAlign: "center" }}>
          <h5 style={{ color: "#333" }}>Formas de Pagamento Aceitas</h5>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "2rem",
            }}
          >
            <FaPix size={40} style={{ color: "#28a745" }} />
            <FaCcVisa size={40} style={{ color: "#007bff" }} />
            <FaCcMastercard size={40} style={{ color: "#dc3545" }} />
            <FaCcAmazonPay size={40} style={{ color: "#ff9900" }} />
            <FaCcApplePay size={40} style={{ color: "#000" }} />
            <FaCreditCard size={40} style={{ color: "#6c757d" }} />
            <FaCcAmex size={40} style={{ color: "#17a2b8" }} />
            <FaCcJcb size={40} style={{ color: "#343a40" }} />
            <FaRegCreditCard size={40} style={{ color: "#343a40" }} />
          </div>
        </div>

        <div style={{ marginTop: "5rem", textAlign: "center" }}>
          <h5 style={{ color: "#333" }}>O que acontece se meu plano vencer?</h5>
          <p style={{ color: "#777" }}>
            Veja abaixo o que pode acontecer dependendo de quanto tempo se
            passar após o vencimento do seu plano:
          </p>

          <div style={{ overflowX: "auto", marginTop: "2rem" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
                tableLayout: "fixed",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                      textAlign: "left",
                    }}
                  >
                    Tempo após Vencimento
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                      textAlign: "left",
                    }}
                  >
                    Consequências
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    Até 24 horas
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    Seus clientes ainda podem agendar para o{" "}
                    <span style={{ color: "#dc3545", fontWeight: "bold" }}>
                      DIA ATUAL OU DIA SEGUINTE
                    </span>
                    .
                  </td>
                </tr>
                <tr>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    Entre 24 e 49 horas
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    Seus clientes{" "}
                    <span style={{ color: "#dc3545", fontWeight: "bold" }}>
                      SÓ
                    </span>{" "}
                    podem agendar para o{" "}
                    <span style={{ color: "#dc3545", fontWeight: "bold" }}>
                      DIA ATUAL
                    </span>
                    .
                  </td>
                </tr>
                <tr>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    Mais de 49 horas
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    Acesso completo ao serviço fica{" "}
                    <span style={{ color: "#dc3545", fontWeight: "bold" }}>
                      BLOQUEADO
                    </span>{" "}
                    até a renovação da assinatura. Seus clientes{" "}
                    <span style={{ color: "#dc3545", fontWeight: "bold" }}>
                      NÃO
                    </span>{" "}
                    podem agendar.
                  </td>
                </tr>
              </tbody>
            </table>
            <p style={{ color: "#777", marginTop: "10px" }}>
              <span style={{ color: "#dc3545", fontWeight: "bold" }}>
                IMPORTANTE:
              </span>{" "}
              Para reativar o acesso completo ao nosso serviço, basta renovar o
              plano.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planos;
