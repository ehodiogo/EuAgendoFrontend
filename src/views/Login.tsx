import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaKey, FaEnvelope, FaSpinner, FaCheck, FaExclamation, FaArrowRight } from "react-icons/fa6";
import {FaShieldAlt, FaSignInAlt} from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const url = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${url}/api/login/`, { email, password });

      const { access, refresh, is_expired_plan, tempo_restante } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("ultimo_acesso", new Date().getTime().toString());
      localStorage.setItem("is_expired_plan", is_expired_plan.toString());
      localStorage.setItem("tempo_restante", tempo_restante.toString());

      navigate("/dashboard");
    } catch (err: any) {
      const apiError = err.response?.data?.erro || err.response?.data?.detail || err.response?.data?.non_field_errors;
      let errorMessage = "Erro de login. Verifique suas credenciais e tente novamente.";

      if (apiError) {
        errorMessage = Array.isArray(apiError) ? apiError[0] : apiError;
      }

      if (err.response?.status === 403) {
        errorMessage = apiError || "Conta não ativada. Confirme seu e-mail para acessar.";
      }

      setError(errorMessage);
      console.error("Erro no login:", err.response || err);
    } finally {
      setIsLoading(false);
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
        @keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }

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

        .login-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          position: relative;
          z-index: 1;
        }

        .login-card {
          background: white;
          border-radius: var(--radius);
          padding: 3rem 2.5rem;
          max-width: 440px;
          width: 100%;
          box-shadow: var(--shadow-lg);
          border-top: 6px solid var(--accent);
          animation: fadeInUp 0.8s ease-out;
          position: relative;
          overflow: hidden;
        }
        .login-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 6px;
          background: linear-gradient(90deg, var(--primary), var(--info), var(--accent));
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .login-header h1 {
          color: #1a1a1a;
          font-weight: 800;
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 0;
        }
        .login-header .icon {
          color: var(--primary);
          font-size: 2.8rem;
        }
        .login-header p {
          color: var(--gray-600);
          margin-top: 0.75rem;
          font-size: 1.05rem;
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
        .form-control:focus + .input-icon {
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
          margin-bottom: 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: fadeInUp 0.4s ease-out;
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
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px dashed var(--gray-200);
          font-size: 0.95rem;
        }
        .footer-links a {
          color: var(--info);
          font-weight: 600;
          text-decoration: none;
          display: flex;
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
          .login-card {
            padding: 2rem 1.5rem;
            margin: 1rem;
          }
          .login-header h1 {
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
          .footer-links {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>

      <div className="hero-bg">
        <Navbar />

        <div className="login-content">
          <div className="login-card">
            <div className="login-header">
              <h1>
                <FaSignInAlt className="icon" /> Bem-vindo
              </h1>
              <p>Acesse sua conta e gerencie suas empresas com total controle.</p>
            </div>

            {successMessage && (
              <div className="alert alert-success">
                <FaCheck /> <span dangerouslySetInnerHTML={{ __html: successMessage }} />
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">E-mail</label>
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

              <div className="form-group">
                <label htmlFor="password" className="form-label">Senha</label>
                <div className="input-wrapper">
                  <FaKey className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-danger">
                  <FaExclamation /> {error}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <FaSpinner className="fa-spin" /> Entrando...
                  </>
                ) : (
                  <>
                    Entrar <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="footer-links">
              <Link to="/cadastro">
                Criar conta gratuita
              </Link>
              <Link to="/esqueci-senha">
                Esqueci a senha
              </Link>
            </div>
          </div>
        </div>

        <footer className="brand-footer">
          <FaShieldAlt /> Sistema seguro • Dados protegidos • Acesso instantâneo
        </footer>
      </div>
    </div>
  );
}

export default Login;