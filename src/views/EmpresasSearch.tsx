import { useState } from "react";

function EmpresasSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const empresas = [
    "Clínica PetLife",
    "Studio Fit",
    "Auto Center",
    "Salão Bella",
    "Tech Solutions",
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setResults(empresas.filter((emp) => emp.toLowerCase().includes(query)));
  };

  return (
    <div className="p-4 bg-light border rounded shadow-sm">
      <h2 className="text-danger mb-4">🔍 Buscar Empresas</h2>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Digite o nome da empresa..."
          value={search}
          onChange={handleSearch}
        />
        <button className="btn btn-outline-danger" disabled={!search}>
          Buscar
        </button>
      </div>

      {search && (
        <ul className="list-group">
          {results.length > 0 ? (
            results.map((empresa, index) => (
              <li key={index} className="list-group-item">
                {empresa}
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
