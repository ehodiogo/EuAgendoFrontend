import { useNavigate } from "react-router-dom";
import {FaExclamationTriangle, FaHome} from "react-icons/fa";
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <style>{`
        /* Paleta de Cores (Consistente) */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --light-gray-bg: #f5f7fa;
          --white: #ffffff;
          --danger-red: #dc3545;
          --shadow-color: rgba(0, 0, 0, 0.1);
        }

        .not-found-page {
          background-color: var(--light-gray-bg);
          background-image: linear-gradient(135deg, var(--light-gray-bg) 0%, var(--white) 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 2rem 1rem;
        }

        /* Ícone de Alerta Grande */
        .not-found-icon {
          color: var(--danger-red);
          font-size: 6rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
          animation: shake 0.5s ease-in-out infinite alternate;
        }
        @keyframes shake {
            0% { transform: translateY(0); }
            100% { transform: translateY(-5px); }
        }

        /* Número 404 */
        .not-found-code {
          font-size: 8rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin-bottom: 0.5rem;
          line-height: 1;
          text-shadow: 4px 4px 0 rgba(0, 48, 135, 0.1);
          letter-spacing: -0.05em;
        }

        /* Título Principal */
        .not-found-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--dark-gray);
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        /* Texto de Descrição */
        .not-found-description {
          font-size: 1.25rem;
          color: var(--dark-gray);
          opacity: 0.8;
          max-width: 450px;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        /* Botão Principal com Estilo Gradiente */
        .btn-home {
          background: linear-gradient(135deg, var(--primary-blue), var(--accent-blue));
          color: var(--white);
          font-weight: 700;
          padding: 0.8rem 2rem;
          border-radius: 10px;
          border: none;
          font-size: 1.15rem;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 4px 15px rgba(0, 48, 135, 0.3);
        }
        .btn-home:hover {
          background: linear-gradient(135deg, var(--accent-blue), var(--primary-blue));
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 48, 135, 0.4);
          cursor: pointer;
        }

        /* Responsividade */
        @media (max-width: 576px) {
            .not-found-code {
                font-size: 6rem;
            }
            .not-found-title {
                font-size: 2rem;
            }
            .not-found-description {
                font-size: 1.1rem;
            }
            .not-found-icon {
                font-size: 5rem;
            }
            .btn-home {
                font-size: 1.05rem;
                padding: 0.75rem 1.5rem;
            }
        }
      `}</style>

      <div className="not-found-icon" aria-hidden="true">
        <FaExclamationTriangle />
      </div>

      <h1 className="not-found-code" aria-label="Erro 404">
        404
      </h1>
      <h2 className="not-found-title">
        Página Não Encontrada
      </h2>
      <p className="not-found-description">
        Lamentamos, mas o endereço que você tentou acessar não existe ou foi removido.
      </p>
      <button
        className="btn-home"
        onClick={() => navigate("/")}
      >
        <FaHome /> Voltar para a Página Inicial
      </button>
    </div>
  );
};

export default NotFound;