import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaUser, FaEnvelope, FaKey, FaEye, FaEyeSlash, FaLink, FaSpinner, FaExclamation, FaArrowRight, FaGift } from "react-icons/fa6";
import {FaPlusCircle} from "react-icons/fa";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const url = import.meta.env.VITE_API_URL;
      await axios.post(`${url}/api/register/`, {
        username: email,
        first_name: name,
        email,
        password,
        codigo_usado: referralCode || null,
      });

      navigate("/login", {
        state: {
          successMessage: "Conta criada com sucesso! Verifique seu e-mail para ativar sua conta.",
        },
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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

        .register-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          position: relative;
          z-index: 1;
        }

        .register-card {
          background: white;
          border-radius: var(--radius);
          padding: 3rem 2.5rem;
          max-width: 500px;
          width: 100%;
          box-shadow: var(--shadow-lg);
          border-top: 6px solid var(--accent);
          animation: fadeInUp 0.8s ease-out;
          position: relative;
          overflow: hidden;
        }
        .register-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 6px;
          background: linear-gradient(90deg, var(--primary), var(--info), var(--accent));
        }

        .register-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .register-header h1 {
          color: #1a1a1a;
          font-weight: 800;
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 0;
        }
        .register-header .icon {
          color: var(--primary);
          font-size: 2.8rem;
        }
        .register-header p {
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
        .form-control:focus ~ .input-icon {
          color: var(--primary);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--info);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.5rem;
          transition: var(--transition);
        }
        .password-toggle:hover {
          color: var(--primary);
        }

        .referral-group {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border: 1px dashed var(--accent);
          border-radius: 16px;
          padding: 1.5rem;
          margin: 1.5rem 0;
          text-align: center;
        }
        .referral-group .label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--primary);
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .referral-group p {
          color: var(--gray-600);
          font-size: 0.9rem;
          margin: 0 0 1rem;
        }

        .submit-btn {
          background: linear-gradient(135deg, var(--success), #1e7e34);
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
          box-shadow: 0 6px 16px rgba(40, 167, 69, 0.25);
        }
        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #1e7e34, var(--success));
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(40, 167, 69, 0.35);
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
          .register-card {
            padding: 2rem 1.5rem;
            margin: 1rem;
          }
          .register-header h1 {
            font-size: 2rem;
          }
          .form-control {
            padding: 0.9rem 0.9rem 0.9rem 2.8rem;
          }
          .input-icon, .password-toggle {
            font-size: 1.1rem;
          }
          .password-toggle { right: 0.8rem; }
          .referral-group { padding: 1.2rem; }
          .submit-btn { font-size: 1.05rem; }
        }
      `}</style>

      <div className="hero-bg">
        <Navbar />

        <div className="register-content">
          <div className="register-card">
            <div className="register-header">
              <h1>
                <FaPlusCircle className="icon" /> Crie sua Conta
              </h1>
              <p>Comece a gerenciar suas empresas com inteligência e controle total.</p>
            </div>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nome Completo</label>
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    required
                  />
                </div>
              </div>

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
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Ocultar" : "Mostrar"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="referral-group">
                <div className="label">
                  <FaGift /> Código de Indicação (Opcional)
                </div>
                <p>Ganhe benefícios extras com um código de amigo!</p>
                <div className="input-wrapper">
                  <FaLink className="input-icon" />
                  <input
                    type="text"
                    className="form-control"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="EX: ABC123"
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
                    <FaSpinner className="fa-spin" /> Criando conta...
                  </>
                ) : (
                  <>
                    Criar Conta <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="footer-links">
              <Link to="/login">
                Já tem conta? Faça login
              </Link>
            </div>
          </div>
        </div>

        <footer className="brand-footer">
          Cadastro grátis • Sem cartão • Ativação instantânea
        </footer>
      </div>
    </div>
  );
}

export default Register;