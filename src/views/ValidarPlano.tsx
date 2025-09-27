import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "aos/dist/aos.css";
import AOS from "aos";

const ValidarPlano = () => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [statusPagamento, setStatusPagamento] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    verificarPagamento();
  }, []);

  const verificarPagamento = async () => {
    const usuario_token = localStorage.getItem("access_token");

    if (!usuario_token) {
      setStatusPagamento("Erro: usuário não autenticado.");
      console.error("Erro: usuário não autenticado.");
      return;
    }

    setLoading(true);
    try {
      const url = window.location.origin.includes("localhost:5173")
        ? "http://localhost:8000"
        : "https://backend-production-6587.up.railway.app";

      const response = await axios.post(url + "/api/payment-success/", {
        usuario_token: usuario_token,
      });

      if (response.data.status === "approved") {
        setVerified(true);
        setStatusPagamento("Pagamento aprovado! Você pode acessar seus recursos.");
      } else if (response.data.status === "pending") {
        setStatusPagamento("Pagamento pendente. Aguarde a confirmação.");
      } else {
        setStatusPagamento("Pagamento não aprovado. Tente novamente mais tarde.");
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      setStatusPagamento("Erro ao verificar pagamento. Tente novamente.");
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
          --warning-orange: #fd7e14;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Container */
        .validar-plano-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 70px); /* Ajusta para o Navbar */
          padding: 3rem 1rem;
        }
        .validar-plano-container .card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 100%;
          padding: 2rem;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .validar-plano-container .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .validar-plano-container h1 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .validar-plano-container .lead {
          color: var(--dark-gray);
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        /* Status message */
        .status-message {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .status-message.success {
          color: var(--success-green);
        }
        .status-message.danger {
          color: var(--danger-red);
        }
        .status-message.warning {
          color: var(--warning-orange);
        }
        .status-message.loading {
          color: var(--dark-gray);
        }

        /* Botões */
        .btn {
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .btn-success {
          background-color: var(--success-green);
          border-color: var(--success-green);
        }
        .btn-outline-success {
          border-color: var(--success-green);
          color: var(--success-green);
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .btn:disabled {
          background-color: #6c757d;
          border-color: #6c757d;
          cursor: not-allowed;
          opacity: 0.7;
        }

        /* Responsividade */
        @media (max-width: 576px) {
          .validar-plano-container {
            padding: 2rem 1rem;
          }
          .validar-plano-container .card {
            padding: 1.5rem;
          }
          .validar-plano-container h1 {
            font-size: 1.75rem;
          }
          .validar-plano-container .lead {
            font-size: 1rem;
          }
          .status-message {
            font-size: 1rem;
          }
          .btn {
            font-size: 0.9rem;
            padding: 0.5rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="validar-plano-container">
          <div className="card" data-aos="fade-up">
            <div className="card-body">
              <h1>
                <FaCheckCircle /> Verificação de Pagamento
              </h1>
              <p className="lead">
                Verifique o status do pagamento de seu plano abaixo.
              </p>
              <div className="mb-4">
                {loading ? (
                  <p className="status-message loading">
                    <FaSpinner className="fa-spin me-2" /> Verificando status...
                  </p>
                ) : statusPagamento ? (
                  <p
                    className={`status-message ${
                      verified
                        ? "success"
                        : statusPagamento.includes("pendente")
                        ? "warning"
                        : "danger"
                    }`}
                  >
                    {verified ? (
                      <FaCheckCircle />
                    ) : statusPagamento.includes("pendente") ? (
                      <FaExclamationCircle />
                    ) : (
                      <FaExclamationCircle />
                    )}
                    {statusPagamento}
                  </p>
                ) : null}
              </div>
              <button
                onClick={verificarPagamento}
                className="btn btn-success w-100 mb-3"
                disabled={loading || verified}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {loading
                  ? "Verificando..."
                  : verified
                  ? "Pagamento Confirmado!"
                  : "Verificar Status do Pagamento"}
              </button>
              <Link
                to="/"
                className="btn btn-outline-success w-100"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidarPlano;