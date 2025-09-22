import { useState } from "react";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import AgendamentosHoje from "./AgendamentosHoje";
import Navbar from "../components/Navbar";
import { FaChevronDown, FaSpinner } from "react-icons/fa";
import React from "react";

const EmpresasUsuario = () => {
  const token = localStorage.getItem("access_token");
  const empresas = useFetch<Empresa[]>(
    `api/empresas-usuario/?usuario_token=${token}`
  );
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);

  const handleToggleDropdown = (empresaId: number) => {
    setDropdownAberto(dropdownAberto === empresaId ? null : empresaId);
  };

  return (
    <div className="min-vh-100">
      <style>{`
        :root {
          --primary-blue: #003087;
          --light-blue: #4dabf7;
          --dark-gray: #2d3748;
          --light-gray: #f7fafc;
          --white: #ffffff;
          --accent-yellow: #f6c107;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --warning-orange: #fd7e14;
        }

        .custom-bg {
          background-color: var(--light-gray);
        }

        .empresas-container {
          padding: 3rem 0;
        }

        .empresas-container h1 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .empresas-container .lead {
          color: var(--dark-gray);
          font-size: 1.25rem;
          max-width: 800px;
          margin: 0 auto 2rem;
          text-align: center;
        }

        .table-responsive {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          background-color: var(--white);
        }

        .table thead th {
          background-color: var(--primary-blue);
          color: var(--white);
          font-weight: 600;
          text-align: center;
          padding: 1rem;
        }

        .table tbody td {
          vertical-align: middle;
          padding: 1rem;
          color: var(--dark-gray);
        }

        .table tbody tr:hover {
          background-color: var(--light-gray);
          cursor: pointer;
        }

        .table .toggle-icon {
          color: var(--primary-blue);
          transition: transform 0.3s ease;
        }

        .table .toggle-icon.open {
          transform: rotate(180deg);
        }

        .agendamentos-dropdown {
          background-color: var(--white);
          padding: 1rem;
          border-top: 1px solid var(--light-gray);
        }

        .loading-container, .error-container, .empty-container {
          text-align: center;
          color: var(--dark-gray);
          font-size: 1.25rem;
          padding: 2rem;
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .error-container {
          color: var(--danger-red);
          font-weight: 500;
        }

        @media (max-width: 991px) {
          .empresas-container {
            padding: 2rem 1rem;
          }
          .table thead th, .table tbody td {
            font-size: 0.9rem;
            padding: 0.75rem;
          }
        }

        @media (max-width: 576px) {
          .empresas-container h1 {
            font-size: 2rem;
          }
          .empresas-container .lead {
            font-size: 1.1rem;
          }
          .table thead th, .table tbody td {
            font-size: 0.85rem;
            padding: 0.5rem;
          }
          .loading-container, .error-container, .empty-container {
            font-size: 1.1rem;
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="empresas-container container">
          <h1 className="display-3 text-primary mb-5 text-center mt-5">
            Suas Empresas
          </h1>
          <p className="lead text-muted text-center">
            Selecione uma empresa para ver seus agendamentos para hoje.
          </p>

          {empresas.loading && (
            <div className="loading-container">
              <FaSpinner className="fa-spin me-2" /> Carregando empresas...
            </div>
          )}

          {!empresas.loading && (!empresas.data || empresas.data.length === 0) && (
            <div className="empty-container">
              Você não tem empresas cadastradas.
              <br />
              <a href="/cadastros-empresa" className="btn btn-primary mt-3">
                Cadastrar Nova Empresa
              </a>
            </div>
          )}

          {!empresas.loading && empresas.data && empresas.data.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
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
                      <tr onClick={() => handleToggleDropdown(empresa.id)}>
                        <td>
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
