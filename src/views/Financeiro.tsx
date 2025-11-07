import { useState } from "react";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import Navbar from "../components/Navbar";
import FinanceiroDados from "../components/FinanceiroDados";
import { FaChartBar, FaSpinner, FaBuilding, FaChevronDown } from "react-icons/fa6";

const Financeiro = () => {
  const token = localStorage.getItem("access_token");
  const { data: empresas, loading } = useFetch<Empresa[]>(`/api/empresas-usuario/?usuario_token=${token}`);
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);

  const handleToggleDropdown = (empresaId: number) => {
    setDropdownAberto(prev => (prev === empresaId ? null : empresaId));
  };

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
          --radius: 20px;
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

        .financeiro-container {
          padding: 4rem 1rem 3rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.8s ease-out;
        }

        .financeiro-header {
          text-align: center;
          color: white;
          margin-bottom: 3rem;
        }
        .financeiro-header h1 {
          font-weight: 800;
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          text-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .financeiro-header p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 800px;
          margin: 1rem auto 0;
        }

        .empresa-card {
          background: white;
          border-radius: var(--radius);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          border-top: 6px solid var(--accent);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: fadeInUp 0.6s ease-out;
          margin-bottom: 1.5rem;
        }
        .empresa-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
          border-top-color: var(--info);
        }
        .empresa-card.active {
          border-top-color: var(--info);
          box-shadow: 0 12px 30px rgba(0, 86, 179, 0.25);
        }

        .empresa-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .empresa-icon {
          color: var(--info);
          font-size: 2.2rem;
        }
        .empresa-title {
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--primary);
          margin: 0;
        }

        .toggle-icon {
          color: var(--info);
          font-size: 1.4rem;
          transition: transform 0.3s ease;
        }
        .empresa-card.active .toggle-icon {
          transform: rotate(180deg);
        }

        .dropdown-wrapper {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dropdown-wrapper.open {
          max-height: 3000px;
        }

        .dropdown-content {
          background: white;
          border-radius: 0 0 var(--radius) var(--radius);
          padding: 2rem;
          border-top: 3px dashed var(--gray-200);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          margin-top: -1px;
        }

        .loading-container {
          text-align: center;
          padding: 4rem 2rem;
          color: white;
        }
        .loading-container .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .no-results {
          text-align: center;
          padding: 5rem 2rem;
          background: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          max-width: 600px;
          margin: 3rem auto;
          animation: fadeInUp 0.6s ease-out;
        }
        .no-results h3 {
          color: var(--primary);
          font-weight: 700;
        }

        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }
        .skeleton-card {
          padding: 1.5rem;
          border-radius: var(--radius);
          background: white;
          box-shadow: var(--shadow-md);
          border-top: 6px solid var(--accent);
          margin-bottom: 1.5rem;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .skeleton-icon { width: 50px; height: 50px; border-radius: 50%; }
        .skeleton-line { height: 1.5rem; width: 60%; border-radius: 8px; }
        .skeleton-toggle { width: 24px; height: 24px; border-radius: 50%; }

        @media (max-width: 768px) {
          .financeiro-header h1 { font-size: 2rem; }
          .empresa-card { padding: 1.2rem; }
          .empresa-title { font-size: 1.3rem; }
          .financeiro-container { padding: 3rem 1rem; }
        }
      `}</style>

      <Navbar />

      <div className="financeiro-container container">
        <header className="financeiro-header">
          <h1>
            <FaChartBar /> Seus Dados Financeiros
          </h1>
          <p>
            Clique em uma empresa para expandir e visualizar relatórios completos, faturamento e métricas.
          </p>
        </header>

        {loading ? (
          <div className="loading-container">
            <FaSpinner className="spinner" size={48} />
            <p className="mt-3 h5">Carregando suas empresas...</p>
          </div>
        ) : !empresas || empresas.length === 0 ? (
          <div className="no-results">
            <FaBuilding size={56} className="text-warning mb-3" />
            <h3>Nenhuma empresa encontrada</h3>
            <p className="text-muted">
              Verifique se você está logado ou se há empresas vinculadas ao seu perfil.
            </p>
          </div>
        ) : (
          <div>
            {empresas.map((empresa) => {
              const isOpen = dropdownAberto === empresa.id;
              return (
                <div key={empresa.id}>
                  {/* Card da Empresa */}
                  <div
                    className={`empresa-card ${isOpen ? "active" : ""}`}
                    onClick={() => handleToggleDropdown(empresa.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleToggleDropdown(empresa.id)}
                  >
                    <div className="empresa-info">
                      <FaBuilding className="empresa-icon" />
                      <h4 className="empresa-title">{empresa.nome}</h4>
                    </div>
                    <FaChevronDown className="toggle-icon" />
                  </div>

                  {/* Dropdown com FinanceiroDados */}
                  <div className={`dropdown-wrapper ${isOpen ? "open" : ""}`}>
                    <div className="dropdown-content">
                      <FinanceiroDados empresa_id={empresa.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Skeleton Loading (quando necessário no FinanceiroDados) */}
      {loading && (
        <div className="container mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="d-flex align-items-center gap-3 w-100">
                <div className="skeleton skeleton-icon"></div>
                <div className="flex-grow-1">
                  <div className="skeleton skeleton-line"></div>
                </div>
                <div className="skeleton skeleton-toggle"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Financeiro;