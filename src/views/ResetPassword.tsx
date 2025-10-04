import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaLock, FaSpinner, FaKey } from "react-icons/fa6";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem. Por favor, verifique.");
      setLoading(false);
      return;
    }

    try {
      const url = import.meta.env.VITE_API_URL;

      const response = await axios.post(url + "/api/reset-password/", {
        uid,
        token,
        new_password: newPassword,
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Erro ao redefinir a senha. O link pode ser inválido ou já foi usado."
      );
      console.error("Erro redefinição senha", err);
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

        .reset-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 70px);
          padding: 2rem 1rem;
        }

        /* Cartão de Reset */
        .reset-card {
          background-color: var(--white);
          border-radius: 20px;
          box-shadow: 0 10px 30px var(--shadow-color);
          padding: 3rem;
          max-width: 420px;
          width: 100%;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          border-top: 5px solid var(--primary-blue);
        }
        .reset-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }
        .reset-card h2 {
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
        .reset-card h2 svg {
            color: var(--primary-blue);
            font-size: 2.5rem;
        }
        .reset-card p {
            color: var(--dark-gray);
            text-align: center;
            margin-bottom: 2rem;
            font-size: 0.95rem;
        }


        .form-label {
          color: var(--dark-gray);
          font-weight: 700;
          font-size: 1.05rem;
          margin-bottom: 0.5rem;
          display: block;
          text-align: left;
        }

        /* Input com Ícone */
        .input-icon {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .input-icon svg {
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
        .form-control::placeholder {
          color: #a0aec0;
        }

        /* Botão de Submit com Gradiente (Consistente) */
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
        
        .link-container {
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
            text-align: center;
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

        /* Responsividade */
        @media (max-width: 576px) {
          .reset-card {
            padding: 2rem 1.5rem;
          }
          .reset-card h2 {
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
            font-size: 1rem;
            left: 0.75rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="reset-container">
          <div className="reset-card">
            <h2>
              <FaKey /> Redefinir Senha
            </h2>
            <p>
                Crie e confirme sua nova senha para acessar o sistema.
            </p>
            {uid && token ? (
                <form onSubmit={handleResetPassword}>
                <div className="input-icon">
                    <label htmlFor="newPassword" className="form-label">
                    Nova Senha
                    </label>
                    <FaLock />
                    <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite a nova senha"
                    required
                    />
                </div>
                <div className="input-icon">
                    <label htmlFor="confirmPassword" className="form-label">
                    Confirmar Senha
                    </label>
                    <FaLock />
                    <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme a nova senha"
                    required
                    />
                </div>
                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <FaSpinner className="fa-spin" /> Salvando...
                        </>
                    ) : (
                        "Redefinir Senha"
                    )}
                </button>
                </form>
            ) : (
                <div className="alert-danger">
                    O link de redefinição está incompleto ou inválido. Por favor, use o link completo enviado por e-mail.
                </div>
            )}

            {error && <div className="alert-danger">{error}</div>}
            {success && (
              <div className="alert-success">
                Senha redefinida com sucesso! Redirecionando para o Login...
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

export default ResetPassword;