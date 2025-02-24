import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";

function EmpresasSearch() {
  const [search, setSearch] = useState("");
  const empresas = useFetch<Empresa[]>("api/empresa");

  useEffect(() => {
    AOS.init({ duration: 800 }); // Ativa animações
  }, []);

  const filteredEmpresas = empresas.data?.filter((empresa: Empresa) =>
    empresa.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      {/* Header */}
      <header
        className="text-center text-white bg-primary py-5"
        data-aos="fade-down"
      >
        <div className="container">
          <h1 className="display-4 fw-bold">🔍 Encontre Empresas</h1>
          <p className="lead">
            Busque empresas cadastradas e agende seus serviços com facilidade.
          </p>
        </div>
      </header>

      {/* Busca */}
      <section className="container py-5 text-center" data-aos="fade-up">
        <h2 className="text-primary fw-bold">Pesquise por Empresas</h2>
        <div className="input-group mt-3 w-50 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Digite o nome da empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-warning" onClick={() => setSearch("")}>
            ❌ Limpar
          </button>
        </div>
      </section>

      {/* Lista de Empresas */}
      <section className="container pb-5">
        <div className="row">
          {filteredEmpresas && filteredEmpresas.length > 0 ? (
            filteredEmpresas.map((empresa, index) => (
              <div key={index} className="col-md-4 mb-4" data-aos="zoom-in">
                <div
                  className="card shadow-lg border-0 d-flex flex-column"
                  style={{ height: "100%" }}
                >
                  <img
                    src={empresa.logo || "default-logo.png"}
                    alt={empresa.nome}
                    className="card-img-top"
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "10px 10px 0 0",
                    }}
                  />
                  <div
                    className="card-body text-center d-flex flex-column"
                    style={{ flexGrow: 1 }}
                  >
                    <h5 className="card-title text-primary fw-bold">
                      {empresa.nome}
                    </h5>
                    <p className="text-muted">
                      <strong>Endereço:</strong> {empresa.endereco}
                    </p>
                    <p className="text-muted">
                      <strong>Telefone:</strong> {empresa.telefone}
                    </p>
                    <h6 className="text-primary">Serviços:</h6>
                    <ul className="list-unstyled" style={{ flexGrow: 1 }}>
                      {empresa.servicos.map((servico, i) => (
                        <li key={i} className="text-muted">
                          • {servico.nome}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/empresas/${empresa.nome}`}
                      className="btn btn-success fw-semibold mt-auto"
                      style={{ marginTop: "auto" }}
                    >
                      Ver Detalhes 🔎
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="alert alert-warning w-75 mx-auto text-center"
              role="alert"
              data-aos="fade-up"
            >
              Nenhuma empresa encontrada para "<strong>{search}</strong>".
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-3">
        <p className="mb-0">
          &copy; 2025 EuAgendo. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

export default EmpresasSearch;
