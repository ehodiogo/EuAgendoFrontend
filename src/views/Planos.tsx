import {
  FaPix,
  FaCcVisa,
  FaCcMastercard,
  FaCcApplePay,
  FaCreditCard,
  FaCcAmex,
} from "react-icons/fa6";
import {FaCheckCircle} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {useFetch} from "../functions/GetData.tsx";
import {Plano} from "../interfaces/Plano.tsx";

type CompanyType = 'servico' | 'locacao';

const PlanCardPlaceholder = ({ count }: { count: number }) => {
    const placeholders = Array.from({ length: count });

    return (
        <div className="plan-row">
            {placeholders.map((_, index) => (
                <div key={index} className="plan-card placeholder-card" style={{ cursor: 'default' }}>
                    <div className="placeholder-glow mx-auto mb-3" style={{ height: '6px', width: '100%', borderRadius: '16px 16px 0 0' }}></div>

                    <div className="placeholder-glow mx-auto mb-4 mt-2" style={{ height: '1.75rem', width: '60%' }}></div>

                    <div className="price-group">
                        <div className="placeholder-glow mx-auto" style={{ height: '3.25rem', width: '70%' }}></div>
                        <div className="placeholder-glow mx-auto mt-2" style={{ height: '1rem', width: '30%' }}></div>
                    </div>

                    <ul style={{textAlign: 'left'}}>
                        {[...Array(5)].map((_, i) => (
                            <li key={i} className="mb-3 d-flex align-items-center">
                                <div className="placeholder-glow me-3" style={{ height: '1rem', width: '1rem', borderRadius: '50%' }}></div>
                                <div className="placeholder-glow" style={{ height: '0.8rem', width: `${50 + (i * 10)}%` }}></div>
                            </li>
                        ))}
                    </ul>

                    <div className="placeholder-glow custom-btn mt-auto" style={{ height: '3rem', width: '100%' }}></div>
                </div>
            ))}
        </div>
    );
};


function Planos() {
  const navigate = useNavigate();
  const { data, loading } = useFetch<Plano[]>(`/api/planos`);
  const [planos, setPlanos] = useState<Plano[]>([]);

  const [companyType, setCompanyType] = useState<CompanyType>('servico');

  useEffect(() => {
    if (!loading && data) {
      // @ts-ignore
      const rawPlanos = Array.isArray(data) ? data : data.results;

      if (Array.isArray(rawPlanos)) {
        const mapped = rawPlanos.map((plano: Plano) => {

          let capacityFeature = '';
          if (companyType === 'servico') {
              const count = plano.quantidade_funcionarios;
              capacityFeature = `Até ${count} funcionário${count !== 1 ? "s" : ""} por empresa`;
          } else if (companyType === 'locacao') {
              const count = plano.quantidade_locacoes;
              capacityFeature = `Até ${count} locaç${count !== 1 ? "ões" : "ão"} ativa${count !== 1 ? "s" : ""}`;
          }

          const planNameLower = plano.nome.toLowerCase();

          return {
            nome: plano.nome,
            valor: plano.valor,
            valor_cheio: plano.valor_cheio,
            is_promo: plano.is_promo,
            porcentagem_promo: plano.porcentagem_promo,
            duracao_em_dias: plano.duracao_em_dias,
            quantidade_empresas: plano.quantidade_empresas,
            quantidade_funcionarios: plano.quantidade_funcionarios,
            quantidade_locacoes: plano.quantidade_locacoes,
            cor: getPlanColor(plano.nome),
            features: [
              `Até ${plano.quantidade_empresas} empresa${plano.quantidade_empresas !== 1 ? "s" : ""}`,
              capacityFeature,
              ...(planNameLower !== "free trial" ? ["Agendamento Online 24/7", "Lembretes Automáticos"] : ["Acesso Limitado por 7 dias"]),
              ...(planNameLower === "plano profissional" || planNameLower === "plano corporativo" ? ["Relatórios Básicos"] : []),
              ...(planNameLower === "plano corporativo" ? ["API de Integração", "Suporte VIP 24h"] : []),
            ],
          };
        });
        // @ts-ignore
        setPlanos(mapped);
      }
    }
  }, [loading, data, companyType]);

  const getPlanColor = (nome: string) => {
    switch (nome.toLowerCase()) {
      case "free trial":
        return "#6c757d";
      case "plano básico":
        return "#28a745";
      case "plano profissional":
        return "#fd7e14";
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
            --secondary-blue: #0056b3;
            --dark-gray: #2d3748;
            --light-gray-bg: #f5f7fa;
            --white: #ffffff;
            --accent-yellow: #f6c107;
            --danger-red: #dc3545;
          }
          .custom-bg {
            background-color: var(--light-gray-bg);
          }
          .custom-section {
            padding: 5rem 0;
          }
          .custom-section h1 {
            color: var(--primary-blue);
            font-weight: 800;
            font-size: 3rem;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .custom-section p.lead {
            color: var(--dark-gray);
            font-size: 1.2rem;
            max-width: 800px;
            margin: 0 auto 3rem;
          }

          .plan-row {
            display: flex;
            flex-wrap: wrap;
            gap: 2rem;
            justify-content: center;
          }
          .plan-card {
            border: 1px solid #e0e0e0;
            border-radius: 16px;
            background-color: var(--white);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            padding: 2.5rem;
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
            flex: 1;
            max-width: 300px;
            overflow: hidden;
            text-align: center;
          }
          .plan-card:not(.placeholder-card):hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          }
          .plan-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 6px;
            background-color: var(--primary-blue);
            border-radius: 16px 16px 0 0;
          }
          .plan-card.highlight {
              transform: scale(1.05);
              border: 2px solid #fd7e14;
          }
          .plan-card.highlight .ribbon {
              position: absolute;
              top: 0;
              right: 20px;
              background-color: #fd7e14;
              color: var(--white);
              padding: 0.25rem 0.75rem;
              font-size: 0.85rem;
              font-weight: 700;
              border-radius: 0 0 8px 8px;
              box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
              z-index: 10;
          }

          .plan-card h4 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
            line-height: 1.2;
          }
          .plan-card .price-group {
              padding: 1.5rem 0;
              margin-bottom: 1.5rem;
              border-bottom: 1px solid #f0f0f0;
          }
          .plan-card .plan-price {
            font-size: 3.25rem;
            font-weight: 900;
            color: var(--primary-blue);
            line-height: 1;
            display: block;
          }
          .plan-card .plan-price small {
            font-size: 1rem;
            font-weight: 600;
            color: var(--dark-gray);
          }
          .plan-card .full-price {
            font-size: 1.1rem;
            color: var(--danger-red);
            text-decoration: line-through;
            display: block;
            margin-top: 0.5rem;
          }
          .plan-card .discount {
            font-size: 1.05rem;
            color: #28a745;
            font-weight: 700;
            margin-top: 0.5rem;
          }
          .plan-card ul {
            list-style: none;
            padding: 0;
            margin-bottom: 2rem;
            color: var(--dark-gray);
            flex-grow: 1;
            text-align: left;
          }
          .plan-card ul li {
            margin-bottom: 0.75rem;
            display: flex;
            align-items: flex-start;
            font-size: 0.95rem;
          }
          .plan-card ul li svg {
            color: #28a745;
            margin-right: 0.75rem;
            margin-top: 3px;
            flex-shrink: 0;
          }
          .plan-card .free-trial-text {
            color: var(--dark-gray);
            font-weight: 600;
            margin-bottom: 1rem;
          }

          .custom-btn {
            font-weight: 700;
            padding: 0.9rem;
            border-radius: 10px;
            transition: all 0.3s ease;
            border: none;
            width: 100%;
            font-size: 1rem;
          }
          .custom-btn:hover {
            opacity: 0.9;
            transform: translateY(-2px);
          }
          .custom-btn:disabled {
            background-color: #6c757d !important;
            color: var(--white);
            cursor: not-allowed;
            opacity: 0.8;
            transform: none;
          }
          
          @keyframes pulse {
              0% { background-position: -200px 0; }
              100% { background-position: calc(200px + 100%) 0; }
          }
          .placeholder-glow {
              background-color: #e9ecef;
              background-image: linear-gradient(90deg, #e9ecef 0%, #f9f9f9 50%, #e9ecef 100%);
              background-size: 200px 100%;
              background-repeat: no-repeat;
              animation: pulse 1.5s infinite linear;
              border-radius: 6px;
          }
          .plan-card.placeholder-card {
            background-color: #f7f7f7;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border: 1px solid #e9ecef;
          }

          .payment-methods-section {
            padding: 2rem 0;
            border-top: 1px solid #e0e0e0;
            margin-top: 3rem;
          }
          .payment-methods {
            gap: 2rem;
            margin-top: 1.5rem;
          }
          .payment-methods svg {
            font-size: 3rem;
            opacity: 0.85;
          }

          .expiration-table-section {
            padding: 2rem 0;
            border-top: 1px solid #e0e0e0;
            margin-top: 3rem;
          }
          .expiration-table {
            border: 1px solid #e0e0e0;
            width: 100%;
            border-collapse: collapse;
          }
          .expiration-table th, .expiration-table td {
            padding: 1rem;
            border: 1px solid #e0eeef;
            text-align: left;
          }
          .expiration-table th {
            background-color: var(--secondary-blue);
            color: var(--white);
            font-weight: 700;
          }
          .expiration-table .highlight {
            color: var(--danger-red);
            font-weight: 600;
          }
          .expiration-table p.note .highlight {
            color: var(--primary-blue);
          }

          @media (max-width: 1200px) {
            .plan-card {
              max-width: 48%;
              flex: 1 1 48%;
            }
          }
          @media (max-width: 768px) {
            .plan-row {
              gap: 1.5rem;
            }
            .plan-card {
              max-width: 100%;
              flex: 1 1 100%;
              padding: 2rem;
            }
            .plan-card.highlight {
                transform: none;
            }
            .custom-section h1 {
                font-size: 2.5rem;
            }
            .plan-card .plan-price {
                font-size: 2.75rem;
            }
          }
        `}
      </style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="container custom-section text-center">
          <h1>Nossos Planos</h1>
          <p className="lead">
            Escolha o plano ideal para o seu negócio. Todos os planos incluem
            agendamento online 24/7 e lembretes automáticos.
          </p>
            <div className="mb-4">
                <button
                    className={`btn btn-sm me-2 ${companyType === 'servico' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setCompanyType('servico')}
                >
                    Ver Planos para Agendamento de Serviços
                </button>
                <button
                    className={`btn btn-sm ${companyType === 'locacao' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setCompanyType('locacao')}
                >
                    Ver Planos para Locações de Quadras, Vagas, Salas, etc.
                </button>
            </div>


          {loading ? (
            <PlanCardPlaceholder count={4} />
          ): (
            <div className="plan-row">
              {planos.map((plano: Plano, index: number) => (
                <div
                    key={index}
                    className={`plan-card ${plano.nome.toLowerCase().includes('profissional') ? 'highlight' : ''}`}
                    style={{'--plan-color': plano.cor} as React.CSSProperties}
                >
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '6px',
                        backgroundColor: plano.cor,
                        borderRadius: '16px 16px 0 0'
                    }}></div>

                    {plano.nome.toLowerCase().includes('profissional') && (
                        <div className="ribbon">MAIS POPULAR</div>
                    )}

                    <h4 style={{ color: plano.cor }}>{plano.nome}</h4>

                    <div className="price-group">
                        <span className="plan-price" style={{ color: plano.cor }}>
                            R${plano.valor.toFixed(2)}
                            <small>/mês</small>
                        </span>
                        {plano.is_promo && (
                            <span className="full-price">
                                De R${plano.valor_cheio.toFixed(2)}
                            </span>
                        )}
                        {plano.is_promo && (
                            <div className="discount">
                                Economize {plano.porcentagem_promo}% na Promoção!
                            </div>
                        )}
                        {plano.valor === 0 && (
                            <div className="free-trial-text">
                                Período de Avaliação Gratuito
                            </div>
                        )}
                    </div>

                    <ul>
                        {plano.features.map((feature, idx) => (
                            <li key={idx}>
                                <FaCheckCircle style={{ color: plano.cor }} />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button
                        className="custom-btn"
                        style={{
                            backgroundColor: plano.cor,
                            color: plano.nome.toLowerCase() === 'plano profissional' ? 'var(--dark-gray)' : 'var(--white)',
                        }}
                        onClick={() => adicionarAoCarrinho(plano)}
                        disabled={plano.valor === 0}
                    >
                        {plano.valor === 0 ? "Comece seu Teste Grátis" : "Adquirir"}
                    </button>
                </div>
              ))}
            </div>
          )}

          <div className="payment-methods-section text-center">
            <h5 style={{ color: "var(--primary-blue)", fontWeight: "700" }}>
              Formas de Pagamento Aceitas
            </h5>
            <div className="payment-methods d-flex justify-content-center">
              <FaPix style={{ color: "#00b39e" }} />
              <FaCcVisa style={{ color: "#1966d2" }} />
              <FaCcMastercard style={{ color: "#ff6d00" }} />
              <FaCcApplePay style={{ color: "#333" }} />
              <FaCreditCard style={{ color: "#6c757d" }} />
              <FaCcAmex style={{ color: "#17a2b8" }} />
            </div>
          </div>

          <div className="expiration-table-section text-center">
            <h5 style={{ color: "var(--primary-blue)", fontWeight: "700" }}>
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
                <span className="highlight" style={{ color: "var(--primary-blue)" }}>IMPORTANTE:</span> Para reativar o acesso completo, basta renovar o plano. Seus dados são mantidos seguros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planos;