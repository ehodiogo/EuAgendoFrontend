import React, { useState } from "react";
import InputMask from "react-input-mask";
import { EmpresaCreate } from "../interfaces/Empresa";
import { Link } from "react-router-dom";

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
  const [empresaCriada, setEmpresaCriada] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setEmpresa((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmpresa((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    if (empresa.logo) {
      if (empresa.logo.startsWith("data:image")) {
        const blob = await fetch(empresa.logo).then((res) => res.blob());
        formData.append("logo", blob, "logo.png");
      } else {
        formData.append("logo", empresa.logo);
      }
    }

    const requiredFields = [
      "nome",
      "cnpj",
      "endereco",
      "telefone",
      "email",
      "horario_abertura_dia_semana",
      "horario_fechamento_dia_semana",
    ];

    requiredFields.forEach((field) => {
      formData.append(field, empresa[field as keyof EmpresaCreate] as string || "");
    });

    formData.append("abre_sabado", empresa.abre_sabado.toString());
    formData.append("abre_domingo", empresa.abre_domingo.toString());
    formData.append("para_almoço", empresa.para_almoço.toString());

    formData.append(
      "horario_abertura_fim_de_semana",
      empresa.horario_abertura_fim_de_semana || ""
    );
    formData.append(
      "horario_fechamento_fim_de_semana",
      empresa.horario_fechamento_fim_de_semana || ""
    );

    formData.append("horario_pausa_inicio", empresa.horario_pausa_inicio || "");
    formData.append("horario_pausa_fim", empresa.horario_pausa_fim || "");

    const usuario_token = localStorage.getItem("access_token");
    if (usuario_token) {
      formData.append("usuario_token", usuario_token);
    }

    console.log("Form Data:", Object.fromEntries(formData.entries()));

    try {
      const response = await fetch("http://localhost:8000/api/empresa-create/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar empresa.");
      }

      const data = await response.json();
      console.log("Empresa cadastrada com sucesso:", data);
      alert("Empresa cadastrada com sucesso!");
      setEmpresaCriada(true);
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao cadastrar empresa.");
    }
  };


  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg p-4 border-0"
        style={{ maxWidth: "600px", margin: "auto", borderRadius: "12px" }}
      >
        <h2 className="text-center text-primary mb-4">Cadastro de Empresa</h2>
        <form onSubmit={handleSubmit}>
          {/* Campos obrigatórios */}
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              name="nome"
              className="form-control"
              value={empresa.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">CNPJ</label>
            <InputMask
              type="text"
              name="cnpj"
              className="form-control"
              value={empresa.cnpj}
              onChange={handleChange}
              mask="99.999.999/9999-99"
              maskChar={null}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Endereço</label>
            <input
              type="text"
              name="endereco"
              className="form-control"
              value={empresa.endereco}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Telefone</label>
            <input
              type="text"
              name="telefone"
              className="form-control"
              value={empresa.telefone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={empresa.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Horário Abertura (Semana)</label>
            <input
              type="text"
              name="horario_abertura_dia_semana"
              className="form-control"
              value={empresa.horario_abertura_dia_semana}
              onChange={handleChange}
              placeholder="Ex: 08:00"
              pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Horário Fechamento (Semana)</label>
            <input
              type="text"
              name="horario_fechamento_dia_semana"
              className="form-control"
              value={empresa.horario_fechamento_dia_semana}
              onChange={handleChange}
              placeholder="Ex: 18:00"
              pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Horário Abertura (Fim de Semana)
            </label>
            <input
              type="text"
              name="horario_abertura_fim_de_semana"
              className="form-control"
              value={empresa.horario_abertura_fim_de_semana}
              onChange={handleChange}
              placeholder="Ex: 10:00"
              pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Horário Fechamento (Fim de Semana)
            </label>
            <input
              type="text"
              name="horario_fechamento_fim_de_semana"
              className="form-control"
              value={empresa.horario_fechamento_fim_de_semana}
              onChange={handleChange}
              placeholder="Ex: 22:00"
              pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Início da Pausa</label>
            <input
              type="text"
              name="horario_pausa_inicio"
              className="form-control"
              value={empresa.horario_pausa_inicio}
              onChange={handleChange}
              placeholder="Ex: 12:00"
              pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Fim da Pausa</label>
            <input
              type="text"
              name="horario_pausa_fim"
              className="form-control"
              value={empresa.horario_pausa_fim}
              onChange={handleChange}
              placeholder="Ex: 13:00"
              pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Logo da Empresa</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">URL do Logo</label>
            <input
              type="text"
              name="logo"
              className="form-control"
              value={empresa.logo}
              onChange={handleChange}
              placeholder="Ou insira a URL da imagem"
            />
          </div>

          {empresa.logo && (
            <div className="text-center mb-3">
              <img
                src={empresa.logo}
                alt="Prévia do logo"
                className="img-fluid"
                style={{ maxWidth: "200px", borderRadius: "8px" }}
              />
            </div>
          )}

          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="abre_sabado"
              className="form-check-input"
              checked={empresa.abre_sabado}
              onChange={handleChange}
            />
            <label className="form-check-label ms-2">Abre Sábado</label>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="abre_domingo"
              className="form-check-input"
              checked={empresa.abre_domingo}
              onChange={handleChange}
            />
            <label className="form-check-label ms-2">Abre Domingo</label>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="para_almoço"
              className="form-check-input"
              checked={empresa.para_almoço}
              onChange={handleChange}
            />
            <label className="form-check-label ms-2">
              Tem Pausa para Almoço
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Cadastrar
          </button>
        </form>

        {empresaCriada && (
          <Link to={`/criar-funcionario/${empresa.nome}`} className="btn btn-secondary w-100 mt-3">
            Criar Funcionarios para a Empresa
          </Link>
        )}
          
      </div>
    </div>
  );
};

export default EmpresaForm;
