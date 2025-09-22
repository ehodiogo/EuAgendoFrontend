import { useState, useEffect } from "react";
import { useFetch } from "../functions/GetData";
import { useParams } from "react-router-dom";
import { Empresa } from "../interfaces/Empresa";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HorariosDoDia from "./Horarios";
import { Servicos } from "../interfaces/ServicosFuncionarios";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaExclamationCircle, FaSpinner, FaClock } from "react-icons/fa";

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

  const empresaInterfaceList = useFetch<Empresa[]>(`api/empresa/?q=${empresaNome}`);
  const empresa = empresaInterfaceList.data?.find(
    (empresa) => empresa.nome === empresaNome
  );

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    if (empresa) {
      const horasRestantes = empresa.assinatura_vencimento;
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

  const limitarDatasDisponiveis = (date: Date) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Normaliza a data de hoje para 00:00:00
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const diferencaHoras = empresa?.assinatura_vencimento ?? -50;

    // Normaliza a data de entrada para comparar apenas ano, mês e dia
    const dataNormalizada = new Date(date);
    dataNormalizada.setHours(0, 0, 0, 0);

    if (empresa?.assinatura_ativa === false) {
      if (diferencaHoras > -24) {
        // Permite hoje ou amanhã
        return (
          dataNormalizada.getTime() === hoje.getTime() ||
          dataNormalizada.getTime() === amanha.getTime()
        );
      }
      if (diferencaHoras >= -49 && diferencaHoras <= -24) {
        // Permite apenas hoje
        return dataNormalizada.getTime() === hoje.getTime();
      }
      return false;
    }

    // Se a assinatura está ativa, permite hoje e datas futuras
    return dataNormalizada >= hoje;
  };

  return (
    <div className="horarios-tabela">
      <style>{`
        /* Paleta de cores */
        :root {
          --primary-blue: #003087;
          --light-blue: #4dabf7;
          --dark-gray: #2d3748;
          --light-gray: #f7fafc;
          --white: #ffffff;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --warning-orange: #fd7e14;
        }

        /* Container */
        .horarios-tabela {
          background-color: var(--light-gray);
          padding: 2rem 0;
          margin: 0;
        }

        /* Card */
        .horarios-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
          max-width: 1200px;
          margin: 0 auto;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .horarios-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
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

        /* DatePicker */
        .horarios-card .form-label {
          color: var(--primary-blue);
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }
        .horarios-card .react-datepicker-wrapper {
          display: block;
          max-width: 300px;
          margin: 0 auto 1.5rem;
        }
        .horarios-card .form-control {
          border: 1px solid var(--light-blue);
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 1rem;
          color: var(--dark-gray);
          width: 100%;
          text-align: center;
        }
        .horarios-card .form-control:focus {
          border-color: var(--primary-blue);
          box-shadow: 0 0 5px rgba(0, 48, 135, 0.3);
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
        }
        .message h4 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: inherit;
        }
        .message p {
          margin: 0;
          font-size: 1rem;
        }
        .message.error {
          color: var(--danger-red);
        }
        .message.warning {
          color: var(--warning-orange);
        }
        .message.info {
          color: var(--primary-blue);
        }
        .message.loading {
          color: var(--dark-gray);
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .horarios-tabela {
            padding: 1.5rem 1rem;
          }
          .horarios-card {
            padding: 1rem;
          }
          .horarios-card h2 {
            font-size: 1.5rem;
          }
        }
        @media (max-width: 576px) {
          .horarios-card h2 {
            font-size: 1.25rem;
          }
          .horarios-card .form-label {
            font-size: 1rem;
          }
          .horarios-card .react-datepicker-wrapper {
            max-width: 100%;
          }
          .horarios-card .form-control {
            font-size: 0.9rem;
            padding: 0.5rem;
          }
          .message {
            font-size: 1rem;
            padding: 1rem;
          }
          .message h4 {
            font-size: 1.1rem;
          }
          .message p {
            font-size: 0.9rem;
          }
        }
      `}</style>
      <div className="horarios-tabela">
        {empresaInterfaceList.loading ? (
          <div className="message loading" data-aos="fade-up">
            <FaSpinner className="fa-spin me-2" /> Carregando dados da empresa...
          </div>
        ) : !empresa ? (
          <div className="message error" data-aos="fade-up">
            <FaExclamationCircle /> Empresa não encontrada.
          </div>
        ) : (
          <div className="horarios-card" data-aos="fade-up">
            {!assinaturaVencida && (
              <>
                <h2>
                  <FaClock /> Horários Disponíveis
                </h2>
                <div className="mb-3">
                  <label htmlFor="data" className="form-label">
                    Escolha a data:
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
              </>
            )}
            {empresaFechada ? (
              <div className="message error">
                <h4>
                  <FaExclamationCircle /> Empresa fechada!
                </h4>
                <p>
                  A empresa <strong>não abre</strong> aos{" "}
                  <strong>{diaSelecionado.toLowerCase()}</strong>.
                </p>
                <p>Escolha outra data.</p>
              </div>
            ) : assinaturaVencida ? (
              <div className="message warning">
                <h4>
                  <FaExclamationCircle /> Empresa temporariamente indisponível
                </h4>
                <p>
                  A assinatura da empresa está vencida há mais de 49 horas. Aguarde a renovação para agendar.
                </p>
              </div>
            ) : servicos.length > 0 ? (
              <HorariosDoDia
                key={dataSelecionadaString}
                empresa={empresa}
                data_selecionada={dataSelecionada}
                funcionario_id={funcionario_id}
                servicos={servicos}
              />
            ) : (
              <div className="message info">
                <h4>
                  <FaExclamationCircle /> Nenhum serviço disponível
                </h4>
                <p>Este funcionário não tem serviços cadastrados na empresa ainda.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HorariosTabela;