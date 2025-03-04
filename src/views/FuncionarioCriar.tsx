import React, { useState } from "react";
import axios from "axios";
import { Funcionario } from "../interfaces/Funcionario";
import { Empresa } from "../interfaces/Empresa";
import { useFetch } from "../functions/GetData";

const FuncionarioForm: React.FC = () => {
  const [acaoSelecionada, setAcaoSelecionada] = useState("");
  const [nome, setNome] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [useFile, setUseFile] = useState(false);
  const [funcionariosCadastrados, setFuncionariosCadastrados] = useState<
    Funcionario[]
  >([]);
  const [selectedFuncionarios, setSelectedFuncionarios] = useState<
    Funcionario[]
  >([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const token = localStorage.getItem("access_token");
  const empresas = useFetch<Empresa[]>(
    `api/empresas-usuario/?usuario_token=${token}`
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("nome", nome);

      if (useFile && fotoArquivo) {
        formData.append("foto", fotoArquivo);
      } else {
        formData.append("foto", fotoUrl);
      }

      const usuario_token = localStorage.getItem("access_token");
      if (usuario_token) {
        formData.append("usuario_token", usuario_token);
      }

      const res = await axios.post(
        "http://localhost:8000/api/funcionario-create/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("Funcionário cadastrado com sucesso!");

      const novoFuncionario = {
        id: res.data.funcionario.id,
        nome,
        foto: useFile ? fotoArquivo?.name || "" : fotoUrl,
      };

      setFuncionariosCadastrados((prev) => [...prev, novoFuncionario]);
      setNome("");
      setFotoUrl("");
      setFotoArquivo(null);
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao cadastrar funcionário.");
    } finally {
      setLoading(false);
    }
  };

  const adicionarFuncionariosAEmpresa = async () => {
    if (!selectedEmpresa) {
      alert("Selecione uma empresa antes de continuar.");
      return;
    }

    if (selectedFuncionarios.length === 0) {
      alert("Selecione ao menos um funcionário.");
      return;
    }

    const usuario_token = localStorage.getItem("access_token");

    try {
      await axios.post(
        "http://localhost:8000/api/adicionar-funcionarios-empresa/",
        {
          empresa_nome: selectedEmpresa.nome,
          funcionarios: selectedFuncionarios.map((func) => func.id),
          usuario_token,
        }
      );

      alert("Funcionários adicionados com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar funcionários:", error);
      alert("Ocorreu um erro ao adicionar funcionários à empresa.");
    }
  };

  const toggleSelectFuncionario = (funcionario: Funcionario) => {
    setSelectedFuncionarios((prev) =>
      prev.includes(funcionario)
        ? prev.filter((f) => f.id !== funcionario.id)
        : [...prev, funcionario]
    );
  };

  console.log("Empresas:", empresas.data);

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg p-4 border-0"
        style={{ maxWidth: "600px", margin: "auto", borderRadius: "12px" }}
      >
        <h2 className="text-center text-primary mb-4">Formulário de Ação</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Selecione a Ação</label>
              <select
                className="form-select"
                onChange={(e) => setAcaoSelecionada(e.target.value)}
                value={acaoSelecionada}
                required
              >
                <option value="">Escolha uma ação</option>
                <option value="cadastrar">Cadastrar Funcionário</option>
                <option value="remover">Remover Funcionário</option>
                <option value="editar">Editar Funcionário</option>
                <option value="adicionar-funcionarios">Adicionar Funcionários a Empresa</option>
                <option value="remover-funcionarios">Remover Funcionários da Empresa</option>
              </select>
            </div>

            {acaoSelecionada === "cadastrar" && (
              <>
                <div
                  className="card shadow-lg p-4 border-0"
                  style={{ maxWidth: "500px", margin: "auto", borderRadius: "12px" }}
                >
                  <h2 className="text-center text-primary mb-4">
                    Cadastro de Funcionário
                  </h2>
                  {message && (
                    <div className="alert alert-info text-center">{message}</div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Nome</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
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
                          placeholder="Insira a URL da imagem"
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
                          onChange={(e) =>
                            setFotoArquivo(e.target.files ? e.target.files[0] : null)
                          }
                          required={useFile}
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2"
                      style={{ borderRadius: "8px" }}
                      disabled={loading}
                    >
                      {loading ? "Cadastrando..." : "Cadastrar Funcionário"}
                    </button>
                  </form>
                </div>

                {funcionariosCadastrados.length > 0 && (
                  <div className="mt-5 text-center">
                    <h3>Funcionários cadastrados</h3>
                    <p className="text-muted mb-4">
                      Selecione os funcionários para cadastrar em uma empresa
                    </p>
                    <ul className="list-group">
                      {funcionariosCadastrados.map((func) => (
                        <li
                          key={func.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFuncionarios.includes(func)}
                            onChange={() => toggleSelectFuncionario(func)}
                          />
                          {func.nome}
                          {func.foto && (
                            <img
                              src={func.foto}
                              alt={func.nome}
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                              }}
                            />
                          )}
                        </li>
                      ))}
                    </ul>

                    {selectedFuncionarios.length > 0 && (
                      <div className="mt-4">
                        <h3>Suas empresas cadastrados</h3>
                        <p className="text-muted mb-4">
                          Selecione a empresa em que você deseja cadastrar os funcionários
                        </p>
                        <ul className="list-group">
                          {empresas.data?.map((empresa) => (
                            <li
                              key={empresa.id}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <input
                                type="checkbox"
                                checked={selectedEmpresa === empresa}
                                onChange={() => setSelectedEmpresa(empresa)}
                              />
                              {empresa.nome}
                            </li>
                          ))}
                        </ul>
                        <button
                          className="btn btn-success mt-3"
                          onClick={adicionarFuncionariosAEmpresa}
                        >
                          Cadastrar Funcionários na Empresa selecionada
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </form>
        </div>
      </div>
  );
};

export default FuncionarioForm;
