import { Empresa } from "../interfaces/Empresa";
import { Agendamento } from "../interfaces/Agendamento";
import { useFetch } from "../functions/GetData";
import { useState } from "react";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Servicos } from "../interfaces/ServicosFuncionarios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheckCircle, FaTimesCircle, FaCoffee, FaSpinner, FaCalendarCheck, FaExclamationCircle, FaUser, FaTools, FaTag } from "react-icons/fa";

interface HorariosDoDiaProps {
  empresa: Empresa;
  data_selecionada: Date;
  funcionario_id?: number;
  locacao_id?: number;
  servicos: Servicos[];
}

const HorariosDoDia = ({ empresa, data_selecionada, funcionario_id, servicos, locacao_id }: HorariosDoDiaProps) => {
  const dataString = data_selecionada.toISOString().split("T")[0];
  const [modalAberto, setModalAberto] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<string | null>(null);
  const [clienteNome, setClienteNome] = useState<string>("");
  const [clienteEmail, setClienteEmail] = useState<string>("");
  const [clienteNumero, setClienteNumero] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const agendamentosUrl = funcionario_id
    ? `/api/agendamentos_funcionario/?id_funcionario=${funcionario_id}&data=${dataString}`
    : `/api/agendamentos_locacao/?id_locacao=${locacao_id}&data=${dataString}`;

  const agendamentosResponse = useFetch<Agendamento[]>(agendamentosUrl);

  const agendamentos = agendamentosResponse.data;

  const formatarDataBR = (dataIso: string): string => {
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const gerarHorarios = (inicio: string, fim: string) => {
    const horarios: string[] = [];
    let [hora, minuto] = inicio.split(":").map(Number);
    const [horaFim, minutoFim] = fim.split(":").map(Number);
    const menorDuracaoServico = Math.min(...servicos.map((servico) => servico.duracao as number));
    const intervaloMinutos = menorDuracaoServico > 0 ? menorDuracaoServico : 30;

    while (hora < horaFim || (hora === horaFim && minuto < minutoFim)) {
      horarios.push(`${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`);
      minuto += intervaloMinutos;
      if (minuto >= 60) {
        minuto -= 60;
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
  const horarioAtual = `${String(dataAtual.getHours()).padStart(2, "0")}:${String(dataAtual.getMinutes()).padStart(2, "0")}`;
  const dataAtualSemHora = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate());
  const dataSelecionadaSemHora = new Date(data_selecionada.getFullYear(), data_selecionada.getMonth(), data_selecionada.getDate());

  const isDataMenorQueAtual = dataSelecionadaSemHora < dataAtualSemHora;
  const isDataIgualAoAtual = dataSelecionadaSemHora.getTime() === dataAtualSemHora.getTime();

  if (horarioAbertura && horarioFechamento) {
    const horarios = gerarHorarios(horarioAbertura, horarioFechamento);
    horarios.forEach((hora) => {
      if (!agendamentos) return;
      const agendamentoExistente = agendamentos.find(
        (agendamento) => agendamento.data === dataString && agendamento.hora.substring(0, 5) === hora
      );

      if (agendamentoExistente) {
          horariosDisponiveis[hora] = "Agendado";
        }
        else if (isDataMenorQueAtual || (isDataIgualAoAtual && hora <= horarioAtual)) {
          horariosDisponiveis[hora] = "Indisponível";
        }
        else if (intervaloAlmoco && horarioPausaInicio && horarioPausaFim) {
          const converterParaMinutos = (hora: string) => {
            const [h, m] = hora.split(":").map(Number);
            return h * 60 + m;
          };
          const horaMinutos = converterParaMinutos(hora);
          const inicioPausaMinutos = converterParaMinutos(horarioPausaInicio);
          const fimPausaMinutos = converterParaMinutos(horarioPausaFim);

          if (horaMinutos >= inicioPausaMinutos && horaMinutos < fimPausaMinutos) {
            horariosDisponiveis[hora] = "Intervalo";
          } else {
            horariosDisponiveis[hora] = "Disponível";
          }
        }
        else {
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
    setIsSubmitting(true);
    setFormError(null);

    if (!servicoSelecionado) {
      setFormError("Por favor, selecione um serviço.");
      setIsSubmitting(false);
      return;
    }
    if (!clienteNome.trim()) {
      setFormError("Por favor, informe o nome do cliente.");
      setIsSubmitting(false);
      return;
    }
    if (!clienteEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clienteEmail)) {
      setFormError("Por favor, informe um e-mail válido.");
      setIsSubmitting(false);
      return;
    }
    if (!clienteNumero.trim()) {
      setFormError("Por favor, informe o número de telefone.");
      setIsSubmitting(false);
      return;
    }

    const servicoInfo = servicos.find(s => s.nome === servicoSelecionado);

    const agendamentoData = {
      id_funcionario: funcionario_id,
      servico_nome: servicoSelecionado,
      data: dataString,
      hora: horarioSelecionado,
      cliente_nome: clienteNome,
      cliente_email: clienteEmail,
      cliente_numero: clienteNumero,
      duracao_minima: servicoInfo?.duracao || Math.min(...servicos.map((servico) => servico.duracao)),
    };

    try {
      const url = import.meta.env.VITE_API_URL;

      const response = await fetch(`${url}/api/agendamento/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamentoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro: ${errorData.detail || 'Falha na comunicação com a API.'}`);
      }

      if (response.status === 201) {
        setModalAberto(false);
        window.location.reload();
      }
    } catch (error) {
      // @ts-ignore
      setFormError(`Falha ao agendar: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const normalizeString = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // VARIÁVEIS DE FORMATO BR
  const dataFormatada = formatarDataBR(dataString);
  const horaFormatada = horarioSelecionado?.substring(0, 5);


  return (
    <div className="horarios-do-dia">
      <style>{`
        /* Paleta de cores Corporativas */
        :root {
          --primary-blue: #004c99; 
          --secondary-bg: #f7f9fc;
          --card-bg: #ffffff;
          --text-dark: #333333;
          --text-muted: #888888;
          --accent-green: #10b981; 
          --warning-orange: #f39c12; 
          --danger-red: #e74c3c; 
          --break-time: #2d3748; 
          --border-light: #e0e6ed;
        }

        /* Grid de Horários */
        .horarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); 
          gap: 1rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .horario-card {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          padding: 1rem;
          text-align: center;
          transition: all 0.2s ease;
          border: 1px solid var(--border-light);
        }
        .horario-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* Cores e Status */
        .horario-card h5 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }
        .horario-card p {
          font-size: 0.9rem;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-weight: 600;
        }
        
        /* Disponível */
        .horario-card.disponivel {
          background-color: #e6fff3; 
          color: var(--accent-green);
          border-color: var(--accent-green);
          cursor: pointer;
        }
        .horario-card.disponivel:hover {
            background-color: var(--accent-green);
            color: var(--card-bg);
            border-color: var(--accent-green);
        }

        /* Agendado */
        .horario-card.agendado {
          background-color: var(--warning-orange);
          color: var(--card-bg);
          border-color: var(--warning-orange);
          cursor: not-allowed;
        }

        /* Indisponível */
        .horario-card.indisponivel {
          background-color: var(--danger-red);
          color: var(--card-bg);
          border-color: var(--danger-red);
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Intervalo */
        .horario-card.intervalo {
          background-color: var(--break-time);
          color: var(--card-bg);
          border-color: var(--break-time);
          opacity: 0.8;
          cursor: not-allowed;
        }


        /* Modal */
        .horarios-modal .modal-content {
          border-radius: 12px;
        }
        .horarios-modal .modal-header {
          background-color: var(--primary-blue);
          color: var(--card-bg);
        }
        .horarios-modal .modal-title {
          font-weight: 700;
        }
        .horarios-modal .modal-body {
          padding: 2rem;
        }
        .horarios-modal .form-label {
          color: var(--primary-blue);
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
        }
        .horarios-modal .form-control,
        .horarios-modal .form-select {
          border: 1px solid var(--border-light);
          border-radius: 6px;
          padding: 0.6rem 0.75rem;
          font-size: 1rem;
        }
        .horarios-modal .form-control:focus,
        .horarios-modal .form-select:focus {
          border-color: var(--primary-blue);
          box-shadow: 0 0 5px rgba(0, 76, 153, 0.3);
        }

        /* Serviço Radio Group */
        .radio-group {
          padding: 1rem;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        .radio-group h5 {
            color: var(--text-dark);
            font-size: 1.1rem;
            font-weight: 600;
            border-bottom: 1px solid var(--border-light);
            padding-bottom: 0.5rem;
            margin-bottom: 0.75rem;
        }
        .radio-group .form-check-label {
            color: var(--text-dark);
            font-size: 0.95rem;
            margin-left: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .radio-group .form-check {
            margin-bottom: 0.5rem;
        }
        .radio-group .form-check-input:checked {
            background-color: var(--primary-blue);
            border-color: var(--primary-blue);
        }
        .radio-group .tooltip-trigger {
            cursor: help;
        }
        .radio-group .service-info {
            font-size: 0.85rem;
            color: var(--text-muted);
        }


        .horarios-modal .error-message {
          color: var(--danger-red);
          font-weight: 600;
          padding: 0.5rem;
          background-color: #ffeeee;
          border-radius: 4px;
          margin-top: 1rem;
          text-align: center;
        }
        .horarios-modal .btn-primary {
          background-color: var(--accent-green);
          border-color: var(--accent-green);
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          transition: background-color 0.3s ease;
        }
        .horarios-modal .btn-primary:hover:not(:disabled) {
          background-color: #0d9472;
          border-color: #0d9472;
        }
        .horarios-modal .btn-primary:disabled {
            opacity: 0.6;
        }

        /* === RESPONSIVIDADE PARA CELULAR (Telas Pequenas) === */
        @media (max-width: 576px) {
          .horarios-grid {
            /* Força os cards a ocuparem a largura total, ficando em uma coluna */
            grid-template-columns: 1fr;
            gap: 0.75rem;
            padding: 0 1rem; /* Adiciona um padding nas laterais do grid */
          }
          .horario-card {
            padding: 0.75rem;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05); /* Sombra mais sutil */
          }
          .horario-card h5 {
            font-size: 1.1rem;
          }
          .horario-card p {
            font-size: 0.85rem;
          }
          .horarios-modal .modal-body {
            padding: 1.5rem; /* Ajusta o padding do modal */
          }
        }
      `}</style>
      <div className="horarios-do-dia">
        {agendamentosResponse.loading ? (
          <div className="message info">
            <FaSpinner className="fa-spin me-2" /> Carregando horários disponíveis...
          </div>
        ) : Object.keys(horariosDisponiveis).length === 0 ? (
          <div className="message info">
            <FaExclamationCircle /> Nenhum horário gerado para este dia.
          </div>
        ) : (
          <div className="horarios-grid">
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
                  {status === "Intervalo" && <FaCoffee />}
                  {status}
                </p>
              </div>
            ))}
          </div>
        )}

        <Modal
            show={modalAberto}
            onHide={() => !isSubmitting && setModalAberto(false)}
            className="horarios-modal"
            centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaCalendarCheck /> Agendar Serviço
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="mb-3">
              Agendamento: <strong>{dataFormatada}</strong> às <strong>{horaFormatada}</strong>
            </p>

            <div className="radio-group">
              <h5><FaTag className="me-1" /> Escolha o Serviço</h5>
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
                  <label htmlFor={`servico-${servico.id}`} className="form-check-label">
                      {servico.nome}
                      <span className="service-info">
                        (R$ {servico.preco} | {servico.duracao}min)
                      </span>
                      <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip id={`tooltip-${servico.id}`}>
                              {servico.descricao || "Sem descrição disponível"}
                            </Tooltip>
                          }
                      >
                         <FaTools className="ms-1 tooltip-trigger" style={{fontSize: '0.8em', cursor: 'pointer'}}/>
                      </OverlayTrigger>
                  </label>
                </div>
              ))}
            </div>

            <div className="row g-2">
              <h5 className="mb-3 mt-0"><FaUser className="me-1" /> Informações do Cliente</h5>
              <div className="col-12">
                <label htmlFor="clienteNome" className="form-label">Nome Completo:</label>
                <input
                  type="text"
                  id="clienteNome"
                  className="form-control"
                  value={clienteNome}
                  onChange={(e) => setClienteNome(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="clienteEmail" className="form-label">E-mail:</label>
                <input
                  type="email"
                  id="clienteEmail"
                  className="form-control"
                  value={clienteEmail}
                  onChange={(e) => setClienteEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="clienteNumero" className="form-label">Telefone/WhatsApp:</label>
                <input
                  type="tel"
                  id="clienteNumero"
                  className="form-control"
                  value={clienteNumero}
                  onChange={(e) => setClienteNumero(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            {formError && <div className="error-message">{formError}</div>}
          </Modal.Body>
          <Modal.Footer>
            <Button
                variant="secondary"
                onClick={() => setModalAberto(false)}
                disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
                variant="primary"
                onClick={confirmarAgendamento}
                disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                    <FaSpinner className="fa-spin me-2" /> Agendando...
                </>
              ) : (
                "Confirmar Agendamento"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default HorariosDoDia;