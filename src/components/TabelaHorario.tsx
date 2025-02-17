import React, { useState } from "react";

const HorariosTabela: React.FC = () => {
  // Dias da semana
  const diasSemana = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
  ];

  // Horários do dia (usando intervalos de 30 minutos)
  const horarios = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  // Estado para armazenar os agendamentos
  interface Agendamento {
    id: number;
    dia: string;
    horario: string;
    descricao: string;
  }

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(
    null
  );
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [descricao, setDescricao] = useState<string>("");

  // Função para adicionar o agendamento
  const adicionarAgendamento = () => {
    if (horarioSelecionado && diaSelecionado && descricao) {
      setAgendamentos([
        ...agendamentos,
        {
          id: agendamentos.length + 1,
          dia: diaSelecionado,
          horario: horarioSelecionado,
          descricao: descricao,
        },
      ]);
      setDescricao("");
      setHorarioSelecionado(null);
      setDiaSelecionado(null);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Cadastro de Agendamentos</h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Horário</th>
            {diasSemana.map((dia) => (
              <th key={dia}>{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horarios.map((horario) => (
            <tr key={horario}>
              <td>{horario}</td>
              {diasSemana.map((dia) => {
                // Verifica se o horário já foi agendado para o dia
                const agendado = agendamentos.some(
                  (agendamento) =>
                    agendamento.horario === horario && agendamento.dia === dia
                );
                return (
                  <td
                    key={dia}
                    onClick={() => {
                      if (!agendado) {
                        setDiaSelecionado(dia);
                        setHorarioSelecionado(horario);
                      }
                    }}
                    style={{
                      cursor: agendado ? "not-allowed" : "pointer",
                      backgroundColor: agendado ? "#f8d7da" : "#ffffff",
                    }}
                  >
                    {agendado ? "Agendado" : "Disponível"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {horarioSelecionado && diaSelecionado && (
        <div className="mt-4">
          <h3>
            Cadastrar agendamento para {horarioSelecionado} - {diaSelecionado}
          </h3>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do agendamento"
            />
          </div>
          <button className="btn btn-success" onClick={adicionarAgendamento}>
            Adicionar
          </button>
        </div>
      )}
    </div>
  );
};

export default HorariosTabela;
