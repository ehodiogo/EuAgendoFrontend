import React, { useState, useEffect } from "react";

interface ServicoCreate {
  nome: string;
  descricao: string;
  duracao: string;
  preco: string;
  funcionarios: number[];
  pontos_gerados: string;
  pontos_resgate: string;
}

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  duracao: string;
  preco: string;
  funcionarios: number[];
  pontos_gerados?: string | number;
  pontos_resgate?: string | number;
}

import { FuncionarioServicos } from "../interfaces/ServicosFuncionarios";
import { Empresa } from "../interfaces/Empresa";
import axios from "axios";
import { useFetch } from "../functions/GetData";
import Navbar from "../components/Navbar";
import {
    FaTools,
    FaSpinner,
    FaExclamationTriangle,
    FaCheckCircle,
    FaGift,
    FaChevronDown,
    FaChevronUp
} from "react-icons/fa";
import { InputMask } from "@react-input/mask";

const ServicoForm: React.FC = () => {
  const [acaoSelecionada, setAcaoSelecionada] = useState<string>("");
  const [servico, setServico] = useState<ServicoCreate>({
    nome: "",
    descricao: "",
    duracao: "",
    preco: "",
    funcionarios: [],
    pontos_gerados: "",
    pontos_resgate: "",
  });
  const [editServico, setEditServico] = useState<Servico | null>(null);
  const [funcionarios, setFuncionarios] = useState<FuncionarioServicos[]>([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<number | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [isFidelidadeSectionOpen, setIsFidelidadeSectionOpen] = useState(false);

  const token = localStorage.getItem("access_token");
  const empresas = useFetch<Empresa[]>(`/api/empresas-usuario/?usuario_token=${token}`);
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

        const servicosComFidelidade = Array.isArray(data.servicos)
            ? data.servicos.map((s: Servico) => ({
                ...s,
                pontos_gerados: String(s.pontos_gerados ?? ""),
                pontos_resgate: String(s.pontos_resgate ?? ""),
              }))
            : [];

        setServicosEmpresa(servicosComFidelidade);
      } catch (error) {
        setFormError("Falha ao carregar serviços.");
      }
    };

    fetchFuncionarios();
    fetchServicos();
  }, [empresaSelecionada, token]);

  useEffect(() => {
    if (acaoSelecionada === "editar" && servicoSelecionado) {
      let precoParaInputMask = String(servicoSelecionado.preco);
      precoParaInputMask = precoParaInputMask.replace('.', '').replace(',', '');
      setEditServico({
        ...servicoSelecionado,
        pontos_gerados: String(servicoSelecionado.pontos_gerados ?? ""),
        pontos_resgate: String(servicoSelecionado.pontos_resgate ?? ""),
        preco: precoParaInputMask
      });
      if (servicoSelecionado.pontos_gerados || servicoSelecionado.pontos_resgate) {
        setIsFidelidadeSectionOpen(true);
      } else {
        setIsFidelidadeSectionOpen(false);
      }
    } else {
      setEditServico(null);
      setIsFidelidadeSectionOpen(false);
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

  const handleToggleFidelidadeSection = () => {
      setIsFidelidadeSectionOpen(prev => !prev);
  };

  const validateDuration = (duration: string | number) => {
      const durationStr = String(duration);

      if (!durationStr.trim()) {
          return "A duração é obrigatória.";
      }

      const duracaoNum = Number(durationStr);

      if (!Number.isInteger(duracaoNum) || duracaoNum < 15 || duracaoNum % 15 !== 0) {
          return "A duração deve ser um número inteiro, múltiplo de 15 minutos (ex: 15, 30, 45, 60, etc.), e com valor mínimo de 15 minutos.";
      }
      return null;
  };

  const validateFidelidade = (item: ServicoCreate | Servico) => {
    const pontosGeradosNum = Number(item.pontos_gerados);
    const pontosResgateNum = Number(item.pontos_resgate);

    if (item.pontos_gerados && (!Number.isInteger(pontosGeradosNum) || pontosGeradosNum < 0)) {
        return "Os 'Pontos Gerados' devem ser um número inteiro não negativo (ou deixe em branco).";
    }
    if (item.pontos_resgate && (!Number.isInteger(pontosResgateNum) || pontosResgateNum < 0)) {
        return "Os 'Pontos para Resgate' devem ser um número inteiro não negativo (ou deixe em branco).";
    }
    return null;
  };


  const validateForm = () => {
    setFormError(null);
    if (!acaoSelecionada) return setFormError("Selecione uma ação."), false;
    if (!empresaSelecionada) return setFormError("Selecione uma empresa."), false;

    if (acaoSelecionada === "cadastrar") {
      if (!servico.nome.trim()) return setFormError("O nome do serviço é obrigatório."), false;
      const durationError = validateDuration(servico.duracao as string);
      if (durationError) return setFormError(durationError), false;
      if (!servico.preco || !/^\d+(\.\d{1,2})?$/.test(servico.preco)) return setFormError("O preço deve ser um valor numérico válido (ex: 99.99)."), false;
      if (!servico.funcionarios.length) return setFormError("Selecione ao menos um funcionário."), false;

      const fidelidadeError = validateFidelidade(servico);
      if (fidelidadeError) return setFormError(fidelidadeError), false;
    }

    if ((acaoSelecionada === "adicionar" || acaoSelecionada === "remover-funcionarios") && !servicoSelecionado) return setFormError("Selecione um serviço."), false;

    if (acaoSelecionada === "remover" && !servicoSelecionado) return setFormError("Selecione um serviço para remover."), false;

    if (acaoSelecionada === "editar" && editServico) {
      if (!editServico.nome.trim()) return setFormError("O nome do serviço é obrigatório."), false;
      const durationError = validateDuration(editServico.duracao as string); // Cast para string, pois 'duracao' pode ser number/string na interface
      if (durationError) return setFormError(durationError), false;
      if (!editServico.preco || !/^\d+(\.\d{1,2})?$/.test(editServico.preco as string)) return setFormError("O preço deve ser um valor numérico válido (ex: 99.99)."), false;

      const fidelidadeError = validateFidelidade(editServico as ServicoCreate); // Cast provisório para validação
      if (fidelidadeError) return setFormError(fidelidadeError), false;
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

    // Converte os campos de fidelidade para number ou null se a seção estiver fechada/vazia
    const getFidelidadePayload = (item: ServicoCreate | Servico) => ({
        pontos_gerados: isFidelidadeSectionOpen && item.pontos_gerados ? Number(item.pontos_gerados) : null,
        pontos_resgate: isFidelidadeSectionOpen && item.pontos_resgate ? Number(item.pontos_resgate) : null,
    });

    if (acaoSelecionada === "cadastrar") {
      try {
        const fidelidade = getFidelidadePayload(servico);

        const payload = {
          usuario_token: token,
          funcionarios: servico.funcionarios,
          servico_nome: servico.nome,
          servico_descricao: servico.descricao,
          servico_duracao: servico.duracao,
          servico_valor: servico.preco,
          empresa_id: empresaSelecionada,
          servico_pontos_gerados: fidelidade.pontos_gerados,
          servico_pontos_resgate: fidelidade.pontos_resgate,
        };
        const { data } = await axios.post(`${url}/api/adicionar-servicos-funcionario/`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        setFormSuccess(data.mensagem || "Serviço cadastrado com sucesso!");
        setServico({ nome: "", descricao: "", duracao: "", preco: "", funcionarios: [], pontos_gerados: "", pontos_resgate: "" });
        setIsFidelidadeSectionOpen(false);
        setServicosEmpresa((prev) => [
          ...prev,
          { id: data.servico_id || Date.now(), ...servico, funcionarios: servico.funcionarios, pontos_gerados: fidelidade.pontos_gerados || "", pontos_resgate: fidelidade.pontos_resgate || "" },
        ]);
      } catch (error) {
        // @ts-ignore
        setFormError(`Falha ao cadastrar serviço: ${error.response?.data?.erro || error.message}`);
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
        const { data } = await axios.post(`${url}/api/adicionar-servico-funcionarios/`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        setFormSuccess(data.mensagem || "Serviço adicionado aos funcionários com sucesso!");
        setServico({ nome: "", descricao: "", duracao: "", preco: "", funcionarios: [], pontos_gerados: "", pontos_resgate: "" });
        setServicoSelecionado(null);
        setServicosEmpresa((prev) =>
          prev.map((s) =>
            s.id === servicoSelecionado!.id
              ? { ...s, funcionarios: Array.from(new Set([...s.funcionarios, ...servico.funcionarios])) }
              : s
          )
        );
      } catch (error) {
        // @ts-ignore
        setFormError(`Falha ao adicionar serviço aos funcionários: ${error.response?.data?.erro || error.message}`);
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
        const { data } = await axios.post(`${url}/api/remover-servico-empresa/`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        setFormSuccess(data.mensagem || "Serviço removido com sucesso!");
        setServicoSelecionado(null);
        setServicosEmpresa((prev) => prev.filter((s) => s.id !== servicoSelecionado!.id));
      } catch (error) {
        // @ts-ignore
        setFormError(`Falha ao remover serviço: ${error.response?.data?.erro || error.message}`);
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
        const { data } = await axios.post(`${url}/api/remover-servicos-funcionario/`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        setFormSuccess(data.mensagem || "Serviço removido dos funcionários com sucesso!");
        setServico({ nome: "", descricao: "", duracao: "", preco: "", funcionarios: [], pontos_gerados: "", pontos_resgate: "" });
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
        setFormError(`Falha ao remover serviço dos funcionários: ${error.response?.data?.erro || error.message}`);
      } finally {
        setLoading(false);
      }
    } else if (acaoSelecionada === "editar" && editServico) {
      try {
        const fidelidade = getFidelidadePayload(editServico);

        const payload = {
          usuario_token: token,
          servico_id: editServico.id,
          servico_nome: editServico.nome,
          servico_descricao: editServico.descricao,
          servico_duracao: editServico.duracao,
          servico_preco: editServico.preco,
          servico_pontos_gerados: fidelidade.pontos_gerados,
          servico_pontos_resgate: fidelidade.pontos_resgate,
        };
        const { data } = await axios.post(`${url}/api/editar-servico/`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        setFormSuccess(data.mensagem || "Serviço editado com sucesso!");

        const servicoAtualizado = {
            ...editServico,
            pontos_gerados: fidelidade.pontos_gerados || "",
            pontos_resgate: fidelidade.pontos_resgate || "",
        };

        setEditServico(null);
        setServicoSelecionado(null);
        setIsFidelidadeSectionOpen(false);
        setServicosEmpresa((prev) =>
          prev.map((s) => (s.id === servicoAtualizado.id ? servicoAtualizado : s))
        );
      } catch (error) {
        // @ts-ignore
        setFormError(`Falha ao editar serviço: ${error.response?.data?.erro || error.message}`);
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
            --config-fidelidade: #8e44ad; /* Tom de roxo para Fidelidade em Serviços */
          }
          
          /* Estilo para o botão de Fidelidade */
          .btn-config-fidelidade {
            background-color: var(--config-fidelidade);
            border-color: var(--config-fidelidade);
            color: var(--white);
            font-weight: 600;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            transition: all 0.3s ease;
            width: 100%;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            cursor: pointer;
            border: none;
          }
          .btn-config-fidelidade:hover {
            background-color: #9b59b6;
            border-color: #9b59b6;
            transform: translateY(-1px);
          }
          
          .fidelidade-section {
              border: 1px dashed var(--config-fidelidade);
              padding: 1rem;
              border-radius: 8px;
              margin-top: 1rem;
          }
          
          .employee-photo {
            width: 40px;      /* Largura fixa */
            height: 40px;     /* Altura fixa */
            border-radius: 50%; /* Transforma em círculo */
            object-fit: cover;  /* Garante que a imagem preencha o espaço sem distorcer */
            margin-left: 0.5rem;
            vertical-align: middle; /* Alinha com o texto */
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
          .servico-form .form-label {
            color: var(--primary-blue);
            font-weight: 600;
            font-size: 1rem;
          }
          
          /* ... todos os outros estilos permanecem ... */

        `}</style>
        <div className="servico-form-container">
          {formSuccess && (
            <div className="toast-message success">
              <FaCheckCircle /> {formSuccess}
            </div>
          )}
          {formError && (
            <div className="toast-message error">
              <FaExclamationTriangle /> {formError}
            </div>
          )}
          {empresas.loading ? (
            <div className="text-center">
              <FaSpinner className="fa-spin" style={{ fontSize: "1.5rem", color: "var(--primary-blue)" }} /> Carregando...
            </div>
          ) : (
            <div className="servico-card">
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
                      setServico({ nome: "", descricao: "", duracao: "", preco: "", funcionarios: [], pontos_gerados: "", pontos_resgate: "" });
                      setServicoSelecionado(null);
                      setEditServico(null);
                      setIsFidelidadeSectionOpen(false);
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
                      setIsFidelidadeSectionOpen(false);
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
                  <div className="servico-card">
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
                      <label className="form-label">Duração em minutos - (De 15 em 15 minutos)</label>
                      <input
                        type="number"
                        min="15"
                        step="15"
                        name="duracao"
                        className="form-control"
                        value={servico.duracao}
                        onChange={handleChange}
                        placeholder="Ex: 15, 30, 45, 60"
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

                    <div className="mb-4">
                        <hr />
                        <button
                            type="button"
                            className="btn btn-config-fidelidade"
                            onClick={handleToggleFidelidadeSection}
                        >
                            <FaGift className="me-2" />
                            {isFidelidadeSectionOpen ? "Ocultar Configurações de Fidelidade" : "Configurar Fidelidade (Opcional)"}
                            {isFidelidadeSectionOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                    </div>

                    {isFidelidadeSectionOpen && (
                        <div className="fidelidade-section mb-4">
                            <h4 className="servico-title mb-3" style={{ fontSize: '1.25rem', color: 'var(--config-fidelidade)' }}>
                                <FaGift className="me-2" /> Configurações de Pontos
                            </h4>
                            <div className="mb-3">
                                <label className="form-label">Pontos Gerados (Ao ser realizado)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    name="pontos_gerados"
                                    className="form-control"
                                    value={servico.pontos_gerados}
                                    onChange={handleChange}
                                    placeholder="Ex: 10 (Deixe em branco para não gerar)"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Pontos para Resgate (Necessário para realizar com pontos)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    name="pontos_resgate"
                                    className="form-control"
                                    value={servico.pontos_resgate}
                                    onChange={handleChange}
                                    placeholder="Ex: 100 (Deixe em branco para não permitir resgate)"
                                />
                            </div>
                        </div>
                    )}

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
                  <div className="servico-card">
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
                  <div className="servico-card">
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
                          <label className="form-label">Duração em minutos - (De 15 em 15 minutos)</label>
                          <input
                            type="number"
                            min="15"
                            step="15"
                            name="duracao"
                            className="form-control"
                            value={editServico.duracao}
                            onChange={handleEditChange}
                            placeholder="Ex: 15, 30, 45, 60"
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

                        <div className="mb-4">
                            <hr />
                            <button
                                type="button"
                                className="btn btn-config-fidelidade"
                                onClick={handleToggleFidelidadeSection}
                            >
                                <FaGift className="me-2" />
                                {isFidelidadeSectionOpen ? "Ocultar Configurações de Fidelidade" : "Configurar Fidelidade (Opcional)"}
                                {isFidelidadeSectionOpen ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                        </div>

                        {isFidelidadeSectionOpen && (
                            <div className="fidelidade-section mb-4">
                                <h4 className="servico-title mb-3" style={{ fontSize: '1.25rem', color: 'var(--config-fidelidade)' }}>
                                    <FaGift className="me-2" /> Configurações de Pontos
                                </h4>
                                <div className="mb-3">
                                    <label className="form-label">Pontos Gerados (Ao ser realizado)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        name="pontos_gerados"
                                        className="form-control"
                                        value={editServico.pontos_gerados}
                                        onChange={handleEditChange}
                                        placeholder="Ex: 10 (Deixe em branco para não gerar)"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Pontos para Resgate (Necessário para realizar com pontos)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        name="pontos_resgate"
                                        className="form-control"
                                        value={editServico.pontos_resgate}
                                        onChange={handleEditChange}
                                        placeholder="Ex: 100 (Deixe em branco para não permitir resgate)"
                                    />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                          {loading ? <><FaSpinner className="fa-spin me-2" />Editando...</> : "Salvar Edição"}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {acaoSelecionada === "remover" && empresaSelecionada && (
                    <div className="servico-card">
                    <h3 className="servico-title">Remover Serviço</h3>
                    <div className="mb-3">
                        <label className="form-label">Selecione um Serviço para Remover</label>
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
                        <div className="warning-text mb-3">
                            <FaExclamationTriangle /> Tem certeza que deseja remover **{servicoSelecionado.nome}**? Esta ação é **irreversível**.
                        </div>
                    )}
                    <button type="submit" className="btn btn-danger w-100" disabled={loading || !servicoSelecionado}>
                        {loading ? <><FaSpinner className="fa-spin me-2" />Removendo...</> : "Remover Serviço"}
                    </button>
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