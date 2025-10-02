import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaCircleXmark, FaRotateLeft, FaCircleExclamation } from "react-icons/fa6"; // Atualizado para Fa6

const FailurePage = () => {
  return (
    <>
      <style>{`
        /* Paleta de cores (Consistente VemAgendar) */
        :root {
          --primary-blue: #003087;
          --dark-gray: #212529;
          --light-gray-bg: #f0f4f8; /* Fundo suave */
          --white: #ffffff;
          --danger-red: #dc3545;
          --danger-light: #fcebeb;
        }

        /* Layout */
        .failure-page-bg {
            background-color: var(--light-gray-bg);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem 1rem;
        }

        /* Card Principal */
        .failure-card {
          background-color: var(--white);
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
          max-width: 550px;
          width: 100%;
          padding: 3rem;
          text-align: center;
          border-top: 6px solid var(--danger-red);
        }
        
        .failure-icon {
            color: var(--danger-red);
            font-size: 4rem;
            margin-bottom: 1.5rem;
        }

        /* Título e Texto */
        .failure-card h1 {
          color: var(--dark-gray);
          font-weight: 800;
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
        }
        .failure-card .lead {
          color: var(--light-gray-text, #495057);
          font-size: 1.15rem;
          margin-bottom: 2rem;
        }
        
        /* Dicas/Mensagem de Erro */
        .error-tip {
            background-color: var(--danger-light);
            color: var(--danger-red);
            border: 1px solid var(--danger-red);
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            font-weight: 600;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }


        /* Botões */
        .btn-custom {
          padding: 0.85rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1.05rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 0.75rem; /* Espaçamento entre os botões */
        }
        .btn-danger-custom {
          background-color: var(--danger-red);
          border-color: var(--danger-red);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .btn-danger-custom:hover {
          background-color: #b02a37;
          border-color: #b02a37;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(220, 53, 69, 0.3);
        }
        .btn-outline-custom {
          border: 2px solid var(--primary-blue);
          color: var(--primary-blue);
          background-color: var(--white);
        }
        .btn-outline-custom:hover {
            background-color: #e0e7ff;
        }

        /* Responsividade */
        @media (max-width: 576px) {
            .failure-card {
                padding: 2rem 1.5rem;
            }
            .failure-icon {
                font-size: 3rem;
            }
            .failure-card h1 {
                font-size: 1.8rem;
            }
        }
      `}</style>
      <Navbar />
      <div className="failure-page-bg">
        <div className="failure-card">
          <FaCircleXmark className="failure-icon" aria-hidden="true" />

          <h1 className="text-danger">Pagamento Recusado</h1>

          <p className="lead">
            Infelizmente, ocorreu um erro ao processar sua transação.
          </p>

          <p className="error-tip">
            <FaCircleExclamation /> Verifique o limite do seu cartão ou tente utilizar outra forma de pagamento.
          </p>

          <Link to="/carrinho" className="btn-custom btn-danger-custom w-100">
            <FaRotateLeft /> Tentar Novamente
          </Link>

          <Link to="/" className="btn-custom btn-outline-custom w-100">
            Voltar à Página Inicial
          </Link>
        </div>
      </div>
    </>
  );
};

export default FailurePage;