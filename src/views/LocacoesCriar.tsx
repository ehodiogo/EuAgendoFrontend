import React, { useState, useEffect } from "react";
import { Locacao } from "../interfaces/Locacao";
import { Empresa } from "../interfaces/Empresa";
import axios from "axios";
import { useFetch } from "../functions/GetData";
import Navbar from "../components/Navbar";
import {
    FaTags,
    FaSpinner,
    FaExclamationTriangle,
    FaCheckCircle,
    FaClipboardList,
    FaTrash,
    FaGift,
    FaChevronDown,
    FaChevronUp
} from "react-icons/fa";
import { InputMask } from "@react-input/mask";

const LocacaoForm: React.FC = () => {
  const [acaoSelecionada, setAcaoSelecionada] = useState<string>("");
  const [novaLocacao, setNovaLocacao] = useState<Locacao>({
    nome: "",
    descricao: "",
    duracao: "",
    preco: "",
    pontos_gerados: "",
    pontos_resgate: "",
  });
  const [editLocacao, setEditLocacao] = useState<Locacao | null>(null);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<number | null>(null);
  const [locacaoSelecionada, setLocacaoSelecionada] = useState<Locacao | null>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isFidelidadeSectionOpen, setIsFidelidadeSectionOpen] = useState(false);

  const token = localStorage.getItem("access_token");
  const empresas = useFetch<Empresa[]>(`/api/empresas-usuario/?usuario_token=${token}`);
  const [locacoesEmpresa, setLocacoesEmpresa] = useState<Locacao[]>([]);

  useEffect(() => {
    if (!empresaSelecionada) return;

    const fetchLocacoes = async () => {
      if (!token) {
        setFormError("Usuário não autenticado.");
        return;
      }
      try {
        const url = import.meta.env.VITE_API_URL;

        const { data } = await axios.get(`${url}/api/locacoes-criadas-usuario-empresa/`, {
          params: { empresa_id: empresaSelecionada, usuario_token: token },
        });
        const locacoesComFidelidade = Array.isArray(data.locacoes)
          ? data.locacoes.map((loc: Locacao) => ({
              ...loc,
              pontos_gerados: loc.pontos_gerados ?? "",
              pontos_resgate: loc.pontos_resgate ?? "",
            }))
          : [];
        setLocacoesEmpresa(locacoesComFidelidade);
        setFormError(null);
      } catch (error) {
        // @ts-ignore
        const errorMessage = error.response?.data?.erro || "Falha ao carregar locações.";
        setFormError(errorMessage);
      }
    };

    fetchLocacoes();
  }, [empresaSelecionada, token]);

  useEffect(() => {
    if (acaoSelecionada === "editar" && locacaoSelecionada) {
        const precoLimpo = String(locacaoSelecionada.preco).replace(',', '.');
        setEditLocacao({
            ...locacaoSelecionada,
            pontos_gerados: String(locacaoSelecionada.pontos_gerados ?? ""),
            pontos_resgate: String(locacaoSelecionada.pontos_resgate ?? ""),
            preco: precoLimpo,
        });
        if (locacaoSelecionada.pontos_gerados || locacaoSelecionada.pontos_resgate) {
            setIsFidelidadeSectionOpen(true);
        } else {
            setIsFidelidadeSectionOpen(false);
        }
    } else {
      setEditLocacao(null);
    }
  }, [acaoSelecionada, locacaoSelecionada]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNovaLocacao((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editLocacao) {
      const { name, value } = e.target;
      setEditLocacao((prev) => prev ? { ...prev, [name]: value } : prev);
    }
  };

  const handleToggleFidelidadeSection = () => {
      setIsFidelidadeSectionOpen(prev => !prev);
  };

  const validateForm = () => {
        setFormError(null);
        if (!acaoSelecionada) return setFormError("Selecione uma ação."), false;
        if (!empresaSelecionada) return setFormError("Selecione uma empresa."), false;

        if (acaoSelecionada === "cadastrar" || (acaoSelecionada === "editar" && editLocacao)) {
            const item = acaoSelecionada === "cadastrar" ? novaLocacao : editLocacao!;

            const nomeStr = String(item.nome);
            if (!nomeStr.trim()) return setFormError("O nome do item de locação é obrigatório."), false;

            const duracaoStr = String(item.duracao);
            const duracaoNum = Number(duracaoStr);

            if (!duracaoStr.trim() || !Number.isInteger(duracaoNum) || duracaoNum < 15 || duracaoNum % 15 !== 0) {
                return setFormError("A duração deve ser um número inteiro, múltiplo de 15 minutos (ex: 15, 30, 45, 60, etc.), e com valor mínimo de 15 minutos."), false;
            }

            const precoStr = String(item.preco).replace(',', '.');
            if (!precoStr || !/^\d+(\.\d{1,2})?$/.test(precoStr)) return setFormError("O preço deve ser um valor numérico válido (ex: 99.99)."), false;

            const pontosGeradosNum = Number(item.pontos_gerados);
            const pontosResgateNum = Number(item.pontos_resgate);

            if (item.pontos_gerados && (!Number.isInteger(pontosGeradosNum) || pontosGeradosNum < 0)) {
                return setFormError("Os 'Pontos Gerados' devem ser um número inteiro não negativo (ou deixe em branco)."), false;
            }
            if (item.pontos_resgate && (!Number.isInteger(pontosResgateNum) || pontosResgateNum < 0)) {
                return setFormError("Os 'Pontos para Resgate' devem ser um número inteiro não negativo (ou deixe em branco)."), false;
            }
        }

        if ((acaoSelecionada === "remover" || acaoSelecionada === "editar") && !locacaoSelecionada) return setFormError("Selecione um item de locação."), false;

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

    try {
        let endpoint = "";
        let payload : Record<string, string | number | null | undefined> = { usuario_token: token };

        if (acaoSelecionada === "cadastrar") {
            endpoint = "/api/cadastrar-locacao/";

            const pontosGerados = isFidelidadeSectionOpen && novaLocacao.pontos_gerados ? Number(novaLocacao.pontos_gerados) : null;
            const pontosResgate = isFidelidadeSectionOpen && novaLocacao.pontos_resgate ? Number(novaLocacao.pontos_resgate) : null;

            payload = {
                ...payload,
                locacao_nome: novaLocacao.nome,
                locacao_descricao: novaLocacao.descricao,
                locacao_duracao: Number(novaLocacao.duracao),
                locacao_preco: Number(novaLocacao.preco),
                empresa_id: empresaSelecionada,
                locacao_pontos_gerados: pontosGerados,
                locacao_pontos_resgate: pontosResgate,
            };
        } else if (acaoSelecionada === "editar" && editLocacao) {
            endpoint = "/api/editar-locacao/";

            const pontosGerados = isFidelidadeSectionOpen && editLocacao.pontos_gerados ? Number(editLocacao.pontos_gerados) : null;
            const pontosResgate = isFidelidadeSectionOpen && editLocacao.pontos_resgate ? Number(editLocacao.pontos_resgate) : null;

            payload = {
                ...payload,
                locacao_id: editLocacao.id,
                locacao_nome: editLocacao.nome,
                locacao_descricao: editLocacao.descricao,
                locacao_duracao: Number(editLocacao.duracao),
                locacao_preco: Number(editLocacao.preco),
                locacao_pontos_gerados: pontosGerados,
                locacao_pontos_resgate: pontosResgate,
            };
        } else if (acaoSelecionada === "remover" && locacaoSelecionada) {
            endpoint = "/api/remover-locacao/";
            payload = {
                ...payload,
                locacao_id: locacaoSelecionada.id,
            };
        } else {
            setFormError("Ação inválida ou item não selecionado.");
            setLoading(false);
            return;
        }

        const { data } = await axios.post(`${url}${endpoint}`, payload);

        setFormSuccess(data.mensagem || "Operação realizada com sucesso!");

        if (acaoSelecionada === "cadastrar") {
            setNovaLocacao({ nome: "", descricao: "", duracao: "", preco: "", pontos_gerados: "", pontos_resgate: "" });
            setIsFidelidadeSectionOpen(false);

            setLocacoesEmpresa((prev) => [
                ...prev,
                {
                    id: data.id || Date.now(),
                    ...novaLocacao,
                    pontos_gerados: payload.locacao_pontos_gerados || "",
                    pontos_resgate: payload.locacao_pontos_resgate || "",
                },
            ]);
        } else if (acaoSelecionada === "editar" && editLocacao) {
            const locacaoAtualizada = {
                ...editLocacao,
                pontos_gerados: payload.locacao_pontos_gerados || "",
                pontos_resgate: payload.locacao_pontos_resgate || "",
            };

            setEditLocacao(null);
            setLocacaoSelecionada(null);
            setIsFidelidadeSectionOpen(false);

            setLocacoesEmpresa((prev) =>
                prev.map((l) => (l.id === locacaoAtualizada.id ? locacaoAtualizada : l))
            );
        } else if (acaoSelecionada === "remover") {
            setLocacaoSelecionada(null);
            setLocacoesEmpresa((prev) => prev.filter((l) => l.id !== locacaoSelecionada!.id));
        }

    } catch (error) {
        let errorMessage = "Ocorreu um erro desconhecido na comunicação com o servidor.";

        if (axios.isAxiosError(error) && error.response) {
            const responseData = error.response.data;

            if (responseData.erro) {
                errorMessage = responseData.erro;
            }
            else if (typeof responseData === 'object' && Object.keys(responseData).length > 0) {
                const fieldErrors = Object.entries(responseData)
                    .map(([key, value]) => `[${key}]: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join('; ');
                errorMessage = `Erro de validação: ${fieldErrors}`;
            } else if (typeof responseData === 'string') {
                 errorMessage = responseData;
            }
        }

        setFormError(errorMessage);
    } finally {
        setLoading(false);
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
            --accent-purple: #8e44ad;
            --config-fidelidade: #3498db; 
          }

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
            background-color: #2980b9;
            border-color: #2980b9;
            transform: translateY(-1px);
          }
          
          .fidelidade-section {
              border: 1px dashed var(--config-fidelidade);
              padding: 1rem;
              border-radius: 8px;
              margin-top: 1rem;
          }
          
          /* Título - Ajustado para Locação */
          .servico-title {
            color: var(--accent-purple); 
            font-size: 1.75rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }
          /* ... o resto dos estilos reutilizados ... */
          .servico-form-container {
            background-color: var(--light-gray);
            padding: 3rem 1rem;
            min-height: calc(100vh - 56px);
          }
          .servico-card {
            max-width: 600px;
            margin: 0 auto;
            background-color: var(--white);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 2rem;
          }
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
          .servico-form .form-control,
          .servico-form .form-select,
          .servico-form textarea {
            border: 1px solid var(--light-blue);
            border-radius: 8px;
            padding: 0.75rem;
            font-size: 1rem;
            color: var(--dark-gray);
          }

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
                <FaTags /> Gerenciar Itens de Locação
              </h2>
              <form onSubmit={handleSubmit} className="servico-form">
                <div className="mb-3">
                  <label className="form-label">Ação</label>
                  <select
                    className="form-select"
                    onChange={(e) => {
                      setAcaoSelecionada(e.target.value);
                      setNovaLocacao({ nome: "", descricao: "", duracao: "", preco: "", pontos_gerados: "", pontos_resgate: "" });
                      setLocacaoSelecionada(null);
                      setEditLocacao(null);
                      setIsFidelidadeSectionOpen(false);
                    }}
                    value={acaoSelecionada}
                    required
                  >
                    <option value="">Escolha uma ação</option>
                    <option value="cadastrar">Cadastrar Novo Item</option>
                    <option value="editar">Editar Item Existente</option>
                    <option value="remover">Remover Item</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Selecione uma Empresa</label>
                  <select
                    className="form-select"
                    onChange={(e) => {
                      setEmpresaSelecionada(Number(e.target.value) || null);
                      setLocacaoSelecionada(null);
                      setEditLocacao(null);
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
                )}


                {acaoSelecionada === "cadastrar" && empresaSelecionada && (
                  <div className="mt-4">
                    <h3 className="servico-title mb-4">Cadastrar Novo Item</h3>
                    <div className="mb-3">
                      <label className="form-label">Nome do Item</label>
                      <input
                        type="text"
                        name="nome"
                        className="form-control"
                        value={novaLocacao.nome}
                        onChange={handleChange}
                        placeholder="Ex: Escavadeira 3T, Sala de Reunião"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descrição</label>
                      <textarea
                        name="descricao"
                        className="form-control"
                        value={novaLocacao.descricao}
                        onChange={handleChange}
                        placeholder="Descreva o item e suas condições de uso"
                        rows={3}
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
                        value={novaLocacao.duracao}
                        onChange={handleChange}
                        placeholder="Ex: 15, 30, 45, 60"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Preço Base (R$)</label>
                      <InputMask
                        mask="999999.99"
                        replacement={{ 9: /[0-9]/ }}
                        value={novaLocacao.preco}
                        onChange={handleChange}
                        name="preco"
                        className="form-control"
                        placeholder="Ex: 500.00"
                        required
                      />
                    </div>

                    {isFidelidadeSectionOpen && (
                        <div className="fidelidade-section">
                            <h4 className="servico-title mb-3" style={{ fontSize: '1.25rem', color: 'var(--config-fidelidade)' }}>
                                <FaGift className="me-2" /> Configurações de Pontos
                            </h4>
                            <div className="mb-3">
                                <label className="form-label">Pontos Gerados (Ao ser locado)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    name="pontos_gerados"
                                    className="form-control"
                                    value={novaLocacao.pontos_gerados}
                                    onChange={handleChange}
                                    placeholder="Ex: 50 (Deixe em branco para não gerar)"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Pontos para Resgate (Necessário para locar com pontos)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    name="pontos_resgate"
                                    className="form-control"
                                    value={novaLocacao.pontos_resgate}
                                    onChange={handleChange}
                                    placeholder="Ex: 500 (Deixe em branco para não permitir resgate)"
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
                      {loading ? <><FaSpinner className="fa-spin me-2" />Cadastrando...</> : "Cadastrar Item de Locação"}
                    </button>
                  </div>
                )}

                {acaoSelecionada === "editar" && empresaSelecionada && (
                  <div className="mt-4">
                    <h3 className="servico-title mb-4">Editar Item</h3>
                    <div className="mb-3">
                      <label className="form-label">Selecione o Item para Editar</label>
                      <select
                        className="form-select"
                        onChange={(e) => {
                          const locacaoId = Number(e.target.value);
                          setLocacaoSelecionada(locacoesEmpresa.find((l) => l.id === locacaoId) || null);
                        }}
                        value={locacaoSelecionada?.id || ""}
                        required
                      >
                        <option value="">Escolha um item</option>
                        {locacoesEmpresa.map((locacao) => (
                          <option key={locacao.id} value={locacao.id}>
                            {locacao.nome} - R${locacao.preco}
                          </option>
                        ))}
                      </select>
                    </div>

                    {locacaoSelecionada && (
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
                    )}

                    {editLocacao && (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Nome</label>
                          <input
                            type="text"
                            name="nome"
                            className="form-control"
                            value={editLocacao.nome}
                            onChange={handleEditChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Descrição</label>
                          <textarea
                            name="descricao"
                            className="form-control"
                            value={editLocacao.descricao}
                            onChange={handleEditChange}
                            rows={3}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Duração em Minutos - (De 15 em 15 minutos)</label>
                          <input
                            type="number"
                            min="15"
                            step="15"
                            name="duracao"
                            className="form-control"
                            value={editLocacao.duracao}
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
                            value={editLocacao.preco}
                            onChange={handleEditChange}
                            name="preco"
                            className="form-control"
                            required
                          />
                        </div>

                        {/* SEÇÃO DE FIDELIDADE (SÓ APARECE AO CLICAR NO BOTÃO) - EDIÇÃO */}
                        {isFidelidadeSectionOpen && (
                            <div className="fidelidade-section">
                                <h4 className="servico-title mb-3" style={{ fontSize: '1.25rem', color: 'var(--config-fidelidade)' }}>
                                    <FaGift className="me-2" /> Configurações de Pontos
                                </h4>
                                <div className="mb-3">
                                    <label className="form-label">Pontos Gerados (Ao ser locado)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        name="pontos_gerados"
                                        className="form-control"
                                        value={editLocacao.pontos_gerados}
                                        onChange={handleEditChange}
                                        placeholder="Ex: 50 (Deixe em branco para não gerar)"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Pontos para Resgate (Necessário para locar com pontos)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        name="pontos_resgate"
                                        className="form-control"
                                        value={editLocacao.pontos_resgate}
                                        onChange={handleEditChange}
                                        placeholder="Ex: 500 (Deixe em branco para não permitir resgate)"
                                    />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
                          {loading ? <><FaSpinner className="fa-spin me-2" />Editando...</> : "Salvar Edição"}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {acaoSelecionada === "remover" && empresaSelecionada && (
                  <div className="mt-4">
                    <h3 className="servico-title mb-4">Remover Item</h3>
                    <div className="warning-text mb-3">
                      <FaExclamationTriangle /> Atenção: A remoção de um item é **irreversível**!
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Selecione o Item para Remover</label>
                      <select
                        className="form-select"
                        onChange={(e) => {
                          const locacaoId = Number(e.target.value);
                          setLocacaoSelecionada(locacoesEmpresa.find((l) => l.id === locacaoId) || null);
                          setIsFidelidadeSectionOpen(false);
                        }}
                        value={locacaoSelecionada?.id || ""}
                        required
                      >
                        <option value="">Escolha um item</option>
                        {locacoesEmpresa.map((locacao) => (
                          <option key={locacao.id} value={locacao.id}>
                            {locacao.nome} - R${locacao.preco}
                          </option>
                        ))}
                      </select>
                    </div>
                    {locacaoSelecionada && (
                        <p className="text-center text-danger fw-bold">
                            Tem certeza que deseja remover **{locacaoSelecionada.nome}**?
                        </p>
                    )}
                    <button type="submit" className="btn btn-danger w-100 mt-3" disabled={loading || !locacaoSelecionada}>
                      {loading ? <><FaSpinner className="fa-spin me-2" />Removendo...</> : <><FaTrash className="me-2" /> Remover Item</>}
                    </button>
                  </div>
                )}

                {(!acaoSelecionada || !empresaSelecionada) && (
                    <div className="mt-4 p-3 border rounded text-center text-muted">
                        <FaClipboardList className="me-2" /> Selecione uma **Ação** e uma **Empresa** acima para começar a gerenciar os itens de locação.
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

export default LocacaoForm;