import { useParams } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";

function EmpresaDetails() {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const empresas = useFetch<Empresa[]>("api/empresa/?q=" + empresaNome);

  const empresa = empresas.data?.find(
    (e) => e.nome.toLowerCase() === empresaNome?.toLowerCase()
  );

  if (!empresa) {
    return (
      <div className="p-4 bg-light border rounded shadow-sm">
        Empresa não encontrada.
      </div>
    );
  }

  return (
    <div className="p-4 bg-light border rounded shadow-sm">
      <h2 className="text-danger mb-4">🏢 {empresa.nome}</h2>

      <div className="input-group mb-4">
        <img
          src={empresa.logo}
          alt={empresa.nome}
          className="img-fluid rounded"
        />
      </div>

      <ul className="list-group">
        <li className="list-group-item">CNPJ: {empresa.cnpj}</li>
        <li className="list-group-item">Endereço: {empresa.endereco}</li>
        <li className="list-group-item">Telefone: {empresa.telefone}</li>
        <li className="list-group-item">Email: {empresa.email}</li>
      </ul>
    </div>
  );
}

export default EmpresaDetails;
