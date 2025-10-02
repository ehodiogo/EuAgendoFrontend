import { useState, useEffect } from "react";
import { useFetch } from "../functions/GetData";
import { useParams } from "react-router-dom";
import { Empresa } from "../interfaces/Empresa";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HorariosDoDia from "./Horarios";
import { Servicos } from "../interfaces/ServicosFuncionarios";
import { FaExclamationCircle, FaSpinner, FaCalendarDay, FaLock, FaTimes } from "react-icons/fa";

interface HorariosTabelaProps {
  funcionario_id: number;
  servicos: Servicos[];
}

const HorariosTabela = ({ funcionario_id, servicos }: HorariosTabelaProps) => {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return hoje;
  });
  const [assinaturaVencida, setAssinaturaVencida] = useState(false);

  const empresaInterfaceList = useFetch<Empresa[]>(`/api/empresa/?q=${empresaNome}`);
  const empresa = empresaInterfaceList.data?.find(
    (e) => e.nome === empresaNome
  );

  useEffect(() => {
    if (empresa) {
      const horasRestantes = empresa.assinatura_vencimento;
      // Define a assinatura como vencida se passar de 49 horas de atraso (mais de 2 dias)
      setAssinaturaVencida(horasRestantes < -49);
    }
  }, [empresa]);

  const diaSelecionado = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ][dataSelecionada.getDay()];

  const dataSelecionadaString = dataSelecionada.toISOString().split("T")[0];

  const empresaFechada =
    (diaSelecionado === "Sábado" && !empresa?.abre_sabado) ||
    (diaSelecionado === "Domingo" && !empresa?.abre_domingo);

  // Lógica de limitação de datas
  const limitarDatasDisponiveis = (date: Date) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const diferencaHoras = empresa?.assinatura_vencimento ?? -50;

    const dataNormalizada = new Date(date);
    dataNormalizada.setHours(0, 0, 0, 0);

    if (empresa?.assinatura_ativa === false) {
      // Se a assinatura expirou, limitamos estritamente.
      if (diferencaHoras > -24) {
        return (dataNormalizada.getTime() === hoje.getTime() || dataNormalizada.getTime() === amanha.getTime());
      }
      if (diferencaHoras >= -49 && diferencaHoras <= -24) {
        return dataNormalizada.getTime() === hoje.getTime();
      }
      return false; // Bloqueia todas as datas
    }

    // Se a assinatura está ativa, permite hoje e datas futuras
    return dataNormalizada >= hoje;
  };

  return (
    <div className="horarios-tabela">
      <style>{`
        /* Paleta de cores (Reutilizando a paleta corporativa) */
        :root {
          --primary-blue: #004c99; 
          --secondary-bg: #f7f9fc;
          --card-bg: #ffffff;
          --text-dark: #333333;
          --text-muted: #888888;
          --accent-green: #10b981;
          --danger-red: #e74c3c;
          --warning-orange: #f39c12;
          --border-light: #e0e6ed;
        }

        /* Container */
        .horarios-tabela {
          padding: 0; 
          margin: 0;
        }

        /* Card Principal (Tabela de Horários) */
        .horarios-card {
          background-color: var(--card-bg);
          border-radius: 12px;
          border: 1px solid var(--border-light);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          padding: 2rem; /* Mais padding para um visual premium */
          max-width: 900px;
          margin: 0 auto;
        }

        /* Título */
        .horarios-card h2 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* DatePicker - Estilo Profissional */
        .datepicker-group {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-light);
        }
        .datepicker-group .form-label {
          color: var(--text-dark);
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          display: block;
        }
        .datepicker-group .react-datepicker-wrapper {
          display: inline-block; /* Alinha ao centro */
          width: auto;
          min-width: 250px;
        }
        .datepicker-group .form-control {
          border: 2px solid var(--primary-blue); /* Borda mais grossa e cor corporativa */
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--primary-blue);
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .datepicker-group .form-control:hover {
            background-color: var(--secondary-bg);
        }
        .datepicker-group .form-control:focus {
          border-color: var(--accent-green);
          box-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
          outline: none;
        }

        /* Mensagens - Estilo de Alerta com Ícone Grande */
        .message {
          font-size: 1.1rem;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 80%;
          margin: 2rem auto 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          background-color: var(--secondary-bg);
          border: 2px solid;
        }
        .message .icon-large {
            font-size: 2.5rem;
        }
        .message h4 {
          font-size: 1.4rem;
          margin: 0;
          font-weight: 700;
        }
        .message p {
          margin: 0;
          font-size: 1.05rem;
        }
        .message.error {
          color: var(--danger-red);
          border-color: var(--danger-red);
        }
        .message.warning {
          color: var(--warning-orange);
          border-color: var(--warning-orange);
        }
        .message.info {
          color: var(--primary-blue);
          border-color: var(--primary-blue);
        }
        .message.loading {
          color: var(--text-dark);
          border-color: var(--border-light);
        }

        /* Responsividade */
        @media (max-width: 576px) {
          .horarios-card {
            padding: 1.5rem;
          }
          .horarios-card h2 {
            font-size: 1.5rem;
          }
          .datepicker-group .form-control {
            font-size: 1rem;
            padding: 0.5rem 0.75rem;
          }
        }
      `}</style>
      <div className="horarios-tabela">
        {/* === MENSAGENS DE STATUS INICIAIS === */}
        {empresaInterfaceList.loading ? (
          <div className="message loading">
            <FaSpinner className="fa-spin icon-large" />
            <h4>Carregando Dados</h4>
            <p>Buscando informações de horário da empresa...</p>
          </div>
        ) : !empresa ? (
          <div className="message error">
            <FaExclamationCircle className="icon-large" />
            <h4>Empresa Não Encontrada</h4>
            <p>Verifique o nome da empresa e tente novamente.</p>
          </div>
        ) : (
          <div className="horarios-card">

            {assinaturaVencida ? (
              // === AVISO DE ASSINATURA VENCIDA (BLOQUEIO TOTAL) ===
              <div className="message warning">
                <FaLock className="icon-large" />
                <h4>Agendamentos Bloqueados</h4>
                <p>
                  A assinatura da empresa está vencida há <strong>mais de 49 horas</strong>. Agendamentos estão temporariamente suspensos.
                </p>
                <p>Por favor, aguarde a renovação para continuar.</p>
              </div>
            ) : (
              <>
                {/* === CONTROLE DE DATA === */}
                <div className="datepicker-group">
                  <label htmlFor="data" className="form-label">
                    <FaCalendarDay className="me-2" /> Selecione a Data do Serviço:
                  </label>
                  <ReactDatePicker
                    selected={dataSelecionada}
                    minDate={new Date()}
                    onChange={(date: Date | null) => date && setDataSelecionada(date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    filterDate={limitarDatasDisponiveis}
                    id="data"
                  />
                </div>

                {/* === MENSAGENS DE VALIDAÇÃO APÓS A DATA === */}
                {empresaFechada ? (
                  <div className="message error">
                    <FaTimes className="icon-large" />
                    <h4>Empresa Fechada</h4>
                    <p>
                      A empresa <strong>não funciona</strong> aos <strong>{diaSelecionado}</strong>. Por favor, escolha outra data.
                    </p>
                  </div>
                ) : servicos.length === 0 ? (
                  <div className="message info">
                    <FaExclamationCircle className="icon-large" />
                    <h4>Serviços Não Encontrados</h4>
                    <p>
                      Este profissional <strong>não tem serviços ativos</strong> para agendamento.
                    </p>
                  </div>
                ) : (
                  // === RENDERIZAÇÃO DA TABELA DE HORÁRIOS ===
                  <HorariosDoDia
                    key={dataSelecionadaString}
                    empresa={empresa}
                    data_selecionada={dataSelecionada}
                    funcionario_id={funcionario_id}
                    servicos={servicos}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HorariosTabela;