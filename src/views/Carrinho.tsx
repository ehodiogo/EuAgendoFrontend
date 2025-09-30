import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import "aos/dist/aos.css";
import AOS from "aos";
import { Link } from "react-router-dom";

function Carrinho() {
  interface Plano {
    nome: string;
    preco: number;
  }

  const [carrinho, setCarrinho] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    const itensCarrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setCarrinho(itensCarrinho);
  }, []);

  const total = carrinho.reduce((acc, plano) => acc + plano.preco, 0);

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

    const usuario_token = localStorage.getItem("access_token");
    if (!usuario_token) {
      setError("Usuário não autenticado! Faça login para continuar.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = import.meta.env.VITE_API_URL;

      const response = await axios.post(url + "/api/pagamento-plano/", {
        plano_nome: carrinho[0].nome,
        usuario_token: usuario_token,
      });

      if (response.data.url) {
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
          --light-blue: #4dabf7;
          --dark-gray: #2d3748;
          --light-gray: #f7fafc;
          --white: #ffffff;
          --accent-yellow: #f6c107;
          --success-green: #28a745;
          --danger-red: #dc3545;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Container */
        .cart-container {
          padding: 3rem 0;
        }
        .cart-container h1 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Cartão do carrinho */
        .cart-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .cart-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        /* Lista de itens */
        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          transition: background-color 0.3s ease;
        }
        .cart-item:last-child {
          border-bottom: none;
        }
        .cart-item:hover {
          background-color: rgba(77, 171, 247, 0.05);
        }
        .cart-item h6 {
          color: var(--dark-gray);
          font-weight: 600;
          margin: 0;
        }
        .cart-item small {
          color: var(--dark-gray);
          font-weight: 500;
        }
        .cart-item .btn-remove {
          background-color: transparent;
          border: 1px solid var(--danger-red);
          color: var(--danger-red);
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .cart-item .btn-remove:hover {
          background-color: var(--danger-red);
          color: var(--white);
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
        }

        /* Total e botão de checkout */
        .cart-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }
        .cart-total h5 {
          color: var(--primary-blue);
          font-weight: 700;
          margin: 0;
        }
        .checkout-btn {
          background-color: var(--success-green);
          color: var(--white);
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          border: none;
        }
        .checkout-btn:hover {
          background-color: #218838;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        .checkout-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
          opacity: 0.7;
        }

        /* Mensagem de erro */
        .alert-danger {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 500;
        }

        /* Mensagem de carrinho vazio */
        .empty-cart {
          text-align: center;
          color: var(--dark-gray);
          font-size: 1.25rem;
          padding: 2rem;
        }
        .empty-cart h5 {
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .empty-cart a {
          color: var(--light-blue);
          text-decoration: none;
          font-weight: 500;
        }
        .empty-cart a:hover {
          color: var(--primary-blue);
          text-decoration: underline;
        }

        /* Responsividade */
        @media (max-width: 576px) {
          .cart-container {
            padding: 2rem 1rem;
          }
          .cart-container h1 {
            font-size: 2rem;
          }
          .cart-card {
            padding: 1.5rem;
          }
          .cart-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
            padding: 0.75rem;
          }
          .cart-total {
            flex-direction: column;
            gap: 1rem;
          }
          .checkout-btn {
            width: 100%;
            padding: 0.75rem;
          }
          .cart-item .btn-remove {
            align-self: flex-end;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="cart-container container">
          <h1 data-aos="fade-up">
            <FaShoppingCart /> Seu Carrinho
          </h1>
          <div className="cart-card" data-aos="fade-up" data-aos-delay="100">
            {error && <div className="alert-danger">{error}</div>}
            {carrinho.length === 0 ? (
              <div className="empty-cart">
                <h5>Seu carrinho está vazio!</h5>
                <Link to="/planos">Explorar Planos</Link>
              </div>
            ) : (
              <div>
                <div className="list-group">
                  {carrinho.map((plano, index) => (
                    <div key={index} className="cart-item">
                      <div>
                        <h6>{plano.nome}</h6>
                        <small>R${plano.preco.toFixed(2)}</small>
                      </div>
                      <button
                        className="btn-remove"
                        onClick={() => removerItem(index)}
                        aria-label={`Remover ${plano.nome} do carrinho`}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <h5>Total: R${total.toFixed(2)}</h5>
                  <button
                    className="checkout-btn"
                    onClick={finalizarCompra}
                    disabled={loading}
                    aria-label="Ir para o checkout"
                  >
                    {loading ? "Processando..." : "Ir para o Checkout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrinho;