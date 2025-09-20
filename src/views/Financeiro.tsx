import { useState, useEffect } from "react";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import Navbar from "../components/Navbar";
import FinanceiroDados from "../components/FinanceiroDados";
import { FaChartBar, FaSpinner } from "react-icons/fa";
import "aos/dist/aos.css";
import AOS from "aos";

const Financeiro = () => {
  const token = localStorage.getItem("access_token");
  const empresas_usuario = useFetch<Empresa[]>(
    `api/empresas-usuario/?usuario_token=${token}`
  );
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleToggleDropdown = async (empresaId: number) => {
    if (dropdownAberto === empresaId) {
      setDropdownAberto(null);
      return;
    }
    setDropdownAberto(empresaId);
  };

  return (
    <div className="min-vh-100">
      <style>{`
        /* Paleta de cores */
        :root {
          --primary-blue: #003087;
          --light-blue: #4dabf7;
          --dark-gray: #2d3748;
          --light-gray: #f7fafc;
          --white: #ffffff;
          --accent-yellow: #f6c107;
          --success-green: #28a745;
          --danger-red: #dc3545;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Container */
        .financeiro-container {
          padding: 3rem 0;
        }
        .financeiro-container h1 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .financeiro-container .lead {
          color: var(--dark-gray);
          font-size: 1.25rem;
          max-width: 800px;
          margin: 0 auto 2rem;
          text-align: center;
        }

        /* Cartões de empresa */
        .empresa-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .empresa-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .empresa-card .card-title {
          color: var(--primary-blue);
          font-weight: 600;
          font-size: 1.5rem;
        }
        .empresa-card .card-text {
          color: var(--dark-gray);
          font-size: 1rem;
        }

        /* Cartão de dropdown */
        .dropdown-card {
          background-color: var(--light-gray);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
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

        /* Responsividade */
        @media (max-width: 991px) {
          .financeiro-container {
            padding: 2rem 1rem;
          }
          .empresa-card .card-title {
            font-size: 1.25rem;
          }
        }
        @media (max-width: 576px) {
          .financeiro-container h1 {
            font-size: 2rem;
          }
          .financeiro-container .lead {
            font-size: 1.1rem;
          }
          .empresa-card .card-title {
            font-size: 1.2rem;
          }
          .empresa-card .card-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="financeiro-container container">
          <h1 data-aos="fade-up">
            <FaChartBar /> Seus Dados Financeiros
          </h1>
          <p className="lead" data-aos="fade-up" data-aos-delay="100">
            Selecione uma empresa para ver seus dados financeiros.
          </p>
          {empresas_usuario.loading ? (
            <div className="loading-container" data-aos="fade-up" data-aos-delay="200">
              <FaSpinner className="fa-spin me-2" /> Carregando empresas...
            </div>
          ) : empresas_usuario.error ? (
            <div className="error-container" data-aos="fade-up" data-aos-delay="200">
              Erro ao carregar empresas: {empresas_usuario.error}
            </div>
          ) : !empresas_usuario.data || empresas_usuario.data.length === 0 ? (
            <div className="error-container" data-aos="fade-up" data-aos-delay="200">
              Nenhuma empresa encontrada.
            </div>
          ) : (
            <div className="row justify-content-center">
              {empresas_usuario.data.map((empresa: Empresa) => (
                <div
                  className="col-md-6 col-lg-4 mb-4"
                  key={empresa.id}
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div
                    className="empresa-card"
                    onClick={() => handleToggleDropdown(empresa.id)}
                  >
                    <div className="card-body text-center">
                      <h4 className="card-title">{empresa.nome}</h4>
                      <p className="card-text">CNPJ: {empresa.cnpj}</p>
                    </div>
                  </div>
                  {dropdownAberto === empresa.id && (
                    <div
                      className="dropdown-card"
                      data-aos="fade-up"
                      data-aos-delay="400"
                    >
                      <FinanceiroDados empresa_id={empresa.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Financeiro;