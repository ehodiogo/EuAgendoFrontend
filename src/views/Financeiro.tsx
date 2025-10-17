import { useState } from "react";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import Navbar from "../components/Navbar";
import FinanceiroDados from "../components/FinanceiroDados";
import { FaChartBar, FaSpinner } from "react-icons/fa";
import { FaChevronDown, FaBuilding } from "react-icons/fa6";

const Financeiro = () => {
  const token = localStorage.getItem("access_token");
  const empresas_usuario = useFetch<Empresa[]>(
    `/api/empresas-usuario/?usuario_token=${token}`
  );
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);

  const handleToggleDropdown = (empresaId: number) => {
    if (dropdownAberto === empresaId) {
      setDropdownAberto(null);
      return;
    }
    setDropdownAberto(empresaId);
  };

  if (empresas_usuario.loading) {
    return (
        <div className="min-vh-100 custom-bg">
            <Navbar />
            <div className="financeiro-container container">
                <h1><FaChartBar /> Seus Dados Financeiros</h1>
                <div className="loading-container p-5 d-flex flex-column align-items-center justify-content-center">
                    <FaSpinner className="fa-spin text-primary mb-3" size={40} />
                    <p className="text-muted h5">Carregando empresas...</p>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-vh-100">
      <style>{`
        /* Paleta de cores */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --medium-gray: #6c757d;
          --light-gray-bg: #f5f7fa;
          --white: #ffffff;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --border-light: #e0e0e0;
          --skeleton-light: #e2e5e7;
          --skeleton-dark: #c9cdd1;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray-bg);
        }

        /* Container */
        .financeiro-container {
          padding: 3.5rem 0;
        }
        .financeiro-container h1 {
          color: var(--primary-blue);
          font-weight: 800;
          font-size: 2.5rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          text-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
        }
        .financeiro-container .lead {
          color: var(--medium-gray);
          font-size: 1.2rem;
          max-width: 900px;
          margin: 0 auto 3rem;
          text-align: center;
        }

        /* Cartões de empresa */
        .empresa-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          border: 2px solid var(--border-light);
          margin-bottom: 0; 
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .empresa-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
          border-color: var(--accent-blue);
        }
        
        /* Estado Ativo do Card */
        .empresa-card.active {
          border-color: var(--primary-blue);
          box-shadow: 0 4px 15px rgba(0, 48, 135, 0.15);
        }

        .empresa-card .card-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .empresa-card .card-icon {
            color: var(--primary-blue);
            font-size: 2.5rem;
        }
        .empresa-card .card-title {
          color: var(--dark-gray);
          font-weight: 700;
          font-size: 1.4rem;
          margin-bottom: 0;
        }
        .empresa-card .card-text {
          color: var(--medium-gray);
          font-size: 0.9rem;
          margin-bottom: 0;
        }

        /* Ícone de Toggle */
        .toggle-icon {
            font-size: 1.2rem;
            color: var(--primary-blue);
            transition: transform 0.3s ease;
        }
        .empresa-card.active .toggle-icon {
            transform: rotate(180deg);
        }

        /* Cartão de dropdown (Dados Financeiros) */
        .dropdown-wrapper {
            margin-top: 0;
            margin-bottom: 1.5rem;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease-in-out;
        }
        .dropdown-wrapper.open {
            max-height: 2000px;
            transition: max-height 0.7s ease-in-out;
        }
        .dropdown-card {
          background-color: var(--white);
          border-radius: 0 0 12px 12px;
          border-top: 3px dashed var(--border-light);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05);
          padding: 2rem;
          border-bottom: 2px solid var(--primary-blue);
        }
        
        /* Loading e erro */
        .loading-container, .error-container {
          text-align: center;
          color: var(--dark-gray);
          font-size: 1.25rem;
          padding: 2rem;
        }
        .error-container {
          color: var(--danger-red);
          font-weight: 500;
        }

        /* ------------------------------------- */
        /* Estilos do Skeleton Loader (para uso no FinanceiroDados) */
        .skeleton-line {
            background-color: var(--skeleton-light);
            animation: pulse 1.5s infinite ease-in-out;
            border-radius: 4px;
            height: 15px;
            width: 100%;
        }
        .skeleton-line.large {
            height: 30px;
            width: 60%;
            margin: 0 auto;
        }
        .skeleton-box {
            height: 120px;
            background-color: var(--skeleton-light);
            animation: pulse 1.5s infinite ease-in-out;
            border-radius: 8px;
        }
        @keyframes pulse {
            0% { background-color: var(--skeleton-light); }
            50% { background-color: var(--skeleton-dark); }
            100% { background-color: var(--skeleton-light); }
        }
        /* ------------------------------------- */

        /* Responsividade */
        @media (max-width: 991px) {
            .financeiro-container {
                padding: 2rem 1rem;
            }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="financeiro-container container">
          <h1>
            <FaChartBar /> Seus Dados Financeiros
          </h1>
          <p className="lead">
            Clique em uma empresa abaixo para expandir e visualizar todos os seus dados e relatórios financeiros.
          </p>

          {!empresas_usuario.data || empresas_usuario.data.length === 0 ? (
            <div className="error-container p-5 alert alert-info text-center d-flex flex-column align-items-center justify-content-center" style={{minHeight: '250px'}}>
              <FaBuilding size={40} className="mb-3 text-primary" />
              <p className="h4 text-primary">Nenhuma empresa encontrada</p>
              <p className="text-muted mb-0">Verifique se você está logado ou se as empresas foram cadastradas no seu perfil.</p>
            </div>
          ) : (
            <div className="row">
                <div className="col-12">
                    {empresas_usuario.data.map((empresa: Empresa) => {
                        const isOpen = dropdownAberto === empresa.id;
                        return (
                            <div key={empresa.id} className="mb-4">
                                <div
                                    className={`empresa-card ${isOpen ? 'active' : ''}`}
                                    onClick={() => handleToggleDropdown(empresa.id)}
                                >
                                    <div className="card-info">
                                        <FaBuilding className="card-icon" />
                                        <div>
                                            <h4 className="card-title">{empresa.nome}</h4>
                                            <p className="card-text">CNPJ: {empresa.cnpj}</p>
                                        </div>
                                    </div>
                                    <FaChevronDown className={`toggle-icon ${isOpen ? 'open' : ''}`} />
                                </div>

                                <div className={`dropdown-wrapper ${isOpen ? 'open' : ''}`}>
                                    <div className="dropdown-card">
                                        <FinanceiroDados empresa_id={empresa.id} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Financeiro;