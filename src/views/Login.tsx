import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import Navbar from "../components/Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login com", email, password);
  };

  return (
    <div className="bg-light min-vh-100">
      
      <Navbar />

      {/* Página de Login */}
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card shadow-lg border-0 p-5"
          style={{ maxWidth: "450px", width: "100%" }}
          data-aos="fade-up"
        >
          <h2 className="text-primary mb-4 text-center fw-bold">
            EuAgendo - Login🔑
          </h2>
          <form onSubmit={handleLogin}>
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
            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100 mb-3">
              Entrar
            </button>
          </form>

          <div className="d-flex justify-content-between">
            <Link to="/cadastro" className="text-primary">
              Criar conta
            </Link>
            <Link to="/esqueci-senha" className="text-primary">
              Esqueci minha senha
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
