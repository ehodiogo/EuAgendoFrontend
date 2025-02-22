import { useState } from "react";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import AgendamentosHoje from "./AgendamentosHoje";
import Navbar from "../components/Navbar";

const EmpresasUsuario = () => {
  const token = localStorage.getItem("access_token");
  const empresas = useFetch<Empresa[]>(
    `api/empresas-usuario/?usuario_token=${token}`
  );

  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);

  const handleToggleDropdown = (empresaId: number) => {
    setDropdownAberto(dropdownAberto === empresaId ? null : empresaId);
  };

  return (
    <div className="jogos-container">
      <Navbar />
      <h1 className="display-3 text-primary mb-5 text-center mt-5">Suas Empresas</h1>

      <p className="lead text-muted text-center">Selecione uma empresa para ver seus agendamentos para hoje.</p>

      {/* Lista de empresas */}
      <div className="row justify-content-center">
        {empresas.data?.map((empresa: Empresa) => (
          <div className="col-md-6 col-lg-4 mb-4" key={empresa.id}>
            <div
              className="card shadow-lg"
              style={{ cursor: "pointer" }}
              onClick={() => handleToggleDropdown(empresa.id)}
            >
              <div className="card-body text-center">
                <h4 className="card-title">{empresa.nome}</h4>
                <p className="card-text">{empresa.cnpj}</p>
              </div>
            </div>

            {/* Dropdown com agendamentos */}
            {dropdownAberto === empresa.id && (
              <div className="card shadow-lg mt-2">
                <div className="card-body">
                  <AgendamentosHoje empresa={empresa} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmpresasUsuario;
