import { Empresa } from "../interfaces/Empresa";
import { Agendamento } from "../interfaces/Agendamento";
import { useFetch } from "../functions/GetData";
import { useState } from "react";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Servicos } from "../interfaces/ServicosFuncionarios";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is included
import { FaCheckCircle, FaTimesCircle, FaUtensils, FaSpinner, FaCalendarCheck, FaExclamationCircle } from "react-icons/fa";

interface HorariosDoDiaProps {
  empresa: Empresa;
  data_selecionada: Date;
  funcionario_id: number;
  servicos: Servicos[];
}

const HorariosDoDia = ({ empresa, data_selecionada, funcionario_id, servicos }: HorariosDoDiaProps) => {
  const dataString = data_selecionada.toISOString().split("T")[0];
  const [modalAberto, setModalAberto] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<string | null>(null);
  const [clienteNome, setClienteNome] = useState<string>("");
  const [clienteEmail, setClienteEmail] = useState<string>("");
  const [clienteNumero, setClienteNumero] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const agendamentosResponse = useFetch<Agendamento[]>(
    `api/agendamentos_funcionario/?id_funcionario=${funcionario_id}&data=${dataString}`
  );
  const agendamentos = agendamentosResponse.data;

  const gerarHorarios = (inicio: string, fim: string) => {
    const horarios: string[] = [];
    let [hora, minuto] = inicio.split(":").map(Number);
    const [horaFim, minutoFim] = fim.split(":").map(Number);
    const menorDuracaoServico = Math.min(...servicos.map((servico) => servico.duracao as number));

    while (hora < horaFim || (hora === horaFim && minuto < minutoFim)) {
      horarios.push(`${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`);
      minuto += menorDuracaoServico;
      if (minuto >= 60) {
        minuto = 0;
        hora++;
      }
    }
    return horarios;
  };

  const horariosDisponiveis: Record<string, string> = {};
  const intervaloAlmoco = empresa?.para_almoco && empresa?.horario_pausa_inicio && empresa?.horario_pausa_fim;
  const diaSelecionado = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data_selecionada.getDay()];
  const fimDeSemana = diaSelecionado === "Sábado" || diaSelecionado === "Domingo";
  const horarioAbertura = fimDeSemana ? empresa?.horario_abertura_fim_de_semana : empresa?.horario_abertura_dia_semana;
  const horarioFechamento = fimDeSemana ? empresa?.horario_fechamento_fim_de_semana : empresa?.horario_fechamento_dia_semana;
  const horarioPausaInicio = empresa?.horario_pausa_inicio;
  const horarioPausaFim = empresa?.horario_pausa_fim;

  const dataAtual = new Date();
  const dataAtualString = dataAtual.toISOString().split("T")[0];
  const horarioAtual = `${String(dataAtual.getHours()).padStart(2, "0")}:${String(dataAtual.getMinutes()).padStart(2, "0")}`;
  const isDataMenorQueAtual = dataString < dataAtualString;
  const isDataIgualAoAtual = dataString === dataAtualString;

  if (horarioAbertura && horarioFechamento) {
    const horarios = gerarHorarios(horarioAbertura, horarioFechamento);
    horarios.forEach((hora) => {
      if (!agendamentos) return;
      const agendamentoExistente = agendamentos.find(
        (agendamento) => agendamento.data === dataString && agendamento.hora.substring(0, 5) === hora
      );

      if (agendamentoExistente) {
        horariosDisponiveis[hora] = "Agendado";
      } else if (isDataMenorQueAtual || (isDataIgualAoAtual && hora <= horarioAtual)) {
        horariosDisponiveis[hora] = "Indisponível";
      } else if (intervaloAlmoco && horarioPausaInicio && horarioPausaFim) {
        const converterParaMinutos = (hora: string) => {
          const [horaInt, minutoInt] = hora.split(":").map(Number);
          return horaInt * 60 + minutoInt;
        };
        const horaMinutos = converterParaMinutos(hora);
        const inicioPausaMinutos = converterParaMinutos(horarioPausaInicio);
        const fimPausaMinutos = converterParaMinutos(horarioPausaFim);

        if (horaMinutos >= inicioPausaMinutos && horaMinutos < fimPausaMinutos) {
          horariosDisponiveis[hora] = "Intervalo";
        } else {
          horariosDisponiveis[hora] = "Disponível";
        }
      } else {
        horariosDisponiveis[hora] = "Disponível";
      }
    });
  }

  const abrirModal = (horario: string) => {
    setHorarioSelecionado(horario);
    setServicoSelecionado(null);
    setClienteNome("");
    setClienteEmail("");
    setClienteNumero("");
    setFormError(null);
    setModalAberto(true);
  };

  const confirmarAgendamento = async () => {
    if (!servicoSelecionado) {
      setFormError("Por favor, selecione um serviço.");
      return;
    }
    if (!clienteNome.trim()) {
      setFormError("Por favor, informe o nome do cliente.");
      return;
    }
    if (!clienteEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clienteEmail)) {
      setFormError("Por favor, informe um e-mail válido.");
      return;
    }
    if (!clienteNumero.trim()) {
      setFormError("Por favor, informe o número de telefone.");
      return;
    }

    const agendamentoData = {
      id_funcionario: funcionario_id,
      servico_nome: servicoSelecionado,
      data: dataString,
      hora: horarioSelecionado,
      cliente_nome: clienteNome,
      cliente_email: clienteEmail,
      cliente_numero: clienteNumero,
      duracao_minima: Math.min(...servicos.map((servico) => servico.duracao)),
    };

    try {
      const url = import.meta.env.VITE_API_URL;

      const response = await fetch(`${url}/api/agendamento/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamentoData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao agendar: ${response.status}`);
      }

      if (response.status === 201) {
        setModalAberto(false);
        window.location.reload();
      }
    } catch (error) {
      // @ts-ignore
      setFormError(`Erro ao agendar: ${error.message}`);
    }
  };

  const normalizeString = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  return (
    <div className="horarios-do-dia">
      <style>{`
        /* Paleta de cores */
        :root {
          --primary-blue: #003087;
          --light-blue: #4dabf7;
          --dark-gray: #2d3748;
          --light-gray: #f7fafc;
          --white: #ffffff;
          --pastel-green: #b8e2c8;
          --pastel-red: #f4c7c3;
          --warning-orange: #fd7e14;
        }

        /* Container */
        .horarios-do-dia {
          background-color: var(--light-gray);
          padding: 2rem 0;
          margin: 0;
        }

        /* Grid de Horários */
        .horarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .horario-card {
          background-color: var(--white);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .horario-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .horario-card.disponivel {
          background-color: var(--pastel-green);
          color: var(--dark-gray);
          cursor: pointer;
        }
        .horario-card.agendado {
          background-color: var(--warning-orange);
          color: var(--white);
        }
        .horario-card.indisponivel {
          background-color: var(--pastel-red);
          color: var(--dark-gray);
        }
        .horario-card.intervalo {
          background-color: var(--dark-gray);
          color: var(--white);
        }
        .horario-card h5 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .horario-card p {
          font-size: 1rem;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        /* Modal */
        .horarios-modal .modal-content {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .horarios-modal .modal-header {
          background-color: var(--primary-blue);
          color: var(--white);
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
        .horarios-modal .modal-title {
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .horarios-modal .modal-body {
          padding: 1.5rem;
        }
        .horarios-modal .form-label {
          color: var(--primary-blue);
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .horarios-modal .form-control,
        .horarios-modal .form-select {
          border: 1px solid var(--light-blue);
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 1rem;
          color: var(--dark-gray);
        }
        .horarios-modal .form-control:focus,
        .horarios-modal .form-select:focus {
          border-color: var(--primary-blue);
          box-shadow: 0 0 5px rgba(0, 48, 135, 0.3);
        }
        .horarios-modal .radio-group {
          margin-bottom: 1.5rem;
        }
        .horarios-modal .radio-group label {
          margin-left: 0.5rem;
          color: var(--dark-gray);
        }
        .horarios-modal .error-message {
          color: var(--pastel-red);
          font-size: 0.9rem;
          margin-top: 0.5rem;
          text-align: center;
        }
        .horarios-modal .btn-primary {
          background-color: var(--primary-blue);
          border-color: var(--primary-blue);
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .horarios-modal .btn-primary:hover {
          background-color: var(--light-blue);
          border-color: var(--light-blue);
          transform: translateY(-2px);
        }
        .horarios-modal .btn-secondary {
          background-color: var(--dark-gray);
          border-color: var(--dark-gray);
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .horarios-modal .btn-secondary:hover {
          background-color: var(--light-blue);
          border-color: var(--light-blue);
          transform: translateY(-2px);
        }

        /* Tooltip Styling */
        .tooltip-inner {
          background-color: var(--primary-blue);
          color: var(--white);
          border-radius: 8px;
          padding: 0.5rem;
          font-size: 0.9rem;
        }
        .tooltip .tooltip-arrow::before {
          border-right-color: var(--primary-blue);
        }

        /* Mensagens */
        .message {
          font-size: 1.1rem;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: var(--white);
          color: var(--pastel-red);
          border: 1px solid var(--pastel-red);
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .horarios-do-dia {
            padding: 1.5rem 1rem;
          }
          .horarios-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
          .horario-card h5 {
            font-size: 1.1rem;
          }
          .horario-card p {
            font-size: 0.9rem;
          }
        }
        @media (max-width: 576px) {
          .horarios-grid {
            grid-template-columns: 1fr;
          }
          .horario-card {
            padding: 0.75rem;
          }
          .horario-card h5 {
            font-size: 1rem;
          }
          .horario-card p {
            font-size: 0.85rem;
          }
          .horarios-modal .modal-body {
            padding: 1rem;
          }
          .horarios-modal .form-label {
            font-size: 0.9rem;
          }
          .horarios-modal .form-control,
          .horarios-modal .form-select {
            font-size: 0.9rem;
            padding: 0.5rem;
          }
          .horarios-modal .btn-primary,
          .horarios-modal .btn-secondary {
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
          }
          .message {
            font-size: 1rem;
            padding: 1rem;
          }
        }
      `}</style>
      <div className="horarios-do-dia">
        {agendamentosResponse.loading ? (
          <div className="message" data-aos="fade-up">
            <FaSpinner className="fa-spin me-2" /> Carregando horários...
          </div>
        ) : Object.keys(horariosDisponiveis).length === 0 ? (
          <div className="message" data-aos="fade-up">
            <FaExclamationCircle /> Nenhum horário disponível para este dia.
          </div>
        ) : (
          <div className="horarios-grid" data-aos="fade-up">
            {Object.entries(horariosDisponiveis).map(([horario, status]) => (
              <div
                key={horario}
                className={`horario-card ${normalizeString(status)}`}
                onClick={() => status === "Disponível" && abrirModal(horario)}
              >
                <h5>{horario}</h5>
                <p>
                  {status === "Disponível" && <FaCheckCircle />}
                  {status === "Agendado" && <FaCalendarCheck />}
                  {status === "Indisponível" && <FaTimesCircle />}
                  {status === "Intervalo" && <FaUtensils />}
                  {status}
                </p>
              </div>
            ))}
          </div>
        )}
        <Modal show={modalAberto} onHide={() => setModalAberto(false)} className="horarios-modal">
          <Modal.Header closeButton>
            <Modal.Title>
              <FaCalendarCheck /> Confirmar Agendamento
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Agendar para <strong>{dataString}</strong> às <strong>{horarioSelecionado}</strong>?
            </p>
            <div className="radio-group">
              <h5>Escolha o serviço:</h5>
              {servicos.map((servico) => (
                <div key={servico.id} className="form-check">
                  <input
                    type="radio"
                    id={`servico-${servico.id}`}
                    name="servico"
                    value={servico.nome}
                    checked={servicoSelecionado === servico.nome}
                    onChange={() => setServicoSelecionado(servico.nome)}
                    className="form-check-input"
                  />
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id={`tooltip-${servico.id}`}>
                        {servico.descricao || "Sem descrição disponível"}
                      </Tooltip>
                    }
                  >
                    <label htmlFor={`servico-${servico.id}`} className="form-check-label">
                      {servico.nome} (R${servico.preco} | {servico.duracao}min)
                    </label>
                  </OverlayTrigger>
                </div>
              ))}
            </div>
            <div>
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
                  Telefone:
                </label>
                <input
                  type="tel"
                  id="clienteNumero"
                  className="form-control"
                  value={clienteNumero}
                  onChange={(e) => setClienteNumero(e.target.value)}
                />
              </div>
              {formError && <div className="error-message">{formError}</div>}
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
    </div>
  );
};

export default HorariosDoDia;