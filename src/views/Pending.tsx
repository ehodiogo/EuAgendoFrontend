import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaSpinner, FaCircleCheck, FaHourglassHalf, FaCircleExclamation } from "react-icons/fa6";

const PendingPage = () => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface Plano {
    nome: string;
    preco: number;
  }

  const [carrinho, setCarrinho] = useState<Plano[]>([]);

  useEffect(() => {
    const itensCarrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setCarrinho(itensCarrinho);
  }, []);

  const planoAtivar = carrinho.length ? carrinho[0].nome : "Plano Indefinido";

  const verificarPagamento = async () => {
    const usuario_token = localStorage.getItem("access_token");

    if (!usuario_token) {
      setError("Erro: usuário não autenticado. Faça login novamente.");
      return;
    }

    if (!carrinho.length) {
      setError("Erro: dados do plano ausentes (carrinho vazio).");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = import.meta.env.VITE_API_URL;

      const response = await axios.post(
        url + "/api/payment-success/",
        {
          plano_nome: planoAtivar,
          usuario_token: usuario_token,
        }
      );

      if (response.data.status === "approved") {
        setVerified(true);
        window.location.href = "/dashboard";
      } else {
        setError("O pagamento ainda está em processamento. Tente novamente mais tarde.");
      }
    } catch (err) {
      console.error("Erro ao verificar pagamento:", err);
      setError("Erro de Conexão. Não foi possível verificar o pagamento.");
    } finally {
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
          --warning-orange: #fd7e14;
        }

        /* Layout */
        .pending-page-bg {
            background-color: var(--light-gray-bg);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem 1rem;
        }

        /* Card Principal */
        .pending-card {
          background-color: var(--white);
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
          max-width: 550px;
          width: 100%;
          padding: 3rem;
          text-align: center;
          border-top: 6px solid var(--warning-orange);
        }
        
        .pending-icon {
            color: var(--warning-orange);
            font-size: 4rem;
            margin-bottom: 1.5rem;
        }

        /* Título e Texto */
        .pending-card h1 {
          color: var(--dark-gray);
          font-weight: 800;
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .pending-card .lead {
          color: var(--light-gray-text, #495057);
          font-size: 1.15rem;
          margin-bottom: 0.5rem;
        }
        .plano-nome-info {
            color: var(--primary-blue);
            font-weight: 700;
        }

        /* Mensagem de Dica */
        .tip-message {
            background-color: #fff7e6;
            color: var(--dark-gray);
            border: 1px solid var(--warning-orange);
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            font-weight: 600;
            font-size: 0.95rem;
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


        /* Botões */
        .btn-custom {
          padding: 0.85rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1.05rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .btn-warning-custom {
          background-color: var(--warning-orange);
          border-color: var(--warning-orange);
          color: var(--white);
        }
        .btn-warning-custom:hover:not(:disabled) {
          background-color: #cc6510;
          border-color: #cc6510;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(253, 126, 20, 0.3);
        }
        .btn-outline-custom {
          border: 2px solid var(--warning-orange);
          color: var(--warning-orange);
          background-color: var(--white);
        }
        .btn-outline-custom:hover {
            background-color: #fff7e6;
        }
        .btn-custom:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            box-shadow: none;
        }

        /* Responsividade */
        @media (max-width: 576px) {
            .pending-card {
                padding: 2rem 1.5rem;
            }
            .pending-icon {
                font-size: 3rem;
            }
            .pending-card h1 {
                font-size: 1.8rem;
            }
        }
      `}</style>
      <Navbar />
      <div className="pending-page-bg">
        <div className="pending-card">
          <FaHourglassHalf className="pending-icon" aria-hidden="true" />

          <h1 className="text-warning">
            <FaHourglassHalf /> Processando Pagamento
          </h1>

          <p className="lead">
            Seu pagamento para o plano <span className="plano-nome-info">{planoAtivar}</span> está sendo processado pelo emissor.
          </p>

          <p className="tip-message">
            Verificações manuais a cada 5-10 minutos podem agilizar a liberação do seu plano!
          </p>

          {error && <div className="error-message"><FaCircleExclamation className="me-2" /> {error}</div>}

          <button
            onClick={verificarPagamento}
            className="btn-custom btn-warning-custom w-100 my-2"
            disabled={loading || verified}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Verificando Status...
              </>
            ) : verified ? (
              <>
                <FaCircleCheck /> Pagamento Confirmado!
              </>
            ) : (
              "Verificar Pagamento Agora"
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

export default PendingPage;