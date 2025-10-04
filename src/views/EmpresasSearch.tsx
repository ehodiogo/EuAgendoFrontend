import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import {Locacao} from "../interfaces/Locacao.tsx";
import Navbar from "../components/Navbar";
import FilterModal from "../components/FilterModal";
import { FaSearch, FaSpinner, FaExclamationCircle, FaFilter, FaMapMarkerAlt, FaPhoneAlt, FaDollarSign, FaBuilding, FaTags } from "react-icons/fa";

// Componente Auxiliar para Lista de Serviços (Refatorado)
interface Servico {
  nome: string;
  preco: number;
  duracao: string;
}

const ListaServicos: React.FC<{ servicos?: Servico[] }> = ({ servicos }) => (
    <div className="list-servicos">
        <h6><FaDollarSign /> Serviços Oferecidos:</h6>
        <ul className="list-unstyled">
            {servicos && servicos.length > 0 ? (
                servicos.slice(0, 3).map((servico, i) => (
                    <li key={i}>
                        {servico.nome} (R$ {servico.preco})
                    </li>
                ))
            ) : (
                <li>Nenhum serviço cadastrado</li>
            )}
            {servicos && servicos.length > 3 && (
                <li className="text-muted text-small">
                    e mais {servicos.length - 3} serviço(s)...
                </li>
            )}
        </ul>
    </div>
);

// Componente Auxiliar para Lista de Locações (NOVO)
const ListaLocacoes: React.FC<{ locacoes?: Locacao[] }> = ({ locacoes }) => (
    <div className="list-servicos">
        <h6><FaTags /> Locações oferecidas:</h6>
        <ul className="list-unstyled">
            {locacoes && locacoes.length > 0 ? (
                locacoes.slice(0, 3).map((locacao, i) => (
                    <li key={i}>
                        {locacao.nome} (Duração: {locacao.duracao})
                    </li>
                ))
            ) : (
                <li>Nenhum item de locação cadastrado</li>
            )}
            {locacoes && locacoes.length > 3 && (
                <li className="text-muted text-small">
                    e mais {locacoes.length - 3} item(s)...
                </li>
            )}
        </ul>
    </div>
);


