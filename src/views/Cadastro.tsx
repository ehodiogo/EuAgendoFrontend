import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "aos/dist/aos.css";
import AOS from "aos";
import Navbar from "../components/Navbar";
import { FaUser, FaEnvelope, FaKey, FaEye, FaEyeSlash, FaLink } from "react-icons/fa";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(""); // New state for referral code
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const url = window.location.origin.includes("localhost:5173")
        ? "http://localhost:8000"
        : "https://backend-production-6587.up.railway.app";

      const response = await axios.post(url + "/api/register/", {
        username: email,
        first_name: name,
        email: email,
        password: password,
        codigo_usado: referralCode || null, // Include referral code, send null if empty
      });

      console.log("Register", response);

      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Erro ao registrar. Verifique os dados e tente novamente."
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
        :root {
          --primary-blue: #003087;
          --light-blue: #4dabf7;
          --dark-gray: #2d3748;
          --light-gray: #f7fafc;
          --white: #ffffff;
          --accent-yellow: #f6c107;
          --success-green: #28a745;
        }

        .custom-bg {
          background-color: var(--light-gray);
        }

        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 70px);
        }

        .register-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
          max-width: 450px;
          width: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .register-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .register-card h2 {
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
        .form-control {
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
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

        .input-icon {
          position: relative;
        }
        .input-icon .left-icon {
          position: absolute;
          top: 50%;
          left: 0.75rem;
          transform: translateY(-50%);
          color: var(--light-blue);
          font-size: 1.2rem;
          pointer-events: none;
        }

        .password-toggle {
          position: absolute;
          top: 50%;
          right: 0.75rem;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--light-blue);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0;
        }
        .password-toggle:hover {
          color: var(--primary-blue);
        }

        @media (max-width: 576px) {
          .register-card {
            padding: 1.5rem;
            margin: 0 1rem;
          }
          .register-card h2 {
            font-size: 1.5rem;
          }
          .form-control {
            font-size: 0.9rem;
            padding-left: 2.25rem;
          }
          .submit-btn {
            font-size: 0.9rem;
          }
          .input-icon .left-icon {
            font-size: 1rem;
            left: 0.5rem;
          }
          .password-toggle {
            font-size: 1rem;
            right: 0.5rem;
          }
        }
      `}</style>

      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="register-container">
          <div className="register-card" data-aos="fade-up">
            <h2>
              <FaUser /> Criar Conta
            </h2>
            <form onSubmit={handleRegister}>
              <div className="mb-3 input-icon">
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
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div className="mb-3 input-icon">
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
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>

              <div className="mb-3 input-icon">
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
                  placeholder="Digite sua senha"
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

              <div className="mb-3 input-icon">
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
                  placeholder="Digite o código de indicação"
                />
              </div>

              {error && <div className="alert-danger">{error}</div>}

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar"}
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