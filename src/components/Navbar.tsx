import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("auth") === "true";

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            EuAgendo
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
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
              <li className="nav-item">
                {isAuthenticated ? (
                  <button
                    className="btn btn-warning px-4 fw-semibold"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-light px-4 fw-semibold"
                    onClick={() => navigate("/login")}
                  >
                    Entrar
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
}

export default Navbar;