function EmpresasSearch() {
  const [search, setSearch] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [pais, setPais] = useState("");
  const [tipoEmpresa, setTipoEmpresa] = useState("");
  const [showModal, setShowModal] = useState(false);
  const empresas = useFetch<Empresa[]>("/api/empresa");

  const tiposDisponiveis = ["Serviço", "Locação"];

  const filteredEmpresas = empresas.data?.filter((empresa: Empresa) =>
    empresa.nome.toLowerCase().includes(search.toLowerCase()) &&
    (cidade ? empresa.cidade.toLowerCase().includes(cidade.toLowerCase()) : true) &&
    (estado ? empresa.estado.toLowerCase().includes(estado.toLowerCase()) : true) &&
    (bairro ? empresa.bairro.toLowerCase().includes(bairro.toLowerCase()) : true) &&
    (pais ? empresa.pais.toLowerCase().includes(pais.toLowerCase()) : true) &&
    (tipoEmpresa ? empresa.tipo.toLowerCase() === tipoEmpresa.toLowerCase() : true)
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
    setTipoEmpresa("");
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
          --primary-blue: #003087; /* Azul Principal */
          --accent-blue: #0056b3; /* Azul para destaques/hover */
          --light-blue: #e0f2f7; /* Azul claro de fundo */
          --dark-gray: #333333; /* Texto principal */
          --medium-gray: #666666; /* Texto secundário */
          --light-gray-bg: #f9f9f9; /* Fundo de seções */
          --white: #ffffff;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --warning-orange: #fd7e14;
          --border-light: #e0e0e0; /* Borda sutil */
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray-bg);
        }

        /* Header */
        .empresas-header {
          background-color: var(--primary-blue);
          color: var(--white);
          padding: 3rem 0;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .empresas-header h1 {
          font-weight: 700;
          font-size: 2.8rem;
          margin-bottom: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
        }
        .empresas-header .lead {
          font-size: 1.3rem;
          max-width: 800px;
          margin: 0.5rem auto 0;
          line-height: 1.6;
        }

        /* Busca e Filtros */
        .search-section {
          padding: 2.5rem 0;
          text-align: center;
          background-color: var(--white);
          border-bottom: 1px solid var(--border-light);
        }
        .search-section .input-group {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          gap: 1rem;
          align-items: stretch;
        }
        .search-section .form-control {
          border-radius: 8px;
          border: 1px solid var(--border-light);
          padding: 0.85rem 1.25rem;
          font-size: 1.05rem;
          color: var(--dark-gray);
          flex: 1;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
        }
        .search-section .form-control:focus {
            border-color: var(--accent-blue);
            box-shadow: 0 0 0 0.2rem rgba(0, 86, 179, 0.25);
        }
        .search-section .btn-filter {
          background-color: var(--accent-blue);
          border-color: var(--accent-blue);
          color: var(--white);
          border-radius: 8px;
          padding: 0.85rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .search-section .btn-filter:hover {
          background-color: var(--primary-blue);
          border-color: var(--primary-blue);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        /* --- Modal (Estilos para o FilterModal) --- */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.65);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: var(--white);
          border-radius: 12px;
          padding: 2.5rem;
          max-width: 550px;
          width: 90%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          position: relative;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateY(-70px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-content h3 {
          color: var(--primary-blue);
          font-weight: 700;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.8rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1rem;
        }
        .modal-content .btn-close {
          position: absolute;
          top: 1.2rem;
          right: 1.2rem;
          background: none;
          border: none;
          font-size: 1.8rem;
          color: var(--medium-gray);
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .modal-content .btn-close:hover {
          opacity: 1;
          color: var(--dark-gray);
        }
        .modal-content .form-group {
            margin-bottom: 1.5rem;
        }
        .modal-content .form-group label {
            font-weight: 600;
            color: var(--dark-gray);
            margin-bottom: 0.4rem;
            display: block;
            font-size: 1rem;
        }
        .modal-content .form-control,
        .modal-content .form-select {
          border-radius: 8px;
          padding: 0.8rem 1rem;
          border: 1px solid var(--border-light);
          transition: border-color 0.2s, box-shadow 0.2s;
          font-size: 1rem;
        }
        .modal-content .form-control:focus,
        .modal-content .form-select:focus {
            border-color: var(--primary-blue);
            box-shadow: 0 0 0 0.2rem rgba(0, 48, 135, 0.25);
        }
        .modal-content .btn-primary, .modal-content .btn-warning {
            border-radius: 8px;
            padding: 0.8rem 1.8rem;
            font-weight: 600;
            transition: all 0.3s ease;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .modal-content .btn-primary {
          background-color: var(--primary-blue);
          border-color: var(--primary-blue);
        }
        .modal-content .btn-warning {
          background-color: var(--warning-orange);
          border-color: var(--warning-orange);
        }
        .modal-content .btn-primary:hover, .modal-content .btn-warning:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }


        /* --- Lista de Empresas (CARDS MELHORADOS) --- */
        .empresas-list {
          padding: 3rem 0;
        }
        .empresas-list .card {
          background-color: var(--white);
          border-radius: 15px; /* Bordas mais arredondadas */
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); /* Sombra mais profunda */
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          border: none; /* Remove a borda padrão do Bootstrap */
          overflow: hidden; /* Garante que nada vaze */
        }
        .empresas-list .card:hover {
          transform: translateY(-8px); /* Efeito de elevação maior */
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2); /* Sombra mais pronunciada no hover */
        }
        .empresas-list .card-img-container {
          width: 100%;
          height: 220px; /* Altura um pouco maior para a imagem */
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--light-gray-bg);
          border-bottom: 1px solid var(--border-light);
          overflow: hidden;
        }
        .empresas-list .card-img-top {
          max-width: 90%; /* Logo um pouco menor para não preencher tudo */
          max-height: 90%;
          object-fit: contain;
          margin: auto;
          padding: 1rem;
          transition: transform 0.3s ease;
        }
        .empresas-list .card:hover .card-img-top {
            transform: scale(1.05); /* Zoom sutil na imagem */
        }
        .empresas-list .card-body {
          padding: 1.8rem; /* Padding interno maior */
          text-align: left;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .empresas-list .card-title {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.8rem; /* Título maior */
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .empresas-list .card-subtitle {
            font-size: 0.95rem;
            color: var(--medium-gray);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .empresas-list .card-details {
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-light);
        }
        .empresas-list .card-details p {
            margin-bottom: 0.6rem;
            font-size: 0.95rem;
            color: var(--dark-gray);
            display: flex;
            align-items: flex-start; /* Alinha o texto ao topo, caso o ícone seja maior */
            gap: 0.75rem; /* Espaço entre ícone e texto */
        }
        .empresas-list .card-details p strong {
            color: var(--primary-blue);
            font-weight: 600;
        }
        .empresas-list .card-details p .icon {
            color: var(--accent-blue);
            font-size: 1.1rem;
            flex-shrink: 0; /* Impede o ícone de encolher */
            position: relative;
            top: 2px;
        }

        .empresas-list .list-servicos {
            margin-bottom: 1.5rem;
        }
        .empresas-list .list-servicos h6 {
            color: var(--primary-blue);
            font-weight: 600;
            font-size: 1.05rem;
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .empresas-list .list-servicos ul {
            padding-left: 1.2rem; /* Indentação para os itens da lista */
            list-style: none; /* Remove bullet padrão */
        }
        .empresas-list .list-servicos ul li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.4rem;
            font-size: 0.9rem;
            color: var(--medium-gray);
        }
        .empresas-list .list-servicos ul li::before {
            content: "•"; /* Bullet customizado */
            color: var(--success-green);
            position: absolute;
            left: 0;
            font-weight: bold;
        }
        .empresas-list .btn-success {
          background-color: var(--success-green);
          border-color: var(--success-green);
          padding: 0.9rem; /* Botão maior */
          font-weight: 700; /* Texto mais forte */
          border-radius: 8px;
          margin-top: auto; /* Empurra para o final do card */
          transition: all 0.3s ease;
          width: 100%;
          font-size: 1.05rem;
        }
        .empresas-list .btn-success:hover {
          background-color: #218838; /* Verde mais escuro no hover */
          border-color: #1e7e34;
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
        }

        /* Mensagens (Loading, Erro, Vazio) */
        .message {
          font-size: 1.2rem;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          max-width: 700px;
          margin: 3rem auto;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          font-weight: 500;
        }
        .message.loading {
          color: var(--primary-blue);
          background-color: var(--white);
          border: 1px solid var(--light-blue);
        }
        .message.error {
          color: var(--danger-red);
          background-color: #ffebeb;
          border: 1px solid var(--danger-red);
        }
        .message.warning {
          color: var(--warning-orange);
          background-color: #fff8e1;
          border: 1px solid var(--warning-orange);
        }

        /* Responsividade */
        @media (max-width: 991px) { /* Tablets e menores */
          .empresas-header { padding: 2.5rem 0; }
          .empresas-header h1 { font-size: 2.3rem; }
          .empresas-header .lead { font-size: 1.15rem; }
          .search-section { padding: 2rem 0; }
          .search-section .input-group { max-width: 90%; }
          .empresas-list .card-title { font-size: 1.5rem; }
          .empresas-list .card-img-container { height: 180px; }
          .empresas-list .card-body { padding: 1.5rem; }
        }

        @media (max-width: 767px) { /* Celulares */
          .empresas-header { padding: 2rem 1rem; }
          .empresas-header h1 { font-size: 2rem; gap: 0.5rem; }
          .empresas-header .lead { font-size: 1rem; }
          .search-section { padding: 1.5rem 1rem; }
          .search-section .input-group {
            flex-direction: column;
            gap: 0.75rem;
            max-width: 100%;
          }
          .search-section .form-control, .search-section .btn-filter {
            width: 100%;
            padding: 0.75rem 1rem;
            font-size: 0.95rem;
          }
          .modal-content { padding: 2rem 1.5rem; width: 95%; }
          .modal-content h3 { font-size: 1.5rem; }
          .modal-content .btn-close { font-size: 1.5rem; }
          .modal-content .btn-primary, .modal-content .btn-warning {
            padding: 0.7rem 1.2rem;
            font-size: 0.95rem;
          }

          .empresas-list { padding: 2rem 0; }
          .empresas-list .card { border-radius: 10px; }
          .empresas-list .card-img-container { height: 160px; }
          .empresas-list .card-body { padding: 1.2rem; }
          .empresas-list .card-title { font-size: 1.3rem; margin-bottom: 0.5rem; }
          .empresas-list .card-subtitle { font-size: 0.85rem; margin-bottom: 1rem; }
          .empresas-list .card-details p, .empresas-list .list-servicos ul li { font-size: 0.88rem; }
          .empresas-list .card-details p .icon { font-size: 1rem; }
          .empresas-list .btn-success { padding: 0.7rem; font-size: 0.95rem; }

          .message {
            font-size: 1rem;
            padding: 1.5rem;
            margin: 2rem auto;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <header className="empresas-header">
          <div className="container">
            <h1>
              <FaSearch /> Busca de Empresas
            </h1>
            <p className="lead">
              Encontre estabelecimentos e profissionais cadastrados para agendar seus serviços.
            </p>
          </div>
        </header>
        <section className="search-section container-fluid">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Pesquisar por nome da empresa ou serviço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-filter"
              onClick={() => setShowModal(true)}
              aria-label="Abrir Filtros"
            >
              <FaFilter /> Filtros
            </button>
          </div>
        </section>

        {/* Renderiza o Modal de Filtros (Componente Separado) */}
        <FilterModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onApply={applyFilters}
          onClear={clearFilters}
          cidade={cidade}
          setCidade={setCidade}
          estado={estado}
          setEstado={setEstado}
          bairro={bairro}
          setBairro={setBairro}
          pais={pais}
          setPais={setPais}
          tipoEmpresa={tipoEmpresa}
          setTipoEmpresa={setTipoEmpresa}
          tiposDisponiveis={tiposDisponiveis}
          estados={estados}
        />

        <section className="empresas-list container">
          {empresas.loading ? (
            <div className="message loading">
              <FaSpinner className="fa-spin" /> Carregando empresas...
            </div>
          ) : filteredEmpresas && filteredEmpresas.length > 0 ? (
            <div className="row">
              {filteredEmpresas.map((empresa, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-img-container">
                      <img
                        src={empresa.logo || "https://via.placeholder.com/220x220?text=Sem+Logo"}
                        alt={empresa.nome}
                        className="card-img-top"
                        loading="lazy"
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{empresa.nome}</h5>

                      <div className="card-details">
                          <p>
                            <FaBuilding className="icon" />
                            <strong>Tipo:</strong> {empresa.tipo}
                          </p>
                          <p>
                            <FaMapMarkerAlt className="icon" />
                            <strong>Localidade:</strong> {empresa.cidade}, {empresa.estado}, {empresa.pais}
                          </p>
                          {empresa.telefone && (
                              <p>
                                <FaPhoneAlt className="icon" />
                                <strong>Telefone:</strong> {empresa.telefone}
                              </p>
                          )}
                      </div>

                      {/* LÓGICA CONDICIONAL: Mostra Locações se for 'Locação', senão mostra Serviços */}
                      {empresa.tipo === "Locação" ? (
                          <ListaLocacoes locacoes={empresa.locacoes} />
                      ) : (
                          <ListaServicos servicos={empresa.servicos} />
                      )}

                      <Link
                        to={`/empresas/${empresa.nome}`}
                        className="btn btn-success"
                      >
                        Ver Detalhes e Agendar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="message warning">
              <FaExclamationCircle /> Nenhuma empresa encontrada com os filtros e busca atuais.
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