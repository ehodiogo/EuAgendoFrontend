import React, { useEffect, useState } from "react";
import {InputMask} from "@react-input/mask";
import { EmpresaCreate, Empresa } from "../interfaces/Empresa";
import { Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import Navbar from "../components/Navbar";

const EmpresaForm: React.FC = () => {
  const [acaoSelecionada, setAcaoSelecionada] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [abreSabado, setAbreSabado] = useState(false);
  const [abreDomingo, setAbreDomingo] = useState(false);
  const [temPausa, setTemPausa] = useState(false);

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
  const [empresaSelecionada, setEmpresaSelecionada] = useState<number | null>(
    null
  );
  const empresas = useFetch<Empresa[]>(
    `api/empresas-usuario/?usuario_token=${localStorage.getItem(
      "access_token"
    )}`
  );

  useEffect(() => {

    setAbreDomingo(false);
    setAbreSabado(false);
    setTemPausa(false);
  
  }, [empresaSelecionada, acaoSelecionada]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setEmpresa((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "abre_sabado") {
      setAbreSabado(checked);
    }

    if (name === "abre_domingo") {
      setAbreDomingo(checked);
    }

    if (name === "para_almoço") {
      setTemPausa(checked);
    }
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
    setLoading(true);

    if (acaoSelecionada === "cadastrar") {

      const payload_limite = {
        usuario_token: localStorage.getItem("access_token"),
        acao_realizada: "criar_empresa",
      }

      let possui_limite = false;

      try {

        const url = window.location.origin.includes("localhost:5173")
          ? "http://localhost:8000"
          : "https://backend-production-7438.up.railway.app";

        const response = await fetch(url + "/api/possui-limite/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload_limite),
        })

        if (!response.ok) {
          throw new Error("Erro ao verificar limite de empresas.");
        }

        const data = await response.json();
        possui_limite = data.possui_limite;
        
      } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao verificar limite de empresas."); //TODO: Melhorar esteticamente essas mensagens de alert
      }

      if (!possui_limite) {
        alert("Você atingiu o limite de empresas cadastradas.");
        setLoading(false);
        return;
      } else {

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

        try {
          const url = window.location.origin.includes("localhost:5173")
            ? "http://localhost:8000"
            : "https://backend-production-7438.up.railway.app";

          const response = await fetch(url + "/api/empresa-create/", {
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
          window.location.reload(); // MELHORAR ISSO
        } catch (error) {
          console.error("Erro:", error);
          alert("Falha ao cadastrar empresa.");
        } finally {
          setLoading(false);
        }
      }
    } else if (acaoSelecionada === "remover") {
      
      const payload = {
        empresa_id: empresaSelecionada,
        usuario_token: localStorage.getItem("access_token"),
      };

      try {
        const url = window.location.origin.includes("localhost:5173")
          ? "http://localhost:8000"
          : "https://backend-production-7438.up.railway.app";

        console.log("URL", url);

        const response = await fetch(
          url + "/api/remover-empresa/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao remover empresa.");
        }

        const data = await response.json();
        console.log("Empresa removida com sucesso:", data);
        alert("Empresa removida com sucesso!");
        setEmpresaSelecionada(null);
        window.location.reload(); // MELHORAR ISSO
      } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao remover empresa.");
      } finally {
        setLoading(false);
      }

    } else if (acaoSelecionada === "editar") {
      
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

      const empresaObj = empresas.data?.find(
        (empresa) => empresa.id === empresaSelecionada
      );

      if (!empresaObj) {
        console.error("Empresa não encontrada.");
        return;
      }

      if (!empresaObj) {
        console.error("Empresa não encontrada.");
        return;
      }

      requiredFields.forEach((field) => {
        formData.append(
          field,
          (empresaObj[field as keyof EmpresaCreate] as string) || ""
        );
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
      if (!empresaSelecionada) {
        alert("Selecione uma empresa para editar.");
        return;
      }
      
      formData.append("empresa_id", empresaSelecionada.toString());

      try {
        const url = window.location.origin.includes("localhost:5173")
          ? "http://localhost:8000"
          : "https://backend-production-7438.up.railway.app";

        const response = await fetch(
          url + "/api/editar-empresa/",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao cadastrar empresa.");
        }

        const data = await response.json();
        console.log("Empresa editada com sucesso:", data);
        alert("Empresa editada com sucesso!");
        setEmpresaCriada(true);
        window.location.reload(); // MELHORAR ISSO
      } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao cadastrar empresa.");
      } finally {
        setLoading(false);
      }
    }
   
  };


  return (
    <>
    <Navbar />
    <div className="container mt-5">
      <div
        className="card shadow-lg p-4 border-0"
        style={{ maxWidth: "600px", margin: "auto", borderRadius: "12px" }}
      >
        <h2 className="text-center text-primary mb-4">Ações que você pode realizar nas suas Empresas</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <select
              className="form-select text-center"
              onChange={(e) => setAcaoSelecionada(e.target.value)}
              value={acaoSelecionada}
              required
            >
              <option value="">Escolha uma ação</option>
              <option value="cadastrar">Cadastrar Empresa</option>
              <option value="remover">Remover Empresa</option>
              <option value="editar">Editar Empresa</option>
            </select>
          </div>

          {acaoSelecionada === "cadastrar" && (
            <>
              <div
                className="card shadow-lg p-4 border-0"
                style={{
                  maxWidth: "600px",
                  margin: "auto",
                  borderRadius: "12px",
                }}
              >
                <h2 className="text-center text-primary mb-4">
                  Cadastro de Empresa
                </h2>
                <div className="mb-3">
                  <label className="form-label">
                    Qual o nome da sua empresa?
                  </label>
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
                  <label className="form-label">
                    Qual o CNPJ da sua empresa?
                  </label>
                  <InputMask
                    mask="99.999.999/9999-99"
                    value={empresa.cnpj}
                    onChange={handleChange}
                    placeholder="__.___-___"
                    name="cnpj"
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Qual o endereço da sua empresa?
                  </label>
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
                  <label className="form-label">
                    Qual o telefone da sua empresa?
                  </label>
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
                  <label className="form-label">
                    Qual o e-mail da sua empresa?
                  </label>
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
                  <label className="form-label">
                    Qual o horário de abertura da sua empresa durante a semana?
                  </label>
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
                  <label className="form-label">
                    Qual o horário de fechamento da sua empresa durante a
                    semana?
                  </label>
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
                    Caso sua empresa abra aos finais de semana, qual o horário
                    de abertura?
                  </label>
                  <input
                    type="text"
                    name="horario_abertura_fim_de_semana"
                    className="form-control"
                    value={empresa.horario_abertura_fim_de_semana}
                    onChange={handleChange}
                    placeholder="Ex: 10:00"
                    pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
                    required={abreSabado || abreDomingo}
                    disabled={!abreSabado && !abreDomingo}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Caso sua empresa feche aos finais de semana, qual o horário
                    de fechamento?
                  </label>
                  <input
                    type="text"
                    name="horario_fechamento_fim_de_semana"
                    className="form-control"
                    value={empresa.horario_fechamento_fim_de_semana}
                    onChange={handleChange}
                    placeholder="Ex: 22:00"
                    pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
                    required={abreSabado || abreDomingo}
                    disabled={!abreSabado && !abreDomingo}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Se houver pausa para intervalo, que horário inicia a pausa?
                  </label>
                  <input
                    type="text"
                    name="horario_pausa_inicio"
                    className="form-control"
                    value={empresa.horario_pausa_inicio}
                    onChange={handleChange}
                    placeholder="Ex: 12:00"
                    pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
                    required={temPausa}
                    disabled={!temPausa}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Se houver pausa para intervalo, que horário termina a pausa?
                  </label>
                  <input
                    type="text"
                    name="horario_pausa_fim"
                    className="form-control"
                    value={empresa.horario_pausa_fim}
                    onChange={handleChange}
                    placeholder="Ex: 13:00"
                    pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
                    required={temPausa}
                    disabled={!temPausa}
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
                  <label className="form-check-label ms-2">
                    Sua empresa abre no sábado?
                  </label>
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    name="abre_domingo"
                    className="form-check-input"
                    checked={empresa.abre_domingo}
                    onChange={handleChange}
                  />
                  <label className="form-check-label ms-2">
                    Sua empresa abre no domingo?
                  </label>
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
                    Sua empresa tem intervalo no almoço?
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 py-2"
                  style={{ borderRadius: "8px" }}
                  disabled={loading}
                >
                  {loading ? "Cadastrando..." : "Cadastrar Empresa"}
                </button>
              </div>
            </>
          )}

          {acaoSelecionada === "editar" && (
            <>
              <div
                className="card shadow-lg p-4 border-0"
                style={{
                  maxWidth: "600px",
                  margin: "auto",
                  borderRadius: "12px",
                }}
              >
                <h2 className="text-center text-primary mb-4">
                  Editar Informações da Empresa
                </h2>
                <div className="mb-3">
                  <label className="form-label">
                    Selecione uma Empresa para Editar
                  </label>
                  <select
                    className="form-select"
                    onChange={(e) =>
                      setEmpresaSelecionada(Number(e.target.value))
                    }
                    value={empresaSelecionada || ""}
                    required
                  >
                    <option value="">Escolha uma empresa</option>
                    {empresas.data?.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {empresaSelecionada && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">
                        Qual o nome da sua empresa?
                      </label>
                      <input
                        type="text"
                        name="nome"
                        className="form-control"
                        value={
                          empresas.data?.find(
                            (empresa) => empresa.id === empresaSelecionada
                          )?.nome
                        }
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Qual o CNPJ da sua empresa?
                      </label>
                      <InputMask
                        type="text"
                        name="cnpj"
                        className="form-control"
                        value={
                          empresas.data?.find(
                            (empresa) => empresa.id === empresaSelecionada
                          )?.cnpj
                        }
                        onChange={handleChange}
                        mask="99.999.999/9999-99"
                        placeholder="__.___-___"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Qual o endereço da sua empresa?
                      </label>
                      <input
                        type="text"
                        name="endereco"
                        className="form-control"
                        value={
                          empresas.data?.find(
                            (empresa) => empresa.id === empresaSelecionada
                          )?.endereco
                        }
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Qual o telefone da sua empresa?
                      </label>
                      <input
                        type="text"
                        name="telefone"
                        className="form-control"
                        value={
                          empresas.data?.find(
                            (empresa) => empresa.id === empresaSelecionada
                          )?.telefone
                        }
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Qual o e-mail da sua empresa?
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={
                          empresas.data?.find(
                            (empresa) => empresa.id === empresaSelecionada
                          )?.email
                        }
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Qual o horário de abertura da sua empresa durante a
                        semana?
                      </label>
                      <input
                        type="text"
                        name="horario_abertura_dia_semana"
                        className="form-control"
                        value={empresas.data
                          ?.find((empresa) => empresa.id === empresaSelecionada)
                          ?.horario_abertura_dia_semana?.toString()
                          .slice(0, 5)}
                        onChange={handleChange}
                        placeholder="Ex: 08:00"
                        pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Qual o horário de fechamento da sua empresa durante a
                        semana?
                      </label>
                      <input
                        type="text"
                        name="horario_fechamento_dia_semana"
                        className="form-control"
                        value={empresas.data
                          ?.find((empresa) => empresa.id === empresaSelecionada)
                          ?.horario_fechamento_dia_semana?.toString()
                          .slice(0, 5)}
                        onChange={handleChange}
                        placeholder="Ex: 18:00"
                        pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Caso sua empresa abra aos finais de semana, qual o
                        horário de abertura?
                      </label>
                      <input
                        type="text"
                        name="horario_abertura_fim_de_semana"
                        className="form-control"
                        value={empresas.data
                          ?.find((empresa) => empresa.id === empresaSelecionada)
                          ?.horario_abertura_fim_de_semana?.toString()
                          .slice(0, 5)}
                        onChange={handleChange}
                        placeholder="Ex: 10:00"
                        pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
                        required={abreSabado || abreDomingo}
                        disabled={!abreSabado && !abreDomingo}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Caso sua empresa feche aos finais de semana, qual o
                        horário de fechamento?
                      </label>
                      <input
                        type="text"
                        name="horario_fechamento_fim_de_semana"
                        className="form-control"
                        value={empresas.data
                          ?.find((empresa) => empresa.id === empresaSelecionada)
                          ?.horario_fechamento_fim_de_semana?.toString()
                          .slice(0, 5)}
                        onChange={handleChange}
                        placeholder="Ex: 22:00"
                        pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
                        required={abreSabado || abreDomingo}
                        disabled={!abreSabado && !abreDomingo}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Se houver pausa para intervalo, que horário inicia a
                        pausa?
                      </label>
                      <input
                        type="text"
                        name="horario_pausa_inicio"
                        className="form-control"
                        value={empresas.data
                          ?.find((empresa) => empresa.id === empresaSelecionada)
                          ?.horario_pausa_inicio?.toString()
                          .slice(0, 5)}
                        onChange={handleChange}
                        placeholder="Ex: 12:00"
                        pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
                        required={temPausa}
                        disabled={!temPausa}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Se houver pausa para intervalo, que horário termina a
                        pausa?
                      </label>
                      <input
                        type="text"
                        name="horario_pausa_fim"
                        className="form-control"
                        value={empresas.data
                          ?.find((empresa) => empresa.id === empresaSelecionada)
                          ?.horario_pausa_fim?.toString()
                          .slice(0, 5)}
                        onChange={handleChange}
                        placeholder="Ex: 13:00"
                        pattern="([01]?[0-9]|2[0-3]):([0-5][0-9])"
                        required={temPausa}
                        disabled={!temPausa}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Logo da Empresa</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleFileChange}
                        value={
                          empresas.data?.find(
                            (empresa) => empresa.id === empresaSelecionada
                          )?.logo
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">URL do Logo</label>
                      <input
                        type="text"
                        name="logo"
                        className="form-control"
                        value={
                          empresas.data?.find(
                            (empresa) => empresa.id === empresaSelecionada
                          )?.logo
                        }
                        onChange={handleChange}
                        placeholder="Ou insira a URL da imagem"
                      />
                    </div>

                    {empresa.logo && (
                      <div className="text-center mb-3">
                        <img
                          src={
                            empresas.data?.find(
                              (empresa) => empresa.id === empresaSelecionada
                            )?.logo
                          }
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
                        value={empresas.data
                          ?.find((empresa) => empresa.id === empresaSelecionada)
                          ?.abre_sabado?.toString()}
                        onChange={handleChange}
                      />
                      <label className="form-check-label ms-2">
                        Sua empresa abre no sábado?
                      </label>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        name="abre_domingo"
                        className="form-check-input"
                        value={empresas.data
                          ?.find((empresa) => empresa.id === empresaSelecionada)
                          ?.abre_domingo.toString()}
                        onChange={handleChange}
                      />
                      <label className="form-check-label ms-2">
                        Sua empresa abre no domingo?
                      </label>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        name="para_almoço"
                        className="form-check-input"
                        value={empresas.data
                          ?.find((empresa) => empresa.id === empresaSelecionada)
                          ?.para_almoço.toString()}
                        onChange={handleChange}
                      />
                      <label className="form-check-label ms-2">
                        Sua empresa tem intervalo no almoço?
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2"
                      style={{ borderRadius: "8px" }}
                      disabled={loading}
                    >
                      {loading ? "Editando..." : "Editar Empresa"}
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {acaoSelecionada === "remover" && (
            <>
              <div
                className="card shadow-lg p-4 border-0"
                style={{
                  maxWidth: "600px",
                  margin: "auto",
                  borderRadius: "12px",
                }}
              >
                <h2 className="text-center text-primary mb-4">
                  Remoção de Empresa
                </h2>
                <span className="text-danger text-center">
                  ATENÇÃO: Esta ação é irreversível!
                </span>
                <span className="text-danger text-center">
                  Todos os funcionários e dados da empresa serão removidos.
                </span>
                <br />
                <div className="mb-3 text-center">
                  <label className="form-label text-center fw-bold">
                    Selecione uma Empresa para Remover
                  </label>
                  <select
                    className="form-select"
                    onChange={(e) =>
                      setEmpresaSelecionada(Number(e.target.value))
                    }
                    value={empresaSelecionada || ""}
                    required
                  >
                    <option value="">Escolha uma empresa</option>
                    {empresas.data?.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nome}
                      </option>
                    ))}
                  </select>

                  {empresaSelecionada && (
                    <button
                      type="submit"
                      className="btn btn-danger w-100 py-2 mt-3"
                      style={{ borderRadius: "8px" }}
                      disabled={loading}
                    >
                      {loading ? "Removendo..." : "Remover Empresa"}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </form>

        {empresaCriada && (
          <Link
            to={`/criar-funcionario`}
            className="btn btn-secondary w-100 mt-3"
          >
            Criar Funcionarios para a Empresa
          </Link>
        )}
      </div>
    </div>
    </>
  );
};

export default EmpresaForm;
