import { useState } from "react";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import AgendamentosHoje from "./AgendamentosHoje";
import Navbar from "../components/Navbar";
import { FaChevronDown, FaSpinner, FaBuilding } from "react-icons/fa6"; // Atualizado para Fa6
import React from "react";

const EmpresasUsuario = () => {
  const token = localStorage.getItem("access_token");
  // Assumindo que useFetch pode lidar com o token no cabeçalho ou URL
  const empresas = useFetch<Empresa[]>(
    `/api/empresas-usuario/?usuario_token=${token}`
  );
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);

  const handleToggleDropdown = (empresaId: number) => {
    setDropdownAberto(dropdownAberto === empresaId ? null : empresaId);
  };

  return (
    <div className="min-vh-100">
      <style>{`
        /* Paleta de Cores (Consistente) */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --light-gray-bg: #f5f7fa;
          --white: #ffffff;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --shadow-color: rgba(0, 0, 0, 0.1);
        }

        .custom-bg {
          background-color: var(--light-gray-bg);
          background-image: linear-gradient(135deg, var(--light-gray-bg) 0%, var(--white) 100%);
        }

        .empresas-container {
          padding: 5rem 1rem 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Título Principal */
        .empresas-container h1 {
          color: var(--dark-gray);
          font-weight: 800;
          font-size: 2.75rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          letter-spacing: -0.05em;
        }
        .empresas-container h1 svg {
            color: var(--primary-blue);
        }

        .empresas-container .lead {
          color: var(--dark-gray);
          font-size: 1.15rem;
          max-width: 800px;
          margin: 0 auto 3rem;
          text-align: center;
          opacity: 0.85;
        }

        /* Tabela & Responsividade */
        .table-responsive {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px var(--shadow-color);
          background-color: var(--white);
          border: 1px solid #e0e7ff;
        }

        .table {
            --bs-table-bg: var(--white);
            --bs-table-striped-bg: #f8fafc;
        }
        
        .table thead th {
          background-color: var(--primary-blue);
          color: var(--white);
          font-weight: 700;
          text-align: left;
          padding: 1.25rem 1.5rem;
          border: none;
        }
        .table thead th:first-child {
            width: 50px; /* Largura para o ícone */
            text-align: center;
        }

        .table tbody td {
          vertical-align: middle;
          padding: 1rem 1.5rem;
          color: var(--dark-gray);
          border-top: 1px solid #edf2f7;
        }

        .table tbody tr:hover {
          background-color: var(--bs-table-striped-bg);
          cursor: pointer;
        }

        .table .toggle-icon {
          color: var(--accent-blue);
          transition: transform 0.3s ease;
          font-size: 1.1rem;
        }

        .table .toggle-icon.open {
          transform: rotate(180deg);
        }
        
        /* Dropdown de Agendamentos */
        .agendamentos-dropdown {
          background-color: var(--white);
          padding: 1.5rem;
          border-top: 3px solid var(--primary-blue);
          box-shadow: inset 0 3px 10px rgba(0, 0, 0, 0.05);
        }
        .agendamentos-dropdown > div {
            padding: 0; /* Remove padding extra do AgendamentosHoje, se houver */
        }
        
        /* Mensagens de Status */
        .status-message {
            text-align: center;
            font-size: 1.25rem;
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            margin-top: 2rem;
            font-weight: 600;
        }

        .loading-container {
          color: var(--primary-blue);
          background-color: #e0e7ff;
        }

        .empty-container {
          color: var(--dark-gray);
          background-color: var(--white);
          border: 1px solid #e2e8f0;
        }
        
        .error-container {
          color: var(--danger-red);
          background-color: #fcebeb;
          border: 1px solid var(--danger-red);
          font-weight: 700;
        }

        .btn-primary-custom {
            background-color: var(--primary-blue);
            border: none;
            color: var(--white);
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 1.5rem;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        .btn-primary-custom:hover {
            background-color: var(--accent-blue);
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 48, 135, 0.3);
        }

        @media (max-width: 991px) {
          .empresas-container {
            padding: 3rem 1rem 2rem;
          }
          .table thead th, .table tbody td {
            font-size: 0.95rem;
            padding: 0.8rem 1rem;
          }
        }

        @media (max-width: 576px) {
          .empresas-container h1 {
            font-size: 2.25rem;
          }
          .empresas-container .lead {
            font-size: 1.05rem;
          }
          .table thead th:nth-child(3), .table tbody td:nth-child(3) {
            display: none; /* Esconde CNPJ em telas muito pequenas */
          }
          .table thead th {
             padding: 1rem;
          }
          .table tbody td {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>

      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="empresas-container container">
          <h1 className="text-center">
            <FaBuilding /> Suas Empresas
          </h1>
          <p className="lead text-center">
            Visualize e gerencie os agendamentos de hoje para as suas empresas.
          </p>

          {empresas.loading && (
            <div className="loading-container status-message">
              <FaSpinner className="fa-spin me-3" /> Carregando empresas...
            </div>
          )}

          {!empresas.loading && empresas.data && empresas.data.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th></th>
                    <th>Nome da Empresa</th>
                    <th>CNPJ</th>
                  </tr>
                </thead>
                <tbody>
                  {empresas.data.map((empresa: Empresa) => (
                    <React.Fragment key={empresa.id}>
                      <tr onClick={() => handleToggleDropdown(empresa.id)} role="button" aria-expanded={dropdownAberto === empresa.id}>
                        <td className="text-center">
                          <FaChevronDown
                            className={`toggle-icon ${
                              dropdownAberto === empresa.id ? "open" : ""
                            }`}
                          />
                        </td>
                        <td>{empresa.nome}</td>
                        <td>{empresa.cnpj}</td>
                      </tr>
                      {dropdownAberto === empresa.id && (
                        <tr>
                          <td colSpan={3} className="agendamentos-dropdown">
                            {/* O componente AgendamentosHoje deve ser o único conteúdo desta célula */}
                            <AgendamentosHoje empresa={empresa} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpresasUsuario;