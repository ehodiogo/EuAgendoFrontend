import Navbar from "../components/Navbar";
import { FaEnvelope, FaPhone, FaLocationDot, FaPaperPlane, FaCircleCheck, FaSpinner, FaCircleXmark, FaHeadset, FaClock, FaCheck } from "react-icons/fa6";
import { useState, ChangeEvent, FormEvent } from "react";

type ChangeType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });

  const [status, setStatus] = useState<"success" | "error" | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeType) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    const baseUrl = import.meta.env.VITE_API_URL;
    const endpoint = `${baseUrl}/api/contato/enviar/`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ nome: "", email: "", mensagem: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus(""), 6000);
    }
  };

  const getStatusMessage = () => {
    if (status === "success") {
      return {
        message: "Mensagem enviada com sucesso! Entraremos em contato em até 2h.",
        className: "status-success",
        icon: <FaCircleCheck size={20} className="me-2" />
      };
    }
    if (status === "error") {
      return {
        message: "Erro ao enviar. Verifique sua conexão e tente novamente.",
        className: "status-error",
        icon: <FaCircleXmark size={20} className="me-2" />
      };
    }
    return null;
  };

  const currentStatus = getStatusMessage();

  return (
    <div className="min-vh-100">
      <style>{`
        :root {
          --primary: #003087;
          --primary-dark: #00205b;
          --accent: #f6c107;
          --success: #28a745;
          --danger: #dc3545;
          --gray-100: #f8f9fa;
          --gray-200: #e9ecef;
          --gray-600: #6c757d;
          --white: #ffffff;
          --shadow-sm: 0 4px 12px rgba(0,0,0,0.08);
          --shadow-md: 0 8px 25px rgba(0,0,0,0.15);
          --shadow-lg: 0 15px 40px rgba(0,0,0,0.25);
          --radius: 20px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }

        .hero-gradient {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          position: relative;
          overflow: hidden;
          color: white;
        }
        .hero-gradient::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(246,193,7,0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .btn-cta-primary {
          background: var(--accent);
          color: #212529;
          font-weight: 700;
          padding: 1rem 2.8rem;
          border-radius: 14px;
          font-size: 1.15rem;
          border: none;
          box-shadow: 0 6px 20px rgba(246, 193, 7, 0.4);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }
        .btn-cta-primary::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 0; height: 0;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .btn-cta-primary:hover::after {
          width: 300px; height: 300px;
        }
        .btn-cta-primary:hover {
          background: #e0a800;
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(246, 193, 7, 0.5);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .contact-card {
          background: white;
          border-radius: var(--radius);
          padding: 2.5rem;
          box-shadow: var(--shadow-md);
          border-top: 6px solid var(--primary);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }
        .contact-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          padding: 1.5rem;
          background: var(--gray-100);
          border-radius: 16px;
          margin-bottom: 1.5rem;
          transition: var(--transition);
          border-left: 5px solid var(--primary);
        }
        .contact-item:hover {
          background: rgba(0, 48, 135, 0.05);
          transform: translateX(4px);
        }
        .contact-item svg {
          color: var(--primary);
          font-size: 1.6rem;
          margin-top: 0.2rem;
          flex-shrink: 0;
        }
        .contact-item strong {
          color: var(--gray-600);
          font-weight: 700;
          font-size: 1.1rem;
        }
        .contact-item a, .contact-item span {
          color: var(--gray-600);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }
        .contact-item a:hover {
          color: var(--primary);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-label {
          color: var(--gray-600);
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: 1rem;
        }
        .form-control {
          border: 1px solid var(--gray-200);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          transition: var(--transition);
        }
        .form-control:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(0, 48, 135, 0.15);
          outline: none;
        }
        .form-control::placeholder {
          color: #9ca3af;
        }

        .submit-btn {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          font-weight: 700;
          padding: 1.1rem;
          border-radius: 14px;
          border: none;
          font-size: 1.1rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 6px 20px rgba(0, 48, 135, 0.3);
          transition: var(--transition);
          margin-top: 1rem;
        }
        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--primary-dark), var(--primary));
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 48, 135, 0.4);
        }
        .submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .status-message {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-top: 1.5rem;
          text-align: center;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          animation: fadeInUp 0.4s ease-out;
          border: 1px solid transparent;
        }
        .status-success {
          background: #d1e7dd;
          color: var(--success);
          border-color: #badbcc;
        }
        .status-error {
          background: #f8d7da;
          color: var(--danger);
          border-color: #f5c2c7;
        }

        .support-stats {
          display: flex;
          justify-content: space-around;
          margin: 3rem 0;
          flex-wrap: wrap;
          gap: 2rem;
        }
        .stat-item {
          text-align: center;
          flex: 1;
          min-width: 180px;
        }
        .stat-number {
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--primary);
          line-height: 1;
        }
        .stat-label {
          color: var(--gray-600);
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .final-cta {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 5rem 0;
          text-align: center;
        }
        .final-cta h3 {
          font-size: 2.3rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 1rem;
        }

        @media (max-width: 991px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .hero-gradient h1 {
            font-size: 2.5rem;
          }
        }
        @media (max-width: 576px) {
          .contact-card {
            padding: 2rem 1.5rem;
          }
          .contact-item {
            padding: 1rem;
            gap: 1rem;
          }
          .stat-number {
            font-size: 2.2rem;
          }
        }
      `}</style>

      <div className="bg-light">
        <Navbar />

        {/* HERO */}
        <header className="hero-gradient text-white py-5">
          <div className="container py-5 text-center">
            <div className="row align-items-center g-5">
              <div className="col-lg-8 animate-fadeInUp">
                <h1 className="display-4 fw-bold mb-4">
                  <FaHeadset className="me-3" />
                  Suporte Imediato
                </h1>
                <p className="lead mb-4 opacity-90 fs-5">
                  Resposta em <strong>média de 2 horas</strong>.
                  Estamos aqui para ajudar seu negócio a crescer.
                </p>
                <button className="btn-cta-primary d-inline-flex align-items-center">
                  Falar com Suporte <FaPaperPlane className="ms-2" />
                </button>
              </div>
              <div className="col-lg-4 text-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-4 p-4 shadow-lg">
                  <h3 className="fw-bold mb-2">Alta taxa</h3>
                  <p className="mb-0 opacity-90">de satisfação</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ESTATÍSTICAS */}
        <section className="py-4 bg-white">
          <div className="container">
            <div className="support-stats">
              <div className="stat-item animate-fadeInUp">
                <div className="stat-number">2h</div>
                <div className="stat-label">Tempo médio de resposta</div>
              </div>
              <div className="stat-item animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                <div className="stat-number">24/7</div>
                <div className="stat-label">Suporte disponível</div>
              </div>
              <div className="stat-item animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <div className="stat-number">Inúmeros</div>
                <div className="stat-label">Clientes atendidos</div>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULÁRIO + CONTATO */}
        <section className="py-5">
          <div className="container">
            <div className="contact-grid">
              {/* INFORMAÇÕES */}
              <div className="contact-card animate-fadeInUp">
                <h3 className="fw-bold mb-4">Canais de Atendimento</h3>

                <div className="contact-item">
                  <FaEnvelope />
                  <div>
                    <strong>E-mail</strong>
                    <a href="mailto:vemagendar@gmail.com">vemagendar@gmail.com</a>
                  </div>
                </div>

                <div className="contact-item">
                  <FaPhone />
                  <div>
                    <strong>Telefone</strong>
                    <a href="tel:+5555996995573">(55) 99699-5573</a>
                    <small className="d-block text-muted">Seg-Sex: 8h-18h</small>
                  </div>
                </div>

                <div className="contact-item">
                  <FaLocationDot />
                  <div>
                    <strong>Endereço</strong>
                    <span>Santa Maria, RS - Brasil</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-primary text-white rounded-3">
                  <FaClock className="me-2" />
                  <strong>Horário de Atendimento:</strong><br />
                  Segunda a Sexta: 8h às 18h
                </div>
              </div>

              {/* FORMULÁRIO */}
              <div className="contact-card animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <h3 className="fw-bold mb-4">Envie sua Mensagem</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Nome Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Seu nome"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">E-mail</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mensagem</label>
                    <textarea
                      className="form-control"
                      name="mensagem"
                      rows={5}
                      value={formData.mensagem}
                      onChange={handleChange}
                      placeholder="Como podemos ajudar?"
                      required
                    />
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
        </section>

        {/* FINAL CTA */}
        <section className="final-cta">
          <div className="container">
            <h3>Pronto para começar?</h3>
            <p className="text-muted lead mb-4">
              Teste grátis por 7 dias. Teste grátis SEM cartão. Cancele quando quiser.
            </p>
            <button className="btn-cta-primary d-inline-flex align-items-center">
              Teste Grátis Agora <FaCheck className="ms-2" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contato;