import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const isAuthenticated =
    localStorage.getItem("access_token") !== null &&
    localStorage.getItem("refresh_token") !== null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          <img
            src="eu-agendo-ico.ico"
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
              <li className="nav-item">
                <button
                  className="btn btn-warning px-4 fw-semibold"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
              </li>
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
