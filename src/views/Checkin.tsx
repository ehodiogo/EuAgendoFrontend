import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import Navbar from "../components/Navbar";
import { FaBuilding, FaExclamationCircle, FaSpinner } from "react-icons/fa";

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
        /* Paleta de cores */
        :root {
          --primary-blue: #003087;
          --light-blue: #4dabf7;
          --dark-gray: #2d3748;
          --light-gray: #f7fafc;
          --white: #ffffff;
          --accent-yellow: #f6c107;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --warning-orange: #fd7e14;
          --gradient-blue: linear-gradient(135deg, #003087, #4dabf7);
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Header */
        .checkin-header {
          background: var(--gradient-blue);
          color: var(--white);
          padding: 4rem 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .checkin-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.2), transparent);
          opacity: 0.3;
        }
        .checkin-header h1 {
          font-weight: 800;
          font-size: 2.8rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        .checkin-header .lead {
          font-size: 1.3rem;
          max-width: 700px;
          margin: 0 auto;
          font-weight: 300;
          position: relative;
        }

        /* Seção de Busca */
        .search-section {
          padding: 2rem 0;
          text-align: center;
        }
        .search-section .input-group {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .search-section .form-control {
          border-radius: 50px;
          border: 1px solid var(--light-blue);
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          color: var(--dark-gray);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .search-section .form-control:focus {
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.3);
        }
        .search-section .btn-warning {
          background-color: var(--warning-orange);
          border-color: var(--warning-orange);
          border-radius: 50px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .search-section .btn-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Container */
        .checkin-container {
          padding: 3rem 0;
        }
        .checkin-container h2 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Cartões de empresa */
        .empresa-card {
          background-color: var(--white);
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 2rem;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(77, 171, 247, 0.2);
        }
        .empresa-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, #ffffff, #f8fbff);
        }
        .empresa-card .card-img-container {
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          overflow: hidden;
          background-color: var(--light-gray);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .empresa-card .card-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .empresa-card .card-title {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.6rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .empresa-card .card-text {
          color: var(--dark-gray);
          font-size: 1rem;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .empresa-card .card-action {
          color: var(--light-blue);
          font-size: 0.9rem;
          font-weight: 600;
          text-align: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .empresa-card:hover .card-action {
          opacity: 1;
        }

        /* Mensagens */
        .message {
          font-size: 1.1rem;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          background-color: var(--white);
        }
        .message.loading {
          color: var(--dark-gray);
        }
        .message.warning {
          color: var(--warning-orange);
        }

        /* Footer */
        .checkin-footer {
          background: var(--gradient-blue);
          color: var(--white);
          padding: 2rem 0;
          text-align: center;
          margin-top: 2rem;
        }
        .checkin-footer p {
          margin: 0;
          font-size: 1rem;
          font-weight: 300;
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .checkin-header, .search-section, .checkin-container {
            padding: 2rem 1rem;
          }
          .search-section .input-group {
            max-width: 100%;
            flex-direction: column;
          }
          .search-section .form-control, .search-section .btn-warning {
            width: 100%;
          }
          .empresa-card .card-title {
            font-size: 1.4rem;
          }
        }
        @media (max-width: 576px) {
          .checkin-header h1 {
            font-size: 2.2rem;
          }
          .checkin-header .lead {
            font-size: 1.1rem;
          }
          .checkin-container h2 {
            font-size: 1.8rem;
          }
          .empresa-card .card-title {
            font-size: 1.2rem;
          }
          .empresa-card .card-text {
            font-size: 0.9rem;
          }
          .empresa-card .card-img-container {
            width: 60px;
            height: 60px;
          }
          .message {
            font-size: 1rem;
            padding: 1rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <header className="checkin-header">
          <div className="container">
            <h1>
              <FaBuilding /> Check-In
            </h1>
            <p className="lead">
              Escolha uma de suas empresas para realizar o check-in de agendamentos.
            </p>
          </div>
        </header>
        <section className="search-section container">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Pesquisar por nome, cidade ou estado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-warning"
              onClick={() => setSearch("")}
            >
              Limpar
            </button>
          </div>
        </section>
        <div className="checkin-container container">
          <h2>
            <FaBuilding /> Suas Empresas
          </h2>
          {empresas_usuario.loading ? (
            <div className="message loading">
              <FaSpinner className="fa-spin me-2" /> Carregando empresas...
            </div>
          ) : filteredEmpresas && filteredEmpresas.length > 0 ? (
            <div className="row justify-content-center">
              {filteredEmpresas.map((empresa: Empresa) => (
                <div
                  className="col-12 col-md-6 col-lg-4 mb-4"
                  key={empresa.id}
                >
                  <Link to={`/checkin/empresa/${empresa.id}`}>
                    <div className="empresa-card">
                      <div className="card-img-container">
                        <img
                          src={empresa.logo || "https://via.placeholder.com/80x80?text=Logo"}
                          alt={empresa.nome}
                          className="card-img"
                        />
                      </div>
                      <div className="card-body text-center">
                        <h4 className="card-title">{empresa.nome}</h4>
                        <p className="card-text">CNPJ: {empresa.cnpj}</p>
                        <p className="card-text">
                          {empresa.endereco}, {empresa.bairro}, {empresa.cidade}, {empresa.estado}, {empresa.pais}
                        </p>
                        <p className="card-action">Clique para selecionar</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="message warning">
              <FaExclamationCircle /> Nenhuma empresa encontrada.
            </div>
          )}
        </div>
        <footer className="checkin-footer">
          <p>&copy; 2025 VemAgendar. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

export default CheckIn;