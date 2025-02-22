import { Agendamento } from "../interfaces/Agendamento";
import { useFetch } from "../functions/GetData";
import { Funcionario } from "../interfaces/Funcionario";
import { Cliente } from "../interfaces/Cliente";
import { Servico } from "../interfaces/Servico";

interface AgendamentoDadosProps {
  agendamento: Agendamento;
}

const AgendamentoDados = ({ agendamento }: AgendamentoDadosProps) => {
  const funcionario = useFetch<Funcionario>(
    `api/funcionario/${agendamento.funcionario}`
  );
  const cliente = useFetch<Cliente>(`api/cliente/${agendamento.cliente}`);
  const servico = useFetch<Servico>(`api/servico/${agendamento.servico}`);

  console.log("AgendamentoDados", funcionario, cliente, servico);

  return (
    <div>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <td>
              <strong>Funcionário:</strong>
            </td>
            <td>{funcionario.data?.nome}</td>
          </tr>
          <tr>
            <td>
              <strong>Cliente:</strong>
            </td>
            <td>{cliente.data?.nome}</td>
          </tr>
          <tr>
            <td>
              <strong>Serviço:</strong>
            </td>
            <td>{servico.data?.nome}</td>
          </tr>
          <tr>
            <td>
              <strong>Hora:</strong>
            </td>
            <td>{agendamento.hora}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AgendamentoDados;
