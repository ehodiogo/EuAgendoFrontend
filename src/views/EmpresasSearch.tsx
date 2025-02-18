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
    <div className="p-4 bg-light border rounded shadow-sm">
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

      {search && (
        <ul className="list-group">
          {filteredEmpresas && filteredEmpresas.length > 0 ? (
            filteredEmpresas.map((empresa, index) => (
              <li key={index} className="list-group-item">
                <Link
                  to={`/empresas/${empresa.nome}`}
                  className="text-decoration-none"
                >
                  {empresa.nome} - {empresa.cnpj}
                </Link>
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">
              Nenhuma empresa encontrada.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default EmpresasSearch;
