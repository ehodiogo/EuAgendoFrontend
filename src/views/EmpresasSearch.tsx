import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";

function EmpresasSearch() {
  const [search, setSearch] = useState("");
  const empresas = useFetch<Empresa[]>("api/empresa");

  const filteredEmpresas = empresas.data?.filter((empresa: Empresa) =>
    empresa.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 bg-light border rounded shadow-sm text-center">
      <h2 className="text-danger mb-4">🔍 Buscar Empresas</h2>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Digite o nome da empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn btn-outline-danger"
          onClick={() => setSearch("")}
        >
          Limpar
        </button>
      </div>

      {/* Mostrar empresas filtradas quando houver pesquisa */}
      <div className="row">
        {filteredEmpresas && filteredEmpresas.length > 0 ? (
          filteredEmpresas.map((empresa, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card shadow-lg">
                <img
                  src={empresa.logo || "default-logo.png"} // Logo padrão
                  alt={empresa.nome}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary">{empresa.nome}</h5>
                  <p className="card-text">
                    <strong>Endereço:</strong> {empresa.endereco} <br />
                    <strong>Telefone:</strong> {empresa.telefone} <br />
                    <strong>Serviços:</strong>
                    <ul>
                      {empresa.servicos.map((servico, index) => (
                        <li key={index}>{servico.nome}</li> // Exibindo apenas o nome do serviço
                      ))}
                    </ul>
                  </p>
                  <Link
                    to={`/empresas/${empresa.nome}`}
                    className="btn btn-danger btn-sm"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-warning mt-4" role="alert">
            Nenhuma empresa encontrada para "{search}".
          </div>
        )}
      </div>
    </div>
  );
}

export default EmpresasSearch;
