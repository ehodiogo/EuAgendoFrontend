"use client";
import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { EmpresaCreate, Empresa } from "../interfaces/Empresa";
import { Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaBuilding, FaSpinner, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const EmpresaForm: React.FC = () => {
  const [acaoSelecionada, setAcaoSelecionada] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [abreSabado, setAbreSabado] = useState(false);
  const [abreDomingo, setAbreDomingo] = useState(false);
  const [temPausa, setTemPausa] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

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
    para_almoco: false,
    horario_pausa_inicio: "",
    horario_pausa_fim: "",
  });
  const [empresaCriada, setEmpresaCriada] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<number | null>(null);
  const empresas = useFetch<Empresa[]>(`api/empresas-usuario/?usuario_token=${localStorage.getItem("access_token")}`);

  useEffect(() => {
    AOS.init({ duration: 800 });
    setAbreSabado(empresa.abre_sabado);
    setAbreDomingo(empresa.abre_domingo);
    setTemPausa(empresa.para_almoco);
    if (acaoSelecionada === "editar" && empresaSelecionada) {
      const selectedEmpresa = empresas.data?.find((emp) => emp.id === empresaSelecionada);
      if (selectedEmpresa) {
        setEmpresa({
          nome: selectedEmpresa.nome || "",
          cnpj: selectedEmpresa.cnpj || "",
          endereco: selectedEmpresa.endereco || "",
          telefone: selectedEmpresa.telefone || "",
          email: selectedEmpresa.email || "",
          servicos: selectedEmpresa.servicos || [],
          logo: selectedEmpresa.logo || "",
          horario_abertura_dia_semana: selectedEmpresa.horario_abertura_dia_semana?.slice(0, 5) || "",
          horario_fechamento_dia_semana: selectedEmpresa.horario_fechamento_dia_semana?.slice(0, 5) || "",
          horario_abertura_fim_de_semana: selectedEmpresa.horario_abertura_fim_de_semana?.slice(0, 5) || "",
          horario_fechamento_fim_de_semana: selectedEmpresa.horario_fechamento_fim_de_semana?.slice(0, 5) || "",
          abre_sabado: selectedEmpresa.abre_sabado || false,
          abre_domingo: selectedEmpresa.abre_domingo || false,
          para_almoco: selectedEmpresa.para_almoco || false,
          horario_pausa_inicio: selectedEmpresa.horario_pausa_inicio?.slice(0, 5) || "",
          horario_pausa_fim: selectedEmpresa.horario_pausa_fim?.slice(0, 5) || "",
        });
      }
    }
  }, [empresaSelecionada, acaoSelecionada, empresas.data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    console.log(`Field: ${name}, Value: ${value}`); // Debug log
    setEmpresa((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "abre_sabado") setAbreSabado(checked);
    if (name === "abre_domingo") setAbreDomingo(checked);
    if (name === "para_almoco") setTemPausa(checked);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError("A imagem deve ter menos de 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmpresa((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!acaoSelecionada) {
      setFormError("Selecione uma ação.");
      return false;
    }
    if (acaoSelecionada === "cadastrar" || acaoSelecionada === "editar") {
      if (!empresa.nome.trim()) return setFormError("O nome da empresa é obrigatório."), false;
      if (!empresa.cnpj || !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(empresa.cnpj)) return setFormError("CNPJ inválido."), false;
      if (!empresa.endereco.trim()) return setFormError("O endereço é obrigatório."), false;
      if (!empresa.telefone || !/^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(empresa.telefone)) return setFormError("Telefone inválido."), false;
      if (!empresa.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresa.email)) return setFormError("E-mail inválido."), false;
      if (!empresa.horario_abertura_dia_semana || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(empresa.horario_abertura_dia_semana)) return setFormError("Horário de abertura (semana) inválido."), false;
      if (!empresa.horario_fechamento_dia_semana || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(empresa.horario_fechamento_dia_semana)) return setFormError("Horário de fechamento (semana) inválido."), false;
      if ((abreSabado || abreDomingo) && (!empresa.horario_abertura_fim_de_semana || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(empresa.horario_abertura_fim_de_semana))) return setFormError("Horário de abertura (fim de semana) inválido."), false;
      if ((abreSabado || abreDomingo) && (!empresa.horario_fechamento_fim_de_semana || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(empresa.horario_fechamento_fim_de_semana))) return setFormError("Horário de fechamento (fim de semana) inválido."), false;
      if (temPausa && (!empresa.horario_pausa_inicio || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(empresa.horario_pausa_inicio))) return setFormError("Horário de início da pausa inválido."), false;
      if (temPausa && (!empresa.horario_pausa_fim || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(empresa.horario_pausa_fim))) return setFormError("Horário de fim da pausa inválido."), false;
    }
    if (acaoSelecionada === "editar" && !empresaSelecionada) return setFormError("Selecione uma empresa para editar."), false;
    if (acaoSelecionada === "remover" && !empresaSelecionada) return setFormError("Selecione uma empresa para remover."), false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    setFormSuccess(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const url = window.location.origin.includes("localhost:5173")
      ? "http://localhost:8000"
      : "https://backend-production-7438.up.railway.app";

    if (acaoSelecionada === "cadastrar") {
      try {
        const payload_limite = {
          usuario_token: localStorage.getItem("access_token"),
          acao_realizada: "criar_empresa",
        };
        const limiteResponse = await fetch(`${url}/api/possui-limite/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload_limite),
        });
        if (!limiteResponse.ok) throw new Error("Erro ao verificar limite de empresas.");
        const limiteData = await limiteResponse.json();
        if (!limiteData.possui_limite) {
          setFormError("Você atingiu o limite de empresas cadastradas.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        if (empresa.logo && empresa.logo.startsWith("data:image")) {
          const blob = await fetch(empresa.logo).then((res) => res.blob());
          formData.append("logo", blob, "logo.png");
        } else if (empresa.logo) {
          formData.append("logo", empresa.logo);
        }

        const requiredFields = [
          "nome", "cnpj", "endereco", "telefone", "email",
          "horario_abertura_dia_semana", "horario_fechamento_dia_semana",
          "horario_abertura_fim_de_semana", "horario_fechamento_fim_de_semana",
          "horario_pausa_inicio", "horario_pausa_fim",
        ];
        requiredFields.forEach((field) => formData.append(field, empresa[field as keyof EmpresaCreate] as string || ""));
        formData.append("abre_sabado", empresa.abre_sabado.toString());
        formData.append("abre_domingo", empresa.abre_domingo.toString());
        formData.append("para_almoco", empresa.para_almoco.toString());
        formData.append("usuario_token", localStorage.getItem("access_token") || "");

        const response = await fetch(`${url}/api/empresa-create/`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Erro ao cadastrar empresa.");
        setFormSuccess("Empresa cadastrada com sucesso!");
        setEmpresaCriada(true);
        setEmpresa({
          nome: "", cnpj: "", endereco: "", telefone: "", email: "", servicos: [], logo: "",
          horario_abertura_dia_semana: "", horario_fechamento_dia_semana: "",
          horario_abertura_fim_de_semana: "", horario_fechamento_fim_de_semana: "",
          abre_sabado: false, abre_domingo: false, para_almoco: false,
          horario_pausa_inicio: "", horario_pausa_fim: "",
        });
      } catch (error: unknown) {
        setFormError(`Erro ao cadastrar empresa: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else if (acaoSelecionada === "editar") {
      try {
        const formData = new FormData();
        if (empresa.logo && empresa.logo.startsWith("data:image")) {
          const blob = await fetch(empresa.logo).then((res) => res.blob());
          formData.append("logo", blob, "logo.png");
        } else if (empresa.logo) {
          formData.append("logo", empresa.logo);
        }

        const requiredFields = [
          "nome", "cnpj", "endereco", "telefone", "email",
          "horario_abertura_dia_semana", "horario_fechamento_dia_semana",
          "horario_abertura_fim_de_semana", "horario_fechamento_fim_de_semana",
          "horario_pausa_inicio", "horario_pausa_fim",
        ];
        requiredFields.forEach((field) => formData.append(field, empresa[field as keyof EmpresaCreate] as string || ""));
        formData.append("abre_sabado", empresa.abre_sabado.toString());
        formData.append("abre_domingo", empresa.abre_domingo.toString());
        formData.append("para_almoco", empresa.para_almoco.toString());
        formData.append("usuario_token", localStorage.getItem("access_token") || "");
        formData.append("empresa_id", empresaSelecionada!.toString());

        const response = await fetch(`${url}/api/editar-empresa/`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Erro ao editar empresa.");
        setFormSuccess("Empresa editada com sucesso!");
        setEmpresaSelecionada(null);
      } catch (error: unknown) {
        setFormError(`Erro ao editar empresa: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else if (acaoSelecionada === "remover") {
      try {
        const payload = {
          empresa_id: empresaSelecionada,
          usuario_token: localStorage.getItem("access_token"),
        };
        const response = await fetch(`${url}/api/remover-empresa/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Erro ao remover empresa.");
        setFormSuccess("Empresa removida com sucesso!");
        setEmpresaSelecionada(null);
      } catch (error: unknown) {
        setFormError(`Erro ao remover empresa: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="empresa-form-container">
        <style>{`
          /* Paleta de cores */
          :root {
            --primary-blue: #003087;
            --light-blue: #4dabf7;
            --dark-gray: #2d3748;
            --light-gray: #f7fafc;
            --white: #ffffff;
            --pastel-green: #b8e2c8;
            --pastel-red: #f4c7c3;
            --warning-orange: #fd7e14;
          }

          /* Container */
          .empresa-form-container {
            background-color: var(--light-gray);
            padding: 3rem 1rem;
            min-height: calc(100vh - 56px);
          }

          /* Card */
          .empresa-card {
            max-width: 600px;
            margin: 0 auto;
            background-color: var(--white);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 2rem;
          }

          /* Título */
          .empresa-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--primary-blue);
            text-align: center;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          /* Formulário */
          .empresa-form .form-label {
            color: var(--primary-blue);
            font-weight: 600;
            font-size: 1rem;
          }
          .empresa-form .form-control,
          .empresa-form .form-select {
            border: 1px solid var(--light-blue);
            border-radius: 8px;
            padding: 0.75rem;
            font-size: 1rem;
            color: var(--dark-gray);
            pointer-events: auto; /* Ensure inputs are interactive */
            user-select: auto; /* Ensure text can be selected */
          }
          .empresa-form .form-control:focus,
          .empresa-form .form-select:focus {
            border-color: var(--primary-blue);
            box-shadow: 0 0 5px rgba(0, 48, 135, 0.3);
          }
          .empresa-form .form-check-label {
            color: var(--dark-gray);
          }
          .empresa-form .btn-primary {
            background-color: var(--primary-blue);
            border-color: var(--primary-blue);
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .empresa-form .btn-primary:hover {
            background-color: var(--light-blue);
            border-color: var(--light-blue);
            transform: translateY(-2px);
          }
          .empresa-form .btn-success {
            background-color: var(--pastel-green);
            border-color: var(--pastel-green);
            color: var(--dark-gray);
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .empresa-form .btn-success:hover {
            background-color: #a0d1b0;
            border-color: #a0d1b0;
            transform: translateY(-2px);
          }
          .empresa-form .btn-danger {
            background-color: var(--pastel-red);
            border-color: var(--pastel-red);
            color: var(--dark-gray);
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .empresa-form .btn-danger:hover {
            background-color: #e0b3af;
            border-color: #e0b3af;
            transform: translateY(-2px);
          }
          .empresa-form .btn-secondary {
            background-color: var(--dark-gray);
            border-color: var(--dark-gray);
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .empresa-form .btn-secondary:hover {
            background-color: var(--light-blue);
            border-color: var(--light-blue);
            transform: translateY(-2px);
          }

          /* Mensagens */
          .toast-message {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1rem;
            max-width: 400px;
          }
          .toast-message.success {
            background-color: var(--pastel-green);
            color: var(--dark-gray);
            border: 1px solid #a0d1b0;
          }
          .toast-message.error {
            background-color: var(--pastel-red);
            color: var(--dark-gray);
            border: 1px solid #e0b3af;
          }
          .warning-text {
            color: var(--pastel-red);
            font-weight: 600;
            text-align: center;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }
          .logo-preview {
            max-width: 200px;
            border-radius: 8px;
            margin: 1rem auto;
            display: block;
          }

          /* Responsividade */
          @media (max-width: 991px) {
            .empresa-form-container {
              padding: 2rem 1rem;
            }
            .empresa-card {
              padding: 1.5rem;
            }
            .empresa-title {
              font-size: 1.5rem;
            }
          }
          @media (max-width: 576px) {
            .empresa-card {
              padding: 1rem;
            }
            .empresa-title {
              font-size: 1.25rem;
            }
            .empresa-form .form-label {
              font-size: 0.9rem;
            }
            .empresa-form .form-control,
            .empresa-form .form-select {
              font-size: 0.9rem;
              padding: 0.5rem;
            }
            .empresa-form .btn-primary,
            .empresa-form .btn-success,
            .empresa-form .btn-danger,
            .empresa-form .btn-secondary {
              font-size: 0.9rem;
              padding: 0.5rem;
            }
            .toast-message {
              top: 10px;
              right: 10px;
              font-size: 0.9rem;
              padding: 0.75rem 1rem;
            }
          }
        `}</style>
        <div className="empresa-form-container">
          {formSuccess && (
            <div className="toast-message success" data-aos="fade-left">
              <FaCheckCircle /> {formSuccess}
            </div>
          )}
          {formError && (
            <div className="toast-message error" data-aos="fade-left">
              <FaExclamationTriangle /> {formError}
            </div>
          )}
          {empresas.loading ? (
            <div className="text-center" data-aos="fade-up">
              <FaSpinner className="fa-spin" style={{ fontSize: "1.5rem", color: "var(--primary-blue)" }} /> Carregando...
            </div>
          ) : (
            <div className="empresa-card" data-aos="fade-up">
              <h2 className="empresa-title">
                <FaBuilding /> Gerenciar Empresas
              </h2>
              <form onSubmit={handleSubmit} className="empresa-form">
                <div className="mb-3">
                  <label className="form-label">Ação</label>
                  <select
                    className="form-select"
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
                  <div className="empresa-card" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="empresa-title">Cadastrar Empresa</h3>
                    <div className="mb-3">
                      <label className="form-label">Nome da Empresa</label>
                      <input
                        type="text"
                        name="nome"
                        className="form-control"
                        value={empresa.nome}
                        onChange={handleChange}
                        placeholder="Ex: Minha Empresa"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">CNPJ</label>
                      <InputMask
                        mask="99.999.999/9999-99"
                        value={empresa.cnpj}
                        onChange={handleChange}
                        placeholder="00.000.000/0000-00"
                        name="cnpj"
                        className="form-control"
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
                        placeholder="Ex: Rua Exemplo, 123"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Telefone</label>
                      <InputMask
                        mask="(99) 99999-9999"
                        value={empresa.telefone}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                        name="telefone"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">E-mail</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={empresa.email}
                        onChange={handleChange}
                        placeholder="Ex: contato@empresa.com"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Horário de Abertura (Semana)</label>
                      <InputMask
                        mask="99:99"
                        value={empresa.horario_abertura_dia_semana}
                        onChange={handleChange}
                        placeholder="Ex: 08:00"
                        name="horario_abertura_dia_semana"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Horário de Fechamento (Semana)</label>
                      <InputMask
                        mask="99:99"
                        value={empresa.horario_fechamento_dia_semana}
                        onChange={handleChange}
                        placeholder="Ex: 18:00"
                        name="horario_fechamento_dia_semana"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        name="abre_sabado"
                        className="form-check-input"
                        checked={empresa.abre_sabado}
                        onChange={handleChange}
                      />
                      <label className="form-check-label ms-2">Abre no sábado</label>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        name="abre_domingo"
                        className="form-check-input"
                        checked={empresa.abre_domingo}
                        onChange={handleChange}
                      />
                      <label className="form-check-label ms-2">Abre no domingo</label>
                    </div>
                    {(abreSabado || abreDomingo) && (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Horário de Abertura (Fim de Semana)</label>
                          <InputMask
                            mask="99:99"
                            value={empresa.horario_abertura_fim_de_semana}
                            onChange={handleChange}
                            placeholder="Ex: 10:00"
                            name="horario_abertura_fim_de_semana"
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Horário de Fechamento (Fim de Semana)</label>
                          <InputMask
                            mask="99:99"
                            value={empresa.horario_fechamento_fim_de_semana}
                            onChange={handleChange}
                            placeholder="Ex: 22:00"
                            name="horario_fechamento_fim_de_semana"
                            className="form-control"
                            required
                          />
                        </div>
                      </>
                    )}
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        name="para_almoco"
                        className="form-check-input"
                        checked={empresa.para_almoco}
                        onChange={handleChange}
                      />
                      <label className="form-check-label ms-2">Intervalo para almoço</label>
                    </div>
                    {temPausa && (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Início da Pausa</label>
                          <InputMask
                            mask="99:99"
                            value={empresa.horario_pausa_inicio}
                            onChange={handleChange}
                            placeholder="Ex: 12:00"
                            name="horario_pausa_inicio"
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Fim da Pausa</label>
                          <InputMask
                            mask="99:99"
                            value={empresa.horario_pausa_fim}
                            onChange={handleChange}
                            placeholder="Ex: 13:00"
                            name="horario_pausa_fim"
                            className="form-control"
                            required
                          />
                        </div>
                      </>
                    )}
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
                      <img src={empresa.logo} alt="Prévia do logo" className="logo-preview" />
                    )}
                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                      {loading ? <><FaSpinner className="fa-spin me-2" />Cadastrando...</> : "Cadastrar Empresa"}
                    </button>
                  </div>
                )}

                {acaoSelecionada === "editar" && (
                  <div className="empresa-card" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="empresa-title">Editar Empresa</h3>
                    <div className="mb-3">
                      <label className="form-label">Selecione uma Empresa</label>
                      <select
                        className="form-select"
                        onChange={(e) => setEmpresaSelecionada(Number(e.target.value))}
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
                          <label className="form-label">Nome da Empresa</label>
                          <input
                            type="text"
                            name="nome"
                            className="form-control"
                            value={empresa.nome}
                            onChange={handleChange}
                            placeholder="Ex: Minha Empresa"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">CNPJ</label>
                          <InputMask
                            mask="99.999.999/9999-99"
                            value={empresa.cnpj}
                            onChange={handleChange}
                            placeholder="00.000.000/0000-00"
                            name="cnpj"
                            className="form-control"
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
                            placeholder="Ex: Rua Exemplo, 123"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Telefone</label>
                          <InputMask
                            mask="(99) 99999-9999"
                            value={empresa.telefone}
                            onChange={handleChange}
                            placeholder="(00) 00000-0000"
                            name="telefone"
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">E-mail</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={empresa.email}
                            onChange={handleChange}
                            placeholder="Ex: contato@empresa.com"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Horário de Abertura (Semana)</label>
                          <InputMask
                            mask="99:99"
                            value={empresa.horario_abertura_dia_semana}
                            onChange={handleChange}
                            placeholder="Ex: 08:00"
                            name="horario_abertura_dia_semana"
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Horário de Fechamento (Semana)</label>
                          <InputMask
                            mask="99:99"
                            value={empresa.horario_fechamento_dia_semana}
                            onChange={handleChange}
                            placeholder="Ex: 18:00"
                            name="horario_fechamento_dia_semana"
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="form-check mb-3">
                          <input
                            type="checkbox"
                            name="abre_sabado"
                            className="form-check-input"
                            checked={empresa.abre_sabado}
                            onChange={handleChange}
                          />
                          <label className="form-check-label ms-2">Abre no sábado</label>
                        </div>
                        <div className="form-check mb-3">
                          <input
                            type="checkbox"
                            name="abre_domingo"
                            className="form-check-input"
                            checked={empresa.abre_domingo}
                            onChange={handleChange}
                          />
                          <label className="form-check-label ms-2">Abre no domingo</label>
                        </div>
                        {(abreSabado || abreDomingo) && (
                          <>
                            <div className="mb-3">
                              <label className="form-label">Horário de Abertura (Fim de Semana)</label>
                              <InputMask
                                mask="99:99"
                                value={empresa.horario_abertura_fim_de_semana}
                                onChange={handleChange}
                                placeholder="Ex: 10:00"
                                name="horario_abertura_fim_de_semana"
                                className="form-control"
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Horário de Fechamento (Fim de Semana)</label>
                              <InputMask
                                mask="99:99"
                                value={empresa.horario_fechamento_fim_de_semana}
                                onChange={handleChange}
                                placeholder="Ex: 22:00"
                                name="horario_fechamento_fim_de_semana"
                                className="form-control"
                                required
                              />
                            </div>
                          </>
                        )}
                        <div className="form-check mb-3">
                          <input
                            type="checkbox"
                            name="para_almoco"
                            className="form-check-input"
                            checked={empresa.para_almoco}
                            onChange={handleChange}
                          />
                          <label className="form-check-label ms-2">Intervalo para almoço</label>
                        </div>
                        {temPausa && (
                          <>
                            <div className="mb-3">
                              <label className="form-label">Início da Pausa</label>
                              <InputMask
                                mask="99:99"
                                value={empresa.horario_pausa_inicio}
                                onChange={handleChange}
                                placeholder="Ex: 12:00"
                                name="horario_pausa_inicio"
                                className="form-control"
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Fim da Pausa</label>
                              <InputMask
                                mask="99:99"
                                value={empresa.horario_pausa_fim}
                                onChange={handleChange}
                                placeholder="Ex: 13:00"
                                name="horario_pausa_fim"
                                className="form-control"
                                required
                              />
                            </div>
                          </>
                        )}
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
                          <img src={empresa.logo} alt="Prévia do logo" className="logo-preview" />
                        )}
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                          {loading ? <><FaSpinner className="fa-spin me-2" />Editando...</> : "Editar Empresa"}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {acaoSelecionada === "remover" && (
                  <div className="empresa-card" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="empresa-title">Remover Empresa</h3>
                    <div className="warning-text">
                      <FaExclamationTriangle /> Atenção: Esta ação é irreversível!
                    </div>
                    <div className="warning-text">
                      <FaExclamationTriangle /> Todos os funcionários e dados da empresa serão removidos.
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Selecione uma Empresa</label>
                      <select
                        className="form-select"
                        onChange={(e) => setEmpresaSelecionada(Number(e.target.value))}
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
                      <button type="submit" className="btn btn-danger w-100" disabled={loading}>
                        {loading ? <><FaSpinner className="fa-spin me-2" />Removendo...</> : "Remover Empresa"}
                      </button>
                    )}
                  </div>
                )}

                {empresaCriada && (
                  <Link to="/criar-funcionario" className="btn btn-secondary w-100 mt-3">
                    Criar Funcionários para a Empresa
                  </Link>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmpresaForm;