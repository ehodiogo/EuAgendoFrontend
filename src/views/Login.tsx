import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "aos/dist/aos.css";
import AOS from "aos";
import Navbar from "../components/Navbar";
import { FaKey, FaEnvelope } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

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
      localStorage.setItem("is_expired_plan", is_expired_plan);
      localStorage.setItem("tempo_restante", tempo_restante);

      navigate("/dashboard");
    } catch (err) {
      setError("Credenciais inválidas ou erro ao autenticar.");
      console.error("Erro no login", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100">
      <style>{`
        :root {
          --primary-blue: #003087;
          --light-blue: #4dabf7;
          --dark-gray: #2d3748;
          --light-gray: #f7fafc;
          --white: #ffffff;
          --success-green: #28a745;
        }

        .custom-bg {
          background-color: var(--light-gray);
        }

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 70px);
        }

        .login-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
          max-width: 450px;
          width: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .login-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .login-card h2 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .form-label {
          color: var(--primary-blue);
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        /* Wrapper para ícone + input */
        .input-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon svg {
          position: absolute;
          left: 0.75rem;
          color: var(--light-blue);
          font-size: 1.2rem;
          pointer-events: none;
        }
        .form-control {
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          font-size: 1rem;
          width: 100%;
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

        .link-container {
          display: flex;
          justify-content: space-between;
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

        @media (max-width: 576px) {
          .login-card {
            padding: 1.5rem;
            margin: 0 1rem;
          }
          .login-card h2 {
            font-size: 1.5rem;
          }
          .form-control {
            font-size: 0.9rem;
            padding-left: 2.25rem;
          }
          .submit-btn {
            font-size: 0.9rem;
          }
          .link-container {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          .input-icon svg {
            font-size: 1rem;
            left: 0.5rem;
          }
        }
      `}</style>

      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="login-container">
          <div className="login-card" data-aos="fade-up">
            <h2>
              <FaKey /> VemAgendar - Login
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
                    placeholder="Digite seu e-mail"
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
                    placeholder="Digite sua senha"
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
                {isLoading ? "Entrando..." : "Entrar"}
              </button>
            </form>
            <div className="link-container">
              <Link to="/cadastro">Criar conta</Link>
              <Link to="/esqueci-senha">Esqueci minha senha</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
