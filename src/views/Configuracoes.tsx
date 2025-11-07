import { useState, useEffect } from "react";
import { FaSpinner, FaCopy, FaCheck, FaExclamation, FaCrown } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import axios from "axios";
import { PerfilUsuario } from "../interfaces/PerfilUsuario.tsx";

const SettingsView = () => {
  const [settings, setSettings] = useState<PerfilUsuario>({
    id: 0,
    usuario: { id: 0, first_name: "", email: "", username: "", password: "" },
    codigo_afiliado: "",
    codigo_usado: "",
    receive_email_notifications: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [copyStatus, setCopyStatus] = useState<"copied" | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) {
        console.error("Token de autenticação não encontrado");
        setIsLoading(false);
        setSubmitStatus("error");
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`${baseURL}/api/perfil-usuario/me/`, {
          params: { usuario_token: token },
        });

        setSettings({
          id: response.data.id ?? 0,
          usuario: response.data.usuario ?? { id: 0, first_name: "", email: "", username: "", password: "" },
          codigo_afiliado: response.data.codigo_afiliado ?? "",
          codigo_usado: response.data.codigo_usado ?? "",
          receive_email_notifications: response.data.receive_email_notifications ?? false,
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
        setSubmitStatus("error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [token, baseURL]);

  const handleToggleEmailNotifications = () => {
    setSettings(prev => ({
      ...prev,
      receive_email_notifications: !prev.receive_email_notifications,
    }));
  };

  const handleGenerateAffiliateCode = async () => {
    if (!token) return setSubmitStatus("error");

    setIsGenerating(true);
    setSubmitStatus(null);
    try {
      const response = await axios.post(
        `${baseURL}/api/perfil-usuario/affiliate-code/`,
        { usuario_token: token },
      );
      setSettings(prev => ({
        ...prev,
        codigo_afiliado: response.data.codigo_afiliado ?? "",
      }));
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error("Error generating affiliate code:", error);
      setSubmitStatus("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (settings.codigo_afiliado) {
      navigator.clipboard.writeText(settings.codigo_afiliado);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus(null), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setSubmitStatus("error");

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await axios.patch(
        `${baseURL}/api/perfil-usuario/settings/`,
        {
          usuario_token: token,
          receive_email_notifications: settings.receive_email_notifications,
        },
      );
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="settings-container min-h-screen">
        <style>{`
          :root {
            --primary: #003087;
            --primary-dark: #00205b;
            --accent: #f6c107;
            --success: #28a745;
            --danger: #dc3545;
            --warning: #fd7e14;
            --info: #0056b3;
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

          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          @keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }

          .hero-gradient {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 4rem 0 3rem;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .hero-gradient::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 20% 80%, rgba(246,193,7,0.15), transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1), transparent 50%);
            pointer-events: none;
          }
          .hero-gradient h1 {
            font-size: 3rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            animation: fadeInUp 0.8s ease-out;
          }
          .hero-gradient .lead {
            font-size: 1.25rem;
            max-width: 800px;
            margin: 1rem auto 0;
            opacity: 0.95;
            animation: fadeInUp 0.8s ease-out 0.2s both;
          }

          .settings-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 3rem 1rem;
          }

          .card {
            background: white;
            border-radius: var(--radius);
            padding: 2.5rem;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--gray-200);
            margin-bottom: 2rem;
            animation: fadeInUp 0.6s ease-out;
          }
          .card h3 {
            color: var(--primary);
            font-weight: 700;
            font-size: 1.6rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid var(--gray-200);
          }

          .toggle-group {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.25rem 0;
          }
          .toggle-label {
            font-weight: 600;
            color: #212529;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          .toggle-switch {
            position: relative;
            width: 56px;
            height: 32px;
          }
          .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #ccc;
            transition: var(--transition);
            border-radius: 34px;
          }
          .slider:before {
            position: absolute;
            content: "";
            height: 24px;
            width: 24px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: var(--transition);
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          input:checked + .slider {
            background-color: var(--success);
          }
          input:checked + .slider:before {
            transform: translateX(24px);
          }

          .affiliate-section {
            padding: 2rem;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 16px;
            border: 1px dashed var(--primary);
            text-align: center;
          }
          .affiliate-section p {
            color: var(--gray-600);
            margin-bottom: 1.5rem;
            font-size: 0.98rem;
          }
          .code-display {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            background: white;
            border: 2px solid var(--primary);
            border-radius: 14px;
            padding: 1rem 1.5rem;
            font-weight: 700;
            font-size: 1.3rem;
            color: var(--primary);
            margin-bottom: 1.5rem;
            box-shadow: var(--shadow-sm);
          }
          .code-display span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 280px;
          }
          .copy-btn {
            background: var(--info);
            color: white;
            border: none;
            padding: 0.6rem 1.2rem;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: var(--transition);
          }
          .copy-btn:hover {
            background: var(--primary);
            transform: translateY(-2px);
          }
          .generate-btn {
            background: var(--warning);
            color: #212529;
            border: none;
            padding: 0.9rem 2rem;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            width: 100%;
            transition: var(--transition);
          }
          .generate-btn:hover:not(:disabled) {
            background: #e07412;
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(253, 126, 20, 0.4);
          }
          .generate-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            opacity: 0.8;
          }

          .submit-btn {
            background: linear-gradient(135deg, var(--primary), var(--info));
            color: white;
            border: none;
            padding: 1.1rem 3rem;
            border-radius: 14px;
            font-weight: 700;
            font-size: 1.15rem;
            width: 100%;
            max-width: 360px;
            margin: 2rem auto 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            transition: var(--transition);
            box-shadow: 0 6px 16px rgba(0, 48, 135, 0.25);
          }
          .submit-btn:hover:not(:disabled) {
            background: linear-gradient(135deg, var(--info), var(--primary));
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 48, 135, 0.35);
          }
          .submit-btn:disabled {
            background: #d1d5db;
            color: var(--gray-600);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .status-message {
            margin-top: 1.5rem;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            animation: fadeInUp 0.4s ease-out;
          }
          .status-success {
            background: rgba(40, 167, 69, 0.1);
            color: var(--success);
            border: 1px solid var(--success);
          }
          .status-error {
            background: rgba(220, 53, 69, 0.1);
            color: var(--danger);
            border: 1px solid var(--danger);
          }

          .loading-state {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--gray-600);
          }
          .spinner {
            animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }

          @media (max-width: 768px) {
            .hero-gradient h1 { font-size: 2.2rem; }
            .settings-content { padding: 2rem 1rem; }
            .card { padding: 2rem 1.5rem; }
            .code-display { font-size: 1.1rem; flex-direction: column; }
            .copy-btn { width: 100%; justify-content: center; }
            .submit-btn { font-size: 1.05rem; padding: 1rem 2.5rem; }
          }
        `}</style>

        {/* HERO */}
        <header className="hero-gradient">
          <div className="container">
            <h1>Configurações</h1>
            <p className="lead">
              Personalize suas preferências, gerencie notificações e ative seu programa de afiliados.
            </p>
          </div>
        </header>

        <section className="container settings-content">
          {isLoading ? (
            <div className="loading-state">
              <FaSpinner className="spinner" size={40} />
              <p className="mt-3">Carregando suas configurações...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* NOTIFICAÇÕES */}
              <div className="card">
                <h3>Notificações por E-mail</h3>
                <div className="toggle-group">
                  <label htmlFor="email-toggle" className="toggle-label">
                    Receber alertas de agendamentos
                  </label>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      id="email-toggle"
                      checked={settings.receive_email_notifications}
                      onChange={handleToggleEmailNotifications}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              {/* AFILIADOS */}
              <div className="card">
                <h3>Programa de Afiliados</h3>
                <div className="affiliate-section">
                  <p>
                    Ganhe com indicações! Compartilhe seu código único e receba benefícios a cada novo cadastro.
                  </p>

                  <div className="code-display">
                    <span>{settings.codigo_afiliado || "Nenhum código gerado"}</span>
                    {settings.codigo_afiliado && (
                      <button type="button" className="copy-btn" onClick={handleCopyCode}>
                        {copyStatus === "copied" ? <FaCheck /> : <FaCopy />} {copyStatus === "copied" ? "Copiado!" : "Copiar"}
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    className="generate-btn"
                    onClick={handleGenerateAffiliateCode}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <FaSpinner className="spinner" />
                    ) : (
                      <>
                        <FaCrown /> Gerar Novo Código
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* SALVAR */}
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? <FaSpinner className="spinner" /> : "Salvar Alterações"}
              </button>

              {/* STATUS */}
              {submitStatus === "success" && (
                <div className="status-message status-success">
                  <FaCheck /> Configurações salvas com sucesso!
                </div>
              )}
              {submitStatus === "error" && (
                <div className="status-message status-error">
                  <FaExclamation /> Erro ao salvar. Tente novamente.
                </div>
              )}
            </form>
          )}
        </section>
      </div>
    </>
  );
};

export default SettingsView;