import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "aos/dist/aos.css";
import AOS from "aos";
import Navbar from "../components/Navbar";
import { FaEnvelope } from "react-icons/fa";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const url = window.location.origin.includes("localhost:5173")
        ? "http://localhost:8000"
        : "https://backend-production-7438.up.railway.app";

      const response = await axios.post(url + "/api/password-recovery/", {
        email: email,
      });

      if (response.status === 200) {
        setSuccess(true);
        setEmail(""); // Clear input after success
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Erro ao enviar o link de recuperação. Verifique o e-mail e tente novamente."
      );
      console.error("Erro no envio do link", err);
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
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Layout */
        .forgot-password-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 70px); /* Ajusta para altura da Navbar */
        }

        /* Cartão de recuperação */
        .forgot-password-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
          max-width: 450px;
          width: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .forgot-password-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .forgot-password-card h2 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        /* Formulário */
        .form-label {
          color: var(--primary-blue);
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .form-control {
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          font-size: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-control:focus {
          border-color: var(--light-blue);
          box-shadow: 0 0 0 0.2rem rgba(77, 171, 247, 0.25);
          outline: none;
        }
        .form-control::placeholder {
          color: #9ca3af;
        }
        .submit-btn {
          background-color: var(--success-green);
          color: var(--white);
          font-weight: 600;
          padding: 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          border: none;
          width: 100%;
        }
        .submit-btn:hover {
          background-color: #218838;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        .submit-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
          opacity: 0.7;
        }

        /* Mensagens de erro e sucesso */
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
        .alert-success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 500;
        }

        /* Links */
        .link-container {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }
        .link-container a {
          color: var(--light-blue);
          font-weight: 500;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .link-container a:hover {
          color: var(--primary-blue);
          text-decoration: underline;
        }

        /* Ícones nos inputs */
        .input-icon {
          position: relative;
        }
        .input-icon svg {
          position: absolute;
          top: 50%;
          left: 0.75rem;
          transform: translateY(-50%);
          color: var(--light-blue);
          font-size: 1.2rem;
          z-index: 1;
        }

        /* Responsividade */
        @media (max-width: 576px) {
          .forgot-password-card {
            padding: 1.5rem;
            margin: 0 1rem;
          }
          .forgot-password-card h2 {
            font-size: 1.5rem;
          }
          .form-control {
            font-size: 0.9rem;
            padding-left: 2.25rem;
          }
          .submit-btn {
            font-size: 0.9rem;
          }
          .input-icon svg {
            font-size: 1rem;
            left: 0.5rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="forgot-password-container">
          <div className="forgot-password-card" data-aos="fade-up">
            <h2>
              <FaEnvelope /> Recuperar Senha
            </h2>
            <form onSubmit={handlePasswordRecovery}>
              <div className="mb-3 input-icon">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <FaEnvelope />
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
                aria-label="Enviar link de recuperação de senha"
              >
                {loading ? "Enviando..." : "Enviar Link de Recuperação"}
              </button>
            </form>
            {error && <div className="alert-danger">{error}</div>}
            {success && (
              <div className="alert-success">
                Link de recuperação enviado! Verifique seu e-mail.
              </div>
            )}
            <div className="link-container">
              <Link to="/login">Voltar ao Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;