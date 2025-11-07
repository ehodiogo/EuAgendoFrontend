import {
  FaPix,
  FaCcVisa,
  FaCcMastercard,
  FaCcApplePay,
  FaCreditCard,
  FaCcAmex,
} from "react-icons/fa6";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetch } from "../functions/GetData.tsx";
import { Plano } from "../interfaces/Plano.tsx";

type CompanyType = 'servico' | 'locacao';

const PlanCardPlaceholder = ({ count }: { count: number }) => {
  return (
    <div className="plan-row">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="plan-card placeholder-card">
          <div className="placeholder-glow top-bar"></div>
          <div className="placeholder-glow title"></div>
          <div className="price-group">
            <div className="placeholder-glow price"></div>
            <div className="placeholder-glow subtitle"></div>
          </div>
          <ul>
            {[...Array(5)].map((_, j) => (
              <li key={j}>
                <div className="placeholder-glow bullet"></div>
                <div className="placeholder-glow text"></div>
              </li>
            ))}
          </ul>
          <div className="placeholder-glow button"></div>
        </div>
      ))}
    </div>
  );
};

function Planos() {
  const navigate = useNavigate();
  const { data, loading } = useFetch<Plano[]>("/api/planos");
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [companyType, setCompanyType] = useState<CompanyType>('servico');
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && data) {
      // @ts-ignore
      const rawPlanos = Array.isArray(data) ? data : data.results;
      if (Array.isArray(rawPlanos)) {
        const mapped = rawPlanos
          .filter(p => p.nome.toLowerCase() !== "free trial")
          .map((p: Plano) => {
            let capacity = '';
            if (companyType === 'servico') {
              capacity = `Até ${p.quantidade_funcionarios} funcionário${p.quantidade_funcionarios > 1 ? 's' : ''}`;
            } else {
              capacity = `Até ${p.quantidade_locacoes} locaç${p.quantidade_locacoes > 1 ? 'ões' : 'ão'} ativa${p.quantidade_locacoes > 1 ? 's' : ''}`;
            }

            const cor = getPlanColor(p.nome);

            return {
              ...p,
              cor,
              features: [
                `Até ${p.quantidade_empresas} empresa${p.quantidade_empresas > 1 ? 's' : ''}`,
                capacity,
                "Agendamento 24/7",
                "Lembretes WhatsApp/SMS",
                "Gestão completa de clientes",
                ...(p.nome.toLowerCase().includes('profissional') || p.nome.toLowerCase().includes('corporativo') ? ["Relatórios em tempo real"] : []),
                ...(p.nome.toLowerCase().includes('corporativo') ? ["API de Integração", "Suporte VIP 24h"] : []),
              ],
            } as Plano;
          });

        setPlanos(mapped);
      }
    }
  }, [loading, data, companyType]);

  const getPlanColor = (nome: string) => {
    const n = nome.toLowerCase();
    if (n.includes('básico')) return '#28a745';
    if (n.includes('profissional')) return '#fd7e14';
    if (n.includes('corporativo')) return '#003087';
    return '#6c757d';
  };

  const adicionarAoCarrinho = (plano: Plano) => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    carrinho.push(plano);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    navigate("/carrinho");
  };

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
          --white: #ffffff;
          --shadow-sm: 0 4px 12px rgba(0,0,0,0.08);
          --shadow-md: 0 8px 25px rgba(0,0,0,0.15);
          --shadow-lg: 0 15px 40px rgba(0,0,0,0.25);
          --radius: 20px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(253, 126, 20, 0.4); }
          50% { box-shadow: 0 0 40px rgba(253, 126, 20, 0.8); }
        }
        @keyframes ribbonPop {
          0% { transform: rotate(45deg) scale(0.8); opacity: 0; }
          70% { transform: rotate(45deg) scale(1.1); }
          100% { transform: rotate(45deg) scale(1); opacity: 1; }
        }
        @keyframes pricePop {
          0% { transform: scale(0.8); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes badgePop {
          0% { transform: scale(0); }
          80% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-ribbon { animation: ribbonPop 0.6s ease-out forwards; }
        .animate-price { animation: pricePop 0.7s ease-out forwards; }
        .animate-badge { animation: badgePop 0.5s ease-out forwards; }

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

        .toggle-group {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          padding: 0.5rem;
          display: inline-flex;
          gap: 0.5rem;
        }
        .toggle-btn {
          background: transparent;
          color: rgba(255,255,255,0.7);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          transition: var(--transition);
        }
        .toggle-btn.active {
          background: white;
          color: var(--primary);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .plan-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2.5rem;
          margin: 4rem 0;
          position: relative;
        }

        .plan-card {
          background: white;
          border-radius: var(--radius);
          padding: 3rem 2.5rem;
          height: 100%;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          z-index: 1;
        }
        .plan-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 8px;
          background: var(--plan-color);
          border-radius: var(--radius) var(--radius) 0 0;
        }
        .plan-card:hover {
          transform: translateY(-15px);
          box-shadow: var(--shadow-lg);
          z-index: 2;
        }
        .plan-card.dimmed {
          opacity: 0.6;
          filter: blur(1px);
          transition: all 0.4s ease;
        }

        /* 1º PLANO - BÁSICO: VERDE SUAVE */
        .plan-card:nth-child(1) {
          --plan-color: #28a745;
          border-color: #28a745;
          box-shadow: 0 8px 25px rgba(40, 167, 69, 0.12);
        }
        .plan-card:nth-child(1):hover {
          box-shadow: 0 15px 40px rgba(40, 167, 69, 0.2);
        }

        /* 2º PLANO - POPULAR: LARANJA VIBRANTE */
        .plan-card:nth-child(2) {
          --plan-color: #fd7e14 !important;
          transform: scale(1.08);
          border: 3px solid #fd7e14;
          box-shadow: 0 20px 50px rgba(253, 126, 20, 0.3);
          animation: pulseGlow 2s infinite alternate;
          z-index: 10;
          position: relative;
        }
        .plan-card:nth-child(2)::after {
          content: '';
          position: absolute;
          top: -10px; left: -10px; right: -10px; bottom: -10px;
          background: linear-gradient(45deg, transparent 30%, rgba(253, 126, 20, 0.1) 50%, transparent 70%);
          border-radius: var(--radius);
          z-index: -1;
          animation: pulseGlow 2s infinite alternate;
        }

        .plan-card:nth-child(2) .ribbon {
          position: absolute;
          top: 20px;
          right: -50px;
          background: linear-gradient(135deg, #ff8c00, #fd7e14);
          color: white;
          padding: 0.6rem 4rem;
          font-size: 0.9rem;
          font-weight: 800;
          transform: rotate(45deg);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          z-index: 11;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: ribbonPop 0.8s ease-out forwards;
        }
        .plan-card:nth-child(2) .ribbon::before {
          content: '';
          position: absolute;
          left: -15px; top: 0;
          width: 0; height: 0;
          border-style: solid;
          border-width: 15px 15px 15px 0;
          border-color: transparent #cc6a00 transparent transparent;
        }
        .plan-card:nth-child(2) .ribbon::after {
          content: '';
          position: absolute;
          right: -15px; top: 0;
          width: 0; height: 0;
          border-style: solid;
          border-width: 15px 0 15px 15px;
          border-color: transparent transparent transparent #cc6a00;
        }

        /* 3º PLANO - CORPORATIVO: AZUL PROFUNDO */
        .plan-card:nth-child(3) {
          --plan-color: #003087;
          border-color: #003087;
          box-shadow: 0 8px 25px rgba(0, 48, 135, 0.12);
        }
        .plan-card:nth-child(3):hover {
          box-shadow: 0 15px 40px rgba(0, 48, 135, 0.2);
        }

        .plan-price {
          font-size: 3.2rem;
          font-weight: 900;
          color: var(--plan-color);
          line-height: 1;
          animation: pricePop 0.8s ease-out forwards;
        }
        .plan-price small {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--gray-600);
        }
        .full-price {
          font-size: 1.2rem;
          color: var(--danger);
          text-decoration: line-through;
          margin-top: 0.5rem;
        }
        .discount-badge {
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
          color: #155724;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 800;
          display: inline-block;
          margin-top: 0.75rem;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
          animation: badgePop 0.6s ease-out forwards;
        }

        .plan-features {
          flex-grow: 1;
          margin: 2rem 0;
        }
        .plan-features li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
          font-size: 1rem;
          color: var(--gray-600);
          font-weight: 500;
        }
        .plan-features svg {
          color: var(--plan-color);
          margin-right: 0.75rem;
          margin-top: 3px;
          flex-shrink: 0;
          font-size: 1.1rem;
        }

        .plan-btn {
          background: var(--plan-color);
          color: white;
          font-weight: 700;
          padding: 1.1rem;
          border-radius: 14px;
          border: none;
          font-size: 1.1rem;
          transition: var(--transition);
          margin-top: auto;
          position: relative;
          overflow: hidden;
        }
        .plan-btn::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 0; height: 0;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .plan-btn:hover::before {
          width: 300px; height: 300px;
        }
        .plan-btn:hover {
          opacity: 0.95;
          transform: translateY(-3px);
        }
        .plan-btn:nth-child(2) {
          background: linear-gradient(135deg, #fd7e14, #ff8c00);
          font-size: 1.15rem;
          animation: pulse 2s infinite;
        }

        .payment-icons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin: 2rem 0;
        }
        .payment-icons svg {
          font-size: 2.5rem;
          opacity: 0.8;
          transition: var(--transition);
        }
        .payment-icons svg:hover {
          opacity: 1;
          transform: translateY(-3px);
        }

        .expiration-card {
          background: white;
          border-radius: var(--radius);
          padding: 2rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--gray-200);
        }
        .expiration-card h5 {
          color: var(--primary);
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .expiration-item {
          display: flex;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid var(--gray-200);
        }
        .expiration-item:last-child {
          border-bottom: none;
        }
        .expiration-icon {
          width: 50px; height: 50px;
          background: var(--danger);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          font-size: 1.2rem;
        }
        .expiration-text strong {
          color: var(--danger);
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

        /* PLACEHOLDER */
        .placeholder-glow {
          background: #e9ecef;
          background-image: linear-gradient(90deg, #e9ecef 0%, #f9f9f9 50%, #e9ecef 100%);
          background-size: 200px 100%;
          animation: pulse-placeholder 1.5s infinite linear;
          border-radius: 6px;
        }
        @keyframes pulse-placeholder {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        .placeholder-card .top-bar { height: 8px; margin-bottom: 1.5rem; }
        .placeholder-card .title { height: 1.75rem; width: 60%; margin: 0 auto 1rem; }
        .placeholder-card .price { height: 3rem; width: 70%; margin: 0 auto 0.5rem; }
        .placeholder-card .subtitle { height: 1rem; width: 40%; margin: 0 auto 1.5rem; }
        .placeholder-card .bullet { height: 1rem; width: 1rem; border-radius: 50%; margin-right: 0.75rem; }
        .placeholder-card .text { height: 0.8rem; width: 80%; }
        .placeholder-card .button { height: 3rem; margin-top: auto; }

        @media (max-width: 992px) {
          .plan-card:nth-child(2) { transform: scale(1.05); }
        }
        @media (max-width: 768px) {
          .plan-card:nth-child(2) { transform: none; }
          .plan-price { font-size: 2.5rem; }
          .plan-row { gap: 2rem; }
        }
      `}</style>

      <div className="bg-light">
        <Navbar />

        {/* HERO */}
        <header className="hero-gradient text-white py-5">
          <div className="container py-5 text-center">
            <div className="row align-items-center g-5">
              <div className="col-lg-7 animate-fadeInUp">
                <h1 className="display-4 fw-bold mb-4">
                  Planos que Crescem com Você
                </h1>
                <p className="lead mb-4 opacity-90 fs-5">
                  Escolha o plano perfeito para <strong>automatizar agendamentos</strong> e
                  <strong> escalar seu negócio</strong> sem complicação.
                </p>
                <div className="toggle-group mb-4">
                  <button
                    className={`toggle-btn ${companyType === 'servico' ? 'active' : ''}`}
                    onClick={() => setCompanyType('servico')}
                  >
                    Serviços
                  </button>
                  <button
                    className={`toggle-btn ${companyType === 'locacao' ? 'active' : ''}`}
                    onClick={() => setCompanyType('locacao')}
                  >
                    Locações
                  </button>
                </div>
              </div>
              <div className="col-lg-5 text-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-4 p-4 shadow-lg">
                  <h3 className="fw-bold mb-2">+2.800 empresas</h3>
                  <p className="mb-0 opacity-90">já confiam no VemAgendar</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* PLANOS */}
        <section className="py-5 bg-white">
          <div className="container">
            {loading ? (
              <PlanCardPlaceholder count={3} />
            ) : (
              <div className="plan-row">
                {planos.map((plano, i) => {
                  const isSecondPlan = i === 1;
                  const isOtherHovered = hoveredPlan !== null && hoveredPlan !== i;

                  return (
                    <div
                      key={i}
                      className={`plan-card animate-fadeInUp ${isOtherHovered ? 'dimmed' : ''}`}
                      style={{
                        '--plan-color': isSecondPlan ? '#fd7e14' : plano.cor,
                        animationDelay: `${i * 0.15}s`
                      } as React.CSSProperties}
                      onMouseEnter={() => setHoveredPlan(i)}
                      onMouseLeave={() => setHoveredPlan(null)}
                    >
                      {isSecondPlan && (
                        <div className="ribbon animate-ribbon">
                          MAIS POPULAR
                        </div>
                      )}

                      <h4 className="fw-bold mt-4" style={{ color: isSecondPlan ? '#fd7e14' : plano.cor }}>
                        {plano.nome}
                      </h4>

                      <div className="text-center my-4">
                        <span className="plan-price animate-price">
                          R${plano.valor.toFixed(2)}
                          <small>/mês</small>
                        </span>
                        {plano.is_promo && (
                          <>
                            <div className="full-price">De R${plano.valor_cheio.toFixed(2)}</div>
                            <div className="discount-badge animate-badge">
                              Economize {plano.porcentagem_promo}% na Promoção!
                            </div>
                          </>
                        )}
                      </div>

                      <ul className="plan-features">
                        {plano.features.map((f, j) => (
                          <li key={j}>
                            {f}
                          </li>
                        ))}
                      </ul>

                      <button
                        className="plan-btn"
                        style={{
                          background: isSecondPlan
                            ? 'linear-gradient(135deg, #fd7e14, #ff8c00)'
                            : plano.cor
                        }}
                        onClick={() => adicionarAoCarrinho(plano)}
                      >
                        {plano.valor === 0 ? "Teste Grátis" : "Adquirir Plano"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* PAGAMENTOS */}
        <section className="py-5" style={{ background: 'var(--gray-100)' }}>
          <div className="container text-center">
            <h5 className="fw-bold" style={{ color: 'var(--primary)' }}>
              Formas de Pagamento Aceitas
            </h5>
            <div className="payment-icons">
              <FaPix style={{ color: '#00b39e' }} />
              <FaCcVisa style={{ color: '#1966d2' }} />
              <FaCcMastercard style={{ color: '#ff6d00' }} />
              <FaCcApplePay style={{ color: '#333' }} />
              <FaCreditCard style={{ color: 'var(--gray-600)' }} />
              <FaCcAmex style={{ color: '#17a2b8' }} />
            </div>
          </div>
        </section>

        {/* VENCIMENTO */}
        <section className="py-5 bg-white">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="expiration-card text-center">
                  <h5>
                    O que acontece se meu plano vencer?
                  </h5>
                  <p className="text-muted mb-4">
                    Seu acesso é gradualmente restrito para proteger seus dados:
                  </p>
                  <div className="text-start">
                    <div className="expiration-item">
                      <div className="expiration-icon"></div>
                      <div className="expiration-text">
                        <strong>Até 24h:</strong> Agendamentos só para hoje ou amanhã
                      </div>
                    </div>
                    <div className="expiration-item">
                      <div className="expiration-icon"></div>
                      <div className="expiration-text">
                        <strong>24-49h:</strong> Só para hoje
                      </div>
                    </div>
                    <div className="expiration-item">
                      <div className="expiration-icon"></div>
                      <div className="expiration-text">
                        <strong>+49h:</strong> Acesso <strong className="text-danger">BLOQUEADO</strong>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-muted small">
                    <strong style={{ color: 'var(--primary)' }}>Seus dados ficam salvos.</strong>
                    Renove a qualquer momento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta">
          <div className="container">
            <h3>Pronto para transformar sua agenda?</h3>
            <p className="text-muted lead mb-4">
              Milhares de empresas já economizam tempo e dinheiro com o VemAgendar.
            </p>
            <button className="btn-cta-primary d-inline-flex align-items-center">
              Teste Grátis por 7 Dias
            </button>
            <p className="mt-3 text-muted small">
              Teste grátis SEM cartão • Cancele quando quiser
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Planos;