import { Agendamento } from "../interfaces/Agendamento";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import AgendamentoDados from "../components/AgendamentoDados";

interface AgendamentosHojeProps {
  empresa: Empresa;
}

export default function AgendamentosHoje({ empresa }: AgendamentosHojeProps) {
  const agendamentosHoje = useFetch<Agendamento[]>(
    `api/agendamentos-hoje/?empresa_id=${empresa.id}`
  );

  return (
    <div className="container my-5">
      <h1 className="display-3 text-primary mb-4">Agendamentos para Hoje</h1>
      <p className="lead text-muted mb-4">
        Confira os agendamentos para hoje na empresa {empresa.nome}.
      </p>

      {agendamentosHoje.data && agendamentosHoje.data.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Detalhes dos Agendamentos</th>
              </tr>
            </thead>
            <tbody>
              {agendamentosHoje.data.map((agendamento: Agendamento) => (
                <tr key={agendamento.id}>
                  <td>
                    <AgendamentoDados agendamento={agendamento} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Não há agendamentos para hoje.</p>
      )}
    </div>
  );
}
