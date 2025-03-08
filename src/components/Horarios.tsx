import { Empresa } from "../interfaces/Empresa";
import { Agendamento } from "../interfaces/Agendamento";
import { useFetch } from "../functions/GetData";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Servicos } from "../interfaces/ServicosFuncionarios";

interface Horarios {
  empresa: Empresa;
  data_selecionada: Date;
  funcionario_id: number;
  servicos: Servicos[];
}

const HorariosDoDia = ({ empresa, data_selecionada, funcionario_id, servicos }: Horarios) => {

    const dataString = data_selecionada.toISOString().split("T")[0];
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
    const agendamentos = useFetch<Agendamento[]>(
      `api/agendamentos_funcionario/?id_funcionario=${funcionario_id}&data=${dataString}`
    ).data;

   const gerarHorarios = (inicio: string, fim: string) => {
     const horarios: string[] = [];
     let [hora, minuto] = inicio.split(":").map(Number);
     const [horaFim, minutoFim] = fim.split(":").map(Number);

    const menorDuracaoServico = Math.min(
      ...servicos.map((servico) => servico.duracao as number)
    );
      
     while (hora < horaFim || (hora === horaFim && minuto < minutoFim)) {
       horarios.push(
         `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`
       );
       minuto += menorDuracaoServico; 
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
  ][data_selecionada.getDay()];

  const fimDeSemana =
    diaSelecionado === "Sábado" || diaSelecionado === "Domingo";

  const horarioAbertura = fimDeSemana
    ? empresa?.horario_abertura_fim_de_semana
    : empresa?.horario_abertura_dia_semana;
  const horarioFechamento = fimDeSemana
    ? empresa?.horario_fechamento_fim_de_semana
    : empresa?.horario_fechamento_dia_semana;

  const horarioPausaInicio = empresa?.horario_pausa_inicio;
  const horarioPausaFim = empresa?.horario_pausa_fim;

  const dataAtual = new Date();
  const dataAtualString = dataAtual.toISOString().split("T")[0];
  const horarioAtual = `${String(dataAtual.getHours()).padStart(
    2,
    "0"
  )}:${String(dataAtual.getMinutes()).padStart(2, "0")}`;

  const isDataMenorQueAtual = dataString < dataAtualString;
  const isDataIgualAoAtual = dataString === dataAtualString;
  if (horarioAbertura && horarioFechamento) {
    const horarios = gerarHorarios(horarioAbertura, horarioFechamento);
    horarios.forEach((hora) => {
      if (!agendamentos) return;

        const agendamentoExistente = agendamentos.find(
          (agendamento) =>
            agendamento.data === dataString &&
            agendamento.hora.substring(0, 5) === hora 
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

  const abrirModal = (horario: string) => {
    setHorarioSelecionado(horario);
    setModalAberto(true);
  };

  const confirmarAgendamento = async () => {
    const agendamentoData = {
      id_funcionario: funcionario_id,
      servico_nome: servicoSelecionado,
      data: dataString,
      hora: horarioSelecionado,
      cliente_nome: clienteNome,
      cliente_email: clienteEmail,
      cliente_numero: clienteNumero,
      duracao_minima: Math.min(
        ...servicos.map((servico) => servico.duracao)
      ),
    };

    try {

      const url = window.location.origin.includes("localhost:5173")
        ? "http://localhost:8000"
        : "https://backend-production-7438.up.railway.app";

      const response = await fetch(
        url + "/api/agendamento/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(agendamentoData),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao agendar: ${response.status}`);
      }

      if (response.status === 201) {
        window.location.reload();
      }

      setModalAberto(false);
    } catch (error) {
      console.error("Erro ao agendar:", error);
    }
  };

  return (
    <div className="container py-4">
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

      <Modal show={modalAberto} onHide={() => setModalAberto(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Agendamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Você deseja agendar para {dataString} às{" "}
            {horarioSelecionado}?
          </p>
          <div>
            <h5>Escolha o serviço:</h5>
            {servicos.map((servico) => (
              <div key={servico.id}>
                <input
                  type="radio"
                  id={servico.id + servico.nome}
                  name="servico"
                  value={servico.nome}
                  checked={servicoSelecionado === servico.nome}
                  onChange={() => setServicoSelecionado(servico.nome) }
                />
                <label htmlFor={servico.id + servico.nome}>{servico.nome}</label>
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
}

export default HorariosDoDia;