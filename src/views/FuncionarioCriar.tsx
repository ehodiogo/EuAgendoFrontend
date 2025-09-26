"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Funcionario } from "../interfaces/Funcionario";
import { Empresa } from "../interfaces/Empresa";
import { useFetch } from "../functions/GetData";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaUserPlus, FaSpinner, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const FuncionarioForm: React.FC = () => {
  const [nome, setNome] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [useFile, setUseFile] = useState(false);
  const [selectedFuncionarios, setSelectedFuncionarios] = useState<Funcionario[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [acaoSelecionada, setAcaoSelecionada] = useState<string>("");
  const [acaoEmpresa, setAcaoEmpresa] = useState<string>("");
  const [editNome, setEditNome] = useState<string>("");
  const [editFotoUrl, setEditFotoUrl] = useState<string>("");
  const [editFotoArquivo, setEditFotoArquivo] = useState<File | null>(null);
  const [editUseFile, setEditUseFile] = useState<boolean>(false);
  const token = localStorage.getItem("access_token");
  const empresas = useFetch<Empresa[]>(`api/empresas-usuario/?usuario_token=${token}`);
  const seusFuncionarios = useFetch<Funcionario[]>(`api/funcionarios-usuario/?usuario_token=${token}`);

  useEffect(() => {
    AOS.init({ duration: 800 });
    if (acaoSelecionada === "editar" && selectedFuncionarios.length === 1) {
      setEditNome(selectedFuncionarios[0].nome);
      setEditFotoUrl(selectedFuncionarios[0].foto || "");
      setEditFotoArquivo(null);
      setEditUseFile(false);
    }
  }, [acaoSelecionada, selectedFuncionarios]);

  const validateForm = () => {
    if (!acaoSelecionada) return setFormError("Selecione uma ação."), false;
    if (acaoSelecionada === "cadastrar") {
      if (!nome.trim()) return setFormError("O nome do funcionário é obrigatório."), false;
      if (useFile && !fotoArquivo) return setFormError("Selecione uma imagem para upload."), false;
      if (!useFile && !fotoUrl.trim()) return setFormError("Insira a URL da imagem."), false;
      if (!useFile && !/^https?:\/\/.*\.(png|jpg|jpeg|gif)$/.test(fotoUrl)) return setFormError("URL da imagem inválida."), false;
    }
    if (acaoSelecionada === "editar" && !selectedFuncionarios.length) return setFormError("Selecione um funcionário para editar."), false;
    if (acaoSelecionada === "remover" && !selectedFuncionarios.length) return setFormError("Selecione ao menos um funcionário para remover."), false;
    if ((acaoEmpresa === "inserir" || acaoEmpresa === "remover") && !selectedEmpresa) return setFormError("Selecione uma empresa."), false;
    if (acaoEmpresa === "editar_nome_foto") {
      if (!editNome.trim()) return setFormError("O novo nome do funcionário é obrigatório."), false;
      if (editUseFile && !editFotoArquivo) return setFormError("Selecione uma nova imagem para upload."), false;
      if (!editUseFile && editFotoUrl && !/^https?:\/\/.*\.(png|jpg|jpeg|gif)$/.test(editFotoUrl)) return setFormError("URL da nova imagem inválida."), false;
    }
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
        const limiteResponse = await fetch(`${url}/api/possui-limite/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario_token: token, acao_realizada: "criar_funcionario" }),
        });
        const limiteData = await limiteResponse.json();
        if (!limiteData.possui_limite) {
          setFormError("Você atingiu o limite de funcionários cadastrados.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("nome", nome);
        if (useFile && fotoArquivo) {
          if (fotoArquivo.size > 5 * 1024 * 1024) {
            setFormError("A imagem deve ter menos de 5MB.");
            setLoading(false);
            return;
          }
          formData.append("foto", fotoArquivo);
        } else {
          formData.append("foto", fotoUrl);
        }
        formData.append("usuario_token", token || "");

        const res = await axios.post(`${url}/api/funcionario-create/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setFormSuccess("Funcionário cadastrado com sucesso!");
        setNome("");
        setFotoUrl("");
        setFotoArquivo(null);
      } catch (error) {
        setFormError(`Erro ao cadastrar funcionário: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else if (acaoSelecionada === "editar" && acaoEmpresa === "editar_nome_foto") {
      try {
        const formData = new FormData();
        formData.append("nome", editNome);
        if (editUseFile && editFotoArquivo) {
          if (editFotoArquivo.size > 5 * 1024 * 1024) {
            setFormError("A nova imagem deve ter menos de 5MB.");
            setLoading(false);
            return;
          }
          formData.append("foto", editFotoArquivo);
        } else {
          formData.append("foto", editFotoUrl);
        }
        formData.append("usuario_token", token || "");
        formData.append("funcionario_id", selectedFuncionarios[0].id.toString());

        await axios.post(`${url}/api/editar-funcionario/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setFormSuccess("Funcionário editado com sucesso!");
        setSelectedFuncionarios([]);
      } catch (error) {
        setFormError(`Erro ao editar funcionário: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else if (acaoSelecionada === "remover") {
      try {
        await axios.post(`${url}/api/remover-funcionarios/`, {
          usuario_token: token,
          funcionarios_ids: selectedFuncionarios.map((func) => func.id),
        });
        setFormSuccess("Funcionários removidos com sucesso!");
        setSelectedFuncionarios([]);
      } catch (error) {
        setFormError(`Erro ao remover funcionários: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const adicionarFuncionariosAEmpresa = async () => {
    if (!validateForm()) return;
    try {
      const url = window.location.origin.includes("localhost:5173")
        ? "http://localhost:8000"
        : "https://backend-production-7438.up.railway.app";
      await axios.post(`${url}/api/adicionar-funcionarios-empresa/`, {
        empresa_nome: selectedEmpresa!.nome,
        funcionarios: selectedFuncionarios.map((func) => func.id),
        usuario_token: token,
      });
      setFormSuccess("Funcionários adicionados à empresa com sucesso!");
      setSelectedFuncionarios([]);
      setSelectedEmpresa(null);
    } catch (error) {
      setFormError(`Erro ao adicionar funcionários à empresa: ${error.message}`);
    }
  };

  const removerFuncionariosDaEmpresa = async () => {
    if (!validateForm()) return;
    try {
      const url = window.location.origin.includes("localhost:5173")
        ? "http://localhost:8000"
        : "https://backend-production-7438.up.railway.app";
      await axios.post(`${url}/api/remover-funcionarios-empresa/`, {
        empresa_id: selectedEmpresa!.id,
        funcionarios_ids: selectedFuncionarios.map((func) => func.id),
        usuario_token: token,
      });
      setFormSuccess("Funcionários removidos da empresa com sucesso!");
      setSelectedFuncionarios([]);
      setSelectedEmpresa(null);
    } catch (error) {
      setFormError(`Erro ao remover funcionários da empresa: ${error.message}`);
    }
  };

  const toggleSelectFuncionario = (funcionario: Funcionario) => {
    setSelectedFuncionarios((prev) => {
      if (acaoSelecionada === "editar" && acaoEmpresa === "editar_nome_foto") {
        if (prev.some((f) => f.id === funcionario.id)) return [];
        return [funcionario];
      }
      return prev.some((f) => f.id === funcionario.id)
        ? prev.filter((f) => f.id !== funcionario.id)
        : [...prev, funcionario];
    });
  };

  return (
    <>
      <Navbar />
      <div className="funcionario-form-container">
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
          .funcionario-form-container {
            background-color: var(--light-gray);
            padding: 3rem 1rem;
            min-height: calc(100vh - 56px);
          }

          /* Card */
          .funcionario-card {
            max-width: 600px;
            margin: 0 auto;
            background-color: var(--white);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 2rem;
          }

          /* Título */
          .funcionario-title {
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
          .funcionario-form .form-label {
            color: var(--primary-blue);
            font-weight: 600;
            font-size: 1rem;
          }
          .funcionario-form .form-control,
          .funcionario-form .form-select {
            border: 1px solid var(--light-blue);
            border-radius: 8px;
            padding: 0.75rem;
            font-size: 1rem;
            color: var(--dark-gray);
          }
          .funcionario-form .form-control:focus,
          .funcionario-form .form-select:focus {
            border-color: var(--primary-blue);
            box-shadow: 0 0 5px rgba(0, 48, 135, 0.3);
          }
          .funcionario-form .form-check-label {
            color: var(--dark-gray);
          }
          .funcionario-form .list-group-item {
            border-radius: 8px;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .funcionario-form .btn-primary {
            background-color: var(--primary-blue);
            border-color: var(--primary-blue);
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .funcionario-form .btn-primary:hover {
            background-color: var(--light-blue);
            border-color: var(--light-blue);
            transform: translateY(-2px);
          }
          .funcionario-form .btn-success {
            background-color: var(--pastel-green);
            border-color: var(--pastel-green);
            color: var(--dark-gray);
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .funcionario-form .btn-success:hover {
            background-color: #a0d1b0;
            border-color: #a0d1b0;
            transform: translateY(-2px);
          }
          .funcionario-form .btn-danger {
            background-color: var(--pastel-red);
            border-color: var(--pastel-red);
            color: var(--dark-gray);
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .funcionario-form .btn-danger:hover {
            background-color: #e0b3af;
            border-color: #e0b3af;
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
          .employee-photo {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
          }

          /* Responsividade */
          @media (max-width: 991px) {
            .funcionario-form-container {
              padding: 2rem 1rem;
            }
            .funcionario-card {
              padding: 1.5rem;
            }
            .funcionario-title {
              font-size: 1.5rem;
            }
          }
          @media (max-width: 576px) {
            .funcionario-card {
              padding: 1rem;
            }
            .funcionario-title {
              font-size: 1.25rem;
            }
            .funcionario-form .form-label {
              font-size: 0.9rem;
            }
            .funcionario-form .form-control,
            .funcionario-form .form-select {
              font-size: 0.9rem;
              padding: 0.5rem;
            }
            .funcionario-form .btn-primary,
            .funcionario-form .btn-success,
            .funcionario-form .btn-danger {
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
              width: 40px;
              height: 40px;
            }
          }
        `}</style>
        <div className="funcionario-form-container">
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
          {seusFuncionarios.loading || empresas.loading ? (
            <div className="text-center" data-aos="fade-up">
              <FaSpinner className="fa-spin" style={{ fontSize: "1.5rem", color: "var(--primary-blue)" }} /> Carregando...
            </div>
          ) : seusFuncionarios.error || empresas.error ? (
            <div className="toast-message error" data-aos="fade-up">
              <FaExclamationTriangle /> Erro ao carregar dados: {seusFuncionarios.error || empresas.error}
            </div>
          ) : (
            <div className="funcionario-card" data-aos="fade-up">
              <h2 className="funcionario-title">
                <FaUserPlus /> Gerenciar Funcionários
              </h2>
              <form onSubmit={handleSubmit} className="funcionario-form">
                <div className="mb-3">
                  <label className="form-label">Ação</label>
                  <select
                    className="form-select"
                    onChange={(e) => setAcaoSelecionada(e.target.value)}
                    value={acaoSelecionada}
                    required
                  >
                    <option value="">Escolha uma ação</option>
                    <option value="cadastrar">Cadastrar Funcionário</option>
                    <option value="editar">Editar Funcionário</option>
                    <option value="remover">Remover Funcionário</option>
                  </select>
                </div>

                {acaoSelecionada === "cadastrar" && (
                  <div className="funcionario-card" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="funcionario-title">Cadastrar Funcionário</h3>
                    <div className="mb-3">
                      <label className="form-label">Nome</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: João Silva"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Foto</label>
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="urlOption"
                          name="fotoOption"
                          checked={!useFile}
                          onChange={() => setUseFile(false)}
                        />
                        <label className="form-check-label" htmlFor="urlOption">
                          Usar URL
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="fileOption"
                          name="fotoOption"
                          checked={useFile}
                          onChange={() => setUseFile(true)}
                        />
                        <label className="form-check-label" htmlFor="fileOption">
                          Upload de arquivo
                        </label>
                      </div>
                    </div>
                    {!useFile ? (
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Insira a URL da imagem (ex: https://exemplo.com/imagem.jpg)"
                          value={fotoUrl}
                          onChange={(e) => setFotoUrl(e.target.value)}
                          required={!useFile}
                        />
                      </div>
                    ) : (
                      <div className="mb-3">
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => setFotoArquivo(e.target.files ? e.target.files[0] : null)}
                          required={useFile}
                        />
                      </div>
                    )}
                    {fotoUrl && !useFile && (
                      <img src={fotoUrl} alt="Prévia da foto" className="employee-photo" />
                    )}
                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                      {loading ? <><FaSpinner className="fa-spin me-2" />Cadastrando...</> : "Cadastrar Funcionário"}
                    </button>
                    {seusFuncionarios.data?.length > 0 && (
                      <div className="mt-4">
                        <h4>Funcionários Cadastrados</h4>
                        <p className="text-muted mb-3">Selecione funcionários para adicionar a uma empresa</p>
                        <ul className="list-group">
                          {seusFuncionarios.data.funcionarios.map((func : Funcionario) => (
                            <li key={func.id} className="list-group-item">
                              <input
                                type="checkbox"
                                checked={selectedFuncionarios.some((f) => f.id === func.id)}
                                onChange={() => toggleSelectFuncionario(func)}
                              />
                              <span className="ms-2">{func.nome}</span>
                              {func.foto && <img src={func.foto} alt={func.nome} className="employee-photo ms-2" />}
                            </li>
                          ))}
                        </ul>
                        {selectedFuncionarios.length > 0 && (
                          <div className="mt-3">
                            <h4>Empresas Disponíveis</h4>
                            <p className="text-muted mb-3">Selecione a empresa para adicionar os funcionários</p>
                            <ul className="list-group">
                              {empresas.data?.map((empresa) => (
                                <li key={empresa.id} className="list-group-item">
                                  <input
                                    type="checkbox"
                                    checked={selectedEmpresa?.id === empresa.id}
                                    onChange={() => setSelectedEmpresa(empresa)}
                                  />
                                  <span className="ms-2">{empresa.nome}</span>
                                </li>
                              ))}
                            </ul>
                            <button
                              className="btn btn-success w-100 mt-3"
                              onClick={adicionarFuncionariosAEmpresa}
                              disabled={loading || !selectedEmpresa}
                            >
                              Adicionar Funcionários à Empresa
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {acaoSelecionada === "editar" && (
                  <div className="funcionario-card" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="funcionario-title">Editar Funcionário</h3>
                    <div className="mb-3">
                      <label className="form-label">Selecione um Funcionário</label>
                      <ul className="list-group">
                        {seusFuncionarios.data?.funcionarios.map((func: Funcionario) => (
                          <li key={func.id} className="list-group-item">
                            <input
                              type="checkbox"
                              checked={selectedFuncionarios.some((f) => f.id === func.id)}
                              onChange={() => toggleSelectFuncionario(func)}
                            />
                            <span className="ms-2">{func.nome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {selectedFuncionarios.length === 1 && (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Ação</label>
                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="editar-nome-foto"
                              checked={acaoEmpresa === "editar_nome_foto"}
                              onChange={() => setAcaoEmpresa("editar_nome_foto")}
                            />
                            <label className="form-check-label" htmlFor="editar-nome-foto">
                              Alterar Nome ou Foto
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="inserir-em-empresa"
                              checked={acaoEmpresa === "inserir"}
                              onChange={() => setAcaoEmpresa("inserir")}
                            />
                            <label className="form-check-label" htmlFor="inserir-em-empresa">
                              Adicionar à Empresa
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="remover-de-empresa"
                              checked={acaoEmpresa === "remover"}
                              onChange={() => setAcaoEmpresa("remover")}
                            />
                            <label className="form-check-label" htmlFor="remover-de-empresa">
                              Remover da Empresa
                            </label>
                          </div>
                        </div>
                        {acaoEmpresa === "editar_nome_foto" && (
                          <div className="p-3 border rounded shadow-sm">
                            <h4>Editar Funcionário: {selectedFuncionarios[0].nome}</h4>
                            <div className="mb-3">
                              <label className="form-label">Novo Nome</label>
                              <input
                                type="text"
                                className="form-control"
                                value={editNome}
                                onChange={(e) => setEditNome(e.target.value)}
                                placeholder="Novo Nome"
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Nova Foto</label>
                              <div className="form-check">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  id="editUrlOption"
                                  name="editFotoOption"
                                  checked={!editUseFile}
                                  onChange={() => setEditUseFile(false)}
                                />
                                <label className="form-check-label" htmlFor="editUrlOption">
                                  Usar URL
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  id="editFileOption"
                                  name="editFotoOption"
                                  checked={editUseFile}
                                  onChange={() => setEditUseFile(true)}
                                />
                                <label className="form-check-label" htmlFor="editFileOption">
                                  Upload de arquivo
                                </label>
                              </div>
                            </div>
                            {!editUseFile ? (
                              <div className="mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Insira a URL da nova imagem"
                                  value={editFotoUrl}
                                  onChange={(e) => setEditFotoUrl(e.target.value)}
                                />
                              </div>
                            ) : (
                              <div className="mb-3">
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="image/*"
                                  onChange={(e) => setEditFotoArquivo(e.target.files ? e.target.files[0] : null)}
                                  required={editUseFile}
                                />
                              </div>
                            )}
                            {editFotoUrl && !editUseFile && (
                              <img src={editFotoUrl} alt="Prévia da foto" className="employee-photo" />
                            )}
                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                              {loading ? <><FaSpinner className="fa-spin me-2" />Salvando...</> : "Salvar Alterações"}
                            </button>
                          </div>
                        )}
                        {(acaoEmpresa === "inserir" || acaoEmpresa === "remover") && (
                          <div className="mt-3">
                            <h4>{acaoEmpresa === "inserir" ? "Adicionar à Empresa" : "Remover da Empresa"}</h4>
                            <p className="text-muted mb-3">
                              Selecione a empresa
                            </p>
                            <ul className="list-group">
                              {(acaoEmpresa === "inserir"
                                ? empresas.data?.filter(
                                    (empresa) =>
                                      !empresa.funcionarios?.some((func) =>
                                        selectedFuncionarios.some((selectedFunc) => selectedFunc.id === func.id)
                                      )
                                  )
                                : empresas.data?.filter((empresa) =>
                                    empresa.funcionarios?.some((func) =>
                                      selectedFuncionarios.some((selectedFunc) => selectedFunc.id === func.id)
                                    )
                                  )
                              )?.map((empresa) => (
                                <li key={empresa.id} className="list-group-item">
                                  <input
                                    type="checkbox"
                                    checked={selectedEmpresa?.id === empresa.id}
                                    onChange={() => setSelectedEmpresa(empresa)}
                                  />
                                  <span className="ms-2">{empresa.nome}</span>
                                </li>
                              ))}
                            </ul>
                            <button
                              className="btn btn-success w-100 mt-3"
                              onClick={acaoEmpresa === "inserir" ? adicionarFuncionariosAEmpresa : removerFuncionariosDaEmpresa}
                              disabled={loading || !selectedEmpresa}
                            >
                              {acaoEmpresa === "inserir" ? "Adicionar à Empresa" : "Remover da Empresa"}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {acaoSelecionada === "remover" && (
                  <div className="funcionario-card" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="funcionario-title">Remover Funcionário</h3>
                    <div className="warning-text">
                      <FaExclamationTriangle /> Atenção: Esta ação é irreversível!
                    </div>
                    <p className="text-muted mb-3">Selecione os funcionários para remover</p>
                    <ul className="list-group">
                      {seusFuncionarios.data?.funcionarios.map((func : Funcionario) => (
                        <li key={func.id} className="list-group-item">
                          <input
                            type="checkbox"
                            checked={selectedFuncionarios.some((f) => f.id === func.id)}
                            onChange={() => toggleSelectFuncionario(func)}
                          />
                          <span className="ms-2">{func.nome}</span>
                          {func.foto && <img src={func.foto} alt={func.nome} className="employee-photo ms-2" />}
                        </li>
                      ))}
                    </ul>
                    {selectedFuncionarios.length > 0 && (
                      <button type="submit" className="btn btn-danger w-100 mt-3" disabled={loading}>
                        {loading ? <><FaSpinner className="fa-spin me-2" />Removendo...</> : "Remover Funcionários"}
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

export default FuncionarioForm;