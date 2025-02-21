import { useParams, Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import { Funcionario } from "../interfaces/Funcionario";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";

function EmpresaDetails() {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const empresas = useFetch<Empresa[]>("api/empresa/?q=" + empresaNome);
  const funcionarios = useFetch<Funcionario[]>(
    `api/funcionario/?empresa=${empresaNome}`
  );

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const empresa = empresas.data?.find(
    (e) => e.nome.toLowerCase() === empresaNome?.toLowerCase()
  );

  if (!empresa) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger" data-aos="fade-in">
          ❌ Empresa não encontrada.
        </div>
        <Link to="/" className="btn btn-primary mt-3">
          Voltar para Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* Conteúdo da Empresa */}
      <div className="container py-5">
        {/* Nome da empresa */}
        <div className="text-center mb-4" data-aos="fade-down">
          <h1 className="fw-bold text-primary">🏢 {empresa.nome}</h1>
          <p className="text-muted">
            {empresa.endereco} | {empresa.telefone}
          </p>
        </div>

        {/* Imagem da empresa */}
        <div className="text-center mb-4" data-aos="zoom-in">
          <img
            src={empresa.logo || "/default-logo.png"}
            alt={empresa.nome}
            className="img-fluid rounded shadow"
            style={{ maxWidth: "400px" }}
          />
        </div>

        {/* Informações da empresa */}
        <div className="row">
          <div className="col-lg-6" data-aos="fade-right">
            <h4 className="text-primary mb-3">📄 Informações</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>CNPJ:</strong> {empresa.cnpj}
              </li>
              <li className="list-group-item">
                <strong>Email:</strong> {empresa.email}
              </li>
            </ul>
          </div>

          <div className="col-lg-6" data-aos="fade-left">
            <h4 className="text-primary mb-3">📌 Serviços Disponíveis</h4>
            <ul className="list-group">
              {empresa.servicos.length > 0 ? (
                empresa.servicos.map((servico, index) => (
                  <li key={index} className="list-group-item">
                    {servico.nome}
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">
                  Nenhum serviço cadastrado.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Lista de funcionários */}
        <div className="mt-5" data-aos="fade-up">
          <h4 className="text-primary mb-3">👨‍💼 Funcionários</h4>
          <div className="row">
            {funcionarios.data && funcionarios.data.length > 0 ? (
              funcionarios.data.map((funcionario) => (
                <div key={funcionario.id} className="col-md-4 col-sm-6 mb-3">
                  <div className="card text-center shadow">
                    <img
                      src={funcionario.foto || "/default-user.png"}
                      alt={funcionario.nome}
                      className="rounded-circle mx-auto mt-3"
                      width="80"
                      height="80"
                    />
                    <div className="card-body">
                      <h5 className="card-title text-primary">
                        {funcionario.nome}
                      </h5>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">Nenhum funcionário cadastrado.</p>
            )}
          </div>
        </div>

        {/* Botão de agendamento */}
        <div className="text-center mt-5" data-aos="zoom-in">
          <Link
            to={`/agendar/${empresa.nome}`}
            className="btn btn-lg btn-success fw-semibold"
          >
            📅 Agendar Agora
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EmpresaDetails;
