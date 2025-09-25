import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import { FaSearch, FaSpinner, FaExclamationCircle, FaFilter } from "react-icons/fa";

function EmpresasSearch() {
  const [search, setSearch] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [pais, setPais] = useState("");
  const [showModal, setShowModal] = useState(false);
  const empresas = useFetch<Empresa[]>("api/empresa");

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const filteredEmpresas = empresas.data?.filter((empresa: Empresa) =>
    empresa.nome.toLowerCase().includes(search.toLowerCase()) &&
    (cidade ? empresa.cidade.toLowerCase().includes(cidade.toLowerCase()) : true) &&
    (estado ? empresa.estado.toLowerCase().includes(estado.toLowerCase()) : true) &&
    (bairro ? empresa.bairro.toLowerCase().includes(bairro.toLowerCase()) : true) &&
    (pais ? empresa.pais.toLowerCase().includes(pais.toLowerCase()) : true)
  );

  const estados = [
    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
    "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
    "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
    "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
    "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
  ];

  const clearFilters = () => {
    setSearch("");
    setCidade("");
    setEstado("");
    setBairro("");
    setPais("");
    setShowModal(false);
  };

  const applyFilters = () => {
    setShowModal(false);
  };

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

        /* Busca e Filtros */
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
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .search-section .form-control {
          border-radius: 8px;
          border: 1px solid var(--light-blue);
          padding: 0.75rem;
          font-size: 1rem;
          color: var(--dark-gray);
          flex: 1;
          min-width: 200px;
        }
        .search-section .btn-filter {
          background-color: var(--light-blue);
          border-color: var(--light-blue);
          color: var(--white);
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .search-section .btn-filter:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: var(--white);
          border-radius: 12px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          position: relative;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-content h3 {
          color: var(--primary-blue);
          font-weight: 700;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .modal-content .form-group {
          margin-bottom: 1rem;
        }
        .modal-content .form-control,
        .modal-content .form-select {
          width: 100%;
          border-radius: 8px;
          border: 1px solid var(--light-blue);
          padding: 0.75rem;
          font-size: 1rem;
          color: var(--dark-gray);
        }
        .modal-content .btn-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--dark-gray);
          cursor: pointer;
        }
        .modal-content .btn-primary {
          background-color: var(--primary-blue);
          border-color: var(--primary-blue);
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .modal-content .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .modal-content .btn-warning {
          background-color: var(--warning-orange);
          border-color: var(--warning-orange);
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .modal-content .btn-warning:hover {
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
          .search-section .form-control, .search-section .btn-filter {
            font-size: 0.9rem;
            padding: 0.5rem;
            min-width: 100%;
          }
          .modal-content {
            padding: 1.5rem;
            width: 95%;
          }
          .modal-content .form-control, .modal-content .form-select {
            font-size: 0.9rem;
            padding: 0.5rem;
          }
          .modal-content .btn-primary, .modal-content .btn-warning {
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
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
            <button
              className="btn btn-filter"
              onClick={() => setShowModal(true)}
            >
              <FaFilter /> Filtros
            </button>
          </div>
        </section>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
              <h3>
                <FaFilter /> Filtros de Pesquisa
              </h3>
              <div className="form-group">
                <label htmlFor="cidade">Cidade</label>
                <input
                  type="text"
                  className="form-control"
                  id="cidade"
                  placeholder="Digite a cidade..."
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <select
                  className="form-select"
                  id="estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value="">Selecione o estado...</option>
                  {estados.map((est) => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="bairro">Bairro</label>
                <input
                  type="text"
                  className="form-control"
                  id="bairro"
                  placeholder="Digite o bairro..."
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pais">País</label>
                <input
                  type="text"
                  className="form-control"
                  id="pais"
                  placeholder="Digite o país..."
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-warning" onClick={clearFilters}>
                  Limpar
                </button>
                <button className="btn btn-primary" onClick={applyFilters}>
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        )}
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
                        <strong>Endereço:</strong> {empresa.endereco}, {empresa.bairro}, {empresa.cidade}, {empresa.estado}, {empresa.pais}
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
              <FaExclamationCircle /> Nenhuma empresa encontrada com os filtros aplicados.
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