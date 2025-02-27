import React, { useState } from "react";
import { FuncionarioCreate } from "../interfaces/Funcionario";

const FuncionarioForm: React.FC = () => {
  const [funcionario, setFuncionario] = useState<Omit<FuncionarioCreate, "id">>(
    {
      nome: "",
      foto: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFuncionario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Funcionário cadastrado:", funcionario);
  };

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg p-4 border-0"
        style={{ maxWidth: "500px", margin: "auto", borderRadius: "12px" }}
      >
        <h2 className="text-center text-primary mb-4">
          Cadastro de Funcionário
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              name="nome"
              className="form-control"
              value={funcionario.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Foto (URL)</label>
            <input
              type="text"
              name="foto"
              className="form-control"
              value={funcionario.foto}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            style={{ borderRadius: "8px" }}
          >
            Cadastrar Funcionário
          </button>
        </form>
      </div>
    </div>
  );
};

export default FuncionarioForm;
