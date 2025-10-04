import React, { useState } from "react";
import { FaFilter, FaTriangleExclamation } from "react-icons/fa6"; // Ícones Fa6

const FiltrosAgendamento: React.FC = () => {
  const [filtroFuncionario, setFiltroFuncionario] = useState<string>("todos");
  const [filtroCliente, setFiltroCliente] = useState<string>("todos");
  const [filtroHorario, setFiltroHorario] = useState<string>("todos");
  const [filtroServico, setFiltroServico] = useState<string>("todos");

  const handleFiltroFuncionario = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFiltroFuncionario(event.target.value);
  };

  const handleFiltroCliente = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroCliente(event.target.value);
  };

  const handleFiltroHorario = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroHorario(event.target.value);
  };

  const handleFiltroServico = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroServico(event.target.value);
  };

  return (
    <div className="filters-container">
      <style>{`
        /* Paleta de cores */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --light-gray-bg: #f5f7fa;
          --white: #ffffff;
          --warning-orange: #fd7e14;
        }

        .filters-container {
          background-color: var(--light-gray-bg);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .filters-container h4 {
            color: var(--dark-gray);
            font-weight: 700;
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .filters-container h4 svg {
            color: var(--primary-blue);
        }

        .development-alert {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--warning-orange);
            font-weight: 600;
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
            padding: 0.5rem 0.75rem;
            background-color: #fff7e6;
            border-left: 4px solid var(--warning-orange);
            border-radius: 4px;
        }

        /* Labels */
        .form-label {
          font-weight: 600;
          color: var(--dark-gray);
          font-size: 0.95rem;
          margin-bottom: 0.4rem;
        }

        /* Select Inputs */
        .form-select {
          border-radius: 8px;
          border: 1px solid #ced4da;
          padding: 0.65rem 1rem;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
          color: var(--dark-gray);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .form-select:focus {
          border-color: var(--accent-blue);
          box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.25);
          outline: none;
        }

        /* Responsividade do Layout de Filtros */
        .row {
            display: flex;
            flex-wrap: wrap;
            margin: 0;
        }
        .col-md-3 {
            flex-grow: 1;
            padding: 0 0.5rem;
        }
        .col-md-3:first-child {
            padding-left: 0;
        }
        .col-md-3:last-child {
            padding-right: 0;
        }

        @media (max-width: 992px) {
            .col-md-3 {
                flex-basis: 50%; /* Duas colunas em telas médias */
                padding: 0 0.5rem;
                margin-bottom: 1rem;
            }
            .col-md-3:nth-child(2n-1) {
                padding-left: 0;
            }
            .col-md-3:nth-child(2n) {
                padding-right: 0;
            }
            .filters-container {
                padding: 1.25rem;
            }
        }
        @media (max-width: 576px) {
            .col-md-3 {
                flex-basis: 100%; /* Uma coluna em telas pequenas */
                padding: 0;
                margin-bottom: 1rem;
            }
            .filters-container {
                padding: 1rem;
            }
        }
      `}</style>

      <h4><FaFilter /> Filtragem da Agenda</h4>
      <p className="development-alert">
        <FaTriangleExclamation /> Esta seção está <strong>EM DESENVOLVIMENTO</strong> e não aplica filtros reais.
      </p>

      <div className="row">
        <div className="col-md-3 mb-2">
          <label htmlFor="filtroFuncionario" className="form-label">
            Funcionário
          </label>
          <select
            id="filtroFuncionario"
            className="form-select"
            value={filtroFuncionario}
            onChange={handleFiltroFuncionario}
          >
            <option value="todos">Todos</option>
            <option value="funcionario1">Funcionário 1</option>
            <option value="funcionario2">Funcionário 2</option>
            <option value="funcionario3">Funcionário 3</option>
          </select>
        </div>

        <div className="col-md-3 mb-2">
          <label htmlFor="filtroCliente" className="form-label">
            Cliente
          </label>
          <select
            id="filtroCliente"
            className="form-select"
            value={filtroCliente}
            onChange={handleFiltroCliente}
          >
            <option value="todos">Todos</option>
            <option value="cliente1">Cliente 1</option>
            <option value="cliente2">Cliente 2</option>
            <option value="cliente3">Cliente 3</option>
          </select>
        </div>

        <div className="col-md-3 mb-2">
          <label htmlFor="filtroHorario" className="form-label">
            Período
          </label>
          <select
            id="filtroHorario"
            className="form-select"
            value={filtroHorario}
            onChange={handleFiltroHorario}
          >
            <option value="todos">Todos</option>
            <option value="manha">Manhã (08h - 12h)</option>
            <option value="tarde">Tarde (12h - 18h)</option>
            <option value="noite">Noite (18h - 22h)</option>
          </select>
        </div>

        <div className="col-md-3 mb-2">
          <label htmlFor="filtroServico" className="form-label">
            Serviço
          </label>
          <select
            id="filtroServico"
            className="form-select"
            value={filtroServico}
            onChange={handleFiltroServico}
          >
            <option value="todos">Todos</option>
            <option value="servico1">Serviço 1</option>
            <option value="servico2">Serviço 2</option>
            <option value="servico3">Serviço 3</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltrosAgendamento;