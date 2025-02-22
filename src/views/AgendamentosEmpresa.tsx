import { useState } from "react";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import AgendamentosHoje from "./AgendamentosHoje"; // Importa o componente de agendamentos

const EmpresasUsuario = () => {
  const token = localStorage.getItem("access_token");
  const empresas = useFetch<Empresa[]>(
    `api/empresas-usuario/?usuario_token=${token}`
  );

  // Estado para armazenar a empresa selecionada
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(
    null
  );

  // Função para mudar a empresa selecionada
  const handleChangeEmpresa = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const empresaId = event.target.value;
    const empresa = empresas.data?.find(
      (empresa) => empresa.id.toString() === empresaId
    );
    setEmpresaSelecionada(empresa || null);
  };

  return (
    <div>
      <h1>Empresas do Usuário</h1>

      {/* Dropdown para selecionar a empresa */}
      <select onChange={handleChangeEmpresa} defaultValue="">
        <option value="" disabled>
          Selecione uma empresa
        </option>
        {empresas.data?.map((empresa: Empresa) => (
          <option key={empresa.id + empresa.cnpj} value={empresa.id}>
            {empresa.nome}
          </option>
        ))}
      </select>

      {/* Mostrar os agendamentos caso uma empresa tenha sido selecionada */}
      {empresaSelecionada && <AgendamentosHoje empresa={empresaSelecionada} />}
    </div>
  );
};

export default EmpresasUsuario;
