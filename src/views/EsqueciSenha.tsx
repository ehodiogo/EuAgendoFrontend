import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "aos/dist/aos.css";
import AOS from "aos";
import Navbar from "../components/Navbar";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/password-recovery/",
        {
          email: email,
        }
      );

      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      setError("Erro ao enviar o link de recuperação. Verifique o email.");
      console.error("Erro no envio do link", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card shadow-lg border-0 p-5"
          style={{ maxWidth: "450px", width: "100%" }}
          data-aos="fade-up"
        >
          <h2 className="text-primary mb-4 text-center fw-bold">
            🔄 Recuperar Senha
          </h2>
          <form onSubmit={handlePasswordRecovery}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-success w-100 mb-3"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Link de Recuperação"}
            </button>
          </form>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && (
            <div className="alert alert-success">
              Link de recuperação enviado!
            </div>
          )}
          <div className="d-flex justify-content-center">
            <Link to="/login" className="text-primary">
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
