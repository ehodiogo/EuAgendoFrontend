import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import { FaSearch, FaBuilding, FaSpinner, FaExclamationCircle } from "react-icons/fa";

function EmpresasSearch() {
  const [search, setSearch] = useState("");
  const empresas = useFetch<Empresa[]>("api/empresa");

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const filteredEmpresas = empresas.data?.filter((empresa: Empresa) =>
    empresa.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-vh-100">
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

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Header */
        .empresas-header {
          background-color: var(--primary-blue);
          color: var(--white);
          padding: 3rem 0;
          text-align: center;
        }
        .empresas-header h1 {
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .empresas-header .lead {
          font-size: 1.25rem;
          max-width: 800px;
          margin: 0 auto;
        }

        /* Busca */
        .search-section {
          padding: 3rem 0;
          text-align: center;
        }
        .search-section h2 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .search-section .input-group {
          max-width: 500px;
          margin: 0 auto;
        }
        .search-section .form-control {
          border-radius: 8px 0 0 8px;
          border: 1px solid var(--light-blue);
          padding: 0.75rem;
          font-size: 1rem;
          color: var(--dark-gray);
        }
        .search-section .btn-warning {
          background-color: var(--warning-orange);
          border-color: var(--warning-orange);
          border-radius: 0 8px 8px 0;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .search-section .btn-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Lista de Empresas */
        .empresas-list {
          padding-bottom: 3rem;
        }
        .empresas-list .card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .empresas-list .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .empresas-list .card-img-container {
          width: 100%;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--light-gray);
          border-radius: 12px 12px 0 0;
          overflow: hidden;
        }
        .empresas-list .card-img-top {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          margin: auto;
        }
        .empresas-list .card-body {
          padding: 1.5rem;
          text-align: center;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .empresas-list .card-title {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
        .empresas-list .text-muted {
          color: var(--dark-gray);
          font-size: 1rem;
        }
        .empresas-list .btn-success {
          background-color: var(--success-green);
          border-color: var(--success-green);
          padding: 0.75rem;
          font-weight: 600;
          border-radius: 8px;
          margin-top: auto;
          transition: all 0.3s ease;
        }
        .empresas-list .btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
        }
        .message.loading {
          color: var(--dark-gray);
          background-color: var(--white);
        }
        .message.error {
          color: var(--danger-red);
          background-color: var(--white);
        }
        .message.warning {
          color: var(--warning-orange);
          background-color: var(--white);
        }

        /* Footer */
        .empresas-footer {
          background-color: var(--primary-blue);
          color: var(--white);
          padding: 1.5rem 0;
          text-align: center;
        }
        .empresas-footer p {
          margin: 0;
          font-size: 1rem;
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .empresas-header, .search-section, .empresas-list {
            padding: 2rem 1rem;
          }
          .search-section .input-group {
            max-width: 100%;
          }
        }
        @media (max-width: 576px) {
          .empresas-header h1 {
            font-size: 2rem;
          }
          .empresas-header .lead {
            font-size: 1.1rem;
          }
          .search-section h2 {
            font-size: 1.5rem;
          }
          .search-section .form-control, .search-section .btn-warning {
            font-size: 0.9rem;
            padding: 0.5rem;
          }
          .empresas-list .card-title {
            font-size: 1.1rem;
          }
          .empresas-list .text-muted {
            font-size: 0.9rem;
          }
          .empresas-list .btn-success {
            font-size: 0.9rem;
            padding: 0.5rem;
          }
          .message {
            font-size: 1rem;
            padding: 1rem;
          }
          .empresas-list .card-img-container {
            height: 150px;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <header className="empresas-header" data-aos="fade-down">
          <div className="container">
            <h1>
              <FaSearch /> Encontre Empresas
            </h1>
            <p className="lead">
              Busque empresas cadastradas e agende seus serviços com facilidade.
            </p>
          </div>
        </header>
        <section className="search-section container" data-aos="fade-up">
          <h2>
            <FaSearch /> Pesquise por Empresas
          </h2>
          <div className="input-group mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Digite o nome da empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-warning" onClick={() => setSearch("")}>
              Limpar
            </button>
          </div>
        </section>
        <section className="empresas-list container">
          {empresas.loading ? (
            <div className="message loading" data-aos="fade-up">
              <FaSpinner className="fa-spin me-2" /> Carregando empresas...
            </div>
          ) : filteredEmpresas && filteredEmpresas.length > 0 ? (
            <div className="row">
              {filteredEmpresas.map((empresa, index) => (
                <div key={index} className="col-md-4 mb-4" data-aos="zoom-in" data-aos-delay={index * 100}>
                  <div className="card">
                    <div className="card-img-container">
                      <img
                        src={empresa.logo || "https://via.placeholder.com/200x200?text=Sem+Logo"}
                        alt={empresa.nome}
                        className="card-img-top"
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{empresa.nome}</h5>
                      <p className="text-muted">
                        <strong>Endereço:</strong> {empresa.endereco}
                      </p>
                      <p className="text-muted">
                        <strong>Telefone:</strong> {empresa.telefone}
                      </p>
                      <h6 className="text-primary">Serviços:</h6>
                      <ul className="list-unstyled">
                        {empresa.servicos && empresa.servicos.length > 0 ? (
                          empresa.servicos.map((servico, i) => (
                            <li key={i} className="text-muted">
                              • {servico.nome}
                            </li>
                          ))
                        ) : (
                          <li className="text-muted">Nenhum serviço cadastrado</li>
                        )}
                      </ul>
                      <Link
                        to={`/empresas/${empresa.nome}`}
                        className="btn btn-success"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="message warning" data-aos="fade-up">
              <FaExclamationCircle /> Nenhuma empresa encontrada para "<strong>{search}</strong>".
            </div>
          )}
        </section>
        <footer className="empresas-footer">
          <p>&copy; 2025 VemAgendar. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

export default EmpresasSearch;