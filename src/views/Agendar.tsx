import { useFetch } from "../functions/GetData";
import { ServicosFuncionariosEmpresa } from "../interfaces/ServicosFuncionarios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import HorariosTabela from "../components/TabelaHorario";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import { Funcionario } from "../interfaces/Funcionario";

const Agendar = () => {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const empresasData = useFetch<ServicosFuncionariosEmpresa[]>(
    `api/empresaservico/?empresa_nome=${empresaNome}`
  );
  const funcionarios = useFetch<Funcionario[]>(
    `api/funcionario/?empresa_nome=${empresaNome}`
  );

  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<
    number | null
  >(null);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  if (!empresasData.data) {
    return (
      <div className="text-center text-danger py-5">
        <h4>❌ Empresa não encontrada.</h4>
      </div>
    );
  }

  const empresa = empresasData.data[0];

  console.log("Funcionários", funcionarios.data);

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      <header
        className="text-center text-white bg-primary py-5"
        data-aos="fade-down"
      >
        <div className="container">
          <h1 className="display-4 fw-bold">📅 Agendamento de Serviços</h1>
          <p className="lead">
            Escolha um funcionário e marque seu horário facilmente.
          </p>
        </div>
      </header>

      <section className="container py-5 text-center">
        <h2 className="text-primary fw-bold">Escolha um Funcionário</h2>
        <div className="row justify-content-center mt-4">
          {empresa.funcionarios.length > 0 ? (
            empresa.funcionarios.map((funcionario, index) => (
              <div key={index} className="col-md-4 mb-4" data-aos="zoom-in">
                <div
                  className={`card shadow-lg border-0 text-center ${
                    funcionarioSelecionado === funcionario.id
                      ? "border-danger"
                      : ""
                  }`}
                  onClick={() => setFuncionarioSelecionado(funcionario.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={funcionario.foto_url || "default-avatar.png"}
                    alt={funcionario.nome}
                    className="card-img-top rounded-circle mx-auto mt-3"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-primary fw-bold">
                      {funcionario.nome}
                    </h5>

                    <h6 className="text-danger mb-2">Serviços:</h6>

                    <ul className="list-unstyled">
                      {funcionario.servicos.map((servico, i) => (
                        <li
                          key={i}
                          className="d-flex justify-content-between align-items-center text-muted"
                        >
                          <span className="fw-medium">{servico.nome}</span>
                          <span className="badge bg-info text-dark">
                            R${servico.preco} | {servico.duracao.split(":")[2]}{" "}
                            min
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="alert alert-warning w-50 mx-auto"
              data-aos="fade-up"
            >
              Nenhum funcionário disponível no momento.
            </div>
          )}
        </div>
      </section>

      {funcionarioSelecionado ? (
        <section className="container pb-5 text-center">
          <h2 className="text-primary fw-bold" data-aos="fade-up">
            Escolha um Horário
          </h2>
          <HorariosTabela
            funcionario_id={funcionarioSelecionado}
            servicos_nome={
              empresa.funcionarios
                .find((f) => f.id === funcionarioSelecionado)
                ?.servicos.map((s) => s.nome) || []
            }
            key={funcionarioSelecionado}
          />
        </section>
      ) : (
        <div className="text-muted text-center pb-5" data-aos="fade-up">
          Selecione um funcionário para ver os horários disponíveis.
        </div>
      )}

      <footer className="bg-primary text-white text-center py-3">
        <p className="mb-0">
          &copy; 2025 EuAgendo. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default Agendar;
