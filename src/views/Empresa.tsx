import { useParams, Link } from "react-router-dom";
import { useFetch } from "../functions/GetData";
import { Empresa } from "../interfaces/Empresa";
import { Funcionario } from "../interfaces/Funcionario";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import { FaBuilding, FaInfoCircle, FaTools, FaUserTie, FaCalendar, FaSpinner, FaExclamationCircle } from "react-icons/fa";

function EmpresaDetails() {
  const { empresa: empresaNome } = useParams<{ empresa: string }>();
  const empresas = useFetch<Empresa[]>(`api/empresa/?q=${empresaNome}`);
  const funcionarios = useFetch<Funcionario[]>(`api/funcionario/?empresa_nome=${empresaNome}`);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const empresa = empresas.data?.find(
    (e) => e.nome.toLowerCase() === empresaNome?.toLowerCase()
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

        /* Container */
        .empresa-details-container {
          padding: 3rem 0;
        }

        /* Cabeçalho */
        .empresa-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .empresa-header h1 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .empresa-header .text-muted {
          color: var(--dark-gray);
          font-size: 1.1rem;
        }

        /* Imagem */
        .empresa-image {
          text-align: center;
          margin-bottom: 2rem;
        }
        .empresa-image img {
          max-width: 400px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Informações e Serviços */
        .info-section, .servicos-section {
          margin-bottom: 2rem;
        }
        .info-section h4, .servicos-section h4 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .info-section .list-group-item, .servicos-section .list-group-item {
          border: none;
          border-bottom: 1px solid var(--light-blue);
          padding: 0.75rem 0;
          font-size: 1rem;
          color: var(--dark-gray);
          background-color: transparent;
        }

        /* Funcionários */
        .funcionarios-section {
          margin-bottom: 2rem;
          text-align: center;
        }
        .funcionarios-section h4 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .funcionarios-section .card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          width: 250px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .funcionarios-section .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .funcionarios-section .card-img-top {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 50%;
          margin: 1rem auto;
        }
        .funcionarios-section .card-title {
          color: var(--primary-blue);
          font-weight: 600;
          font-size: 1.1rem;
        }

        /* Botões */
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .btn-success {
          background-color: var(--success-green) !important;
          border-color: var(--success-green) !important;
          color: #fff !important;
        }
        .btn-primary {
          background-color: var(--primary-blue);
          border-color: var(--primary-blue);
        }
        .btn:hover {
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .message.loading {
          color: var(--dark-gray);
          background-color: var(--white);
        }
        .message.error {
          color: var(--danger-red);
          background-color: var(--white);
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .empresa-details-container {
            padding: 2rem 1rem;
          }
          .empresa-header h1 {
            font-size: 2rem;
          }
          .empresa-image img {
            max-width: 300px;
          }
          .info-section h4, .servicos-section h4, .funcionarios-section h4 {
            font-size: 1.25rem;
          }
        }
        @media (max-width: 576px) {
          .empresa-header h1 {
            font-size: 1.75rem;
          }
          .empresa-header .text-muted {
            font-size: 1rem;
          }
          .empresa-image img {
            max-width: 250px;
          }
          .info-section .list-group-item, .servicos-section .list-group-item {
            font-size: 0.9rem;
          }
          .funcionarios-section .card {
            width: 200px;
          }
          .funcionarios-section .card-img-top {
            width: 60px;
            height: 60px;
          }
          .funcionarios-section .card-title {
            font-size: 1rem;
          }
          .btn {
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
          }
          .message {
            font-size: 1rem;
            padding: 1rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="empresa-details-container container">
          {empresas.loading ? (
            <div className="message loading" data-aos="fade-up">
              <FaSpinner className="fa-spin me-2" /> Carregando dados da empresa...
            </div>
          ) : empresas.error ? (
            <div className="message error" data-aos="fade-up">
              <FaExclamationCircle /> Erro ao carregar empresa: {empresas.error}
            </div>
          ) : !empresa ? (
            <div className="message error" data-aos="fade-up">
              <FaExclamationCircle /> Empresa não encontrada.
              <Link to="/" className="btn btn-primary mt-3 ms-3">
                Voltar para Home
              </Link>
            </div>
          ) : (
            <>
              <div className="empresa-header" data-aos="fade-down">
                <h1>
                  <FaBuilding /> {empresa.nome}
                </h1>
                <p className="text-muted">
                  {empresa.endereco} | {empresa.telefone}
                </p>
              </div>
              <div className="empresa-image" data-aos="zoom-in">
                <img
                  src={empresa.logo || "https://via.placeholder.com/400x200?text=Sem+Logo"}
                  alt={empresa.nome}
                  className="img-fluid"
                />
              </div>
              <div className="row">
                <div className="col-lg-6 info-section" data-aos="fade-right">
                  <h4>
                    <FaInfoCircle /> Informações
                  </h4>
                  <ul className="list-group">
                    <li className="list-group-item">
                      <strong>CNPJ:</strong> {empresa.cnpj}
                    </li>
                    <li className="list-group-item">
                      <strong>Email:</strong> {empresa.email}
                    </li>
                  </ul>
                </div>
                <div className="col-lg-6 servicos-section" data-aos="fade-left">
                  <h4>
                    <FaTools /> Serviços Disponíveis
                  </h4>
                  <ul className="list-group">
                    {empresa.servicos && empresa.servicos.length > 0 ? (
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
              <div className="funcionarios-section" data-aos="fade-up">
                <h4>
                  <FaUserTie /> Funcionários
                </h4>
                {funcionarios.loading ? (
                  <div className="message loading" data-aos="fade-up">
                    <FaSpinner className="fa-spin me-2" /> Carregando funcionários...
                  </div>
                ) : funcionarios.error ? (
                  <div className="message error" data-aos="fade-up">
                    <FaExclamationCircle /> Erro ao carregar funcionários: {funcionarios.error}
                  </div>
                ) : funcionarios.data && funcionarios.data.length > 0 ? (
                  <div className="row justify-content-center">
                    {funcionarios.data.map((funcionario, index) => (
                      <div
                        key={funcionario.id}
                        className="col-md-4 col-sm-6 mb-3"
                        data-aos="zoom-in"
                        data-aos-delay={index * 100}
                      >
                        <div className="card">
                          <img
                            src={funcionario.foto || "https://via.placeholder.com/80x80?text=Sem+Foto"}
                            alt={funcionario.nome}
                            className="card-img-top"
                          />
                          <div className="card-body">
                            <h5 className="card-title">{funcionario.nome}</h5>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">Nenhum funcionário cadastrado.</p>
                )}
              </div>
              <div className="text-center mt-5">
                <Link
                  to={`/agendar/${empresa.nome}`}
                  className="btn btn-success"
                >
                  <FaCalendar /> Agendar Agora
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmpresaDetails;