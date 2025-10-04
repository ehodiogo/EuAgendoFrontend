import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaSpinner, FaRocket } from "react-icons/fa6";
import {FaCheckCircle} from "react-icons/fa";

const SuccessPage = () => {
  interface Plano {
    nome: string;
    preco: number;
  }

  const [carrinho, setCarrinho] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const itensCarrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setCarrinho(itensCarrinho);
  }, []);

  const usuario_token = localStorage.getItem("access_token");

  const planoAtivar = carrinho.length ? carrinho[0].nome : "Plano Indefinido";

  const ativarPlano = async () => {
    if (!carrinho.length || !usuario_token) {
      setError("Erro: Dados do plano ou autenticação ausentes.");
      return;
    }

    setLoading(true);
    try {
      const url = import.meta.env.VITE_API_URL;

      await axios.post(url + "/api/payment-success/", {
        plano_nome: planoAtivar,
        usuario_token: usuario_token,
      });

      setSuccess(true);
      setError(null);

      window.localStorage.removeItem("carrinho");

      setTimeout(() => {
          window.location.href = "/dashboard";
      }, 1000);

    } catch (err) {
      console.error("Erro ao ativar o plano:", err);
      setError("Erro ao ativar o plano. Contate o suporte.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* Paleta de cores (Consistente VemAgendar) */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --light-gray-bg: #f0f4f8; /* Fundo suave */
          --white: #ffffff;
          --success-green: #28a745;
          --danger-red: #dc3545;
        }
        
        /* Layout */
        .success-page-bg {
            background-color: var(--light-gray-bg);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem 1rem;
        }

        /* Card Principal */
        .success-card {
          background-color: var(--white);
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
          max-width: 550px;
          width: 100%;
          padding: 3rem;
          text-align: center;
          border-top: 6px solid var(--success-green);
        }
        
        .success-icon {
            color: var(--success-green);
            font-size: 4rem;
            margin-bottom: 1.5rem;
            animation: bounce 1s ease-in-out;
        }

        /* Título e Texto */
        .success-card h1 {
          color: var(--dark-gray);
          font-weight: 800;
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
        }
        .success-card .lead {
          color: var(--light-gray-text, #495057);
          font-size: 1.15rem;
          margin-bottom: 2rem;
        }
        .plano-nome-destaque {
            color: var(--accent-blue);
            font-weight: 700;
        }

        /* Botões */
        .btn-custom {
          padding: 0.85rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1.05rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .btn-activate {
          background-color: var(--success-green);
          border-color: var(--success-green);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .btn-activate:hover:not(:disabled) {
          background-color: #1e8736;
          border-color: #1e8736;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(40, 167, 69, 0.3);
        }
        .btn-outline-custom {
          border: 2px solid var(--success-green);
          color: var(--success-green);
          background-color: var(--white);
        }
        .btn-outline-custom:hover {
            background-color: #e6f8ee;
        }

        /* Animação para feedback */
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-10px);}
            60% {transform: translateY(-5px);}
        }
        .animate-spin-fast {
            animation: spin 0.5s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* Mensagem de Erro */
        .error-message {
            background-color: #fcebeb;
            color: var(--danger-red);
            border: 1px solid var(--danger-red);
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-weight: 600;
        }
        
        /* Responsividade */
        @media (max-width: 576px) {
            .success-card {
                padding: 2rem 1.5rem;
            }
            .success-icon {
                font-size: 3rem;
            }
            .success-card h1 {
                font-size: 1.8rem;
            }
            .success-card .lead {
                font-size: 1rem;
            }
        }
      `}</style>
      <Navbar />
      <div className="success-page-bg">
        <div className="success-card">
          <FaCheckCircle className="success-icon" aria-hidden="true" />

          <h1 className="text-success">Pagamento Aprovado!</h1>

          <p className="lead">
            Seu pagamento foi processado com sucesso. Você está a um clique de ativar seu novo plano: <span className="plano-nome-destaque">{planoAtivar}</span>.
          </p>

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={ativarPlano}
            className="btn-custom btn-activate w-100 mb-3"
            disabled={loading || success}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin-fast" /> Ativando Plano...
              </>
            ) : success ? (
              <>
                <FaRocket /> Plano Ativado! Redirecionando...
              </>
            ) : (
              "Ativar Plano e Ir para o Dashboard"
            )}
          </button>

          <Link to="/" className="btn-custom btn-outline-custom w-100">
            Voltar à Página Inicial
          </Link>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;