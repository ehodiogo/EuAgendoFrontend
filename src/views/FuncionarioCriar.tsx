import React, { useState } from "react";
import axios from "axios";
import { Funcionario } from "../interfaces/Funcionario";
import { Empresa } from "../interfaces/Empresa";
import { useFetch } from "../functions/GetData";
import Navbar from "../components/Navbar";

const FuncionarioForm: React.FC = () => {
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
  const [acaoSelecionada, setAcaoSelecionada] = useState<string>("");
  const token = localStorage.getItem("access_token");
  const empresas = useFetch<Empresa[]>(
    `api/empresas-usuario/?usuario_token=${token}`
  );
  const seusFuncionarios = useFetch<Funcionario[]>(
    `api/funcionarios-usuario/?usuario_token=${token}`
  );
  const [acaoEmpresa, setAcaoEmpresa] = useState<string>("");
  const [useFiles, setUseFiles] = useState<boolean[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (acaoSelecionada === "cadastrar") {

      let possui_limite = false;

      try {
        const response = await fetch(
          "http://localhost:8000/api/possui-limite/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              usuario_token: token,
              acao_realizada: "criar_funcionario",
            }),
          }
        );

        const data = await response.json();
        possui_limite = data.possui_limite;
      } catch (error) {
        console.error("Erro ao verificar limite:", error);
        alert("Ocorreu um erro ao verificar seu limite de funcionários.");
      }

      if (!possui_limite) {
        alert("Você atingiu o limite de funcionários cadastrados.");
        setLoading(false);
        return;
      }

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
        setFotoUrl("");
        setFotoArquivo(null);
      }
    } else if (acaoSelecionada === "editar") {
      const payload = {
        usuario_token: token,
        funcionario_id: selectedFuncionarios[0].id,
        nome: selectedFuncionarios[0].nome,
        foto: selectedFuncionarios[0].foto,
      };

      try {
        await axios.post(
          "http://localhost:8000/api/editar-funcionario/",
          payload
        );
        alert("Funcionário editado com sucesso!");
        window.location.reload(); // MELHORAR ISSO
      } catch (error) {
        console.error("Erro ao editar funcionário:", error);
        alert("Ocorreu um erro ao editar funcionário.");
      } finally {
        setLoading(false);
      }

    } else if (acaoSelecionada === "remover") {
      const payload = {
        usuario_token: token,
        funcionarios_ids: selectedFuncionarios.map((func) => func.id),
      };

      try {
        await axios.post(
          "http://localhost:8000/api/remover-funcionarios/",
          payload
        );
        alert("Funcionários excluídos com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir funcionários:", error);
        alert("Ocorreu um erro ao excluir funcionários.");
      } finally {
        setLoading(false);
      }
      setSelectedFuncionarios([]);
      setFuncionariosCadastrados((prev) =>
        prev.filter((func) => !selectedFuncionarios.includes(func))
      );
      window.location.reload(); // MELHORAR ISSO
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

  const removerFuncionariosDaEmpresa = async () => {
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
        "http://localhost:8000/api/remover-funcionarios-empresa/",
        {
          empresa_id: selectedEmpresa.id,
          funcionarios_ids: selectedFuncionarios.map((func) => func.id),
          usuario_token,
        }
      );

      alert("Funcionários removidos com sucesso!");
    } catch (error) {
      console.error("Erro ao remover funcionários:", error);
      alert("Ocorreu um erro ao remover funcionários da empresa.");    
    alert("Ocorreu um erro ao remover funcionários da empresa.");
    }
  };

  const toggleSelectFuncionario = (funcionario: Funcionario) => {
    setSelectedFuncionarios((prev) => {
      if (prev[0]?.id === funcionario.id) {
        return []; 
      } else {
        return [funcionario]; 
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div
          className="card shadow-lg p-4 border-0"
          style={{ maxWidth: "600px", margin: "auto", borderRadius: "12px" }}
        >
          <h2 className="text-center text-primary mb-4">
            Ações que você pode realizar nos seus Funcionários
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <select
                className="form-select text-center"
                onChange={(e) => setAcaoSelecionada(e.target.value)}
                value={acaoSelecionada}
                required
              >
                <option value="">Escolha uma ação</option>
                <option value="cadastrar">Cadastrar Funcionário</option>
                <option value="remover">Remover Funcionário</option>
                <option value="editar">Editar Funcionário</option>
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
                    Cadastro de Funcionário
                  </h2>
                  {message && (
                    <div className="alert alert-info text-center">
                      {message}
                    </div>
                  )}
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
                          setFotoArquivo(
                            e.target.files ? e.target.files[0] : null
                          )
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
                          Selecione a empresa em que você deseja cadastrar os
                          funcionários
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
                    Edição de Funcionário
                  </h2>
                  {message && (
                    <div className="alert alert-info text-center">
                      {message}
                    </div>
                  )}

                  <p className="text-muted mb-4">
                    Selecione o funcionário que deseja editar
                  </p>
                  <ul className="list-group">
                    {seusFuncionarios.data?.map((func) => (
                      <li
                        key={func.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFuncionarios.length === 1 &&
                            selectedFuncionarios[0].id === func.id
                          }
                          onChange={() => toggleSelectFuncionario(func)}
                        />
                        {func.nome}
                      </li>
                    ))}
                  </ul>

                  <div className="form-check mt-3">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="alterar-nome-foto"
                      checked={acaoEmpresa === "editar_nome_foto"}
                      onChange={() => setAcaoEmpresa("editar_nome_foto")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="alterar-nome-foto"
                    >
                      Alterar Nome ou Foto do Funcionário
                    </label>
                  </div>

                  <div className="form-check mt-3">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="inserir-em-empresa"
                      checked={acaoEmpresa === "inserir"}
                      onChange={() => setAcaoEmpresa("inserir")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="inserir-em-empresa"
                    >
                      Inserir em uma empresa
                    </label>
                  </div>

                  <div className="form-check mt-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="remover-de-empresa"
                      checked={acaoEmpresa === "remover"}
                      onChange={() => setAcaoEmpresa("remover")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="remover-de-empresa"
                    >
                      Remover de uma empresa
                    </label>
                  </div>

                  {selectedFuncionarios.length > 0 && acaoEmpresa && (
                    <div className="mt-4">
                      <p className="text-muted mb-4">
                        {acaoEmpresa === "inserir"
                          ? "Selecione a Empresa para Adicionar o Funcionário"
                          : acaoEmpresa === "remover"
                          ? "Selecione a Empresa para Remover o Funcionário"
                          : "Editar Nome ou Foto do Funcionário"}
                      </p>
                      <ul className="list-group">
                        {acaoEmpresa === "inserir" &&
                          empresas?.data
                            ?.filter(
                              (empresa) =>
                                !empresa.funcionarios?.some((func) =>
                                  selectedFuncionarios.some(
                                    (selectedFunc) =>
                                      selectedFunc.nome === func.nome
                                  )
                                )
                            )
                            .map((empresa) => (
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

                        {acaoEmpresa === "remover" &&
                          empresas?.data
                            ?.filter((empresa) =>
                              empresa.funcionarios?.some((func) =>
                                selectedFuncionarios.some(
                                  (selectedFunc) =>
                                    selectedFunc.nome === func.nome
                                )
                              )
                            )
                            .map((empresa) => (
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

                      {acaoEmpresa === "editar_nome_foto" &&
                        selectedFuncionarios.length === 1 && (
                          <div className="p-4 border rounded shadow-sm">
                            <h5>Editar Nome ou Foto de Funcionários</h5>

                            {selectedFuncionarios.map((func, index) => (
                              <div key={func.id} className="mb-4">
                                <h6>Funcionário: {func.nome}</h6>

                                {/* Campo para alterar o nome */}
                                <div className="mb-3">
                                  <label className="form-label">
                                    Novo Nome
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Novo Nome"
                                    value={func.nome}
                                    onChange={(e) => {
                                      const updatedFuncionarios = [
                                        ...selectedFuncionarios,
                                      ];
                                      updatedFuncionarios[index].nome =
                                        e.target.value;
                                      setSelectedFuncionarios(
                                        updatedFuncionarios
                                      );
                                    }}
                                  />
                                </div>

                                {/* Opções para alterar a foto */}
                                <div className="mb-3">
                                  <label className="form-label">
                                    Nova Foto
                                  </label>
                                  <div className="form-check">
                                    <input
                                      type="radio"
                                      className="form-check-input"
                                      id={`urlOption-${func.id}`}
                                      name={`fotoOption-${func.id}`}
                                      checked={!useFiles[index]}
                                      onChange={() => {
                                        const updatedFuncionarios = [
                                          ...selectedFuncionarios,
                                        ];
                                        updatedFuncionarios[index].foto = "";
                                        setSelectedFuncionarios(
                                          updatedFuncionarios
                                        );
                                        // Atualiza o estado useFiles para false
                                        const updatedUseFiles = [...useFiles];
                                        updatedUseFiles[index] = false;
                                        setUseFiles(updatedUseFiles);
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`urlOption-${func.id}`}
                                    >
                                      Usar URL
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      type="radio"
                                      className="form-check-input"
                                      id={`fileOption-${func.id}`}
                                      name={`fotoOption-${func.id}`}
                                      checked={useFiles[index]}
                                      onChange={() => {
                                        const updatedFuncionarios = [
                                          ...selectedFuncionarios,
                                        ];
                                        updatedFuncionarios[index].foto = "";
                                        setSelectedFuncionarios(
                                          updatedFuncionarios
                                        );
                                        // Atualiza o estado useFiles para true
                                        const updatedUseFiles = [...useFiles];
                                        updatedUseFiles[index] = true;
                                        setUseFiles(updatedUseFiles);
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`fileOption-${func.id}`}
                                    >
                                      Upload de arquivo
                                    </label>
                                  </div>
                                </div>

                                {!useFiles[index] ? (
                                  <div className="mb-3">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Insira a URL da nova imagem"
                                      value={func.foto || ""}
                                      onChange={(e) => {
                                        const updatedFuncionarios = [
                                          ...selectedFuncionarios,
                                        ];
                                        updatedFuncionarios[index].foto =
                                          e.target.value;
                                        setSelectedFuncionarios(
                                          updatedFuncionarios
                                        );
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="mb-3">
                                    <input
                                      type="file"
                                      className="form-control"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const updatedFuncionarios = [
                                          ...selectedFuncionarios,
                                        ];
                                        updatedFuncionarios[index].foto = e
                                          .target.files
                                          ? e.target.files[0].name
                                          : "";
                                        setSelectedFuncionarios(
                                          updatedFuncionarios
                                        );
                                      }}
                                    />
                                  </div>
                                )}

                                <button
                                  type="button"
                                  className="btn btn-primary w-100 text-center align-items-center"
                                  onClick={handleSubmit}
                                >
                                  Salvar Alterações do Funcionário
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                      {(acaoEmpresa === "inserir" ||
                        acaoEmpresa === "remover") && (
                        <button
                          className="btn btn-success mt-3 w-100"
                          onClick={
                            acaoEmpresa === "inserir"
                              ? adicionarFuncionariosAEmpresa
                              : removerFuncionariosDaEmpresa
                          }
                        >
                          {acaoEmpresa === "inserir"
                            ? "Adicionar Funcionários à Empresa"
                            : "Remover Funcionários da Empresa"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {acaoSelecionada === "remover" && (
              <>
                <h3>Remover Funcionário</h3>
                <p className="text-muted mb-4">
                  Selecione o funcionário que deseja remover
                </p>
                <ul className="list-group">
                  {seusFuncionarios.data?.map((func) => (
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
                    </li>
                  ))}
                </ul>

                {selectedFuncionarios.length > 0 && (
                  <button
                    type="submit"
                    className="btn btn-danger w-100 py-2 mt-4"
                    style={{ borderRadius: "8px" }}
                    disabled={loading}
                  >
                    {loading ? "Removendo..." : "Remover Funcionários"}
                  </button>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default FuncionarioForm;
