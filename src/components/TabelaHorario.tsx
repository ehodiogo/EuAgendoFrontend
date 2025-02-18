import { useState } from "react";
import { useFetch } from "../functions/GetData";
import { Funcionario } from "../interfaces/Funcionario";

interface HorariosTabelaProps {
  funcionario_id: number;
  servicos: string[];
}

const HorariosTabela = ({ funcionario_id, servicos }: HorariosTabelaProps) => {
  const funcionario = useFetch<Funcionario>(
    `api/funcionario/${funcionario_id}`
  );

  // Estado para armazenar o horário e o dia selecionado, além do serviço
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(
    null
  );
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<string | null>(
    null
  );
  const [agendamentoConfirmado, setAgendamentoConfirmado] = useState(false);

  // Estado para controlar os horários já agendados
  const [horariosAgendados, setHorariosAgendados] = useState<{
    [key: string]: boolean;
  }>({});

  const diasSemana = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
  ];

  const horarios = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const handleHorarioClick = (horario: string, dia: string) => {
    // Verifica se o horário já foi agendado
    if (horariosAgendados[`${dia}-${horario}`]) {
      return; // Impede que o horário seja selecionado novamente
    }

    setHorarioSelecionado(horario);
    setDiaSelecionado(dia);
  };

  const handleServicoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setServicoSelecionado(event.target.value);
  };

  const handleConfirmarAgendamento = () => {
    if (horarioSelecionado && diaSelecionado && servicoSelecionado) {
      // Marca o horário como agendado
      setHorariosAgendados((prev) => ({
        ...prev,
        [`${diaSelecionado}-${horarioSelecionado}`]: true,
      }));

      setAgendamentoConfirmado(true);
    }
  };

  return (
    <div className="container py-4">
      <h5 className="text-danger mb-4">
        Horários disponíveis de {funcionario.data?.nome}
      </h5>

      {/* Tabela reorganizada com dias na parte superior e horários na lateral */}
      <table className="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th className="text-center">Horário</th>
            {diasSemana.map((dia) => (
              <th key={dia} className="text-center">
                {dia}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horarios.map((horario) => (
            <tr key={horario}>
              <td className="text-center">{horario}</td>
              {diasSemana.map((dia) => (
                <td
                  key={`${dia}-${horario}`}
                  className="text-center"
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      horarioSelecionado === horario && diaSelecionado === dia
                        ? "#b03a2e"
                        : horariosAgendados[`${dia}-${horario}`]
                        ? "#d3d3d3"
                        : "", // Indicando se o horário já foi agendado
                    color:
                      horarioSelecionado === horario && diaSelecionado === dia
                        ? "white"
                        : horariosAgendados[`${dia}-${horario}`]
                        ? "gray"
                        : "black", // Tornando o texto cinza para horários já agendados
                  }}
                  onClick={() => handleHorarioClick(horario, dia)}
                >
                  {horariosAgendados[`${dia}-${horario}`]
                    ? "Indisponível"
                    : horarioSelecionado === horario && diaSelecionado === dia
                    ? "Selecionado"
                    : "Disponível"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {horarioSelecionado && diaSelecionado && !agendamentoConfirmado && (
        <div className="mt-4">
          <h5>Escolha o serviço para agendar:</h5>
          <select
            className="form-select mb-3"
            value={servicoSelecionado || ""}
            onChange={handleServicoChange}
          >
            <option value="" disabled>
              Selecione um serviço
            </option>
            {servicos.map((servico, index) => (
              <option key={index} value={servico}>
                {servico}
              </option>
            ))}
          </select>

          <button
            className="btn btn-danger"
            onClick={handleConfirmarAgendamento}
            disabled={!servicoSelecionado}
          >
            Confirmar Agendamento
          </button>
        </div>
      )}

      {agendamentoConfirmado && (
        <div className="alert alert-success mt-4">
          <h5>Agendamento Confirmado!</h5>
          <p>
            Você agendou o serviço <strong>{servicoSelecionado}</strong> para o
            dia <strong>{diaSelecionado}</strong> às{" "}
            <strong>{horarioSelecionado}</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export default HorariosTabela;
