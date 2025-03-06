import { useState, useEffect } from "react";
import { useFetch } from "../functions/GetData";
import { useParams } from "react-router-dom";
import { Empresa } from "../interfaces/Empresa";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HorariosDoDia from "./Horarios";
import { Servicos } from "../interfaces/ServicosFuncionarios";

interface HorariosTabelaProps {
  funcionario_id: number;
  servicos: Servicos[];
}

const HorariosTabela = ({ funcionario_id, servicos }: HorariosTabelaProps) => {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [assinaturaVencida, setAssinaturaVencida] = useState(false);

  const empresaInterfaceList = useFetch<Empresa[]>(
    `api/empresa/?q=${empresaNome}`
  );
  const empresa = empresaInterfaceList.data?.find(
    (empresa) => empresa.nome === empresaNome
  );

  useEffect(() => {
    if (empresa) {
      const horasRestantes = empresa.assinatura_vencimento;

      if (horasRestantes < -49) {
        setAssinaturaVencida(true);
      } else {
        setAssinaturaVencida(false);
      }
    }
  }, [empresa]);

  if (!empresa) {
    return (
      <div className="container py-4">
        <p>Empresa não encontrada</p>
      </div>
    );
  }

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
    (diaSelecionado === "Sábado" && !empresa.abre_sabado) ||
    (diaSelecionado === "Domingo" && !empresa.abre_domingo);

  const limitarDatasDisponiveis = (date: Date) => {
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);
    const diferencaHoras = empresa.assinatura_vencimento;

    if (empresa.assinatura_ativa === false) {
     

      if (diferencaHoras > -24) {
        return (
          date.getDate() === hoje.getDate() || date.getDate() === amanha.getDate()
        );
      }

      if (diferencaHoras < -24 && diferencaHoras > -49) {
        return date.getDate() === hoje.getDate();
      }

      if (diferencaHoras < -49) {
        return false;
      }
    }

    return date >= hoje;
  };

  return (
    <div className="container py-4">
      {!assinaturaVencida && (
        <>
          <h2>Horários Disponíveis</h2>

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
            />
          </div>
        </>
      )}

      {empresaFechada ? (
        <div className="alert alert-danger text-center">
          <h4>⚠ Empresa fechada!</h4>
          <p>
            A empresa <strong>não abre</strong> aos{" "}
            <strong>{diaSelecionado.toLowerCase()}</strong>.
          </p>
          <p>Escolha outra data. 📅</p>
        </div>
      ) : assinaturaVencida ? (
        <div className="alert alert-warning text-center">
          <h4>⚠ A empresa está temporariamente indisponível</h4>
          <p>
            A assinatura da empresa está vencida há mais de 49 horas. Por favor,
            aguarde até que a assinatura seja renovada para poder realizar o
            agendamento.
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
        <div className="alert alert-info text-center">
          <h4>⚠ Nenhum serviço disponível</h4>
          <p>Este funcionário não tem serviços cadastrados na empresa ainda.</p>
        </div>
      )}
    </div>
  );
};

export default HorariosTabela;
