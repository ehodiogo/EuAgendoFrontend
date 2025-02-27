import React, { useState } from "react";
import { EmpresaCreate } from "../interfaces/Empresa";

const EmpresaForm: React.FC = () => {
  const [empresa, setEmpresa] = useState<EmpresaCreate>({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    servicos: [],
    logo: "",
    horario_abertura_dia_semana: "",
    horario_fechamento_dia_semana: "",
    horario_abertura_fim_de_semana: "",
    horario_fechamento_fim_de_semana: "",
    abre_sabado: false,
    abre_domingo: false,
    para_almoço: false,
    horario_pausa_inicio: "",
    horario_pausa_fim: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setEmpresa((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(empresa);
  };

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg p-4 border-0"
        style={{ maxWidth: "600px", margin: "auto", borderRadius: "12px" }}
      >
        <h2 className="text-center text-primary mb-4">Cadastro de Empresa</h2>
        <form onSubmit={handleSubmit}>
          {[
            { label: "Nome", name: "nome", type: "text" },
            { label: "CNPJ", name: "cnpj", type: "text" },
            { label: "Endereço", name: "endereco", type: "text" },
            { label: "Telefone", name: "telefone", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "URL do Logo", name: "logo", type: "text" },
            {
              label: "Horário Abertura (Semana)",
              name: "horario_abertura_dia_semana",
              type: "time",
            },
            {
              label: "Horário Fechamento (Semana)",
              name: "horario_fechamento_dia_semana",
              type: "time",
            },
            {
              label: "Horário Abertura (Fim de Semana)",
              name: "horario_abertura_fim_de_semana",
              type: "time",
            },
            {
              label: "Horário Fechamento (Fim de Semana)",
              name: "horario_fechamento_fim_de_semana",
              type: "time",
            },
            {
              label: "Início da Pausa",
              name: "horario_pausa_inicio",
              type: "time",
            },
            { label: "Fim da Pausa", name: "horario_pausa_fim", type: "time" },
          ].map((field) => (
            <div className="mb-3" key={field.name}>
              <label className="form-label">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {[
            { label: "Abre Sábado", name: "abre_sabado" },
            { label: "Abre Domingo", name: "abre_domingo" },
            { label: "Pausa para Almoço", name: "para_almoco" },
          ].map((checkbox) => (
            <div className="form-check mb-3" key={checkbox.name}>
              <input
                type="checkbox"
                name={checkbox.name}
                className="form-check-input"
                onChange={handleChange}
              />
              <label className="form-check-label ms-2">{checkbox.label}</label>
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            style={{ borderRadius: "8px" }}
          >
            Cadastrar Empresa
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmpresaForm;
