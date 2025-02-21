import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import Navbar from "../components/Navbar";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recuperação de senha com email:", email);
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      {/* Página de Recuperação de Senha */}
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
            <button type="submit" className="btn btn-success w-100 mb-3">
              Enviar Link de Recuperação
            </button>
          </form>
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
