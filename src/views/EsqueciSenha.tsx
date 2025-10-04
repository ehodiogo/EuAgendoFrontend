import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaEnvelope, FaLockOpen, FaSpinner, FaArrowLeft } from "react-icons/fa6";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const url = import.meta.env.VITE_API_URL;

      const response = await axios.post(url + "/api/password-recovery/", {
        email: email,
      });

      if (response.status === 200) {
        setSuccess(true);
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
        /* Cores Aprimoradas */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --light-gray-bg: #f5f7fa;
          --white: #ffffff;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --shadow-color: rgba(0, 0, 0, 0.15);
        }

        .custom-bg {
          background-color: var(--light-gray-bg);
          background-image: linear-gradient(135deg, var(--light-gray-bg) 0%, var(--white) 100%);
        }

        .forgot-password-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 70px);
          padding: 2rem 1rem;
        }

        /* Cartão de recuperação */
        .forgot-password-card {
          background-color: var(--white);
          border-radius: 20px;
          box-shadow: 0 10px 30px var(--shadow-color);
          padding: 3rem;
          max-width: 420px;
          width: 100%;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          border-top: 5px solid var(--primary-blue);
        }
        .forgot-password-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }
        .forgot-password-card h2 {
          color: var(--dark-gray);
          font-weight: 800;
          font-size: 2.25rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          letter-spacing: -0.04em;
        }
        .forgot-password-card h2 svg {
            color: var(--primary-blue);
            font-size: 2.5rem;
        }
        .forgot-password-card p {
            color: var(--dark-gray);
            text-align: center;
            margin-bottom: 2rem;
            font-size: 0.95rem;
        }

        /* Formulário */
        .form-label {
          color: var(--dark-gray);
          font-weight: 700;
          font-size: 1.05rem;
          margin-bottom: 0.5rem;
          display: block;
          text-align: left;
        }
        /* Input com Ícone Aprimorado */
        .input-icon {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .input-icon .left-icon {
          position: absolute;
          top: 50%;
          left: 1rem;
          transform: translateY(-50%);
          color: var(--accent-blue);
          font-size: 1.1rem;
          pointer-events: none;
          transition: color 0.3s ease;
          z-index: 10;
        }
        .form-control {
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 1rem 1rem 1rem 3rem;
          font-size: 1rem;
          width: 100%;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-control:focus {
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(0, 48, 135, 0.2);
          outline: none;
        }
        .form-control:focus + .left-icon {
            color: var(--primary-blue);
        }
        .form-control::placeholder {
          color: #a0aec0;
        }
        
        /* Botão de Submit com Gradiente */
        .submit-btn {
          background: linear-gradient(135deg, var(--primary-blue), var(--accent-blue));
          color: var(--white);
          font-weight: 700;
          padding: 1rem;
          border-radius: 10px;
          transition: all 0.3s ease;
          border: none;
          width: 100%;
          font-size: 1.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 4px 15px rgba(0, 48, 135, 0.3);
          margin-top: 0.5rem;
        }
        .submit-btn:hover {
          background: linear-gradient(135deg, var(--accent-blue), var(--primary-blue));
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 48, 135, 0.4);
        }
        .submit-btn:disabled {
          background: #ccc;
          color: var(--dark-gray);
          cursor: not-allowed;
          opacity: 0.8;
          transform: none;
          box-shadow: none;
        }

        /* Mensagens de erro e sucesso */
        .alert-danger {
          background-color: #fcebeb;
          color: var(--danger-red);
          border: 1px solid #f9d7da;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1.5rem;
          text-align: center;
          font-weight: 600;
        }
        .alert-success {
          background-color: #d4edda;
          color: var(--success-green);
          border: 1px solid #c3e6cb;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1.5rem;
          text-align: center;
          font-weight: 600;
        }

        /* Links */
        .link-container {
          display: flex;
          justify-content: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
          font-size: 0.95rem;
        }
        .link-container a {
          color: var(--accent-blue);
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .link-container a:hover {
          color: var(--primary-blue);
          text-decoration: underline;
        }

        /* Responsividade */
        @media (max-width: 576px) {
          .forgot-password-card {
            padding: 2rem 1.5rem;
          }
          .forgot-password-card h2 {
            font-size: 1.75rem;
          }
          .form-control {
            font-size: 0.9rem;
            padding: 0.8rem 0.8rem 0.8rem 2.5rem;
          }
          .submit-btn {
            font-size: 1.05rem;
            padding: 0.8rem;
          }
          .input-icon .left-icon {
            font-size: 1rem;
            left: 0.75rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="forgot-password-container">
          <div className="forgot-password-card">
            <h2>
              <FaLockOpen /> Redefinir Senha
            </h2>
            <p>
                Insira o endereço de e-mail associado à sua conta e enviaremos um link para redefinir sua senha.
            </p>
            <form onSubmit={handlePasswordRecovery}>
              <div className="input-icon">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <FaEnvelope className="left-icon" />
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@empresa.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
                aria-label="Enviar link de recuperação de senha"
              >
                {loading ? (
                  <>
                    <FaSpinner className="fa-spin" /> Enviando...
                  </>
                ) : (
                  "Enviar Link de Recuperação"
                )}
              </button>
            </form>

            {success && (
              <div className="alert-success">
                Link de recuperação enviado com sucesso! <strong>Verifique sua caixa de entrada</strong> (e spam) para prosseguir.
              </div>
            )}
            {error && <div className="alert-danger">{error}</div>}

            <div className="link-container">
              <Link to="/login">
                <FaArrowLeft /> Voltar ao Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;