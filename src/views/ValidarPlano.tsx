import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaSpinner, FaCircleExclamation, FaHourglassHalf, FaCircleCheck } from "react-icons/fa6";

const ValidarPlano = () => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [statusPagamento, setStatusPagamento] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(() => {
      if (isMounted) {
        verificarPagamento();
      }
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const verificarPagamento = async () => {
    const usuario_token = localStorage.getItem("access_token");

    if (!usuario_token) {
      setStatusPagamento("Erro: usuário não autenticado. Faça login novamente.");
      console.error("Erro: usuário não autenticado.");
      return;
    }

    setLoading(true);
    try {
      const url = import.meta.env.VITE_API_URL;

      const response = await axios.post(url + "/api/payment-success/", {
        usuario_token: usuario_token,
      });

      const status = response.data.status;

      if (status === "approved") {
        setVerified(true);
        setStatusPagamento("Pagamento <strong>Aprovado</strong>! Acesso liberado aos recursos premium.");
      } else if (status === "pending" || status === "in_process") {
        setStatusPagamento("Pagamento <strong>Pendente</strong>. Aguarde a confirmação do banco/emissor.");
      } else {
        setStatusPagamento("Pagamento <strong>Não Aprovado</strong>. Verifique seus dados ou tente outro método.");
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      setStatusPagamento("Erro de Conexão. Tente verificar o status novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = () => {
    if (loading) return "loading";
    if (verified) return "success";
    if (statusPagamento?.includes("Pendente")) return "warning";
    if (statusPagamento) return "danger";
    return "";
  };

  const getStatusIcon = () => {
      if (loading) return <FaSpinner className="animate-spin" />;
      if (verified) return <FaCircleCheck />;
      if (statusPagamento?.includes("Pendente")) return <FaHourglassHalf />;
      return <FaCircleExclamation />;
  };

  return (
    <div className="min-vh-100 plano-validation-wrapper">
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

        /* Estilos gerais */
        .plano-validation-wrapper {
          background-color: var(--light-gray-bg);
        }

        /* Container Principal */
        .validar-plano-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 70px);
          padding: 3rem 1rem;
        }
        
        /* Card Central */
        .validar-plano-container .card-verification {
          background-color: var(--white);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          max-width: 550px;
          width: 100%;
          padding: 2.5rem;
          text-align: center;
          border-top: 6px solid var(--primary-blue);
        }
        
        .card-verification h1 {
          color: var(--primary-blue);
          font-weight: 800;
          font-size: 2.25rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }
        .card-verification h1 svg {
            color: var(--accent-blue);
        }
        .card-verification .lead {
          color: var(--dark-gray);
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        /* Status Message */
        .status-message {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 2.5rem;
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          border: 1px solid transparent;
        }
        
        .status-message.success {
          color: var(--success-green);
          background-color: #e6f8ee;
          border-color: var(--success-green);
        }
        .status-message.danger {
          color: var(--danger-red);
          background-color: #fcebeb;
          border-color: var(--danger-red);
        }
        .status-message.warning {
          color: var(--warning-orange);
          background-color: #fff7e6;
          border-color: var(--warning-orange);
        }
        .status-message.loading {
          color: var(--primary-blue);
          background-color: #f0f4f8;
        }
        .status-message strong {
            font-weight: 900;
            margin-right: 0.25rem;
        }
        .status-message svg {
            font-size: 1.5rem;
        }

        /* Botões */
        .btn-custom {
          padding: 0.8rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .btn-success-custom {
          background-color: var(--success-green);
          border-color: var(--success-green);
          color: var(--white);
        }
        .btn-success-custom:hover:not(:disabled) {
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
        .btn-outline-custom:hover:not(:disabled) {
          background-color: #e6f8ee;
          color: var(--success-green);
          transform: translateY(-1px);
        }
        .btn-custom:disabled {
          background-color: #adb5bd !important;
          border-color: #adb5bd !important;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Responsividade */
        @media (max-width: 576px) {
          .card-verification {
            padding: 1.5rem;
          }
          .card-verification h1 {
            font-size: 1.8rem;
          }
          .status-message {
            font-size: 1rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="validar-plano-container">
          <div className="card-verification">
            <div className="card-body">
              <h1>
                <FaCircleCheck /> Verificação do Plano
              </h1>
              <p className="lead">
                Estamos processando seu pagamento. Por favor, aguarde alguns
                instantes ou verifique o status novamente.
              </p>
              <div className="mb-4">
                {loading ? (
                  <p className="status-message loading">
                    <FaSpinner className="animate-spin" /> Verificando status...
                  </p>
                ) : statusPagamento ? (
                  <p
                    className={`status-message ${getStatusClass()}`}
                  >
                    {getStatusIcon()}
                    <span dangerouslySetInnerHTML={{ __html: statusPagamento.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </p>
                ) : null}
              </div>

              <button
                onClick={verificarPagamento}
                className="btn-custom btn-success-custom w-100 mb-3"
                disabled={loading || verified}
              >
                {loading
                  ? "Verificando..."
                  : verified
                  ? "Acesso Liberado!"
                  : "Verificar Status do Pagamento"}
              </button>

              <Link
                to="/"
                className="btn-custom btn-outline-custom w-100"
              >
                Voltar à Página Principal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidarPlano;