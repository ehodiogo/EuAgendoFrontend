import { useParams, Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import { Funcionario } from "../interfaces/Funcionario";

function EmpresaDetails() {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const empresas = useFetch<Empresa[]>("api/empresa/?q=" + empresaNome);
  const funcionarios = useFetch<Funcionario[]>(
    "api/funcionario/?empresa=" + empresaNome
  );

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

  console.log("Empresa service", empresa.servicos);

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

      <ul className="list-group mb-4">
        <li className="list-group-item">CNPJ: {empresa.cnpj}</li>
        <li className="list-group-item">Endereço: {empresa.endereco}</li>
        <li className="list-group-item">Telefone: {empresa.telefone}</li>
        <li className="list-group-item">Email: {empresa.email}</li>
      </ul>

      <h4 className="text-danger mb-3">📌 Serviços Disponíveis</h4>
      <ul className="list-group mb-4">
        {empresa.servicos && empresa.servicos.length > 0 ? (
          empresa.servicos.map((servico, index) => (
            <li key={index} className="list-group-item">
              {servico.nome}
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">
            Nenhum serviço cadastrado.
          </li>
        )}
      </ul>

      <h4 className="text-danger mb-3">👨‍💼 Funcionários</h4>
      <ul className="list-group mb-4">
        {funcionarios.data && funcionarios.data.length > 0 ? (
          funcionarios.data.map((funcionario) => (
            <li key={funcionario.id} className="list-group-item">
              <img
                src={funcionario.foto}
                alt={funcionario.nome}
                className="img-fluid rounded-circle"
                width="40"
                height="40"
              />
              <span className="ml-2">{funcionario.nome}</span>
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">
            Nenhum funcionário cadastrado.
          </li>
        )}
      </ul>

      <Link to={`/agendar/${empresa.nome}`} className="btn btn-danger w-100">
        Agendar
      </Link>
    </div>
  );
}

export default EmpresaDetails;
