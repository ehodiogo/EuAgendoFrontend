import { useState } from "react";
import { Agendamento } from "../interfaces/Agendamento";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import AgendamentoDados from "../components/AgendamentoDados";
import { FaTable, FaCalendar } from "react-icons/fa";
import FiltrosAgendamento from "../components/FiltrosAgendamentos";

interface AgendamentosHojeProps {
  empresa: Empresa;
}

export default function AgendamentosHoje({ empresa }: AgendamentosHojeProps) {
  const [visualizacao, setVisualizacao] = useState<"tabela" | "quadro">(
    "tabela"
  );
  const agendamentosHoje = useFetch<Agendamento[]>(
    `api/agendamentos-hoje/?empresa_id=${empresa.id}`
  );

  const alternarVisualizacao = (tipo: "tabela" | "quadro") => {
    console.log(`Visualização alterada para: ${tipo}`);
    setVisualizacao(tipo);
  };

  return (
    <div className="container my-5">
      <h1 className="display-3 text-primary mb-4">Agendamentos para Hoje</h1>
      <p className="lead text-muted mb-4">
        Confira os agendamentos para hoje na empresa {empresa.nome}.
      </p>

      <div className="mb-3">
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => alternarVisualizacao("tabela")}
        >
          <FaTable className="me-2" />
          Tabela
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => alternarVisualizacao("quadro")}
        >
          <FaCalendar className="me-2" />
          Quadro de Horários
        </button>
      </div>

      {agendamentosHoje.data && agendamentosHoje.data.length > 0 ? (
        visualizacao === "tabela" ? (
          <div className="table-responsive">
            <div className="mb-3">
              <FiltrosAgendamento />
            </div>

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
          <div>
            <p className="text-center">
              Quadro de horários em{" "}
              <span className="fw-bold text-warning">desenvolvimento</span>.
            </p>
          </div>
        )
      ) : (
        <p>Não há agendamentos para hoje.</p>
      )}
    </div>
  );
}
