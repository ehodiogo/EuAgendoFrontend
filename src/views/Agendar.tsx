import { useFetch } from "../functions/GetData";
import { ServicosFuncionariosEmpresa } from "../interfaces/ServicosFuncionarios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import HorariosTabela from "../components/TabelaHorario";

const Agendar = () => {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const empresasData = useFetch<ServicosFuncionariosEmpresa[]>(
    `api/empresaservico/?q=${empresaNome}`
  );

  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<
    number | null
  >(null);

  if (!empresasData.data) {
    return (
      <div className="p-4 bg-light border rounded shadow-sm">
        Empresa não encontrada.
      </div>
    );
  }

  const empresa = empresasData.data[0]; // Supondo que há pelo menos uma empresa

  const handleFuncionarioClick = (id: number) => {
    // Atualiza o estado com o ID do funcionário selecionado
    setFuncionarioSelecionado(id);
  };

  return (
    <div className="p-4 bg-light border rounded shadow-sm text-center">
      <h2 className="text-danger mb-4">🏢 {empresa.nome}</h2>

      <h4 className="text-danger mb-3">
        Escolha o funcionário para agendar o serviço
      </h4>

      <div className="row d-flex justify-content-center">
        {empresa.funcionarios && empresa.funcionarios.length > 0 ? (
          empresa.funcionarios.map((funcionario, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4 mb-3">
              <div
                className="card text-center"
                onClick={() => handleFuncionarioClick(funcionario.id)} // Atualiza o ID ao clicar
                style={{
                  cursor: "pointer",
                  border:
                    funcionarioSelecionado === funcionario.id
                      ? "2px solid #b03a2e"
                      : "", // Destaque ao selecionar
                }}
              >
                <img
                  src={`${funcionario.foto_url}`}
                  alt={funcionario.nome}
                  className="card-img-top rounded-circle mx-auto"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{funcionario.nome}</h5>
                  <p className="card-text">
                    {funcionario.servicos && funcionario.servicos.length > 0 ? (
                      funcionario.servicos.map((servico, i) => (
                        <span key={i} className="badge bg-danger me-2">
                          {servico.nome}
                        </span>
                      ))
                    ) : (
                      <span className="badge bg-muted">
                        Nenhum serviço disponível
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">Nenhum funcionário encontrado.</p>
        )}
      </div>

      {funcionarioSelecionado ? (
        <>
          <h4 className="text-danger mb-3">Escolha o horário para o serviço</h4>
          <HorariosTabela
            funcionario_id={funcionarioSelecionado}
            servicos_id={
              empresa.funcionarios
                .find(
                  (funcionario) => funcionario.id === funcionarioSelecionado
                )
                ?.servicos.map((servico) => servico.id) || []
            }
            key={funcionarioSelecionado} // Adicionando a chave para forçar re-renderização
          />
        </>
      ) : (
        <div className="text-muted">
          Selecione um funcionário para ver os horários.
        </div>
      )}
    </div>
  );
};

export default Agendar;
