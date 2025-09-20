import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaBuilding, FaUserTie, FaTools, FaList, FaLink, FaCog, FaCalendar, FaDatabase } from "react-icons/fa";
import "aos/dist/aos.css";
import AOS from "aos";

export default function CadastrosUsuario() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

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
          --info-blue: #17a2b8;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Container */
        .cadastros-container {
          padding: 3rem 0;
          text-align: center;
        }
        .cadastros-container h1 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .cadastros-container .lead {
          color: var(--dark-gray);
          font-size: 1.25rem;
          max-width: 800px;
          margin: 0 auto 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        /* Botões */
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }
        .action-buttons .btn {
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .action-buttons .btn-success {
          background-color: var(--success-green);
          border-color: var(--success-green);
        }
        .action-buttons .btn-warning {
          background-color: var(--accent-yellow);
          border-color: var(--accent-yellow);
        }
        .action-buttons .btn-info {
          background-color: var(--info-blue);
          border-color: var(--info-blue);
        }
        .action-buttons .btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        /* Seção de fluxo */
        .fluxo-section {
          max-width: 800px;
          margin: 0 auto 3rem;
        }
        .fluxo-section h3 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .fluxo-section ul {
          list-style-type: none;
          padding: 0;
          color: var(--dark-gray);
          font-size: 1.1rem;
        }
        .fluxo-section li {
          margin-bottom: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .fluxo-section li svg {
          color: var(--light-blue);
          font-size: 1.2rem;
          margin-top: 0.2rem;
        }

        /* Seção de relação */
        .relacao-section {
          max-width: 800px;
          margin: 0 auto;
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }
        .relacao-section h5 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .relacao-section pre {
          background-color: var(--light-gray);
          color: var(--dark-gray);
          font-size: 1rem;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          text-align: left;
          margin-bottom: 1.5rem;
        }
        .relacao-section p {
          color: var(--dark-gray);
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .cadastros-container {
            padding: 2rem 1rem;
          }
          .action-buttons {
            flex-direction: column;
            align-items: center;
          }
          .action-buttons .btn {
            width: 100%;
            max-width: 300px;
          }
        }
        @media (max-width: 576px) {
          .cadastros-container h1 {
            font-size: 2rem;
          }
          .cadastros-container .lead {
            font-size: 1.1rem;
          }
          .fluxo-section h3 {
            font-size: 1.5rem;
          }
          .fluxo-section li {
            font-size: 1rem;
          }
          .relacao-section h5 {
            font-size: 1.25rem;
          }
          .relacao-section pre {
            font-size: 0.9rem;
          }
          .relacao-section p {
            font-size: 1rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="cadastros-container container">
          <h1 data-aos="fade-up">
            <FaCog /> Cadastros de Empresas, Funcionários e Serviços
          </h1>
          <p className="lead" data-aos="fade-up" data-aos-delay="100">
            <FaList /> Nesta seção, você pode cadastrar novas empresas, funcionários e serviços. Além disso, em cada uma dessas telas, é possível editar ou excluir os dados cadastrados.
          </p>
          <div className="action-buttons" data-aos="fade-up" data-aos-delay="200">
            <Link to="/criar-empresa" className="btn btn-success">
              <FaBuilding /> Criar Empresa
            </Link>
            <Link to="/criar-funcionario" className="btn btn-warning">
              <FaUserTie /> Criar Funcionário
            </Link>
            <Link to="/criar-servico" className="btn btn-info">
              <FaTools /> Criar Serviço
            </Link>
          </div>
          <div className="fluxo-section" data-aos="fade-up" data-aos-delay="300">
            <h3>
              <FaCog /> Fluxo para Cadastro Correto
            </h3>
            <p className="text-muted">
              <FaList /> O fluxo do projeto segue a seguinte lógica:
            </p>
            <ul>
              <li>
                <FaBuilding /> O usuário cria uma empresa informando seus dados, incluindo horário de abertura e fechamento, se há funcionamento nos finais de semana e se há intervalos.
              </li>
              <li>
                <FaUserTie /> O usuário deve adicionar funcionários para essa empresa e associar serviços a cada funcionário.
              </li>
              <li>
                <FaCalendar /> Com esses dados configurados, os clientes poderão selecionar um horário disponível dentro do período de funcionamento da empresa, escolher um funcionário e o serviço desejado para agendamento.
              </li>
              <li>
                <FaList /> Na tela de cadastro, o usuário pode adicionar novos registros, editar informações existentes ou excluir dados que não são mais necessários.
              </li>
              <li>
                <FaDatabase /> As informações são armazenadas no banco de dados e podem ser consultadas a qualquer momento.
              </li>
            </ul>
          </div>
          <div className="relacao-section" data-aos="fade-up" data-aos-delay="400">
            <h5>
              <FaLink /> Relação entre os Dados
            </h5>
            <pre>
              <FaBuilding /> Empresa XYZ
              <br />
              &nbsp;&nbsp;- <FaUserTie /> Funcionário 1
              <br />
              &nbsp;&nbsp;- <FaUserTie /> Funcionário 2
            </pre>
            <pre>
              <FaUserTie /> Funcionário 1
              <br />
              &nbsp;&nbsp;- <FaTools /> Serviço 1
              <br />
              &nbsp;&nbsp;- <FaTools /> Serviço 2
            </pre>
            <p>
              <FaList /> Cada empresa possui diversos funcionários, e cada funcionário pode estar associado a diferentes serviços.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}