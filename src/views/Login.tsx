import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaKey, FaEnvelope, FaSpinner } from "react-icons/fa6";
import {FaSignInAlt} from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const url = import.meta.env.VITE_API_URL;

      const response = await axios.post(url + "/api/login/", {
        email,
        password,
      });

      const { access, refresh, is_expired_plan, tempo_restante } =
        response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("ultimo_acesso", new Date().getTime().toString());
      localStorage.setItem("is_expired_plan", is_expired_plan.toString());
      localStorage.setItem("tempo_restante", tempo_restante.toString());

      navigate("/dashboard");
    } catch (err) {
      setError("Credenciais inválidas. Verifique seu e-mail e senha.");
      console.error("Erro no login", err);
    } finally {
      setIsLoading(false);
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

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 70px);
          padding: 2rem 1rem;
        }

        /* Cartão de Login */
        .login-card {
          background-color: var(--white);
          border-radius: 20px;
          box-shadow: 0 10px 30px var(--shadow-color);
          padding: 3rem;
          max-width: 420px;
          width: 100%;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          border-top: 5px solid var(--primary-blue); /* Linha de destaque */
        }
        .login-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }
        .login-card h2 {
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
        .login-card h2 svg {
            color: var(--primary-blue);
            font-size: 2.5rem;
        }

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
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .input-icon svg {
          position: absolute;
          left: 1rem;
          color: var(--accent-blue);
          font-size: 1.1rem;
          pointer-events: none;
          transition: color 0.3s ease;
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
        .form-control:focus + svg {
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

        .alert-danger {
          background-color: #fcebeb;
          color: var(--danger-red);
          border: 1px solid #f9d7da;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 600;
        }

        .link-container {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
          font-size: 0.95rem;
        }
        .link-container a {
          color: var(--accent-blue);
          font-weight: 600;
          text-decoration: none;
        }
        .link-container a:hover {
          color: var(--primary-blue);
          text-decoration: underline;
        }

        @media (max-width: 576px) {
          .login-card {
            padding: 2rem 1.5rem;
          }
          .login-card h2 {
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
          .input-icon svg {
            left: 0.75rem;
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="login-container">
          <div className="login-card">
            <h2>
              <FaSignInAlt /> Acesso ao Sistema
            </h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <div className="input-icon">
                  <FaEnvelope />
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
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <div className="input-icon">
                  <FaKey />
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha secreta"
                    required
                  />
                </div>
              </div>

              {error && <div className="alert-danger">{error}</div>}

              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="fa-spin" /> Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>
            <div className="link-container">
              <Link to="/cadastro">Criar uma nova conta</Link>
              <Link to="/esqueci-senha">Esqueci minha senha</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;