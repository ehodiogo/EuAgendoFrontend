import { useFetch } from "../functions/GetData";
import { Agendamento } from "../interfaces/Agendamento";
import { Empresa } from "../interfaces/Empresa";

interface AgendamentosHojeProps {
  empresa: Empresa;
}

export default function AgendamentosHoje({ empresa }: AgendamentosHojeProps) {
  const agendamentosHoje = useFetch<Agendamento[]>(
    `api/agendamentos-hoje/?empresa_id=${empresa.id}`
  );

  return (
    <div className="container">
      <h1>Agendamentos para hoje</h1>
      <p>Confira os agendamentos para hoje na empresa {empresa.nome}</p>

      {agendamentosHoje.data && agendamentosHoje.data.length > 0 ? (
        <ul>
          {agendamentosHoje.data.map((agendamento: Agendamento) => (
            <li key={agendamento.id}>
              <p>Cliente: {agendamento.cliente}</p>
              <p>Serviço: {agendamento.servico}</p>
              <p>Horário: {agendamento.hora}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Não há agendamentos para hoje.</p>
      )}
    </div>
  );
}
