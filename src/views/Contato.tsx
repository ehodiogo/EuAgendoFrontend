import Navbar from "../components/Navbar";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useState, ChangeEvent, FormEvent } from "react";

function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Enviando:", formData);
    setStatus("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({ nome: "", email: "", mensagem: "" });
    setTimeout(() => setStatus(""), 5000);
  };

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
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Seções */
        .custom-section {
          padding: 4rem 0;
        }
        .custom-section h1 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2.75rem;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .custom-section p.lead {
          color: var(--dark-gray);
          font-size: 1.25rem;
          max-width: 700px;
          margin: 0 auto 2rem;
        }

        /* Layout principal */
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-top: 2rem;
        }
        .contact-info-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          height: fit-content;
        }
        .contact-info-card h3 {
          color: var(--primary-blue);
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: var(--light-gray);
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }
        .contact-item:hover {
          background-color: rgba(77, 171, 247, 0.1);
        }
        .contact-item svg {
          color: var(--light-blue);
          flex-shrink: 0;
        }
        .contact-item a {
          color: var(--dark-gray);
          text-decoration: none;
          font-weight: 500;
        }
        .contact-item a:hover {
          color: var(--primary-blue);
        }

        /* Formulário */
        .contact-form-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }
        .contact-form-card h3 {
          color: var(--primary-blue);
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .form-control {
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 0.75rem 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-control:focus {
          border-color: var(--light-blue);
          box-shadow: 0 0 0 0.2rem rgba(77, 171, 247, 0.25);
        }
        .form-label {
          color: var(--dark-gray);
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .submit-btn {
          background-color: var(--accent-yellow);
          color: var(--dark-gray);
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          border: none;
          width: 100%;
        }
        .submit-btn:hover {
          background-color: #e0a800;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .status-message {
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          text-align: center;
          font-weight: 500;
        }
        .status-success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        /* Responsividade */
        @media (max-width: 991px) {
          .contact-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .custom-section {
            padding: 2rem 0;
          }
        }
        @media (max-width: 576px) {
          .custom-section h1 {
            font-size: 2rem;
          }
          .custom-section p.lead {
            font-size: 1.1rem;
          }
          .contact-info-card, .contact-form-card {
            padding: 1.5rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />

        <div className="container custom-section">
          <section className="text-center">
            <h1>Fale Conosco</h1>
            <p className="lead">
              Tem alguma dúvida ou sugestão? Estamos aqui para ajudar! Entre em contato conosco pelo formulário ao lado ou pelas informações abaixo.
            </p>
          </section>

          <div className="contact-layout">
            <div className="contact-info-card">
              <h3><FaEnvelope size={20} /> Informações de Contato</h3>
              <div className="contact-item">
                <FaEnvelope size={24} />
                <div>
                  <strong>E-mail:</strong>
                  <a href="mailto:vemagendar@gmail.com">vemagendar@gmail.com</a>
                </div>
              </div>
              <div className="contact-item">
                <FaPhone size={24} />
                <div>
                  <strong>Telefone:</strong>
                  <a href="tel:+5511999999999">(11) 99999-9999</a>
                </div>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt size={24} />
                <div>
                  <strong>Endereço:</strong>
                  <a href="https://maps.google.com/?q=São+Paulo,+SP" target="_blank" rel="noopener noreferrer">São Paulo, SP - Brasil</a>
                </div>
              </div>
            </div>

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
                    placeholder="Digite seu nome completo"
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
                    placeholder="Digite seu e-mail"
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
                    rows={5}
                    value={formData.mensagem}
                    onChange={handleChange}
                    placeholder="Digite sua mensagem aqui..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn fw-semibold">
                  Enviar Mensagem
                </button>
                {status && (
                  <div className={`status-message status-success`}>{status}</div>
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