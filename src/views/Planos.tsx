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
import { useEffect, useState } from "react";
import {useFetch} from "../functions/GetData.tsx";
import {Plano} from "../interfaces/Plano.tsx";

function Planos() {
  const navigate = useNavigate();
  const { data, loading } = useFetch<Plano[]>(`/api/planos`);
  const [planos, setPlanos] = useState<Plano[]>([]);

  useEffect(() => {

    console.log("data", data);
    if (!loading && data) {
      // @ts-ignore
      const rawPlanos = Array.isArray(data) ? data : data.results;

      if (Array.isArray(rawPlanos)) {
        const mapped = rawPlanos.map((plano: Plano) => ({
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
        }));
        // @ts-ignore
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

  const adicionarAoCarrinho = (plano: Plano) => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    carrinho.push(plano);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    navigate("/carrinho");
  };

  return (
    <div className="min-vh-100">
      <style>
        {`
          :root {
            --primary-blue: #003087;
            --light-blue: #4dabf7;
            --dark-gray: #2d3748;
            --light-gray: #f7fafc;
            --white: #ffffff;
            --accent-yellow: #f6c107;
          }
          .custom-bg {
            background-color: var(--light-gray);
          }
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
          .custom-btn {
            background-color: var(--accent-yellow);
            color: var(--dark-gray);
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 8px;
            transition: all 0.3s ease;
            border: none;
            width: 100%;
          }
          .custom-btn:hover {
            background-color: #e0a800;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .custom-btn:disabled {
            background-color: #6c757d;
            cursor: not-allowed;
            opacity: 0.7;
          }
          .payment-methods {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 2rem;
            flex-wrap: wrap;
          }
          .payment-methods svg {
            font-size: 2.5rem;
            transition: transform 0.3s ease;
          }
          .payment-methods svg:hover {
            transform: scale(1.1);
          }
          .expiration-table {
            width: 100%;
            border-collapse: collapse;
            background-color: var(--white);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
          }
          .expiration-table th, .expiration-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          .expiration-table th {
            background-color: var(--primary-blue);
            color: var(--white);
            font-weight: 600;
          }
          .expiration-table td {
            color: var(--dark-gray);
          }
          .expiration-table .highlight {
            color: #dc3545;
            font-weight: 700;
          }
          .expiration-table p.note {
            color: var(--dark-gray);
            font-size: 1rem;
            margin-top: 1rem;
          }
          .expiration-table p.note .highlight {
            color: #dc3545;
            font-weight: 700;
          }
          @media (max-width: 1200px) {
            .plan-row {
              flex-wrap: wrap;
            }
            .plan-card {
              max-width: 45%;
              flex: 1 1 45%;
            }
          }
          @media (max-width: 768px) {
            .custom-section {
              padding: 2rem 0;
            }
            .plan-card {
              max-width: 100%;
              flex: 1 1 100%;
              margin-bottom: 1.5rem;
            }
            .expiration-table {
              font-size: 0.9rem;
            }
          }
          @media (max-width: 576px) {
            .custom-section h1 {
              font-size: 2rem;
            }
            .custom-section p.lead {
              font-size: 1.1rem;
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
            .payment-methods svg {
              font-size: 2rem;
            }
          }
        `}
      </style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="container custom-section text-center">
          <h1>Nossos Planos</h1>
          <p className="lead">Escolha o plano ideal para o seu negócio.</p>

          {loading ? (
            <p>Carregando planos...</p>
          ): (
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
                  <ul>
                    {plano.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                  <button
                    className="custom-btn"
                    onClick={() => adicionarAoCarrinho(plano)}
                    disabled={plano.valor === 0}
                  >
                    {plano.valor === 0 ? "Crie sua conta para obter!" : "Adquirir"}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="custom-section text-center">
            <h5 style={{ color: "var(--primary-blue)", fontWeight: "600" }}>
              Formas de Pagamento Aceitas
            </h5>
            <div className="payment-methods">
              <FaPix style={{ color: "#28a745" }} />
              <FaCcVisa style={{ color: "#003087" }} />
              <FaCcMastercard style={{ color: "#dc3545" }} />
              <FaCcAmazonPay style={{ color: "#ff9900" }} />
              <FaCcApplePay style={{ color: "#000" }} />
              <FaCreditCard style={{ color: "#6c757d" }} />
              <FaCcAmex style={{ color: "#17a2b8" }} />
              <FaCcJcb style={{ color: "#343a40" }} />
              <FaRegCreditCard style={{ color: "#343a40" }} />
            </div>
          </div>

          <div className="custom-section text-center">
            <h5 style={{ color: "var(--primary-blue)", fontWeight: "600" }}>
              O que acontece se meu plano vencer?
            </h5>
            <p className="text-muted">
              Veja o que acontece com base no tempo após o vencimento do plano:
            </p>
            <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
              <table className="expiration-table">
                <thead>
                  <tr>
                    <th>Tempo após Vencimento</th>
                    <th>Consequências</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Até 24 horas</td>
                    <td>
                      Seus clientes podem agendar para o <span className="highlight">DIA ATUAL OU DIA SEGUINTE</span>.
                    </td>
                  </tr>
                  <tr>
                    <td>Entre 24 e 49 horas</td>
                    <td>
                      Seus clientes <span className="highlight">SÓ</span> podem agendar para o <span className="highlight">DIA ATUAL</span>.
                    </td>
                  </tr>
                  <tr>
                    <td>Mais de 49 horas</td>
                    <td>
                      Acesso completo ao serviço fica <span className="highlight">BLOQUEADO</span>. Seus clientes <span className="highlight">NÃO</span> podem agendar.
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="note">
                <span className="highlight">IMPORTANTE:</span> Para reativar o acesso completo, basta renovar o plano.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planos;