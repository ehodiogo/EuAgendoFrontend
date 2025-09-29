import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);

  const isAuthenticated =
    localStorage.getItem("access_token") !== null &&
    localStorage.getItem("refresh_token") !== null;

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("carrinho") || "[]");
      setCartItemCount(cart.length);
    };

    updateCartCount();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "carrinho") {
        updateCartCount();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("last_login_time");
    navigate("/login");
  };

  return (
    <div className="navbar-container">
      <style>{`
        .navbar-container .custom-navbar {
          background-color: #003087 !important;
          padding: 1rem 0;
          transition: all 0.3s ease;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          max-height: 70px; /* Fixed navbar height */
          overflow: hidden; /* Prevent content from expanding navbar */
        }
        .navbar-container .navbar-brand {
          font-size: 1.5rem;
          color: #ffffff !important;
          transition: color 0.3s ease;
          padding: 0rem !important; /* Removed padding to save space */
          display: flex;
          align-items: center; /* Center logo vertically */
          overflow: hidden; /* Prevent logo from overflowing */
        }
        .navbar-container .navbar-brand:hover {
          color: #e6f0fa !important;
        }
        .navbar-container .nav-link {
          color: #ffffff !important;
          font-weight: 500;
          padding: 0.5rem 1rem !important;
          transition: color 0.3s ease, background-color 0.3s ease;
        }
        .navbar-container .nav-link:hover {
          color: #4dabf7 !important;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .navbar-container .btn-outline-primary {
          border-color: #4dabf7;
          color: #4dabf7;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .navbar-container .btn-primary {
          background-color: #003087;
          border-color: #003087;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .navbar-container .btn-outline-danger {
          border-color: #dc3545;
          color: #dc3545;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .navbar-container .btn-outline-primary:hover,
        .navbar-container .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 48, 135, 0.3);
          background-color: #0040c1;
          border-color: #0040c1;
          color: #ffffff;
        }
        .navbar-container .btn-outline-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
          background-color: #dc3545;
          color: #ffffff;
        }
        .navbar-container .cart-badge {
          font-size: 0.7rem;
          padding: 4px 6px;
          line-height: 1;
          background-color: #dc3545;
        }
        .navbar-container .navbar-toggler {
          border: none;
          padding: 0.5rem;
        }
        .navbar-container .navbar-toggler:focus {
          outline: none;
          box-shadow: none;
        }
        .navbar-container .dropdown-menu {
          background-color: #ffffff;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          min-width: 200px;
        }
        .navbar-container .dropdown-item {
          padding: 0.75rem 1.25rem;
          transition: background-color 0.3s ease;
          color: #003087;
        }
        .navbar-container .dropdown-item:hover {
          background-color: rgba(77, 171, 247, 0.1);
          color: #003087;
        }
        .navbar-container .logo-img {
          width: 120px; /* Increased logo size */
          height: 120px;
          object-fit: contain; /* Ensure logo scales without stretching navbar */
        }
        @media (max-width: 991px) {
          .navbar-container .custom-navbar {
            max-height: none; /* Allow navbar to expand on mobile */
          }
          .navbar-container .navbar-nav {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
          .navbar-container .nav-item {
            margin-bottom: 0.5rem;
          }
          .navbar-container .btn {
            width: 100%;
            text-align: left;
            justify-content: start;
          }
          .navbar-container .dropdown-menu {
            position: static !important;
            transform: none !important;
            background-color: rgba(255, 255, 255, 0.95);
          }
          .navbar-container .logo-img {
            width: 100px; /* Slightly smaller logo on mobile */
            height: 100px;
          }
        }
      `}</style>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm custom-navbar">
        <div className="container-fluid px-4">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src="/vem-agendar.png"
              alt="Logo VemAgendar"
              className="me-2 logo-img" // Added class for specific styling
            />
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
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-light px-3"
                  onClick={() => navigate("/sobre")}
                  aria-label="Navegar para a página Sobre"
                >
                  Sobre
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-light px-3"
                  onClick={() => navigate("/planos")}
                  aria-label="Navegar para a página Planos"
                >
                  Planos
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-light px-3"
                  onClick={() => navigate("/contato")}
                  aria-label="Navegar para a página Contato"
                >
                  Contato
                </button>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <button
                      className="btn btn-primary px-4 mx-2 fw-semibold"
                      onClick={() => navigate("/dashboard")}
                      aria-label="Navegar para o Dashboard"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li className="nav-item position-relative">
                    <button
                      className="btn btn-outline-light mx-2 position-relative"
                      onClick={() => navigate("/carrinho")}
                      aria-label={`Navegar para o carrinho com ${cartItemCount} itens`}
                    >
                      <FaShoppingCart size={20} />
                      {cartItemCount > 0 && (
                        <span className="badge rounded-pill position-absolute top-0 start-100 translate-middle cart-badge">
                          {cartItemCount}
                        </span>
                      )}
                    </button>
                  </li>
                  <li className="nav-item dropdown">
                    <button
                      className="btn btn-link nav-link dropdown-toggle d-flex align-items-center text-light px-3"
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      aria-label="Menu do usuário"
                    >
                      <FaUserCircle size={24} className="me-2" />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => navigate("/perfil")}
                        >
                          Perfil
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => navigate("/configuracoes")}
                        >
                          Configurações
                        </button>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button
                          className="dropdown-item text-danger d-flex align-items-center"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className="me-2" />
                          Sair
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <button
                    className="btn btn-outline-primary px-4 mx-2 fw-semibold"
                    onClick={() => navigate("/login")}
                    aria-label="Navegar para a página de login"
                  >
                    Entrar
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;