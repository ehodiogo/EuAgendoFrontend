import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaLock } from "react-icons/fa";

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
      setError("As senhas não coincidem.");
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
        }, 2500);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Erro ao redefinir a senha. O link pode estar expirado."
      );
      console.error("Erro redefinição senha", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100">
      <style>{`
        :root {
          --primary-blue: #003087;
          --light-blue: #4dabf7;
          --white: #ffffff;
          --success-green: #28a745;
        }

        .custom-bg {
          background-color: #f7fafc;
        }

        .reset-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 70px);
        }

        .reset-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          padding: 2.5rem;
          max-width: 450px;
          width: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .reset-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }
        .reset-card h2 {
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
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .form-control:focus {
          border-color: var(--light-blue);
          outline: none;
          box-shadow: 0 0 0 0.2rem rgba(77, 171, 247, 0.25);
        }

        .submit-btn {
          background-color: var(--success-green);
          color: var(--white);
          font-weight: 600;
          padding: 0.75rem;
          border-radius: 8px;
          border: none;
          width: 100%;
        }
        .submit-btn:hover {
          background-color: #218838;
        }

        .alert-danger, .alert-success {
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          text-align: center;
          font-weight: 500;
        }
        .alert-danger {
          background-color: #f8d7da;
          color: #721c24;
        }
        .alert-success {
          background-color: #d4edda;
          color: #155724;
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="reset-container">
          <div className="reset-card">
            <h2>
              <FaLock /> Redefinir Senha
            </h2>
            <form onSubmit={handleResetPassword}>
              <div className="mb-3 input-icon">
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
              <div className="mb-3 input-icon">
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
                {loading ? "Salvando..." : "Redefinir Senha"}
              </button>
            </form>
            {error && <div className="alert-danger">{error}</div>}
            {success && (
              <div className="alert-success">
                Senha redefinida com sucesso! Redirecionando...
              </div>
            )}
            <div className="link-container" style={{ marginTop: "1rem", textAlign: "center" }}>
              <Link to="/login">Voltar ao Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
