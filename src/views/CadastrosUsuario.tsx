import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
// Importando o FaTags que é ideal para Locações/Itens
import { FaBuilding, FaUserTie, FaList, FaLink, FaCalendar, FaDatabase, FaArrowRight, FaArrowDown, FaTags } from "react-icons/fa6";
import { FaCog, FaTools } from "react-icons/fa";

export default function CadastrosUsuario() {

  // Dados para os Cards de Ação (Links)
  const actionCards = [
    { to: "/criar-empresa", icon: FaBuilding, title: "Gerenciar Empresas", description: "Crie a estrutura principal, horários e configurações do seu negócio.", color: "primary" },
    { to: "/criar-funcionario", icon: FaUserTie, title: "Gerenciar Funcionários", description: "Adicione sua equipe e defina suas disponibilidades para agendamentos.", color: "warning" },
    { to: "/criar-servico", icon: FaTools, title: "Gerenciar Serviços", description: "Defina os serviços oferecidos e associe-os aos funcionários corretos.", color: "success" },
    // --- NOVO CARD DE LOCAÇÕES ADICIONADO ---
    { to: "/criar-locacao", icon: FaTags, title: "Gerenciar Locações (Itens)", description: "Cadastre itens de locação (recursos, equipamentos) e defina seus valores.", color: "purple" }
  ];

  return (
    <div className="min-vh-100">
      <style>{`
        /* Paleta de cores (Revisada e Expandida) */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --medium-gray: #6c757d;
          --light-gray-bg: #f5f7fa;
          --white: #ffffff;
          --success-green: #28a745;
          --warning-orange: #fd7e14;
          --purple-locacao: #8e44ad; /* Nova cor para Locações */
          --info-cyan: #17a2b8;
          --border-light: #e0e0e0;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray-bg);
        }

        /* Container & Título */
        .cadastros-container {
          padding: 3.5rem 0;
          text-align: center;
        }
        .cadastros-container h1 {
          color: var(--primary-blue);
          font-weight: 800;
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          text-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
        }
        .cadastros-container .lead {
          color: var(--medium-gray);
          font-size: 1.2rem;
          max-width: 900px;
          margin: 0 auto 3rem;
        }

        /* Cards de Ação */
        .action-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1100px;
          margin: 0 auto 3.5rem;
        }
        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          color: var(--dark-gray);
          background-color: var(--white);
          border-bottom: 5px solid;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        .action-card .card-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          transition: color 0.3s ease;
        }
        .action-card .card-title {
          font-weight: 700;
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
        }
        .action-card .card-description {
          font-size: 0.95rem;
          color: var(--medium-gray);
        }

        /* Cores dos Cards */
        .action-card.primary { border-bottom-color: var(--primary-blue); }
        .action-card.warning { border-bottom-color: var(--warning-orange); }
        .action-card.success { border-bottom-color: var(--success-green); }
        .action-card.purple { border-bottom-color: var(--purple-locacao); } /* NOVO */

        .action-card.primary .card-icon { color: var(--primary-blue); }
        .action-card.warning .card-icon { color: var(--warning-orange); }
        .action-card.success .card-icon { color: var(--success-green); }
        .action-card.purple .card-icon { color: var(--purple-locacao); } /* NOVO */
        
        /* Seção de Informações (Fluxo e Relação) */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            max-width: 1100px;
            margin: 0 auto;
        }
        .info-card {
            background-color: var(--white);
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            padding: 2rem;
            text-align: left;
            border-left: 5px solid var(--accent-blue);
        }
        .info-card h3 {
          color: var(--accent-blue);
          font-weight: 700;
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Estilo da Lista de Fluxo */
        .fluxo-section ul {
          list-style-type: none;
          padding: 0;
        }
        .fluxo-section li {
          margin-bottom: 1rem;
          display: flex;
          align-items: flex-start;
          font-size: 1rem;
          color: var(--dark-gray);
        }
        .fluxo-section li .step-icon {
          color: var(--success-green);
          font-size: 1.2rem;
          margin-right: 0.75rem;
          flex-shrink: 0;
          margin-top: 3px;
        }

        /* Estilo da Relação */
        .relacao-section pre {
          background-color: var(--light-gray-bg);
          color: var(--dark-gray);
          font-family: monospace;
          font-size: 0.95rem;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid var(--border-light);
          margin-bottom: 1rem;
        }
        .relacao-section .relacao-line {
            display: block;
            margin: 5px 0;
            color: var(--dark-gray);
        }
        .relacao-section .relacao-line svg {
            margin-right: 5px;
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .cadastros-container {
            padding: 2rem 1rem;
          }
          .action-cards-grid {
            grid-template-columns: 1fr;
          }
          .info-grid {
            grid-template-columns: 1fr;
          }
          .info-card {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="cadastros-container container">
          <h1>
            <FaCog /> Gerenciamento de Cadastros
          </h1>
          <p className="lead">
            Crie, edite e organize a base de dados do seu sistema: Empresas, Funcionários, Serviços **e Locações**.
          </p>

          {/* Cards de Ação (Links) */}
          <div className="action-cards-grid">
            {actionCards.map((card) => (
              // Garantindo que a prop 'title' existe, o que ela faz na definição de 'actionCards'
              <Link to={card.to} key={card.title} className={`action-card ${card.color}`}>
                {/* O componente ícone deve ser renderizado: card.icon */}
                <card.icon className="card-icon" />
                <h2 className="card-title">{card.title}</h2>
                <p className="card-description">{card.description}</p>
                <FaArrowRight className="mt-3 text-muted" size={20} />
              </Link>
            ))}
          </div>

          {/* Grid de Informações: Fluxo e Relação */}
          <div className="info-grid">

            {/* CARD 1: FLUXO PARA CADASTRO CORRETO (Atualizado para incluir Locações) */}
            <div className="info-card fluxo-section">
              <h3>
                <FaList /> Fluxo de Cadastro Recomendado
              </h3>
              <p className="text-muted" style={{marginBottom: '1rem'}}>
                Siga esta ordem para garantir que todas as associações funcionem corretamente.
              </p>
              <ul>
                <li>
                  <FaBuilding className="step-icon text-primary-blue" />
                  <strong>1. Empresa:</strong> Crie a estrutura principal, horários e intervalos.
                </li>
                <li>
                  <FaUserTie className="step-icon text-warning-orange" />
                  <strong>2. Funcionário:</strong> Adicione sua equipe e defina a disponibilidade.
                </li>
                <li>
                  <FaTools className="step-icon text-success-green" />
                  <strong>3. Serviço:</strong> Cadastre serviços e associe-os aos funcionários.
                </li>
                <li>
                  <FaTags className="step-icon" style={{color: 'var(--purple-locacao)'}} />
                  <strong>4. Locação (Itens):</strong> Cadastre os equipamentos ou recursos (não dependem de funcionários).
                </li>
                <li style={{borderTop: '1px dashed var(--border-light)', paddingTop: '10px', marginTop: '10px'}}>
                  <FaCalendar className="step-icon text-accent-blue" />
                  <strong>Resultado:</strong> Clientes podem agendar Serviços (Funcionário + Serviço) OU Locações (Empresa + Item).
                </li>
              </ul>
            </div>

            {/* CARD 2: RELAÇÃO HIERÁRQUICA (Atualizado para Locações) */}
            <div className="info-card relacao-section" style={{borderLeftColor: 'var(--purple-locacao)'}}>
              <h3>
                <FaLink /> Relação Hierárquica dos Dados
              </h3>
              <p className="text-muted" style={{marginBottom: '1.5rem'}}>
                Visualize como as informações se conectam no banco de dados.
              </p>
              <pre>
                <span className="relacao-line"><FaDatabase /> <strong>Estrutura de Dados</strong></span>
                <span className="relacao-line"><FaBuilding /> Empresa Principal</span>

                <span className="relacao-line">&nbsp;&nbsp;<FaArrowDown size={14} style={{color: 'var(--warning-orange)'}}/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FaArrowDown size={14} style={{color: 'var(--purple-locacao)'}}/></span>

                <span className="relacao-line">&nbsp;&nbsp;↳ <FaUserTie /> Funcionários (Muitos) &nbsp;&nbsp;↳ <FaTags /> Locações (Itens)</span>

                <span className="relacao-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FaArrowDown size={14} style={{color: 'var(--success-green)'}}/></span>
                <span className="relacao-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ <FaTools /> Serviços (Muitos por Funcionário)</span>
              </pre>
              <p className="fw-semibold text-dark-gray">
                <FaTags className="text-purple-locacao"/> Os itens de **Locação** são diretamente associados à Empresa e não dependem dos Funcionários.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}