import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "aos/dist/aos.css";
import AOS from "aos";
import Navbar from "../components/Navbar";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        username: email,
        first_name: name,
        email: email,
        password: password,
      });

      console.log("Resposta do registro", response.data);

      navigate("/login");
    } catch (err) {
      setError("Erro ao registrar. Tente novamente.");
      console.error("Erro no registro", err);
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
            📝 Criar Conta
          </h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-success w-100 mb-3">
              Registrar
            </button>
          </form>
          <div className="d-flex justify-content-center">
            <Link to="/login" className="text-primary">
              Já tem uma conta? Faça login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
