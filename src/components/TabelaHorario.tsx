import { useState, useEffect } from "react";
import { useFetch } from "../functions/GetData";
import { useParams } from "react-router-dom";
import { Empresa } from "../interfaces/Empresa";
import { Agendamento } from "../interfaces/Agendamento";

interface HorariosTabelaProps {
  funcionario_id: number;
  servicos_id: number[];
}

const HorariosTabela = ({
  funcionario_id,
  servicos_id,
}: HorariosTabelaProps) => {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const empresaInterfaceList = useFetch<Empresa[]>(
    `api/empresa/?q=${empresaNome}`
  );
  const empresa = empresaInterfaceList.data?.find(
    (empresa) => empresa.nome === empresaNome
  );

  useEffect(() => {
    console.log("Funcionario ID:", funcionario_id);
    console.log("Servicos ID:", servicos_id);
  }, [funcionario_id, servicos_id]);

  if (!empresa) {
    return (
      <div className="container py-4">
        <p>Empresa não encontrada</p>
      </div>
    );
  }

  // Agendamentos fake
  const agendamentosFakes: Agendamento[] = [
    {
      id: 1,
      servico: 101,
      cliente: 1,
      funcionario: 2,
      data: "2025-02-19",
      hora: "09:00",
    },
    {
      id: 2,
      servico: 102,
      cliente: 2,
      funcionario: 3,
      data: "2025-02-19",
      hora: "11:00",
    },
    {
      id: 3,
      servico: 103,
      cliente: 3,
      funcionario: 4,
      data: "2025-02-19",
      hora: "14:00",
    },
    {
      id: 4,
      servico: 104,
      cliente: 4,
      funcionario: 5,
      data: "2025-02-19",
      hora: "16:30",
    },
  ];

  const dataCorrigida = new Date(
    dataSelecionada.getTime() + dataSelecionada.getTimezoneOffset() * 60000
  );
  const diaSelecionado = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ][dataCorrigida.getDay()];

  const formatarHora = (horaComSegundos: string) => {
    if (!horaComSegundos) return null;
    return horaComSegundos.slice(0, 5);
  };

  const gerarHorarios = (inicio: string, fim: string) => {
    const horarios: string[] = [];
    let [hora, minuto] = inicio.split(":").map(Number);
    const [horaFim, minutoFim] = fim.split(":").map(Number);

    while (hora < horaFim || (hora === horaFim && minuto < minutoFim)) {
      horarios.push(
        `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`
      );
      minuto += 30;
      if (minuto >= 60) {
        minuto = 0;
        hora++;
      }
    }

    return horarios;
  };

  const horariosDisponiveis: Record<string, string> = {};
  const fimDeSemana =
    diaSelecionado === "Sábado" || diaSelecionado === "Domingo";

  const horarioAbertura = fimDeSemana
    ? empresa?.horario_abertura_fim_de_semana
    : empresa?.horario_abertura_dia_semana;
  const horarioFechamento = fimDeSemana
    ? empresa?.horario_fechamento_fim_de_semana
    : empresa?.horario_fechamento_dia_semana;

  const horarioPausaInicioFormatado = formatarHora(
    empresa.horario_pausa_inicio
  );
  const horarioPausaFimFormatado = formatarHora(empresa.horario_pausa_fim);

  const dataAtual = new Date();
  const dataSelecionadaString = dataSelecionada.toISOString().split("T")[0];
  const dataAtualString = dataAtual.toISOString().split("T")[0];
  const horaAtual = dataAtual.getHours();
  const minutoAtual = dataAtual.getMinutes();
  const horarioAtual = `${String(horaAtual).padStart(2, "0")}:${String(
    minutoAtual
  ).padStart(2, "0")}`;

  const isDataMenorQueAtual = dataSelecionadaString < dataAtualString;
  const isDataIgualAoAtual =
    dataSelecionadaString === dataAtualString &&
    horarioAtual >= horarioAbertura;

  if (horarioAbertura && horarioFechamento) {
    const horarios = gerarHorarios(horarioAbertura, horarioFechamento);
    const pausaExiste =
      empresa?.para_almoço &&
      horarioPausaInicioFormatado &&
      horarioPausaFimFormatado;

    horarios.forEach((hora) => {
      const agendamentoExistente = agendamentosFakes.find(
        (agendamento) =>
          agendamento.data === dataSelecionadaString &&
          agendamento.hora === hora
      );

      if (agendamentoExistente) {
        horariosDisponiveis[hora] = "Agendado"; 
      } else if (
        isDataMenorQueAtual ||
        (isDataIgualAoAtual && hora <= horarioAtual)
      ) {
        horariosDisponiveis[hora] = "Indisponível"; 
      } else if (
        pausaExiste &&
        hora >= horarioPausaInicioFormatado &&
        hora < horarioPausaFimFormatado
      ) {
        horariosDisponiveis[hora] = "Fechado no momento"; 
      } else {
        horariosDisponiveis[hora] = "✔"; 
      }
    });
  }

  const empresaFechada =
    (diaSelecionado === "Sábado" && !empresa.abre_sabado) ||
    (diaSelecionado === "Domingo" && !empresa.abre_domingo);

  return (
    <div className="container py-4">
      <h2>Horários Disponíveis</h2>

      <div className="mb-3">
        <label htmlFor="data" className="form-label">
          Escolha a data:
        </label>
        <input
          type="date"
          id="data"
          className="form-control"
          value={dataSelecionada.toISOString().split("T")[0]}
          onChange={(e) => setDataSelecionada(new Date(e.target.value))}
        />
      </div>

      {empresaFechada ? (
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">⚠ Empresa fechada!</h4>
          <p>
            A empresa <strong>não abre</strong> aos{" "}
            <strong>{diaSelecionado.toLowerCase()}</strong>.
          </p>
          <hr />
          <p className="mb-0">Por favor, escolha outra data disponível. 📅</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Horário</th>
                <th>{diaSelecionado}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(horariosDisponiveis).map(([horario, status]) => (
                <tr key={horario}>
                  <td>{horario}</td>
                  <td
                    className={
                      status === "Indisponível"
                        ? "bg-danger text-white"
                        : status === "Fechado no momento"
                        ? "bg-warning"
                        : status === "Agendado"
                        ? "bg-warning"
                        : status === "✔"
                        ? "bg-success text-white"
                        : ""
                    }
                  >
                    {status === "Indisponível"
                      ? "Indisponível"
                      : status === "Fechado no momento"
                      ? "Fechado no momento"
                      : status === "Agendado"
                      ? "Agendado"
                      : status === "✔"
                      ? "Disponível"
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HorariosTabela;
