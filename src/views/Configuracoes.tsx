import { useState, useEffect } from "react";
import { FaSpinner, FaEnvelope, FaLink, FaGear, FaCopy } from "react-icons/fa6"; // Alterado para Fa6
import {FaCheckCircle, FaExclamationCircle} from "react-icons/fa";
import Navbar from "../components/Navbar";
import axios from "axios";
import { PerfilUsuario} from "../interfaces/PerfilUsuario.tsx";

const SettingsView = () => {
  const [settings, setSettings] = useState<PerfilUsuario>({
    id: 0,
    usuario: {
      id: 0,
      first_name: "",
      email: "",
      username: "",
      password: ""
    },
    codigo_afiliado: "",
    codigo_usado: "",
    receive_email_notifications: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [copyStatus, setCopyStatus] = useState<"copied" | null>(null);

  const baseURL = import.meta.env.VITE_API_URL;
  // Sugestão: Use uma função para obter o token para maior modularidade e segurança
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
          params: { usuario_token: token }, // Mantendo seu método atual de autenticação
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
    setSettings((prev : PerfilUsuario) => ({
      ...prev,
      receive_email_notifications: !prev.receive_email_notifications,
    }));
  };

  const handleGenerateAffiliateCode = async () => {
    if (!token) {
      console.error("Token de autenticação não encontrado");
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await axios.post(
        `${baseURL}/api/perfil-usuario/affiliate-code/`,
        { usuario_token: token },
      );
      setSettings((prev: PerfilUsuario) => ({
        ...prev,
        codigo_afiliado: response.data.codigo_afiliado ?? "",
      }));
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error("Error generating affiliate code:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
      if (settings.codigo_afiliado) {
          navigator.clipboard.writeText(settings.codigo_afiliado);
          setCopyStatus("copied");
          setTimeout(() => setCopyStatus(null), 2000);
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      console.error("Token de autenticação não encontrado");
      setSubmitStatus("error");
      return;
    }

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
          /* Variaveis e Layout Base */
          :root {
            --primary-blue: #003087;
            --accent-blue: #0056b3;
            --dark-gray: #212529;
            --medium-gray: #6c757d;
            --light-gray-bg: #f5f7fa;
            --white: #ffffff;
            --success-green: #28a745;
            --danger-red: #dc3545;
            --warning-orange: #fd7e14;
          }

          .settings-container {
            background-color: var(--light-gray-bg);
            padding-top: 80px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start; /* Alinha ao topo para evitar gap visual */
            width: 100%;
            padding: 4rem 1rem;
          }

          /* Card Principal */
          .settings-container .settings-card {
            background-color: var(--white);
            border: 1px solid rgba(0, 48, 135, 0.05);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 3rem;
            max-width: 760px;
            width: 100%;
            text-align: center;
          }

          .settings-container .settings-card h2 {
            color: var(--dark-gray);
            font-weight: 800;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            letter-spacing: -0.04em;
          }
          .settings-container .settings-card h2 svg {
              color: var(--primary-blue);
              font-size: 2.75rem;
          }

          /* Seções de Configuração */
          .settings-container .settings-section {
            background-color: var(--white);
            border: 1px solid #e0e0e0;
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 2.5rem;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
            text-align: left;
          }
          .settings-container .settings-section h3 {
              color: var(--accent-blue);
              font-size: 1.5rem;
              font-weight: 700;
              margin-bottom: 1.5rem;
              display: flex;
              align-items: center;
              gap: 0.75rem;
              border-bottom: 2px solid var(--light-gray-bg);
              padding-bottom: 0.75rem;
          }

          /* Toggle para Email */
          .settings-container .toggle-group {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 1rem 0;
          }
          .settings-container .toggle-group label {
            color: var(--dark-gray);
            font-size: 1.15rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          .settings-container .toggle-switch {
            width: 50px;
            height: 28px;
          }
          .settings-container .slider {
            border-radius: 34px;
            background-color: #ccc;
          }
          .settings-container .slider:before {
            height: 20px;
            width: 20px;
            left: 4px;
            bottom: 4px;
          }
          .settings-container input:checked + .slider {
            background-color: var(--success-green); /* Verde para 'Ativado' */
          }
          .settings-container input:checked + .slider:before {
            transform: translateX(22px);
          }

          /* Seção de Afiliado */
          .affiliate-group {
              margin-top: 1.5rem;
              padding-top: 1.5rem;
              border-top: 1px dashed #e0e0e0;
          }
          .affiliate-group p {
              color: var(--medium-gray);
              margin-bottom: 1rem;
              font-size: 0.95rem;
          }
          .affiliate-code-display {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: var(--light-gray-bg);
            border: 2px solid var(--primary-blue);
            border-radius: 12px;
            padding: 0.75rem 1.25rem;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--primary-blue);
            margin-bottom: 1.5rem;
            overflow: hidden;
          }
          .affiliate-code-display span {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
          }
          .copy-btn {
              background-color: var(--accent-blue);
              color: var(--white);
              padding: 0.5rem 1rem;
              border-radius: 8px;
              font-weight: 600;
              font-size: 0.9rem;
              transition: background-color 0.3s ease;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              flex-shrink: 0;
          }
          .copy-btn:hover {
              background-color: var(--primary-blue);
          }
          .generate-btn {
              background-color: var(--warning-orange);
              color: var(--dark-gray);
              font-weight: 700;
              padding: 0.75rem 1.5rem;
              border-radius: 10px;
              transition: all 0.3s ease;
          }
          .generate-btn:hover {
              background-color: #e07412;
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(253, 126, 20, 0.4);
          }
          .generate-btn:disabled {
              background-color: #ccc;
              color: var(--dark-gray);
              cursor: not-allowed;
              opacity: 0.8;
          }

          /* Botão de Salvar */
          .settings-container .submit-btn {
            background: linear-gradient(135deg, var(--primary-blue), var(--accent-blue));
            color: var(--white);
            padding: 1rem 3rem;
            border-radius: 12px;
            font-size: 1.2rem;
            font-weight: 700;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            width: 100%;
            max-width: 320px;
            margin-top: 1rem;
            box-shadow: 0 6px 16px rgba(0, 48, 135, 0.25);
          }
          .settings-container .submit-btn:hover {
            background: linear-gradient(135deg, var(--accent-blue), var(--primary-blue));
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 48, 135, 0.35);
          }
          .settings-container .submit-btn:disabled {
            background: #d1d5db;
            color: var(--dark-gray);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          /* Mensagens de Status */
          .settings-container .message {
            font-size: 1.1rem;
            padding: 1rem;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            font-weight: 600;
            margin-top: 1.5rem;
            max-width: 500px;
            width: 100%;
            margin-left: auto;
            margin-right: auto;
          }
          .settings-container .message.success {
            color: var(--success-green);
            background-color: rgba(40, 167, 69, 0.1);
            border: 1px solid var(--success-green);
          }
          .settings-container .message.error {
            color: var(--danger-red);
            background-color: rgba(220, 53, 69, 0.1);
            border: 1px solid var(--danger-red);
          }
          .settings-container .message.loading {
            color: var(--dark-gray);
            background-color: var(--white);
            border: 1px solid var(--dark-gray);
          }
          
          /* Responsividade */
          @media (max-width: 768px) {
            .settings-container {
              padding: 2rem 1rem;
            }
            .settings-container .settings-card {
              padding: 2rem 1.5rem;
              border-radius: 16px;
            }
            .settings-container .settings-card h2 {
              font-size: 2rem;
              margin-bottom: 2rem;
            }
            .settings-container .settings-section {
              padding: 1.5rem;
            }
            .settings-container .toggle-group label {
              font-size: 1rem;
            }
            .affiliate-code-display {
                font-size: 1.1rem;
                padding: 0.6rem 1rem;
            }
            .copy-btn {
                font-size: 0.8rem;
                padding: 0.4rem 0.8rem;
            }
            .settings-container .submit-btn {
              font-size: 1.1rem;
              padding: 0.8rem 2.5rem;
              max-width: 280px;
            }
          }
        `}</style>
        <section className="settings-card" aria-labelledby="settings-title">
          {isLoading ? (
            <div className="message loading">
              <FaSpinner className="fa-spin text-xl" aria-hidden="true" /> Carregando configurações...
            </div>
          ) : (
            <>
              <h2 id="settings-title">
                <FaGear aria-hidden="true" /> Configurações de Usuário
              </h2>
              <form onSubmit={handleSubmit} aria-label="Formulário de configurações">

                {/* 1. SEÇÃO DE NOTIFICAÇÕES */}
                <div className="settings-section">
                    <h3><FaEnvelope /> Notificações</h3>
                    <div className="toggle-group">
                        <label htmlFor="email-notifications" className="cursor-pointer">
                            Receber e-mails de agendamentos
                        </label>
                        <div className="toggle-switch">
                            <input
                            type="checkbox"
                            id="email-notifications"
                            checked={settings.receive_email_notifications}
                            onChange={handleToggleEmailNotifications}
                            aria-label="Ativar/desativar e-mails de agendamentos"
                            />
                            <span className="slider"></span>
                        </div>
                    </div>
                </div>

                {/* 2. SEÇÃO DE AFILIADO */}
                <div className="settings-section affiliate-group">
                    <h3><FaLink /> Programa de Afiliados</h3>
                    <p>Compartilhe seu código de afiliado para que novos usuários usem e ganhem benefícios.</p>

                    <div className="affiliate-code-display" id="affiliate-code">
                        <span>{settings.codigo_afiliado || "Nenhum código gerado"}</span>
                        {settings.codigo_afiliado && (
                            <button
                                type="button"
                                className="copy-btn"
                                onClick={handleCopyCode}
                                aria-label="Copiar código de afiliado"
                            >
                                <FaCopy /> {copyStatus === "copied" ? "Copiado!" : "Copiar"}
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        className="settings-btn generate-btn"
                        onClick={handleGenerateAffiliateCode}
                        disabled={isSubmitting}
                        aria-label="Gerar novo código de afiliado"
                    >
                        {isSubmitting ? (
                            <FaSpinner className="fa-spin inline mr-2 text-xl" aria-hidden="true" />
                        ) : (
                            "Gerar/Renovar Código"
                        )}
                    </button>
                </div>

                {/* BOTÃO DE SUBMIT PRINCIPAL */}
                <button
                  type="submit"
                  className="settings-btn submit-btn"
                  disabled={isSubmitting}
                  aria-label="Salvar configurações"
                >
                  {isSubmitting ? (
                    <FaSpinner className="fa-spin inline mr-2 text-xl" aria-hidden="true" />
                  ) : (
                    "Salvar Configurações"
                  )}
                </button>
              </form>

              {/* Mensagens de Status */}
              {submitStatus === "success" && (
                <div className="message success">
                  <FaCheckCircle className="text-xl" aria-hidden="true" /> Configurações salvas com sucesso!
                </div>
              )}
              {submitStatus === "error" && (
                <div className="message error">
                  <FaExclamationCircle className="text-xl" aria-hidden="true" /> Erro ao salvar configurações. Tente novamente.
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default SettingsView;