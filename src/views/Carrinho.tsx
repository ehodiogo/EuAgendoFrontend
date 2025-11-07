import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaTrash, FaArrowRight, FaLock, FaStar } from "react-icons/fa6";
import {FaCheckCircle} from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

function Carrinho() {
  interface Plano {
    nome: string;
    valor: number;
    cor?: string;
  }

  const [carrinho, setCarrinho] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const itensCarrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    const planosComCor = itensCarrinho.map((p: Plano) => ({
      ...p,
      cor: getPlanColor(p.nome),
    }));
    setCarrinho(planosComCor);
  }, []);

  const getPlanColor = (nome: string) => {
    const n = nome.toLowerCase();
    if (n.includes('básico')) return '#28a745';
    if (n.includes('profissional')) return '#fd7e14';
    if (n.includes('corporativo')) return '#003087';
    return '#6c757d';
  };

  const total = carrinho.reduce((acc, plano) => acc + plano.valor, 0);

  const removerItem = (index: number) => {
    const carrinhoAtualizado = carrinho.filter((_, i) => i !== index);
    setCarrinho(carrinhoAtualizado);
    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtualizado));
  };

  const finalizarCompra = async () => {
    if (carrinho.length === 0) {
      setError("Seu carrinho está vazio!");
      return;
    }

    const planoParaCheckout = carrinho[0];

    const usuario_token = localStorage.getItem("access_token");
    if (!usuario_token) {
      alert("Você precisa estar logado para finalizar a compra.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = import.meta.env.VITE_API_URL;

      const response = await axios.post(url + "/api/pagamento-plano/", {
        plano_nome: planoParaCheckout.nome,
        usuario_token: usuario_token,
      });

      if (response.data.url) {
        localStorage.removeItem("carrinho");
        setCarrinho([]);
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Erro ao iniciar pagamento. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
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
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }

        .hero-gradient {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 4rem 0;
          text-align: center;
        }
        .hero-gradient h1 {
          font-size: 2.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        .hero-gradient svg {
          color: var(--accent);
        }

        .cart-container {
          padding: 4rem 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .cart-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          margin-top: 2rem;
        }

        .cart-card {
          background: white;
          border-radius: var(--radius);
          padding: 2.5rem;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--gray-200);
          position: relative;
          overflow: hidden;
        }
        .cart-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 6px;
          background: var(--plan-color, var(--primary));
          border-radius: var(--radius) var(--radius) 0 0;
        }

        .item-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
          border-bottom: 1px dashed var(--gray-200);
          animation: slideIn 0.5s ease-out forwards;
        }
        .cart-item:last-child {
          border-bottom: none;
        }
        .cart-item-details {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .plan-badge {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--plan-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .cart-item-details h6 {
          margin: 0;
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--plan-color);
        }
        .cart-item-details small {
          color: var(--gray-600);
          font-size: 0.95rem;
        }
        .price-tag {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--plan-color);
        }

        .btn-remove {
          background: transparent;
          border: none;
          color: var(--danger);
          padding: 0.6rem;
          border-radius: 50%;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-remove:hover {
          background: rgba(220, 53, 69, 0.1);
          transform: scale(1.15);
        }

        .summary-card {
          position: sticky;
          top: 100px;
          height: fit-content;
        }
        .summary-card h3 {
          color: var(--primary);
          font-weight: 800;
          font-size: 1.6rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          font-size: 1.1rem;
        }
        .summary-row.total {
          border-top: 2px solid var(--primary);
          padding-top: 1.25rem;
          margin-top: 1rem;
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--primary);
        }

        .checkout-btn {
          background: linear-gradient(135deg, var(--success), #218838);
          color: white;
          font-weight: 700;
          padding: 1.3rem;
          border-radius: 16px;
          border: none;
          font-size: 1.2rem;
          transition: var(--transition);
          margin-top: 2rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
          position: relative;
          overflow: hidden;
        }
        .checkout-btn::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 0; height: 0;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .checkout-btn:hover::before {
          width: 300px; height: 300px;
        }
        .checkout-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(40, 167, 69, 0.4);
        }
        .checkout-btn:disabled {
          background: var(--gray-600);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .security-note {
          text-align: center;
          margin-top: 1rem;
          color: var(--gray-600);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .empty-cart {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--gray-600);
        }
        .empty-cart h5 {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1rem;
        }
        .empty-cart a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition);
        }
        .empty-cart a:hover {
          color: #e0a800;
          text-decoration: underline;
        }

        .alert-danger {
          background: linear-gradient(135deg, #f8d7da, #f5c6cb);
          color: var(--danger);
          padding: 1.2rem;
          border-radius: 16px;
          margin: 1.5rem auto;
          max-width: 800px;
          text-align: center;
          font-weight: 600;
          border: 1px solid #f5c6cb;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.1);
        }

        @media (max-width: 992px) {
          .cart-grid {
            grid-template-columns: 1fr;
          }
          .summary-card {
            position: static;
          }
        }
        @media (max-width: 768px) {
          .hero-gradient h1 {
            font-size: 2.2rem;
          }
          .cart-container {
            padding: 3rem 1rem;
          }
          .cart-card {
            padding: 2rem;
          }
        }
      `}</style>

      <div className="bg-light min-vh-100">
        <Navbar />

        {/* HERO */}
        <header className="hero-gradient">
          <div className="container">
            <h1 className="animate-fadeInUp">
              <FaShoppingCart /> Resumo da Compra
            </h1>
          </div>
        </header>

        <div className="cart-container container">
          {error && <div className="alert-danger">{error}</div>}

          {carrinho.length === 0 ? (
            <div className="cart-card animate-fadeInUp">
              <div className="empty-cart">
                <h5>Seu carrinho está vazio!</h5>
                <Link to="/planos">
                  Escolher Plano <FaArrowRight />
                </Link>
              </div>
            </div>
          ) : (
            <div className="cart-grid">
              {/* ITENS DO CARRINHO */}
              <div className="cart-card animate-fadeInUp">
                <div className="item-list">
                  {carrinho.map((plano, index) => (
                    <div
                      key={index}
                      className="cart-item"
                      style={{
                        '--plan-color': plano.cor,
                      } as React.CSSProperties}
                    >
                      <div className="cart-item-details">
                        <div className="plan-badge">
                          {plano.nome.includes('Profissional') ? <FaStar /> : <FaCheckCircle />}
                        </div>
                        <div>
                          <h6>{plano.nome}</h6>
                          <small>Plano de Assinatura Mensal</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <span className="price-tag">R${plano.valor.toFixed(2)}</span>
                        <button
                          className="btn-remove"
                          onClick={() => removerItem(index)}
                          aria-label={`Remover ${plano.nome}`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RESUMO */}
              <div className="cart-card summary-card animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <h3>
                  <FaLock /> Resumo do Pedido
                </h3>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>R${total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Descontos</span>
                  <span style={{ color: 'var(--success)' }}>R$0,00</span>
                </div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>R${total.toFixed(2)}</span>
                </div>

                <button
                  className="checkout-btn"
                  onClick={finalizarCompra}
                  disabled={loading}
                >
                  {loading ? (
                    <>Processando...</>
                  ) : (
                    <>Finalizar Compra</>
                  )}
                </button>

                <div className="security-note">
                  <FaLock /> Pagamento 100% seguro e criptografado
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrinho;