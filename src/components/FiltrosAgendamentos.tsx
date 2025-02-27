import React, { useState } from "react";

const FiltrosAgendamento: React.FC = () => {
  const [filtroFuncionario, setFiltroFuncionario] = useState<string>("todos");
  const [filtroCliente, setFiltroCliente] = useState<string>("todos");
  const [filtroHorario, setFiltroHorario] = useState<string>("todos");
  const [filtroServico, setFiltroServico] = useState<string>("todos");

  // Funções para alterar os filtros
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
    <div className="filters-container mb-4">
      <p className="mb-3">Filtros de Agendamentos <span className="fw-bold text-warning">EM DESENVOLVIMENTO</span></p>

      {/* Filtros de Agendamentos */}

      <div className="row">
        {/* Filtro por Funcionário */}
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

        {/* Filtro por Cliente */}
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

        {/* Filtro por Horário */}
        <div className="col-md-3 mb-2">
          <label htmlFor="filtroHorario" className="form-label">
            Horário
          </label>
          <select
            id="filtroHorario"
            className="form-select"
            value={filtroHorario}
            onChange={handleFiltroHorario}
          >
            <option value="todos">Todos</option>
            <option value="manha">Manhã</option>
            <option value="tarde">Tarde</option>
            <option value="noite">Noite</option>
          </select>
        </div>

        {/* Filtro por Serviço */}
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
