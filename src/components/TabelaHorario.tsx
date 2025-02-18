import { useState } from "react";
import { useFetch } from "../functions/GetData";
import { Funcionario } from "../interfaces/Funcionario";
import { Servico } from "../interfaces/Servico";
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

  const funcionario = useFetch<Funcionario>(
    `api/funcionario/${funcionario_id}`
  );
  const servicos = useFetch<Servico[]>(
    `api/servico?ids=${servicos_id.join(",")}`
  );
  const empresaInterfaceList = useFetch<Empresa[]>(
    `api/empresa/?q=${empresaNome}`
  );
  const agendamentos = useFetch<Agendamento[]>(
    `api/agendamento/?funcionario=${funcionario_id}`
  );

  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(
    null
  );
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<string | null>(
    null
  );
  const [agendamentoConfirmado, setAgendamentoConfirmado] = useState(false);
  const [horariosAgendados, setHorariosAgendados] = useState<{
    [key: string]: boolean;
  }>({});

  if (!servicos || !funcionario) {
    return (
      <div className="container py-4">
        <p>Carregando horários...</p>
      </div>
    );
  }

  const empresa = empresaInterfaceList.data?.find(
    (empresa) => empresa.nome === empresaNome
  );

  if (!empresa) {
    return (
      <div className="container py-4">
        <p>Empresa não encontrada</p>
      </div>
    );
  }

  // Condicionalmente exibe "Domingo" e "Sábado" de acordo com a disponibilidade da empresa
  const diasSemana = [
    empresa?.abre_domingo ? "Domingo" : null,
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    empresa?.abre_sabado ? "Sábado" : null,
  ];

  // Filtra os dias visíveis, removendo null
  const diasSemanaVisiveis = diasSemana.filter((dia) => dia !== null);

  // Função para converter HH:MM para minutos
  const converterHorarioParaMinutos = (horario: string): number => {
    const [horas, minutos] = horario.split(":").map(Number);
    return horas * 60 + minutos;
  };

  // Função para converter minutos para formato HH:MM
  const converterMinutosParaHorario = (minutos: number): string => {
    const horas = Math.floor(minutos / 60);
    const min = minutos % 60;
    return `${String(horas).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };

  // Converter os horários de abertura e fechamento corretamente
  const horarioAbertura = converterHorarioParaMinutos(
    empresa.horario_abertura_dia_semana
  );
  const horarioFechamento = converterHorarioParaMinutos(
    empresa.horario_fechamento_dia_semana
  );
  const intervaloHorario = 30; // Intervalo de 30 minutos

  // Gerar lista de horários disponíveis
  const horarios: number[] = [];
  for (
    let horario = horarioAbertura;
    horario <= horarioFechamento;
    horario += intervaloHorario
  ) {
    horarios.push(horario);
  }

  // Função para lidar com clique no horário
  const handleHorarioClick = (horario: string, dia: string) => {
    if (horariosAgendados[`${dia}-${horario}`]) {
      return;
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

  console.log("Agendamentos", agendamentos);

  return (
    <div className="container py-4 text-center">
      <h5 className="text-danger mb-4">
        Horários disponíveis de {funcionario.data?.nome}
      </h5>

      <table className="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th className="text-center">Horário</th>
            {diasSemanaVisiveis.map((dia) => (
              <th key={dia} className="text-center">
                {dia}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horarios.map((horario, index) => {
            const horarioFormatado = converterMinutosParaHorario(horario);
            return (
              <tr key={index}>
                <td className="text-center">{horarioFormatado}</td>
                {diasSemanaVisiveis.map((dia) => {
                  const horarioAgendado =
                    horariosAgendados[`${dia}-${horarioFormatado}`];
                  return (
                    <td
                      key={dia}
                      className={`text-center ${
                        horarioAgendado
                          ? "bg-secondary text-white"
                          : "bg-success text-white"
                      }`}
                      onClick={() => handleHorarioClick(horarioFormatado, dia)}
                      style={{
                        cursor: horarioAgendado ? "not-allowed" : "pointer",
                      }}
                    >
                      {horarioAgendado ? "Ocupado" : "Disponível"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
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
            {servicos.data?.map((servico: Servico, index: number) => (
              <option key={index} value={servico.id}>
                {servico.nome}
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
