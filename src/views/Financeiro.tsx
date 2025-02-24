import { useState } from "react";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import Navbar from "../components/Navbar";
import FinanceiroDados from "../components/FinanceiroDados";

const Financeiro = () => {
  const token = localStorage.getItem("access_token");
  const empresas_usuario = useFetch<Empresa[]>(
    `api/empresas-usuario/?usuario_token=${token}`
  );
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);

  const handleToggleDropdown = async (empresaId: number) => {
    if (dropdownAberto === empresaId) {
      setDropdownAberto(null); 
      return;
    }

      setDropdownAberto(empresaId);
    };

  return (
    <div className="jogos-container">
      <Navbar />
      <h1 className="display-3 text-primary mb-5 text-center mt-5">
        Seus Dados Financeiros
      </h1>

      <p className="lead text-muted text-center">
        Selecione uma empresa para ver seus dados financeiros.
      </p>

      <div className="row justify-content-center">
        {empresas_usuario.data?.map((empresa: Empresa) => (
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

            {dropdownAberto === empresa.id && (
              <div className="card shadow-lg mt-2">
                <div className="card-body">
                    <FinanceiroDados empresa_id={empresa.id} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Financeiro;
