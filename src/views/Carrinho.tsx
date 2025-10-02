import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {FaTrash, FaArrowRight, FaCreditCard, FaLock } from "react-icons/fa6"; // Atualizado para Fa6
import {FaShoppingCart} from "react-icons/fa";
import { Link } from "react-router-dom";

function Carrinho() {
  interface Plano {
    nome: string;
    valor: number;
  }

  const [carrinho, setCarrinho] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const itensCarrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setCarrinho(itensCarrinho);
  }, []);

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

    // Nota: Seu backend parece esperar apenas um plano, pois você envia apenas carrinho[0].nome.
    // Para um carrinho real, você enviaria um array de IDs/Nomes de planos.
    // Mantendo sua lógica original por enquanto.
    const planoParaCheckout = carrinho[0];

    const usuario_token = localStorage.getItem("access_token");
    if (!usuario_token) {
      // Redirecionamento para login é uma UX melhor aqui
      alert("Você precisa estar logado para finalizar a compra.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = import.meta.env.VITE_API_URL;

      const response = await axios.post(url + "/api/pagamento-plano/", {
        plano_nome: planoParaCheckout.nome, // Enviando apenas o primeiro item
        usuario_token: usuario_token,
      });

      if (response.data.url) {
        localStorage.removeItem("carrinho");
        setCarrinho([]);
        window.location.href = response.data.url;
      }
      // @ts-ignore
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
        /* Paleta de cores */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --light-gray-bg: #f5f7fa;
          --white: #ffffff;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --shadow-color: rgba(0, 0, 0, 0.1);
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray-bg);
        }
        
        /* Container */
        .cart-container {
          padding: 4rem 0;
        }
        .cart-container h1 {
          color: var(--dark-gray);
          font-weight: 800;
          font-size: 2.75rem;
          margin-bottom: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          letter-spacing: -0.05em;
        }
        .cart-container h1 svg {
            color: var(--primary-blue);
        }

        /* Layout Grid */
        .cart-grid {
            display: grid;
            grid-template-columns: 2fr 1.2fr; /* Coluna do carrinho maior que a do resumo */
            gap: 2rem;
            max-width: 1000px;
            margin: 0 auto;
        }

        /* Cartões */
        .cart-card {
          background-color: var(--white);
          border-radius: 16px;
          box-shadow: 0 8px 25px var(--shadow-color);
          padding: 2rem;
        }
        .summary-card {
            position: sticky;
            top: 100px; /* Para fixar a barra lateral */
            height: fit-content;
        }

        /* Lista de itens */
        .item-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #e2e8f0;
          transition: background-color 0.3s ease;
        }
        .cart-item:last-child {
          border-bottom: none;
        }
        .cart-item-details h6 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.15rem;
          margin: 0;
        }
        .cart-item-details small {
          color: var(--medium-gray);
          font-weight: 500;
          font-size: 1rem;
        }
        .cart-item .btn-remove {
          background-color: transparent;
          border: none;
          color: var(--danger-red);
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .cart-item .btn-remove:hover {
          background-color: rgba(220, 53, 69, 0.1);
          color: var(--danger-red);
          transform: scale(1.1);
        }

        /* Resumo e Total */
        .summary-card h3 {
            color: var(--dark-gray);
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 0.75rem;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 2px solid var(--primary-blue);
        }
        .total-row h4 {
          color: var(--primary-blue);
          font-weight: 800;
          font-size: 1.75rem;
          margin: 0;
        }
        .total-row span {
            font-size: 1.75rem;
            font-weight: 800;
            color: var(--primary-blue);
        }

        /* Botão de checkout */
        .checkout-btn {
          background-color: var(--success-green);
          color: var(--white);
          font-weight: 700;
          padding: 1rem 2rem;
          border-radius: 10px;
          transition: all 0.3s ease;
          border: none;
          width: 100%;
          margin-top: 2rem;
          font-size: 1.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
        }
        .checkout-btn:hover {
          background-color: #218838;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(40, 167, 69, 0.5);
        }
        .checkout-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
          opacity: 0.8;
          transform: none;
          box-shadow: none;
        }

        /* Mensagens */
        .alert-danger {
          background-color: #f8d7da;
          color: var(--danger-red);
          border: 1px solid #f5c6cb;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 600;
        }

        /* Mensagem de carrinho vazio */
        .empty-cart {
          text-align: center;
          color: var(--dark-gray);
          font-size: 1.25rem;
          padding: 3rem 1rem;
        }
        .empty-cart h5 {
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--primary-blue);
        }
        .empty-cart a {
          color: var(--accent-blue);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .empty-cart a:hover {
          color: var(--primary-blue);
          text-decoration: underline;
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .cart-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .cart-container {
            padding: 3rem 1rem;
          }
          .cart-container h1 {
            font-size: 2.25rem;
            margin-bottom: 2rem;
          }
          .summary-card {
            position: static;
          }
          .cart-item-details h6 {
              font-size: 1.05rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="cart-container container">
          <h1>
            <FaShoppingCart /> Resumo da Compra
          </h1>

          {error && <div className="alert-danger" style={{ maxWidth: '800px', margin: '0 auto 1.5rem auto' }}>{error}</div>}

          {carrinho.length === 0 ? (
            <div className="cart-card">
              <div className="empty-cart">
                <h5>Seu carrinho está vazio!</h5>
                <Link to="/planos">
                    Ir para Planos <FaArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="cart-grid">

              {/* COLUNA ESQUERDA: ITENS DO CARRINHO */}
              <div className="cart-card">
                <div className="item-list">
                  {carrinho.map((plano, index) => (
                    <div key={index} className="cart-item">
                      <div className="cart-item-details">
                        <h6>{plano.nome}</h6>
                        <small>Plano de Assinatura</small>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                         <span className="fw-bold" style={{ color: 'var(--dark-gray)' }}>R${plano.valor.toFixed(2)}</span>
                        <button
                          className="btn-remove"
                          onClick={() => removerItem(index)}
                          aria-label={`Remover ${plano.nome} do carrinho`}
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUNA DIREITA: RESUMO E CHECKOUT */}
              <div className="cart-card summary-card">
                <h3>Resumo do Pedido</h3>

                <div className="d-flex justify-content-between text-muted mb-2">
                    <span>Subtotal</span>
                    <span>R${total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted">
                    <span>Descontos</span>
                    <span style={{ color: 'var(--success-green)' }}>R$0.00</span>
                </div>

                <div className="total-row">
                  <h4>Total</h4>
                  <span>R${total.toFixed(2)}</span>
                </div>

                <button
                  className="checkout-btn"
                  onClick={finalizarCompra}
                  disabled={loading || carrinho.length === 0}
                  aria-label="Ir para o checkout e pagamento"
                >
                  {loading ? (
                    <>
                      <FaCreditCard size={18} /> Processando...
                    </>
                  ) : (
                    <>
                      <FaLock size={18} /> Finalizar Compra
                    </>
                  )}
                </button>
                <small className="d-block text-center mt-3 text-muted">
                    O pagamento será processado de forma segura.
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrinho;