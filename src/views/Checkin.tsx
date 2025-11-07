import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import Navbar from "../components/Navbar";
import { FaBuilding, FaMagnifyingGlass, FaLocationDot } from "react-icons/fa6";
import {FaExclamationCircle} from "react-icons/fa";

const SkeletonCard: React.FC = () => (
  <div className="empresa-card">
    <div className="card-img-container">
      <div className="skeleton skeleton-img"></div>
    </div>
    <div className="skeleton skeleton-title mt-3" style={{ height: '1.5rem', width: '80%' }}></div>
    <div className="skeleton skeleton-text mt-2" style={{ height: '1rem', width: '60%' }}></div>
  </div>
);

function CheckIn() {
  const token = localStorage.getItem("access_token");
  const { data: empresas_usuario, loading } = useFetch<Empresa[]>(
    `/api/empresas-usuario/?usuario_token=${token}`
  );
  const [search, setSearch] = useState("");

  const filteredEmpresas = empresas_usuario?.filter((empresa: Empresa) =>
    empresa.nome.toLowerCase().includes(search.toLowerCase()) ||
    empresa.cidade.toLowerCase().includes(search.toLowerCase()) ||
    empresa.estado.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hero-bg min-vh-100">
      <style>{`
        :root {
          --primary: #003087;
          --primary-dark: #00205b;
          --accent: #f6c107;
          --success: #28a745;
          --danger: #dc3545;
          --info: #0056b3;
          --gray-100: #f8f9fa;
          --gray-200: #e9ecef;
          --gray-600: #6c757d;
          --white: #ffffff;
          --shadow-sm: 0 4px 12px rgba(0,0,0,0.08);
          --shadow-md: 0 8px 25px rgba(0,0,0,0.15);
          --shadow-lg: 0 15px 40px rgba(0,0,0,0.25);
          --radius: 24px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }

        .hero-bg {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 80%, rgba(246,193,7,0.15), transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1), transparent 50%);
          pointer-events: none;
        }

        .checkin-header {
          padding: 3rem 1rem;
          text-align: center;
          color: white;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.8s ease-out;
        }
        .checkin-header h1 {
          font-weight: 800;
          font-size: 2.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          text-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .checkin-header p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 800px;
          margin: 1rem auto 0;
        }

        .search-section {
          background: white;
          padding: 2.5rem 1rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          position: relative;
          z-index: 1;
        }
        .search-wrapper {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .search-input-group {
          flex: 1;
          min-width: 280px;
          display: flex;
          border: 2px solid var(--gray-200);
          border-radius: 16px;
          overflow: hidden;
          transition: var(--transition);
        }
        .search-input-group:focus-within {
          border-color: var(--info);
          box-shadow: 0 0 0 4px rgba(0, 86, 179, 0.2);
        }
        .search-input-group .input-prefix {
          background: var(--gray-100);
          padding: 0 1rem;
          display: flex;
          align-items: center;
          color: var(--info);
        }
        .search-input {
          border: none;
          padding: 1rem;
          font-size: 1.1rem;
          flex: 1;
          outline: none;
        }
        .btn-clear {
          background: var(--info);
          color: white;
          border: none;
          padding: 0 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-clear:hover {
          background: #004494;
          transform: translateY(-2px);
        }

        .checkin-container {
          padding: 3rem 1rem;
          position: relative;
          z-index: 1;
        }
        .section-title {
          text-align: center;
          color: white;
          font-weight: 700;
          font-size: 1.9rem;
          margin-bottom: 2.5rem;
          text-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .empresas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .empresa-card {
          background: white;
          border-radius: var(--radius);
          padding: 2rem;
          box-shadow: var(--shadow-md);
          border-top: 6px solid var(--accent);
          transition: var(--transition);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: inherit;
          animation: fadeInUp 0.6s ease-out;
        }
        .empresa-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-top-color: var(--info);
        }

        .card-img-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 1.5rem;
          border: 4px solid var(--info);
          box-shadow: var(--shadow-sm);
        }
        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .card-img-placeholder {
          width: 100%;
          height: 100%;
          background: var(--gray-100);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--info);
          font-size: 2.5rem;
        }

        .card-title {
          color: var(--primary);
          font-weight: 700;
          font-size: 1.5rem;
          margin: 0 0 0.5rem;
          text-align: center;
        }
        .card-location {
          color: var(--gray-600);
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .btn-checkin {
          background: linear-gradient(135deg, var(--success), #1e7e34);
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: none;
          box-shadow: 0 6px 16px rgba(40,167,69,0.3);
          transition: var(--transition);
        }
        .btn-checkin:hover {
          background: linear-gradient(135deg, #1e7e34, var(--success));
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(40,167,69,0.4);
        }

        .message {
          background: white;
          border-radius: var(--radius);
          padding: 3rem;
          text-align: center;
          box-shadow: var(--shadow-md);
          max-width: 600px;
          margin: 2rem auto;
          border-top: 6px solid var(--accent);
          animation: fadeInUp 0.6s ease-out;
        }
        .message.loading {
          color: var(--info);
        }
        .message.warning {
          color: #d97706;
          border-top-color: #fbbf24;
        }
        .message svg {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }
        .skeleton-img { width: 80px; height: 80px; border-radius: 50%; }
        .skeleton-title { height: 1.5rem; border-radius: 8px; }
        .skeleton-text { height: 1rem; border-radius: 8px; }

        @media (max-width: 768px) {
          .checkin-header h1 { font-size: 2.2rem; }
          .search-wrapper { flex-direction: column; align-items: stretch; }
          .search-input-group { min-width: auto; }
          .empresas-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 576px) {
          .checkin-header { padding: 2rem 1rem; }
          .checkin-header h1 { font-size: 1.9rem; }
          .search-section { padding: 2rem 1rem; }
          .empresa-card { padding: 1.5rem; }
          .card-img-container { width: 60px; height: 60px; }
          .card-title { font-size: 1.3rem; }
        }
      `}</style>

      <Navbar />

      <header className="checkin-header">
        <div className="container">
          <h1>
            <FaBuilding /> Painel de Check-In
          </h1>
          <p>
            Selecione uma empresa para gerenciar os check-ins de hoje.
          </p>
        </div>
      </header>

      <section className="search-section">
        <div className="container">
          <div className="search-wrapper">
            <div className="search-input-group">
              <span className="input-prefix"><FaMagnifyingGlass /></span>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por nome, cidade ou estado..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar empresas"
              />
            </div>
            {search && (
              <button className="btn-clear" onClick={() => setSearch("")}>
                Limpar
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="checkin-container">
        <div className="container">
          <h2 className="section-title">Suas Empresas</h2>

          {loading ? (
            <div className="empresas-grid">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredEmpresas && filteredEmpresas.length > 0 ? (
            <div className="empresas-grid">
              {filteredEmpresas.map((empresa) => (
                <Link
                  key={empresa.id}
                  to={`/checkin/empresa/${empresa.id}`}
                  className="text-decoration-none"
                >
                  <div className="empresa-card">
                    <div className="card-img-container">
                      {empresa.logo ? (
                        <img src={empresa.logo} alt={empresa.nome} className="card-img" />
                      ) : (
                        <div className="card-img-placeholder"><FaBuilding /></div>
                      )}
                    </div>
                    <h3 className="card-title">{empresa.nome}</h3>
                    <p className="card-location">
                      <FaLocationDot /> {empresa.cidade}, {empresa.estado}
                    </p>
                    <button className="btn-checkin">
                      Acessar Check-In
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="message warning">
              <FaExclamationCircle />
              <p>Nenhuma empresa encontrada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckIn;