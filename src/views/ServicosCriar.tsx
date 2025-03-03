import React, { useState, useEffect } from "react";
import { ServicoCreate } from "../interfaces/Servico";
import { FuncionarioServicos } from "../interfaces/ServicosFuncionarios";
import axios from "axios";
import { Empresa } from "../interfaces/Empresa";
import { useFetch } from "../functions/GetData";
import { Servico } from "../interfaces/Servico";

const ServicoForm: React.FC = () => {
  const [acaoSelecionada, setAcaoSelecionada] = useState<string>("");
  const [servico, setServico] = useState<ServicoCreate>({
    nome: "",
    descricao: "",
    duracao: "",
    preco: "",
    funcionarios: [],
  });

  const [funcionarios, setFuncionarios] = useState<FuncionarioServicos[]>([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<number | null>(
    null
  );
  const empresas = useFetch<Empresa[]>(
    `api/empresas-usuario/?usuario_token=${localStorage.getItem(
      "access_token"
    )}`
  );
  const [loading, setLoading] = useState(false);
  const [servicosEmpresa, setServicosEmpresa] = useState<Servico[]>([]);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico>();

  useEffect(() => {
    if (empresaSelecionada === null) return;

    const fetchFuncionarios = async () => {
      const usuarioToken = localStorage.getItem("access_token");
      if (!usuarioToken) {
        alert("Usuário não autenticado.");
        return;
      }

      try {
        const payload = {
          empresa_id: empresaSelecionada,
          usuario_token: usuarioToken,
        };
        const { data } = await axios.get(
          `http://localhost:8000/api/funcionarios-criados/`,
          {
            params: payload,
          }
        );
        if (Array.isArray(data.funcionarios)) {
          setFuncionarios(data.funcionarios);
        } else {
          console.error("Erro: Resposta da API não é um array", data);
          setFuncionarios([]);
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao carregar funcionários.");
      }
    };

    const fetchServicos = async () => {
      const usuarioToken = localStorage.getItem("access_token");
      if (!usuarioToken) {
        alert("Usuário não autenticado.");
        return;
      }

      try {
        const payload = {
          empresa_id: empresaSelecionada,
          usuario_token: usuarioToken,
        };
        const { data } = await axios.get(
          `http://localhost:8000/api/servicos-criados-usuario-empresa/`,
          {
            params: payload,
          }
        );
        if (Array.isArray(data.servicos)) {
          setServicosEmpresa(data.servicos);
        } else {
          console.error("Erro: Resposta da API não é um array", data);
          setServicosEmpresa([]);
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao carregar serviços.");
      }
    };

    fetchFuncionarios();
    fetchServicos();
  }, [empresaSelecionada]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setServico((prev) => ({ ...prev, [name]: value }));
  };

  const handleFuncionarioChange = (id: number) => {
    setServico((prev) => {
      const funcionariosAtuais = prev.funcionarios.includes(id)
        ? prev.funcionarios.filter((fid) => fid !== id)
        : [...prev.funcionarios, id];

      return { ...prev, funcionarios: funcionariosAtuais };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const usuarioToken = localStorage.getItem("access_token");
    if (!usuarioToken) {
      alert("Usuário não autenticado.");
      setLoading(false);
      return;
    }


    if (acaoSelecionada === "cadastrar") {
      const { nome, descricao, duracao, preco, funcionarios } = servico;

      if (!empresaSelecionada) {
        alert("Empresa não selecionada.");
        setLoading(false);
        return;
      }

      const payload = {
        usuario_token: usuarioToken,
        funcionarios: funcionarios,
        servico_nome: nome,
        servico_descricao: descricao,
        servico_duracao: duracao,
        servico_valor: preco,
        empresa_id: empresaSelecionada,
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/api/adicionar-servicos-funcionario/",
          payload,
          {
            headers: {
              Authorization: `Token ${usuarioToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          alert("Serviço cadastrado com sucesso!");
          setServico({
            nome: "",
            descricao: "",
            duracao: "",
            preco: "",
            funcionarios: [],
          });
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao cadastrar serviço.");
      } finally {
        setLoading(false);
      }
    } else if (acaoSelecionada === "adicionar") {
      if (!empresaSelecionada) {
        alert("Empresa não selecionada.");
        setLoading(false);
        return;
      }

      const payload = {
        usuario_token: usuarioToken,
        empresa_id: empresaSelecionada,
        funcionarios: servico.funcionarios,
        servico_id: servicoSelecionado?.id,
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/api/adicionar-servico-funcionarios/",
          payload,
          {
            headers: {
              Authorization: `Token ${usuarioToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          alert("Serviço adicionado com sucesso nos funcionários!");
          setServico({
            nome: "",
            descricao: "",
            duracao: "",
            preco: "",
            funcionarios: [],
          });
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao cadastrar serviço.");
      } finally {
        setLoading(false);
      }
    } else if (acaoSelecionada === "remover") {
      if (!empresaSelecionada) {
        alert("Empresa não selecionada.");
        setLoading(false);
        return;
      }

      const payload = {
        usuario_token: usuarioToken,
        empresa_id: empresaSelecionada,
        servico_id: servicoSelecionado?.id,
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/api/remover-servico-empresa/",
          payload,
          {
            headers: {
              Authorization: `Token ${usuarioToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          alert("Serviço cadastrado com sucesso!");
          setServico({
            nome: "",
            descricao: "",
            duracao: "",
            preco: "",
            funcionarios: [],
          });
          window.location.reload();
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao cadastrar serviço.");
      } finally {
        setLoading(false);
      }
    } else if (acaoSelecionada === "remover-funcionarios") {
      if (!empresaSelecionada) {
        alert("Empresa não selecionada.");
        setLoading(false);
        return;
      }

      const payload = {
        usuario_token: usuarioToken,
        empresa_id: empresaSelecionada,
        servico_id: servicoSelecionado?.id,
        funcionarios: servico.funcionarios,
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/api/remover-servicos-funcionario/",
          payload,
          {
            headers: {
              Authorization: `Token ${usuarioToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          alert("Serviço removido com sucesso dos funcionários!");
          setServico({
            nome: "",
            descricao: "",
            duracao: "",
            preco: "",
            funcionarios: [],
          });
          window.location.reload();
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao cadastrar serviço.");
      } finally {
        setLoading(false);
      }
    } else if (acaoSelecionada === "editar") {

      if (!empresaSelecionada) {
        alert("Empresa não selecionada.");
        setLoading(false);
        return;
      }

      const payload = {
        usuario_token: usuarioToken,
        servico_id: servicoSelecionado?.id,
        servico_nome: servicoSelecionado?.nome,
        servico_descricao: servicoSelecionado?.descricao,
        servico_duracao: servicoSelecionado?.duracao,
        servico_preco: servicoSelecionado?.preco,
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/api/editar-servico/",
          payload,
          {
            headers: {
              Authorization: `Token ${usuarioToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          alert("Serviço editado com sucesso!");
          setServico({
            nome: "",
            descricao: "",
            duracao: "",
            preco: "",
            funcionarios: [],
          });
          window.location.reload();
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao editar serviço.");
      } finally {
        setLoading(false);
      }
    }
  };

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
              <option value="cadastrar">Cadastrar Serviço</option>
              <option value="adicionar">
                Adicionar Serviço a Funcionários
              </option>
              <option value="remover-funcionarios">
                Remover Serviço de Funcionários
              </option>
              <option value="remover">Remover Serviço</option>
              <option value="editar">Editar Serviço</option>
            </select>
          </div>

          {acaoSelecionada === "cadastrar" && (
            <>
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  name="nome"
                  className="form-control"
                  value={servico.nome}
                  onChange={handleChange}
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
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Duração</label>
                <input
                  type="text"
                  name="duracao"
                  className="form-control"
                  value={servico.duracao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Preço</label>
                <input
                  type="text"
                  name="preco"
                  className="form-control"
                  value={servico.preco}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Selecione uma Empresa</label>
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

              <div className="mb-3">
                <label className="form-label">Funcionários</label>
                <div className="d-flex flex-wrap gap-2">
                  {funcionarios.map(({ id, nome, foto_url, servicos }) => (
                    <div
                      key={id}
                      className="d-flex align-items-center gap-2 border p-2 rounded"
                    >
                      <img
                        src={foto_url}
                        alt={nome}
                        className="rounded-circle"
                        width="40"
                        height="40"
                      />
                      <span>{nome}</span>
                      <input
                        type="checkbox"
                        checked={servico.funcionarios.includes(id)}
                        onChange={() => handleFuncionarioChange(id)}
                      />
                      <div className="text-muted">
                        <strong>Serviços Associados:</strong>
                        <ul>
                          {servicos.map((servico) => (
                            <li key={servico.id}>
                              {servico.nome} - {servico.preco} -{" "}
                              {servico.duracao} minutos
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                style={{ borderRadius: "8px" }}
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar Serviço"}
              </button>
            </>
          )}

          {acaoSelecionada === "adicionar" && (
            <>
              <div className="mb-3">
                <label className="form-label">Escolha uma Empresa</label>
                <select
                  className="form-select"
                  onChange={(e) => {
                    const empresaId = Number(e.target.value);
                    setEmpresaSelecionada(empresaId);
                    setServicoSelecionado(undefined);
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

              {empresaSelecionada &&
                (console.log("Empresa selecionada", empresaSelecionada),
                console.log("Serviços da empresa", servicosEmpresa),
                (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Escolha um Serviço</label>
                      <select
                        className="form-select"
                        onChange={(e) => {
                          const servicoId = Number(e.target.value);
                          setServicoSelecionado(
                            servicosEmpresa.find(
                              (servico) => servico.id === servicoId
                            )
                          );
                        }}
                        value={servicoSelecionado?.id || ""}
                        required
                      >
                        <option value="">Escolha um serviço</option>
                        {servicosEmpresa.map((servico) => (
                          <option key={servico.id} value={servico.id}>
                            {servico.nome} - {servico.preco} - {servico.duracao}{" "}
                            min
                          </option>
                        ))}
                      </select>
                    </div>

                    {servicoSelecionado && (
                      <div className="mb-3">
                        <label className="form-label">Funcionários</label>
                        <div className="d-flex flex-wrap gap-2">
                          {funcionarios.map(
                            ({ id, nome, foto_url, servicos }) => (
                              <div
                                key={id}
                                className="d-flex align-items-center gap-2 border p-2 rounded"
                              >
                                <img
                                  src={foto_url}
                                  alt={nome}
                                  className="rounded-circle"
                                  width="40"
                                  height="40"
                                />
                                <span>{nome}</span>
                                <input
                                  type="checkbox"
                                  checked={servico.funcionarios.includes(id)}
                                  onChange={() => handleFuncionarioChange(id)}
                                />
                                <div className="text-muted">
                                  <strong>Serviços Associados:</strong>
                                  <ul>
                                    {servicos.map((servico) => (
                                      <li key={servico.id}>
                                        {servico.nome} - {servico.preco} -{" "}
                                        {servico.duracao} minutos
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary w-100 py-2 mt-3"
                          style={{ borderRadius: "8px" }}
                          disabled={loading}
                        >
                          {loading
                            ? "Adicionando..."
                            : "Adicionar Serviço aos Funcionários"}
                        </button>
                      </div>
                    )}
                  </>
                ))}
            </>
          )}

          {acaoSelecionada === "editar" && (
            <>
              <div className="mb-3">
                <label className="form-label">Selecione uma Empresa</label>
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
                    <label className="form-label">Selecione um Serviço</label>
                    <select
                      className="form-select"
                      onChange={(e) => {
                        const servicoId = Number(e.target.value);
                        setServicoSelecionado(
                          servicosEmpresa.find(
                            (servico) => servico.id === servicoId
                          )
                        );
                      }}
                      value={servicoSelecionado?.id || ""}
                      required
                    >
                      <option value="">Escolha um serviço</option>
                      {servicosEmpresa.map((servico) => (
                        <option key={servico.id} value={servico.id}>
                          {servico.nome} - {servico.preco} - {servico.duracao}{" "}
                          min
                        </option>
                      ))}
                    </select>
                  </div>

                  {servicoSelecionado && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Nome</label>

                        <input
                          type="text"
                          className="form-control"
                          value={servicoSelecionado.nome}
                          onChange={(e) =>
                            setServicoSelecionado({
                              ...servicoSelecionado,
                              nome: e.target.value,
                            })
                          }
                        />

                        <label className="form-label">Descrição</label>

                        <input
                          type="text"
                          className="form-control"
                          value={servicoSelecionado.descricao}
                          onChange={(e) =>
                            setServicoSelecionado({
                              ...servicoSelecionado,
                              descricao: e.target.value,
                            })
                          }
                        />

                        <label className="form-label">Duração</label>

                        <input
                          type="text"
                          className="form-control"
                          value={servicoSelecionado.duracao}
                          onChange={(e) =>
                            setServicoSelecionado({
                              ...servicoSelecionado,
                              duracao: e.target.value,
                            })
                          }
                        />

                        <label className="form-label">Preço</label>

                        <input
                          type="text"
                          className="form-control"
                          value={servicoSelecionado.preco}
                          onChange={(e) =>
                            setServicoSelecionado({
                              ...servicoSelecionado,
                              preco: e.target.value,
                            })
                          }
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-2"
                        style={{ borderRadius: "8px" }}
                        disabled={loading}
                      >
                        {loading ? "Editando..." : "Editar Serviço da Empresa"}
                      </button>
                  </>
                  )}
                </>
              )}
            </>
          )}

          {acaoSelecionada === "remover" && (
            <>
              <div className="mb-3">
                <label className="form-label">Selecione uma Empresa</label>
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
                    <label className="form-label">Selecione um Serviço</label>
                    <select
                      className="form-select"
                      onChange={(e) => {
                        const servicoId = Number(e.target.value);
                        setServicoSelecionado(
                          servicosEmpresa.find(
                            (servico) => servico.id === servicoId
                          )
                        );
                      }}
                      value={servicoSelecionado?.id || ""}
                      required
                    >
                      <option value="">Escolha um serviço</option>
                      {servicosEmpresa.map((servico) => (
                        <option key={servico.id} value={servico.id}>
                          {servico.nome} - {servico.preco} - {servico.duracao}{" "}
                          min
                        </option>
                      ))}
                    </select>
                  </div>

                  {servicoSelecionado && (
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2"
                      style={{ borderRadius: "8px" }}
                      disabled={loading}
                    >
                      {loading ? "Removendo..." : "Remover Serviço da Empresa"}
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {acaoSelecionada === "remover-funcionarios" && (
            <>
              <div className="mb-3">
                <label className="form-label">Selecione uma Empresa</label>
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
                    <label className="form-label">Selecione um Serviço</label>
                    <select
                      className="form-select"
                      onChange={(e) => {
                        const servicoId = Number(e.target.value);
                        setServicoSelecionado(
                          servicosEmpresa.find(
                            (servico) => servico.id === servicoId
                          )
                        );
                      }}
                      value={servicoSelecionado?.id || ""}
                      required
                    >
                      <option value="">Escolha um serviço</option>
                      {servicosEmpresa.map((servico) => (
                        <option key={servico.id} value={servico.id}>
                          {servico.nome} - {servico.preco} - {servico.duracao}{" "}
                          min
                        </option>
                      ))}
                    </select>
                  </div>

                  {servicoSelecionado && (
                    <div className="mb-3">
                      <label className="form-label">Funcionários</label>
                      <div className="d-flex flex-wrap gap-2">
                        {funcionarios.map(
                          ({ id, nome, foto_url, servicos }) => (
                            servicos.some((servico) => servico.id === servicoSelecionado?.id) && (
                              <div
                                key={id}
                                className="d-flex align-items-center gap-2 border p-2 rounded"
                              >
                                <img
                                  src={foto_url}
                                  alt={nome}
                                  className="rounded-circle"
                                  width="40"
                                  height="40"
                                />
                                <span>{nome}</span>
                                <input
                                  type="checkbox"
                                  checked={servico.funcionarios.includes(id)}
                                  onChange={() => handleFuncionarioChange(id)}
                                />
                                <div className="text-muted">
                                  <strong>Serviços Associados:</strong>
                                  <ul>
                                    {servicos.map((servico) => (
                                      <li key={servico.id}>
                                        {servico.nome} - {servico.preco} -{" "}
                                        {servico.duracao} minutos
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )

                          )
                        )}
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 mt-3"
                        style={{ borderRadius: "8px" }}
                        disabled={loading}
                      >
                        {loading
                          ? "Removendo..."
                          : "Remover Serviço dos Funcionários"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ServicoForm;
