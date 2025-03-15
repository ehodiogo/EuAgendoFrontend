import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);

  const isAuthenticated =
    localStorage.getItem("access_token") !== null &&
    localStorage.getItem("refresh_token") !== null;

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setCartItemCount(cart.length);
  }, []);

  const handleLogout = () => {
    // Remove os dados de autenticação
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("last_login_time");

    // Redireciona para a página de login
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          <img
            src="/eu-agendo-ico.ico"
            alt="Logo"
            style={{ width: "40px", height: "40px", marginRight: "10px" }}
          />
          EuAgendo
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                className="btn btn-link nav-link"
                onClick={() => navigate("/sobre")}
              >
                Sobre
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-link nav-link"
                onClick={() => navigate("/planos")}
              >
                Planos
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-link nav-link"
                onClick={() => navigate("/contato")}
              >
                Contato
              </button>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <button
                    className="btn btn-warning px-4 fw-semibold"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </button>
                </li>
                <li className="nav-item position-relative">
                  <button
                    className="btn btn-light ms-2 position-relative"
                    onClick={() => navigate("/carrinho")}
                  >
                    <FaShoppingCart size={20} className="text-dark" />
                    {cartItemCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "0.75rem", padding: "4px 6px" }}
                      >
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </li>
                {/* Botão de logout */}
                <li className="nav-item ms-2">
                  <button
                    className="btn btn-danger px-4 fw-semibold"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </li>
              </>
            ) : null}
            {!isAuthenticated ? (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light px-4 fw-semibold"
                  onClick={() => navigate("/login")}
                >
                  Entrar
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
