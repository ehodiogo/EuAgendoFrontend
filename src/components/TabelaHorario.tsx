import { useState, useEffect } from "react";
import { useFetch } from "../functions/GetData";
import { useParams } from "react-router-dom";
import { Empresa } from "../interfaces/Empresa";
import { Agendamento } from "../interfaces/Agendamento";
import { Modal, Button } from "react-bootstrap";
import ReactDatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 

// TODO:
// Filtrar os agendamentos por funcionário e data
// Exibir os horários disponíveis

interface HorariosTabelaProps {
  funcionario_id: number;
  servicos_nome: string[];
}

const HorariosTabela = ({
  funcionario_id,
  servicos_nome,
}: HorariosTabelaProps) => {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [modalAberto, setModalAberto] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(
    null
  );
  const [servicoSelecionado, setServicoSelecionado] = useState<string | null>(
    null
  );
  const [clienteNome, setClienteNome] = useState<string>("");
  const [clienteEmail, setClienteEmail] = useState<string>("");
  const [clienteNumero, setClienteNumero] = useState<string>("");

  const empresaInterfaceList = useFetch<Empresa[]>(
    `api/empresa/?q=${empresaNome}`
  );
  const empresa = empresaInterfaceList.data?.find(
    (empresa) => empresa.nome === empresaNome
  );

  useEffect(() => {
    console.log("Funcionario ID:", funcionario_id);
    console.log("Servicos:", servicos_nome);
  }, [funcionario_id, servicos_nome]);

  if (!empresa) {
    return (
      <div className="container py-4">
        <p>Empresa não encontrada</p>
      </div>
    );
  }

  const agendamentosFakes: Agendamento[] = [
    {
      id: 1,
      servico: "Corte de Cabelo",
      cliente: "João",
      funcionario: 2,
      data: "2025-02-21",
      hora: "09:00",
    },
    {
      id: 2,
      servico: "Corte de Cabelo",
      cliente: "Maria",
      funcionario: 2,
      data: "2025-02-21",
      hora: "10:00",
    },
    {
      id: 3,
      servico: "Corte de Cabelo",
      cliente: "Pedro",
      funcionario: 2,
      data: "2025-02-21",
      hora: "14:00",
    },
  ];

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

  const intervaloAlmoco =
    empresa?.para_almoço &&
    empresa?.horario_pausa_inicio &&
    empresa?.horario_pausa_fim;

  const diaSelecionado = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ][dataSelecionada.getDay()];

  const fimDeSemana = diaSelecionado === "Sábado" || diaSelecionado === "Domingo";

  const horarioAbertura = fimDeSemana
    ? empresa?.horario_abertura_fim_de_semana
    : empresa?.horario_abertura_dia_semana;
  const horarioFechamento = fimDeSemana
    ? empresa?.horario_fechamento_fim_de_semana
    : empresa?.horario_fechamento_dia_semana;

  const horarioPausaInicio = empresa?.horario_pausa_inicio;
  const horarioPausaFim = empresa?.horario_pausa_fim;

  const dataAtual = new Date();
  const dataSelecionadaString = dataSelecionada.toISOString().split("T")[0];
  const dataAtualString = dataAtual.toISOString().split("T")[0];
  const horarioAtual = `${String(dataAtual.getHours()).padStart(2, "0")}:${String(
    dataAtual.getMinutes()
  ).padStart(2, "0")}`;

  const isDataMenorQueAtual = dataSelecionadaString < dataAtualString;
  const isDataIgualAoAtual = dataSelecionadaString === dataAtualString;
  if (horarioAbertura && horarioFechamento) {
    const horarios = gerarHorarios(horarioAbertura, horarioFechamento);
    horarios.forEach((hora) => {
      const agendamentoExistente = agendamentosFakes.find(
        (agendamento) =>
          agendamento.data === dataSelecionadaString && agendamento.hora === hora
      );

      if (agendamentoExistente) {
        horariosDisponiveis[hora] = "Agendado";
      } else if (
        isDataMenorQueAtual ||
        (isDataIgualAoAtual && hora <= horarioAtual)
      ) {
        horariosDisponiveis[hora] = "Indisponível";
      } else if (intervaloAlmoco) {
        const converterParaMinutos = (hora: string) => {
          const [horaInt, minutoInt] = hora.split(":").map(Number);
          return horaInt * 60 + minutoInt;
        };

        if (intervaloAlmoco) {
          const horaMinutos = converterParaMinutos(hora);
          const inicioPausaMinutos = converterParaMinutos(horarioPausaInicio);
          const fimPausaMinutos = converterParaMinutos(horarioPausaFim);

          if (
            horaMinutos >= inicioPausaMinutos &&
            horaMinutos < fimPausaMinutos
          ) {
            horariosDisponiveis[hora] = "Intervalo";
          } else if (horaMinutos === fimPausaMinutos) {
            horariosDisponiveis[hora] = "✔";
          } else {
            horariosDisponiveis[hora] = "✔";
          }
        }
      } else {
        horariosDisponiveis[hora] = "✔";
      }
    });
  }

  const empresaFechada =
    (diaSelecionado === "Sábado" && !empresa.abre_sabado) ||
    (diaSelecionado === "Domingo" && !empresa.abre_domingo);

  const abrirModal = (horario: string) => {
    setHorarioSelecionado(horario);
    setModalAberto(true);
  };

  const confirmarAgendamento = async () => {
    const agendamentoData = {
      id_funcionario: funcionario_id,
      servico_nome: servicoSelecionado,
      data: dataSelecionadaString,
      hora: horarioSelecionado,
      cliente_nome: clienteNome,
      cliente_email: clienteEmail,
      cliente_numero: clienteNumero,
    };


    try {
      const response = await fetch("http://localhost:8000/api/agendamento/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agendamentoData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao agendar: ${response.status}`);
      }

      setModalAberto(false);
    } catch (error) {
      console.error("Erro ao agendar:", error);
    }
  };


  return (
    <div className="container py-4">
      <h2>Horários Disponíveis</h2>

      <div className="mb-3">
        <label htmlFor="data" className="form-label">
          Escolha a data:
        </label>
        <ReactDatePicker
          selected={dataSelecionada}
          onChange={(date: Date | null) => date && setDataSelecionada(date)}
          dateFormat="dd/MM/yyyy"
          className="form-control"
        />
      </div>

      {empresaFechada ? (
        <div className="alert alert-danger text-center">
          <h4>⚠ Empresa fechada!</h4>
          <p>
            A empresa <strong>não abre</strong> aos{" "}
            <strong>{diaSelecionado.toLowerCase()}</strong>.
          </p>
          <p>Escolha outra data. 📅</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Horário</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(horariosDisponiveis).map(([horario, status]) => (
                <tr key={horario}>
                  <td>{horario}</td>
                  <td
                    className={
                      status === "✔"
                        ? "bg-success text-white cursor-pointer"
                        : status === "Intervalo"
                        ? "bg-secondary"
                        : status === "Agendado"
                        ? "bg-warning"
                        : "bg-danger"
                    }
                    onClick={() => status === "✔" && abrirModal(horario)}
                  >
                    {status === "✔" ? "Disponível" : status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={modalAberto} onHide={() => setModalAberto(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Agendamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Você deseja agendar para {dataSelecionadaString} às{" "}
            {horarioSelecionado}?
          </p>
          <div>
            <h5>Escolha o serviço:</h5>
            {servicos_nome.map((servico) => (
              <div key={servico}>
                <input
                  type="radio"
                  id={servico}
                  name="servico"
                  value={servico}
                  checked={servicoSelecionado === servico}
                  onChange={() => setServicoSelecionado(servico)}
                />
                <label htmlFor={servico}>{servico}</label>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <h5>Informações do Cliente</h5>
            <div className="mb-2">
              <label htmlFor="clienteNome" className="form-label">
                Nome:
              </label>
              <input
                type="text"
                id="clienteNome"
                className="form-control"
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="clienteEmail" className="form-label">
                E-mail:
              </label>
              <input
                type="email"
                id="clienteEmail"
                className="form-control"
                value={clienteEmail}
                onChange={(e) => setClienteEmail(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="clienteNumero" className="form-label">
                Número de telefone:
              </label>
              <input
                type="text"
                id="clienteNumero"
                className="form-control"
                value={clienteNumero}
                onChange={(e) => setClienteNumero(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalAberto(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmarAgendamento}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HorariosTabela;
