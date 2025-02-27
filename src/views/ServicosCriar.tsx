import React, { useState } from "react";
import { ServicoCreate } from "../interfaces/Servico";
import { Funcionario } from "../interfaces/Funcionario";

const ServicoForm: React.FC = () => {
  const [servico, setServico] = useState<ServicoCreate>({
    nome: "",
    descricao: "",
    duracao: "",
    preco: "",
    funcionarios: [],
  });

  const funcionariosSimulados: Funcionario[] = [
    { id: 1, nome: "Carlos Silva", foto: "https://via.placeholder.com/50" },
    { id: 2, nome: "Mariana Souza", foto: "https://via.placeholder.com/50" },
    { id: 3, nome: "Pedro Alves", foto: "https://via.placeholder.com/50" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setServico((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFuncionarioChange = (id: number) => {
    setServico((prev) => {
      const funcionariosAtuais = prev.funcionarios.includes(id)
        ? prev.funcionarios.filter((fid) => fid !== id) // Remove se já estiver na lista
        : [...prev.funcionarios, id]; // Adiciona se não estiver

      return {
        ...prev,
        funcionarios: funcionariosAtuais,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(servico);
  };

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg p-4 border-0"
        style={{ maxWidth: "600px", margin: "auto", borderRadius: "12px" }}
      >
        <h2 className="text-center text-primary mb-4">Cadastro de Serviço</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              name="nome"
              className="form-control"
              value={servico.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descrição</label>
            <textarea
              name="descricao"
              className="form-control"
              value={servico.descricao}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Duração</label>
            <input
              type="text"
              name="duracao"
              className="form-control"
              value={servico.duracao}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Preço</label>
            <input
              type="text"
              name="preco"
              className="form-control"
              value={servico.preco}
              onChange={handleChange}
              required
            />
          </div>

          {/* Seleção de Funcionários */}
          <div className="mb-3">
            <label className="form-label">Funcionários</label>
            <div className="d-flex flex-wrap gap-2">
              {funcionariosSimulados.map((funcionario) => (
                <div
                  key={funcionario.id}
                  className="d-flex align-items-center gap-2 border p-2 rounded"
                >
                  <img
                    src={funcionario.foto}
                    alt={funcionario.nome}
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <span>{funcionario.nome}</span>
                  <input
                    type="checkbox"
                    checked={servico.funcionarios.includes(funcionario.id)}
                    onChange={() => handleFuncionarioChange(funcionario.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            style={{ borderRadius: "8px" }}
          >
            Cadastrar Serviço
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServicoForm;
