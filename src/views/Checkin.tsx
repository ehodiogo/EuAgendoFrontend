import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import Navbar from "../components/Navbar";
import { FaBuilding, FaSpinner, FaMagnifyingGlass, FaLocationDot } from "react-icons/fa6"; // Usando Fa6 para consistência
import {FaExclamationCircle} from "react-icons/fa";

function CheckIn() {
  const token = localStorage.getItem("access_token");
  const empresas_usuario = useFetch<Empresa[]>(
    `/api/empresas-usuario/?usuario_token=${token}`
  );
  const [search, setSearch] = useState("");

  // Filtra empresas com base na busca
  const filteredEmpresas = empresas_usuario.data?.filter((empresa: Empresa) =>
    empresa.nome.toLowerCase().includes(search.toLowerCase()) ||
    empresa.cidade.toLowerCase().includes(search.toLowerCase()) ||
    empresa.estado.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-vh-100">
      <style>{`
        /* Paleta de cores (Consistente com a anterior) */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --medium-gray: #6c757d;
          --light-gray-bg: #f5f7fa;
          --white: #ffffff;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --warning-orange: #fd7e14;
          --gradient-blue: linear-gradient(135deg, #003087, #0056b3);
          --border-light: #e0e0e0;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray-bg);
        }

        /* Header */
        .checkin-header {
          background: var(--gradient-blue);
          color: var(--white);
          padding: 3rem 0;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .checkin-header h1 {
          font-weight: 800;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .checkin-header .lead {
          font-size: 1.2rem;
          font-weight: 300;
          max-width: 700px;
          margin: 0 auto;
        }

        /* Seção de Busca */
        .search-section {
          padding: 2.5rem 0 1.5rem;
          text-align: center;
          background-color: var(--white);
          border-bottom: 1px solid var(--border-light);
        }
        .search-section .input-group-custom {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          align-items: center;
        }
        .search-section .form-control {
          border-radius: 8px 0 0 8px;
          border: 1px solid var(--border-light);
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          color: var(--dark-gray);
          box-shadow: none;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1; /* Para garantir que o foco seja visível */
        }
        .search-section .form-control:focus {
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 2px rgba(0, 48, 135, 0.2);
        }
        .search-section .btn-clear {
          background-color: var(--warning-orange);
          border-color: var(--warning-orange);
          border-radius: 0 8px 8px 0;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          color: var(--white);
          transition: background-color 0.3s ease;
          flex-shrink: 0;
        }
        .search-section .btn-clear:hover {
          background-color: #e06800;
        }

        /* Container & Título da Lista */
        .checkin-container {
          padding: 3rem 0;
        }
        .checkin-container h2 {
          color: var(--dark-gray);
          font-weight: 700;
          font-size: 1.8rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        /* Cartões de empresa (Novo Design) */
        .empresa-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-left 0.3s ease;
          margin-bottom: 1.5rem;
          padding: 2rem;
          border-left: 5px solid var(--primary-blue);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }
        .empresa-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-left: 5px solid var(--success-green);
        }
        .empresa-card-content {
            flex-grow: 1;
        }
        .empresa-card .card-img-container {
          width: 70px;
          height: 70px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          overflow: hidden;
          background-color: var(--light-gray-bg);
          border: 3px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .empresa-card .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .empresa-card .card-title {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .empresa-card .card-text {
          color: var(--medium-gray);
          font-size: 1rem;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .empresa-card .card-location {
          color: var(--dark-gray);
          font-size: 1rem;
          font-weight: 500;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        /* Mensagens */
        .message {
          font-size: 1.1rem;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          background-color: var(--white);
        }
        .message.loading {
          color: var(--primary-blue);
          border: 1px solid var(--border-light);
        }
        .message.warning {
          color: var(--warning-orange);
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
        }

        /* Responsividade */
        @media (max-width: 991px) {
            .search-section .input-group-custom {
                flex-direction: column;
                gap: 0.5rem;
            }
            .search-section .form-control {
                border-radius: 8px;
            }
            .search-section .btn-clear {
                width: 100%;
                border-radius: 8px;
            }
        }
        @media (max-width: 576px) {
          .checkin-header h1 { font-size: 2.2rem; }
          .checkin-header .lead { font-size: 1.1rem; }
          .checkin-container h2 { font-size: 1.6rem; }
          .empresa-card .card-title { font-size: 1.3rem; }
          .empresa-card .card-img-container { width: 50px; height: 50px; }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <header className="checkin-header">
          <div className="container">
            <h1>
              <FaBuilding /> Painel de Check-In
            </h1>
            <p className="lead">
              Selecione uma de suas empresas ativas para iniciar o gerenciamento de check-ins de agendamento.
            </p>
          </div>
        </header>

        <section className="search-section container">
          <div className="input-group-custom">
            <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FaMagnifyingGlass className="text-primary-blue" /></span>
                <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Pesquisar por nome, cidade ou estado da empresa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button
              className="btn btn-clear"
              onClick={() => setSearch("")}
            >
              Limpar Busca
            </button>
          </div>
        </section>

        <div className="checkin-container container">
          <h2>
            Empresas Encontradas
          </h2>
          {empresas_usuario.loading ? (
            <div className="message loading">
              <FaSpinner className="fa-spin me-2" /> Carregando lista de empresas...
            </div>
          ) : filteredEmpresas && filteredEmpresas.length > 0 ? (

            <div className="row justify-content-center">
              {filteredEmpresas.map((empresa: Empresa) => (
                <div
                  className="col-12 col-md-6 col-lg-4 d-flex"
                  key={empresa.id}
                >
                  <Link to={`/checkin/empresa/${empresa.id}`} className="w-100 text-decoration-none">
                    <div className="empresa-card">
                      <div className="card-img-container">
                        <img
                          src={empresa.logo || "https://via.placeholder.com/80x80?text=Logo"}
                          alt={empresa.nome}
                          className="card-img"
                        />
                      </div>
                      <div className="empresa-card-content">
                        <h4 className="card-title">{empresa.nome}</h4>
                        <p className="card-text text-muted">CNPJ: {empresa.cnpj}</p>
                        <p className="card-location">
                          <FaLocationDot className="text-success-green" />
                          {empresa.cidade}, {empresa.estado}
                        </p>
                      </div>
                      <p className="mt-3 mb-0 fw-bold text-success-green">Acessar Check-In</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="message warning">
              <FaExclamationCircle className="me-2" /> Nenhuma empresa encontrada com os critérios de busca.
            </div>
          )}
        </div>
        <footer className="checkin-footer">
          <div className="container">
            <p>&copy; 2025 VemAgendar. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default CheckIn;