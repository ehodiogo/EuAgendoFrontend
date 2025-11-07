import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaEnvelope, FaLockOpen, FaSpinner, FaArrowLeft, FaCheck, FaExclamation, FaPaperPlane } from "react-icons/fa6";

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
      await axios.post(`${url}/api/password-recovery/`, { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro ao enviar o link. Tente novamente.");
      console.error("Erro no envio do link", err);
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
          --danger: #dc3545;
          --info: #0056b3;
          --gray-100: #f8f9fa;
          --gray-200: #e9ecef;
          --gray-600: #6c757d;
          --white: #ffffff;
          --shadow-sm: 0 4px 12px rgba(0,0,0,0.08);
          --shadow-md: 0 8px 25px rgba(0,0,0,0.15);
          --shadow-lg: 0 15px 40px rgba(0,0,0,0.25);
          --radius: 24px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }

        .hero-bg {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 80%, rgba(246,193,7,0.15), transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1), transparent 50%);
          pointer-events: none;
        }

        .recovery-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          position: relative;
          z-index: 1;
        }

        .recovery-card {
          background: white;
          border-radius: var(--radius);
          padding: 3rem 2.5rem;
          max-width: 460px;
          width: 100%;
          box-shadow: var(--shadow-lg);
          border-top: 6px solid var(--accent);
          animation: fadeInUp 0.8s ease-out;
          position: relative;
          overflow: hidden;
        }
        .recovery-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 6px;
          background: linear-gradient(90deg, var(--primary), var(--info), var(--accent));
        }

        .recovery-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .recovery-header h1 {
          color: #1a1a1a;
          font-weight: 800;
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 0;
        }
        .recovery-header .icon {
          color: var(--primary);
          font-size: 2.8rem;
        }
        .recovery-header p {
          color: var(--gray-600);
          margin-top: 0.75rem;
          font-size: 1.05rem;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-label {
          display: block;
          color: #212529;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--info);
          font-size: 1.2rem;
          pointer-events: none;
          transition: var(--transition);
        }
        .form-control {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid var(--gray-200);
          border-radius: 14px;
          font-size: 1rem;
          transition: var(--transition);
          background: white;
        }
        .form-control:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(0, 48, 135, 0.15);
          outline: none;
        }
        .form-control:focus ~ .input-icon {
          color: var(--primary);
        }

        .submit-btn {
          background: linear-gradient(135deg, var(--primary), var(--info));
          color: white;
          border: none;
          padding: 1.1rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1.15rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1rem;
          transition: var(--transition);
          box-shadow: 0 6px 16px rgba(0, 48, 135, 0.25);
        }
        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--info), var(--primary));
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 48, 135, 0.35);
        }
        .submit-btn:disabled {
          background: #d1d5db;
          color: var(--gray-600);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .alert {
          padding: 1rem 1.25rem;
          border-radius: 12px;
          margin-top: 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          animation: fadeInUp 0.4s ease-out;
          text-align: center;
        }
        .alert-success {
          background: rgba(40, 167, 69, 0.1);
          color: var(--success);
          border: 1px solid var(--success);
        }
        .alert-danger {
          background: rgba(220, 53, 69, 0.1);
          color: var(--danger);
          border: 1px solid var(--danger);
        }

        .footer-links {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px dashed var(--gray-200);
        }
        .footer-links a {
          color: var(--info);
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition);
        }
        .footer-links a:hover {
          color: var(--primary);
          text-decoration: underline;
        }

        .brand-footer {
          text-align: center;
          padding: 1.5rem;
          color: rgba(255,255,255,0.8);
          font-size: 0.9rem;
        }

        @media (max-width: 576px) {
          .recovery-card {
            padding: 2rem 1.5rem;
            margin: 1rem;
          }
          .recovery-header h1 {
            font-size: 2rem;
          }
          .form-control {
            padding: 0.9rem 0.9rem 0.9rem 2.8rem;
          }
          .input-icon {
            left: 0.9rem;
            font-size: 1.1rem;
          }
          .submit-btn {
            font-size: 1.05rem;
            padding: 1rem;
          }
        }
      `}</style>

      <div className="hero-bg">
        <Navbar />

        <div className="recovery-content">
          <div className="recovery-card">
            <div className="recovery-header">
              <h1>
                <FaLockOpen className="icon" /> Recuperar Senha
              </h1>
              <p>
                Sem problemas! Digite seu e-mail e enviaremos um link seguro para redefinir sua senha em minutos.
              </p>
            </div>

            <form onSubmit={handlePasswordRecovery}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">E-mail da conta</label>
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="fa-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    Enviar Link <FaPaperPlane />
                  </>
                )}
              </button>
            </form>

            {success && (
              <div className="alert alert-success">
                <FaCheck /> Link enviado! Verifique sua caixa de entrada e spam.
              </div>
            )}
            {error && (
              <div className="alert alert-danger">
                <FaExclamation /> {error}
              </div>
            )}

            <div className="footer-links">
              <Link to="/login">
                <FaArrowLeft /> Voltar ao login
              </Link>
            </div>
          </div>
        </div>

        <footer className="brand-footer">
          Recuperação segura • Link válido por 15 min • Suporte 24h
        </footer>
      </div>
    </div>
  );
}

export default ForgotPassword;