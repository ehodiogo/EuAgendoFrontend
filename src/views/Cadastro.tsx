import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaUser, FaEnvelope, FaKey, FaEye, FaEyeSlash, FaLink, FaSpinner } from "react-icons/fa6"; // Atualizado para Fa6
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

      const response = await axios.post(url + "/api/register/", {
        username: email,
        first_name: name,
        email: email,
        password: password,
        codigo_usado: referralCode || null,
      });

      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Erro ao registrar. Por favor, verifique seus dados e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 70px);
          padding: 2rem 1rem;
        }

        /* Cartão de Registro */
        .register-card {
          background-color: var(--white);
          border-radius: 20px;
          box-shadow: 0 10px 30px var(--shadow-color);
          padding: 3rem;
          max-width: 480px; /* Um pouco maior para caber mais campos */
          width: 100%;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          border-top: 5px solid var(--primary-blue);
        }
        .register-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }
        .register-card h2 {
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
        .register-card h2 svg {
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
          padding: 1rem 1rem 1rem 3rem; /* Espaço para o ícone */
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

        .password-toggle {
          position: absolute;
          top: 50%;
          right: 1rem;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--accent-blue);
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0.5rem;
          z-index: 10;
        }
        .password-toggle:hover {
          color: var(--primary-blue);
        }
        
        /* Botão de Submit com Gradiente */
        .submit-btn {
          background: linear-gradient(135deg, var(--success-green), #218838);
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
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
          margin-top: 1rem;
        }
        .submit-btn:hover {
          background: linear-gradient(135deg, #218838, var(--success-green));
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
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
        }
        .link-container a:hover {
          color: var(--primary-blue);
          text-decoration: underline;
        }

        @media (max-width: 576px) {
          .register-card {
            padding: 2rem 1.5rem;
          }
          .register-card h2 {
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
          .input-icon .left-icon, .password-toggle {
            font-size: 1rem;
            left: 0.75rem;
          }
          .password-toggle {
            right: 0.75rem;
          }
        }
      `}</style>

      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="register-container">
          <div className="register-card">
            <h2>
              <FaPlusCircle /> Nova Conta
            </h2>
            <form onSubmit={handleRegister}>
              <div className="input-icon">
                <label htmlFor="name" className="form-label">
                  Nome Completo
                </label>
                <FaUser className="left-icon" />
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

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
                  placeholder="Seu melhor e-mail"
                  required
                />
              </div>

              <div className="input-icon">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <FaKey className="left-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crie uma senha forte"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="input-icon">
                <label htmlFor="referral-code" className="form-label">
                  Código de Indicação (Opcional)
                </label>
                <FaLink className="left-icon" />
                <input
                  type="text"
                  className="form-control"
                  id="referral-code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Código do seu amigo (se houver)"
                />
              </div>

              {error && <div className="alert-danger">{error}</div>}

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <FaSpinner className="fa-spin" /> Registrando...
                  </>
                ) : (
                  "Criar minha conta"
                )}
              </button>
            </form>

            <div className="link-container">
              <Link to="/login">Já tem uma conta? Faça login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;