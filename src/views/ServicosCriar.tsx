"use client";
import React, { useState, useEffect } from "react";
import { ServicoCreate, Servico } from "../interfaces/Servico";
import { FuncionarioServicos } from "../interfaces/ServicosFuncionarios";
import { Empresa } from "../interfaces/Empresa";
import axios from "axios";
import { useFetch } from "../functions/GetData";
import Navbar from "../components/Navbar";
import "aos/dist/aos.css";
import { FaTools, FaSpinner, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { InputMask } from "@react-input/mask";

const ServicoForm: React.FC = () => {
  const [acaoSelecionada, setAcaoSelecionada] = useState<string>("");
  const [servico, setServico] = useState<ServicoCreate>({
    nome: "",
    descricao: "",
    duracao: "",
    preco: "",
    funcionarios: [],
  });
  const [editServico, setEditServico] = useState<Servico | null>(null);
  const [funcionarios, setFuncionarios] = useState<FuncionarioServicos[]>([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<number | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const token = localStorage.getItem("access_token");
  const empresas = useFetch<Empresa[]>(`api/empresas-usuario/?usuario_token=${token}`);
  const [servicosEmpresa, setServicosEmpresa] = useState<Servico[]>([]);

  useEffect(() => {
    if (!empresaSelecionada) return;

    const fetchFuncionarios = async () => {
      if (!token) {
        setFormError("Usuário não autenticado.");
        return;
      }
      try {
        const url = import.meta.env.VITE_API_URL;
        const { data } = await axios.get(`${url}/api/funcionarios-criados/`, {
          params: { empresa_id: empresaSelecionada, usuario_token: token },
        });
        setFuncionarios(Array.isArray(data.funcionarios) ? data.funcionarios : []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setFormError("Falha ao carregar funcionários.");
      }
    };

    const fetchServicos = async () => {
      if (!token) {
        setFormError("Usuário não autenticado.");
        return;
      }
      try {
        const url = import.meta.env.VITE_API_URL;

        const { data } = await axios.get(`${url}/api/servicos-criados-usuario-empresa/`, {
          params: { empresa_id: empresaSelecionada, usuario_token: token },
        });
        setServicosEmpresa(Array.isArray(data.servicos) ? data.servicos : []);
      } catch (error) {
        setFormError("Falha ao carregar serviços.");
      }
    };

    fetchFuncionarios();
    fetchServicos();
  }, [empresaSelecionada, token]);

  useEffect(() => {
    if (acaoSelecionada === "editar" && servicoSelecionado) {
      setEditServico(servicoSelecionado);
    }
  }, [acaoSelecionada, servicoSelecionado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setServico((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editServico) {
      const { name, value } = e.target;
      setEditServico((prev) => prev ? { ...prev, [name]: value } : prev);
    }
  };

  const handleFuncionarioChange = (id: number) => {
    setServico((prev) => ({
      ...prev,
      funcionarios: prev.funcionarios.includes(id)
        ? prev.funcionarios.filter((fid) => fid !== id)
        : [...prev.funcionarios, id],
    }));
  };

  const validateForm = () => {
    if (!acaoSelecionada) return setFormError("Selecione uma ação."), false;
    if (!empresaSelecionada) return setFormError("Selecione uma empresa."), false;
    if (acaoSelecionada === "cadastrar") {
      if (!servico.nome.trim()) return setFormError("O nome do serviço é obrigatório."), false;
      if (!servico.duracao || !/^\d+$/.test(servico.duracao)) return setFormError("A duração deve ser um número inteiro (minutos)."), false;
      if (!servico.preco || !/^\d+(\.\d{1,2})?$/.test(servico.preco)) return setFormError("O preço deve ser um valor numérico válido (ex: 99.99)."), false;
      if (!servico.funcionarios.length) return setFormError("Selecione ao menos um funcionário."), false;
    }
    if ((acaoSelecionada === "adicionar" || acaoSelecionada === "remover-funcionarios") && !servicoSelecionado) return setFormError("Selecione um serviço."), false;
    if (acaoSelecionada === "remover" && !servicoSelecionado) return setFormError("Selecione um serviço para remover."), false;
    if (acaoSelecionada === "editar" && editServico) {
      if (!editServico.nome.trim()) return setFormError("O nome do serviço é obrigatório."), false;
      if (!editServico.duracao || !/^\d+$/.test(editServico.duracao)) return setFormError("A duração deve ser um número inteiro (minutos)."), false;
      if (!editServico.preco || !/^\d+(\.\d{1,2})?$/.test(editServico.preco)) return setFormError("O preço deve ser um valor numérico válido (ex: 99.99)."), false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    setFormSuccess(null);

    if (!token) {
      setFormError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const url = import.meta.env.VITE_API_URL;

    if (acaoSelecionada === "cadastrar") {
      try {
        const payload = {
          usuario_token: token,
          funcionarios: servico.funcionarios,
          servico_nome: servico.nome,
          servico_descricao: servico.descricao,
          servico_duracao: servico.duracao,
          servico_valor: servico.preco,
          empresa_id: empresaSelecionada,
        };
        await axios.post(`${url}/api/adicionar-servicos-funcionario/`, payload, {
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        });
        setFormSuccess("Serviço cadastrado com sucesso!");
        setServico({ nome: "", descricao: "", duracao: "", preco: "", funcionarios: [] });
        setServicosEmpresa((prev) => [
          ...prev,
          { id: Date.now(), nome: servico.nome, descricao: servico.descricao, duracao: servico.duracao, preco: servico.preco, funcionarios: servico.funcionarios },
        ]);
      } catch (error) {
        // @ts-ignore
        setFormError(`Falha ao cadastrar serviço: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else if (acaoSelecionada === "adicionar") {
      try {
        const payload = {
          usuario_token: token,
          empresa_id: empresaSelecionada,
          funcionarios: servico.funcionarios,
          servico_id: servicoSelecionado!.id,
        };
        await axios.post(`${url}/api/adicionar-servico-funcionarios/`, payload, {
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        });
        setFormSuccess("Serviço adicionado aos funcionários com sucesso!");
        setServico({ nome: "", descricao: "", duracao: "", preco: "", funcionarios: [] });
        setServicoSelecionado(null);
        setServicosEmpresa((prev) =>
          prev.map((s) =>
            s.id === servicoSelecionado!.id
              ? { ...s, funcionarios: [...s.funcionarios, ...servico.funcionarios] }
              : s
          )
        );
      } catch (error) {
        // @ts-ignore
        setFormError(`Falha ao adicionar serviço aos funcionários: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else if (acaoSelecionada === "remover") {
      try {
        const payload = {
          usuario_token: token,
          empresa_id: empresaSelecionada,
          servico_id: servicoSelecionado!.id,
        };
        await axios.post(`${url}/api/remover-servico-empresa/`, payload, {
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        });
        setFormSuccess("Serviço removido com sucesso!");
        setServicoSelecionado(null);
        setServicosEmpresa((prev) => prev.filter((s) => s.id !== servicoSelecionado!.id));
      } catch (error) {
        // @ts-ignore
        setFormError(`Falha ao remover serviço: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else if (acaoSelecionada === "remover-funcionarios") {
      try {
        const payload = {
          usuario_token: token,
          empresa_id: empresaSelecionada,
          servico_id: servicoSelecionado!.id,
          funcionarios: servico.funcionarios,
        };
        await axios.post(`${url}/api/remover-servicos-funcionario/`, payload, {
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        });
        setFormSuccess("Serviço removido dos funcionários com sucesso!");
        setServico({ nome: "", descricao: "", duracao: "", preco: "", funcionarios: [] });
        setServicoSelecionado(null);
        setServicosEmpresa((prev) =>
          prev.map((s) =>
            s.id === servicoSelecionado!.id
              ? { ...s, funcionarios: s.funcionarios.filter((id) => !servico.funcionarios.includes(id)) }
              : s
          )
        );
      } catch (error) {
        // @ts-ignore
        setFormError(`Falha ao remover serviço dos funcionários: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else if (acaoSelecionada === "editar" && editServico) {
      try {
        const payload = {
          usuario_token: token,
          servico_id: editServico.id,
          servico_nome: editServico.nome,
          servico_descricao: editServico.descricao,
          servico_duracao: editServico.duracao,
          servico_preco: editServico.preco,
        };
        await axios.post(`${url}/api/editar-servico/`, payload, {
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        });
        setFormSuccess("Serviço editado com sucesso!");
        setEditServico(null);
        setServicoSelecionado(null);
        setServicosEmpresa((prev) =>
          prev.map((s) => (s.id === editServico.id ? editServico : s))
        );
      } catch (error) {
        // @ts-ignore
        setFormError(`Falha ao editar serviço: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="servico-form-container">
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
          .servico-form-container {
            background-color: var(--light-gray);
            padding: 3rem 1rem;
            min-height: calc(100vh - 56px);
          }

          /* Card */
          .servico-card {
            max-width: 600px;
            margin: 0 auto;
            background-color: var(--white);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 2rem;
          }

          /* Título */
          .servico-title {
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
          .servico-form .form-label {
            color: var(--primary-blue);
            font-weight: 600;
            font-size: 1rem;
          }
          .servico-form .form-control,
          .servico-form .form-select,
          .servico-form textarea {
            border: 1px solid var(--light-blue);
            border-radius: 8px;
            padding: 0.75rem;
            font-size: 1rem;
            color: var(--dark-gray);
          }
          .servico-form .form-control:focus,
          .servico-form .form-select:focus,
          .servico-form textarea:focus {
            border-color: var(--primary-blue);
            box-shadow: 0 0 5px rgba(0, 48, 135, 0.3);
          }
          .servico-form .list-group-item {
            border-radius: 8px;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
          }
          .servico-form .btn-primary {
            background-color: var(--primary-blue);
            border-color: var(--primary-blue);
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .servico-form .btn-primary:hover {
            background-color: var(--light-blue);
            border-color: var(--light-blue);
            transform: translateY(-2px);
          }
          .servico-form .btn-success {
            background-color: var(--pastel-green);
            border-color: var(--pastel-green);
            color: var(--dark-gray);
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .servico-form .btn-success:hover {
            background-color: #a0d1b0;
            border-color: #a0d1b0;
            transform: translateY(-2px);
          }
          .servico-form .btn-danger {
            background-color: var(--pastel-red);
            border-color: var(--pastel-red);
            color: var(--dark-gray);
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .servico-form .btn-danger:hover {
            background-color: #e0b3af;
            border-color: #e0b3af;
            transform: translateY(-2px);
          }
          .employee-photo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
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

          /* Responsividade */
          @media (max-width: 991px) {
            .servico-form-container {
              padding: 2rem 1rem;
            }
            .servico-card {
              padding: 1.5rem;
            }
            .servico-title {
              font-size: 1.5rem;
            }
          }
          @media (max-width: 576px) {
            .servico-card {
              padding: 1rem;
            }
            .servico-title {
              font-size: 1.25rem;
            }
            .servico-form .form-label {
              font-size: 0.9rem;
            }
            .servico-form .form-control,
            .servico-form .form-select,
            .servico-form textarea {
              font-size: 0.9rem;
              padding: 0.5rem;
            }
            .servico-form .btn-primary,
            .servico-form .btn-success,
            .servico-form .btn-danger {
              font-size: 0.9rem;
              padding: 0.5rem;
            }
            .toast-message {
              top: 10px;
              right: 10px;
              font-size: 0.9rem;
              padding: 0.75rem 1rem;
            }
            .employee-photo {
              width: 30px;
              height: 30px;
            }
          }
        `}</style>
        <div className="servico-form-container">
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
            <div className="servico-card" data-aos="fade-up">
              <h2 className="servico-title">
                <FaTools /> Gerenciar Serviços
              </h2>
              <form onSubmit={handleSubmit} className="servico-form">
                <div className="mb-3">
                  <label className="form-label">Ação</label>
                  <select
                    className="form-select"
                    onChange={(e) => {
                      setAcaoSelecionada(e.target.value);
                      setServico({ nome: "", descricao: "", duracao: "", preco: "", funcionarios: [] });
                      setServicoSelecionado(null);
                      setEditServico(null);
                    }}
                    value={acaoSelecionada}
                    required
                  >
                    <option value="">Escolha uma ação</option>
                    <option value="cadastrar">Cadastrar Serviço</option>
                    <option value="adicionar">Adicionar Serviço a Funcionários</option>
                    <option value="remover-funcionarios">Remover Serviço de Funcionários</option>
                    <option value="remover">Remover Serviço</option>
                    <option value="editar">Editar Serviço</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Selecione uma Empresa</label>
                  <select
                    className="form-select"
                    onChange={(e) => {
                      setEmpresaSelecionada(Number(e.target.value) || null);
                      setServicoSelecionado(null);
                      setEditServico(null);
                    }}
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

                {acaoSelecionada === "cadastrar" && empresaSelecionada && (
                  <div className="servico-card" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="servico-title">Cadastrar Serviço</h3>
                    <div className="mb-3">
                      <label className="form-label">Nome</label>
                      <input
                        type="text"
                        name="nome"
                        className="form-control"
                        value={servico.nome}
                        onChange={handleChange}
                        placeholder="Ex: Corte de Cabelo"
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
                        placeholder="Descreva o serviço"
                        rows={4}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Duração (minutos)</label>
                      <input
                        type="text"
                        name="duracao"
                        className="form-control"
                        value={servico.duracao}
                        onChange={handleChange}
                        placeholder="Ex: 30"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Preço (R$)</label>
                      <InputMask
                        mask="999999.99"
                        replacement={{ 9: /[0-9]/ }}
                        value={servico.preco}
                        onChange={handleChange}
                        name="preco"
                        className="form-control"
                        placeholder="Ex: 50.00"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Funcionários</label>
                      <ul className="list-group">
                        {funcionarios.map(({ id, nome, foto_url, servicos }) => {
                          const empresaSelecionadaObjeto = empresas.data?.find((e) => e.id === empresaSelecionada);
                          const funcionarioSelecionado = empresaSelecionadaObjeto?.funcionarios?.some(
                            (funcionario) => funcionario.id === id
                          );
                          if (!funcionarioSelecionado) return null;
                          return (
                            <li key={id} className="list-group-item">
                              <input
                                type="checkbox"
                                checked={servico.funcionarios.includes(id)}
                                onChange={() => handleFuncionarioChange(id)}
                              />
                              <span className="ms-2">{nome}</span>
                              {foto_url && <img src={foto_url} alt={nome} className="employee-photo ms-2" />}
                              {servicos?.length > 0 && (
                                <div className="text-muted ms-2">
                                  <strong>Serviços Associados:</strong>
                                  <ul>
                                    {servicos.map((s) => (
                                      <li key={s.id}>
                                        {s.nome} - R${s.preco} - {s.duracao} min
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                      {loading ? <><FaSpinner className="fa-spin me-2" />Cadastrando...</> : "Cadastrar Serviço"}
                    </button>
                  </div>
                )}

                {(acaoSelecionada === "adicionar" || acaoSelecionada === "remover-funcionarios") && empresaSelecionada && (
                  <div className="servico-card" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="servico-title">{acaoSelecionada === "adicionar" ? "Adicionar Serviço a Funcionários" : "Remover Serviço de Funcionários"}</h3>
                    <div className="mb-3">
                      <label className="form-label">Selecione um Serviço</label>
                      <select
                        className="form-select"
                        onChange={(e) => {
                          const servicoId = Number(e.target.value);
                          setServicoSelecionado(servicosEmpresa.find((s) => s.id === servicoId) || null);
                          setServico((prev) => ({ ...prev, funcionarios: [] }));
                        }}
                        value={servicoSelecionado?.id || ""}
                        required
                      >
                        <option value="">Escolha um serviço</option>
                        {servicosEmpresa.map((servico) => (
                          <option key={servico.id} value={servico.id}>
                            {servico.nome} - R${servico.preco} - {servico.duracao} min
                          </option>
                        ))}
                      </select>
                    </div>
                    {servicoSelecionado && (
                      <div className="mb-3">
                        <label className="form-label">Funcionários</label>
                        <ul className="list-group">
                          {funcionarios
                            .filter(({ id }) =>
                              acaoSelecionada === "adicionar"
                                ? !servicoSelecionado.funcionarios.includes(id)
                                : servicoSelecionado.funcionarios.includes(id)
                            )
                            .map(({ id, nome, foto_url, servicos }) => (
                              <li key={id} className="list-group-item">
                                <input
                                  type="checkbox"
                                  checked={servico.funcionarios.includes(id)}
                                  onChange={() => handleFuncionarioChange(id)}
                                />
                                <span className="ms-2">{nome}</span>
                                {foto_url && <img src={foto_url} alt={nome} className="employee-photo ms-2" />}
                                {servicos?.length > 0 && (
                                  <div className="text-muted ms-2">
                                    <strong>Serviços Associados:</strong>
                                    <ul>
                                      {servicos.map((s) => (
                                        <li key={s.id}>
                                          {s.nome} - R${s.preco} - {s.duracao} min
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </li>
                            ))}
                        </ul>
                        <button type="submit" className="btn btn-success w-100 mt-3" disabled={loading}>
                          {loading ? <><FaSpinner className="fa-spin me-2" />Processando...</> : acaoSelecionada === "adicionar" ? "Adicionar Serviço aos Funcionários" : "Remover Serviço dos Funcionários"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {acaoSelecionada === "editar" && empresaSelecionada && (
                  <div className="servico-card" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="servico-title">Editar Serviço</h3>
                    <div className="mb-3">
                      <label className="form-label">Selecione um Serviço</label>
                      <select
                        className="form-select"
                        onChange={(e) => {
                          const servicoId = Number(e.target.value);
                          setServicoSelecionado(servicosEmpresa.find((s) => s.id === servicoId) || null);
                        }}
                        value={servicoSelecionado?.id || ""}
                        required
                      >
                        <option value="">Escolha um serviço</option>
                        {servicosEmpresa.map((servico) => (
                          <option key={servico.id} value={servico.id}>
                            {servico.nome} - R${servico.preco} - {servico.duracao} min
                          </option>
                        ))}
                      </select>
                    </div>
                    {editServico && (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Nome</label>
                          <input
                            type="text"
                            name="nome"
                            className="form-control"
                            value={editServico.nome}
                            onChange={handleEditChange}
                            placeholder="Ex: Corte de Cabelo"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Descrição</label>
                          <textarea
                            name="descricao"
                            className="form-control"
                            value={editServico.descricao}
                            onChange={handleEditChange}
                            placeholder="Descreva o serviço"
                            rows={4}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Duração (minutos)</label>
                          <input
                            type="text"
                            name="duracao"
                            className="form-control"
                            value={editServico.duracao}
                            onChange={handleEditChange}
                            placeholder="Ex: 30"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Preço (R$)</label>
                          <InputMask
                            mask="999999.99"
                            replacement={{ 9: /[0-9]/ }}
                            value={editServico.preco}
                            onChange={handleEditChange}
                            name="preco"
                            className="form-control"
                            placeholder="Ex: 50.00"
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                          {loading ? <><FaSpinner className="fa-spin me-2" />Editando...</> : "Editar Serviço"}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {acaoSelecionada === "remover" && empresaSelecionada && (
                  <div className="servico-card" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="servico-title">Remover Serviço</h3>
                    <div className="warning-text">
                      <FaExclamationTriangle /> Atenção: Esta ação é irreversível!
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Selecione um Serviço</label>
                      <select
                        className="form-select"
                        onChange={(e) => {
                          const servicoId = Number(e.target.value);
                          setServicoSelecionado(servicosEmpresa.find((s) => s.id === servicoId) || null);
                        }}
                        value={servicoSelecionado?.id || ""}
                        required
                      >
                        <option value="">Escolha um serviço</option>
                        {servicosEmpresa.map((servico) => (
                          <option key={servico.id} value={servico.id}>
                            {servico.nome} - R${servico.preco} - {servico.duracao} min
                          </option>
                        ))}
                      </select>
                    </div>
                    {servicoSelecionado && (
                      <button type="submit" className="btn btn-danger w-100" disabled={loading}>
                        {loading ? <><FaSpinner className="fa-spin me-2" />Removendo...</> : "Remover Serviço"}
                      </button>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServicoForm;