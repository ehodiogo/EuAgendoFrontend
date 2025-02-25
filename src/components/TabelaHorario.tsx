import { useState } from "react";
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

const HorariosTabela = ({
  funcionario_id,
  servicos,
}: HorariosTabelaProps) => {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const empresaInterfaceList = useFetch<Empresa[]>(
    `api/empresa/?q=${empresaNome}`
  );
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
        <HorariosDoDia
          key={dataSelecionadaString}
          empresa={empresa}
          data_selecionada={dataSelecionada}
          funcionario_id={funcionario_id}
          servicos={servicos}
        />
      )}
    </div>
  );
};

export default HorariosTabela;
