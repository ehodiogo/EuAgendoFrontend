import { FaEnvelopeOpenText } from "react-icons/fa6"; // Ícones Fa6 para destaque
import {FaCheckCircle} from "react-icons/fa";

function Confirmacao() {
  return (
    <div className="confirmacao-page-bg">
      <style>{`
        /* Paleta de Cores Consistente */
        :root {
          --primary-blue: #003087;
          --dark-gray: #212529;
          --light-gray-bg: #f0f4f8; /* Fundo suave */
          --white: #ffffff;
          --success-green: #28a745;
          --success-light: #e6f8ee;
        }

        /* Layout */
        .confirmacao-page-bg {
            background-color: var(--light-gray-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem 1rem;
        }

        /* Card Principal */
        .confirmacao-card {
          background-color: var(--white);
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
          max-width: 600px;
          width: 100%;
          padding: 3.5rem 2.5rem;
          text-align: center;
          border-top: 8px solid var(--success-green);
        }
        
        /* Ícone de Sucesso */
        .success-icon-large {
            color: var(--success-green);
            font-size: 5rem;
            margin-bottom: 1.5rem;
            animation: fadeInScale 0.8s ease-out;
            border-radius: 50%;
            background-color: var(--success-light);
            padding: 15px;
        }

        /* Título e Texto */
        .confirmacao-card h1 {
          color: var(--dark-gray);
          font-weight: 800;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .confirmacao-card .lead {
          color: var(--dark-gray);
          font-size: 1.25rem;
          margin-top: 1.5rem;
          margin-bottom: 0;
        }
        .confirmacao-card .email-message {
            color: var(--primary-blue);
            font-weight: 600;
            font-size: 1.05rem;
            margin-top: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem;
            background-color: #f0f8ff;
            border-radius: 8px;
        }

        /* Animações */
        @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
        }

        /* Responsividade */
        @media (max-width: 576px) {
            .confirmacao-card {
                padding: 2.5rem 1.5rem;
            }
            .confirmacao-card h1 {
                font-size: 2rem;
            }
            .success-icon-large {
                font-size: 4rem;
            }
            .confirmacao-card .lead {
                font-size: 1.1rem;
            }
        }
      `}</style>
      <div className="confirmacao-card">
        <FaCheckCircle className="success-icon-large" aria-hidden="true" />
        
        <h1 className="text-center">Obrigado! Sua Compra foi Confirmada.</h1>
        
        <p className="lead">
          Seu pagamento foi realizado com sucesso. Agradecemos por confiar no VemAgendar!
        </p>
        
        <p className="email-message">
          <FaEnvelopeOpenText />
          Um e-mail de confirmação e recibo foi enviado para o seu endereço cadastrado.
        </p>
      </div>
    </div>
  );
}

export default Confirmacao;