import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSignOutAlt, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

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
      if (e.key === "carrinho") updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("last_login_time");
    navigate("/login");
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (e.shiftKey || e.ctrlKey) return;
    e.preventDefault();
    setIsOpen(false);
    setTimeout(() => navigate(path), 150);
  };

  return (
    <>
      <style>{`
        :root {
          --primary: #003087;
          --accent: #f6c107;
          --white: #ffffff;
          --shadow-sm: 0 4px 12px rgba(0,0,0,0.08);
          --transition: all 0.3s ease;
        }

        .navbar-custom {
          background: var(--primary) !important;
          padding: 0.75rem 0;
          min-height: 68px;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 1050;
        }

        .navbar-brand {
          font-weight: 700;
          font-size: 1.5rem;
          color: white !important;
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .navbar-brand:hover { color: var(--accent) !important; }

        .logo-img {
          height: 42px;
          margin-right: 0.75rem;
        }

        .nav-link {
          color: white !important;
          font-weight: 500;
          padding: 0.5rem 1rem !important;
          border-radius: 8px;
          transition: var(--transition);
        }
        .nav-link:hover {
          color: var(--accent) !important;
          background: rgba(255,255,255,0.1);
        }

        .btn-cta {
          background: var(--accent);
          color: #212529;
          font-weight: 700;
          padding: 0.65rem 1.8rem;
          border-radius: 12px;
          font-size: 0.95rem;
          border: none;
          box-shadow: 0 4px 15px rgba(246,193,7,0.3);
          transition: var(--transition);
        }
        .btn-cta:hover {
          background: #e0a800;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(246,193,7,0.4);
        }

        .cart-btn {
          position: relative;
          width: 44px; height: 44px;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: var(--transition);
        }
        .cart-btn:hover {
          background: var(--accent);
          color: #212529;
        }

        .cart-badge {
          position: absolute;
          top: -6px; right: -6px;
          background: #dc3545;
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          min-width: 18px; height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pop 0.3s ease-out;
        }
        @keyframes pop { 0% { transform: scale(0); } 100% { transform: scale(1); } }

        .user-btn {
          background: none;
          border: none;
          color: white;
          width: 44px; height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-btn:hover { background: rgba(255,255,255,0.15); }

        .hamburger {
          width: 44px; height: 44px;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: none;
        }
        .hamburger:hover {
          background: var(--accent);
          color: #212529;
        }

        /* MOBILE MENU */
        .mobile-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1040;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .mobile-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu {
          position: fixed;
          top: 0; right: -100%;
          width: 280px; height: 100vh;
          background: var(--primary);
          z-index: 1041;
          padding: 5rem 1.5rem 2rem;
          transition: right 0.4s ease;
          box-shadow: -8px 0 25px rgba(0,0,0,0.2);
        }
        .mobile-menu.open { right: 0; }

        .mobile-menu .nav-link {
          color: white;
          font-size: 1.3rem;
          font-weight: 500;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: block;
        }
        .mobile-menu .btn-cta {
          margin-top: 1.5rem;
          width: 100%;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container-fluid px-4">
          {/* LOGO */}
          <a href="/" className="navbar-brand" onClick={(e) => handleLinkClick(e, "/")}>
            <img src="/vem-agendar.png" alt="VemAgendar" className="logo-img" />
            VemAgendar
          </a>

          {/* TOGGLE MOBILE */}
          <button
            className="d-lg-none hamburger"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

          {/* DESKTOP MENU */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              <li className="nav-item">
                <a className="nav-link" href="/sobre" onClick={(e) => handleLinkClick(e, "/sobre")}>Sobre</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/planos" onClick={(e) => handleLinkClick(e, "/planos")}>Planos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contato" onClick={(e) => handleLinkClick(e, "/contato")}>Contato</a>
              </li>

              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <a href="/dashboard" className="btn-cta" onClick={(e) => handleLinkClick(e, "/dashboard")}>
                      Dashboard
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/carrinho" className="cart-btn" onClick={(e) => handleLinkClick(e, "/carrinho")}>
                      <FaShoppingCart size={20} />
                      {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                    </a>
                  </li>
                  <li className="nav-item dropdown">
                    <button
                      className="user-btn"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FaUserCircle size={26} />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><a className="dropdown-item" href="/perfil" onClick={(e) => handleLinkClick(e, "/perfil")}>Perfil</a></li>
                      <li><a className="dropdown-item" href="/configuracoes" onClick={(e) => handleLinkClick(e, "/configuracoes")}>Configurações</a></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item text-danger d-flex align-items-center" onClick={handleLogout}>
                          <FaSignOutAlt className="me-2" /> Sair
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <a href="/login" className="btn-cta" onClick={(e) => handleLinkClick(e, "/login")}>
                    Entrar
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU LATERAL */}
      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}></div>
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <a className="nav-link" href="/sobre" onClick={(e) => handleLinkClick(e, "/sobre")}>Sobre</a>
        <a className="nav-link" href="/planos" onClick={(e) => handleLinkClick(e, "/planos")}>Planos</a>
        <a className="nav-link" href="/contato" onClick={(e) => handleLinkClick(e, "/contato")}>Contato</a>
        {isAuthenticated ? (
          <>
            <a className="nav-link" href="/dashboard" onClick={(e) => handleLinkClick(e, "/dashboard")}>Dashboard</a>
            <a className="nav-link d-flex align-items-center gap-2" href="/carrinho" onClick={(e) => handleLinkClick(e, "/carrinho")}>
              <FaShoppingCart /> Carrinho {cartItemCount > 0 && `(${cartItemCount})`}
            </a>
            <button className="nav-link text-danger text-start border-0 bg-transparent p-0" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Sair
            </button>
          </>
        ) : (
          <a href="/login" className="btn-cta d-block text-center" onClick={(e) => handleLinkClick(e, "/login")}>
            Entrar
          </a>
        )}
      </div>
    </>
  );
};

export default Navbar;