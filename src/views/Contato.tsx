import Navbar from "../components/Navbar";
import { FaEnvelope, FaPhone, FaLocationDot, FaPaperPlane, FaUser, FaCircleCheck } from "react-icons/fa6"; // Atualizado para Fa6
import { useState, ChangeEvent, FormEvent } from "react";

function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeType) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  type ChangeType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    // Simulação de envio de formulário
    setTimeout(() => {
      setIsLoading(false);
      // Aqui você integraria com sua API de envio (ex: Axios.post)
      // Se fosse real: try { await axios.post('/api/contato', formData); setStatus(...) } catch(e) { setError(...) }

      setStatus("success");
      setFormData({ nome: "", email: "", mensagem: "" });
      setTimeout(() => setStatus(""), 6000); // Remove a mensagem de sucesso após 6 segundos
    }, 1500);
  };

  const getStatusMessage = () => {
    if (status === "success") {
      return {
        message: "Mensagem enviada com sucesso! Agradecemos o contato.",
        className: "status-success",
        icon: <FaCircleCheck size={20} className="me-2" />
      };
    }
    // Adicionar um status de erro se necessário
    return null;
  };

  const currentStatus = getStatusMessage();

  return (
    <div className="min-vh-100">
      <style>{`
        /* Paleta de cores (Consistente com Login/Register) */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --light-gray-bg: #f5f7fa;
          --white: #ffffff;
          --success-green: #28a745;
          --shadow-color: rgba(0, 0, 0, 0.15);
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray-bg);
          background-image: linear-gradient(135deg, var(--light-gray-bg) 0%, var(--white) 100%);
        }

        /* Seções */
        .custom-section {
          padding: 5rem 0;
        }
        .custom-section h1 {
          color: var(--dark-gray);
          font-weight: 800;
          font-size: 3rem;
          margin-bottom: 0.5rem;
          letter-spacing: -0.05em;
        }
        .custom-section p.lead {
          color: var(--dark-gray);
          font-size: 1.15rem;
          max-width: 800px;
          margin: 0 auto 3rem;
        }

        /* Layout principal */
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1.5fr; /* Dando mais espaço ao formulário */
          gap: 3rem;
          max-width: 1100px;
          margin: 2rem auto 0;
        }
        
        /* Cards de Informação e Formulário */
        .contact-info-card, .contact-form-card {
          background-color: var(--white);
          border-radius: 20px;
          box-shadow: 0 8px 30px var(--shadow-color);
          padding: 2.5rem;
          transition: transform 0.3s ease;
          border-top: 5px solid var(--primary-blue);
        }
        .contact-info-card {
             height: fit-content;
        }
        
        .contact-info-card h3 {
          color: var(--dark-gray);
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        /* Item de Contato */
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1.25rem;
          background-color: var(--light-gray-bg);
          border-radius: 12px;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          border-left: 5px solid var(--accent-blue);
        }
        .contact-item:hover {
          background-color: rgba(0, 86, 179, 0.05);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }
        .contact-item svg {
          color: var(--primary-blue);
          flex-shrink: 0;
          font-size: 1.5rem;
          margin-top: 0.1rem;
        }
        .contact-item strong {
            color: var(--dark-gray);
            font-size: 1.1rem;
            font-weight: 700;
            display: block;
            margin-bottom: 0.2rem;
        }
        .contact-item a, .contact-item span {
          color: var(--dark-gray);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }
        .contact-item a:hover {
          color: var(--accent-blue);
          text-decoration: underline;
        }

        /* Formulário */
        .contact-form-card h3 {
          color: var(--dark-gray);
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }
        .form-control {
          border-radius: 10px;
          border: 1px solid #d1d5db;
          padding: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-control:focus {
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(0, 48, 135, 0.2);
        }
        .form-label {
          color: var(--dark-gray);
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }
        
        /* Botão de Envio com Gradiente (Consistente) */
        .submit-btn {
          background: linear-gradient(135deg, var(--primary-blue), var(--accent-blue));
          color: var(--white);
          font-weight: 700;
          padding: 1rem;
          border-radius: 10px;
          transition: all 0.3s ease;
          border: none;
          width: 100%;
          font-size: 1.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 4px 15px rgba(0, 48, 135, 0.3);
          margin-top: 1rem;
        }
        .submit-btn:hover {
          background: linear-gradient(135deg, var(--accent-blue), var(--primary-blue));
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 48, 135, 0.4);
        }
        .submit-btn:disabled {
          background: #ccc;
          color: var(--dark-gray);
          cursor: not-allowed;
          opacity: 0.8;
          transform: none;
          box-shadow: none;
        }
        
        /* Mensagem de Status */
        .status-message {
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1.5rem;
          text-align: center;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .status-success {
          background-color: #d4edda;
          color: var(--success-green);
          border: 1px solid #c3e6cb;
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .contact-layout {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            max-width: 700px;
          }
          .custom-section {
            padding: 3rem 0;
          }
        }
        @media (max-width: 576px) {
          .custom-section h1 {
            font-size: 2.5rem;
          }
          .custom-section p.lead {
            font-size: 1.05rem;
            margin-bottom: 2rem;
          }
          .contact-info-card, .contact-form-card {
            padding: 2rem 1.5rem;
            border-radius: 15px;
          }
          .contact-info-card h3, .contact-form-card h3 {
              font-size: 1.6rem;
          }
          .contact-item {
              padding: 1rem;
              gap: 1rem;
          }
          .contact-item svg {
              font-size: 1.3rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />

        <div className="container custom-section">
          <section className="text-center">
            <h1>Fale Conosco</h1>
            <p className="lead">
              Tem alguma dúvida, sugestão ou precisa de suporte? Nossa equipe está pronta para ajudar. Preencha o formulário e entraremos em contato o mais breve possível.
            </p>
          </section>

          <div className="contact-layout">
            {/* COLUNA DE INFORMAÇÕES */}
            <div className="contact-info-card">
              <h3>Detalhes de Contato</h3>

              <div className="contact-item">
                <FaEnvelope />
                <div>
                  <strong>E-mail de Suporte</strong>
                  <a href="mailto:vemagendar@gmail.com">suporte@vemagendar.com</a>
                </div>
              </div>

              <div className="contact-item">
                <FaPhone />
                <div>
                  <strong>Telefone de Atendimento</strong>
                  <a href="tel:+5511999999999">(11) 99999-9999</a>
                </div>
              </div>

              <div className="contact-item">
                <FaLocationDot />
                <div>
                  <strong>Localização</strong>
                  <span>Santa Maria, RS - Brasil</span>
                </div>
              </div>
            </div>

            {/* COLUNA DO FORMULÁRIO */}
            <div className="contact-form-card">
              <h3>Envie sua Mensagem</h3>
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label htmlFor="nome" className="form-label">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    E-mail
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Seu melhor e-mail para contato"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="mensagem" className="form-label">
                    Mensagem
                  </label>
                  <textarea
                    className="form-control"
                    id="mensagem"
                    name="mensagem"
                    rows={6}
                    value={formData.mensagem}
                    onChange={handleChange}
                    placeholder="Descreva sua dúvida, sugestão ou problema..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="fa-spin" /> Enviando...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Enviar Mensagem
                    </>
                  )}
                </button>

                {currentStatus && (
                  <div className={`status-message ${currentStatus.className}`}>
                    {currentStatus.icon} {currentStatus.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contato;