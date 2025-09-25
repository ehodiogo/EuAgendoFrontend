import { useState, useEffect } from "react";
import { FaSpinner, FaExclamationCircle, FaCheckCircle, FaEnvelope, FaLink } from "react-icons/fa";
import Navbar from "../components/Navbar";
import axios from "axios";

interface UserSettings {
  receiveEmailNotifications: boolean;
  affiliateCode: string;
}

const SettingsView = () => {
  const [settings, setSettings] = useState<UserSettings>({
    receiveEmailNotifications: false,
    affiliateCode: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const baseURL = window.location.origin.includes("localhost")
    ? "http://localhost:8000/"
    : "https://backend-production-7438.up.railway.app/";

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseURL}api/user/settings`);
        setSettings({
          receiveEmailNotifications: response.data.receiveEmailNotifications ?? false,
          affiliateCode: response.data.affiliateCode ?? "",
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
        setSubmitStatus("error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggleEmailNotifications = () => {
    setSettings((prev) => ({
      ...prev,
      receiveEmailNotifications: !prev.receiveEmailNotifications,
    }));
  };

  const handleGenerateAffiliateCode = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await axios.post(`${baseURL}api/user/affiliate-code`, {});
      setSettings((prev) => ({
        ...prev,
        affiliateCode: response.data.affiliateCode,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await axios.patch(`${baseURL}api/user/settings`, {
        receiveEmailNotifications: settings.receiveEmailNotifications,
      });
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
      <div className="settings-container min-h-screen bg-gradient-to-b from-light-gray via-white to-light-blue/10 flex items-center justify-center py-14">
        <style>{`
          :root {
            --primary-blue: #003087;
            --light-blue: #4dabf7;
            --dark-gray: #2d3748;
            --light-gray: #f7fafc;
            --white: #ffffff;
            --success-green: #28a745;
            --danger-red: #dc3545;
            --warning-orange: #fd7e14;
          }

          .settings-container {
            padding-top: 80px; /* Adjust for navbar height */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 3rem 1rem;
          }

          .settings-container .settings-card {
            background-color: var(--white);
            border: 1px solid rgba(0, 48, 135, 0.08);
            border-radius: 24px;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.07);
            padding: 3.5rem;
            max-width: 720px;
            width: 100%;
            text-align: center;
            transition: transform 0.4s ease, box-shadow 0.4s ease;
          }
          .settings-container .settings-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
          }

          .settings-container .settings-card h2 {
            color: var(--primary-blue);
            font-weight: 800;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            font-family: 'Inter', sans-serif;
            letter-spacing: -0.03em;
          }

          .settings-container .settings-section {
            background-color: var(--light-gray);
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 3rem;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.04);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }

          .settings-container .settings-section label {
            color: var(--dark-gray);
            font-size: 1.2rem;
            font-family: 'Inter', sans-serif;
            line-height: 1.7;
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .settings-container .toggle-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
          }
          .settings-container .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .settings-container .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: 0.4s;
            border-radius: 34px;
          }
          .settings-container .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: var(--white);
            transition: 0.4s;
            border-radius: 50%;
          }
          .settings-container input:checked + .slider {
            background-color: var(--primary-blue);
          }
          .settings-container input:checked + .slider:before {
            transform: translateX(26px);
          }
          .settings-container .toggle-switch input:focus + .slider {
            box-shadow: 0 0 8px rgba(0, 48, 135, 0.3);
          }

          .settings-container .affiliate-code {
            background-color: var(--white);
            border: 1px solid var(--light-blue);
            border-radius: 14px;
            padding: 1rem;
            font-size: 1.2rem;
            color: var(--dark-gray);
            width: 100%;
            max-width: 300px;
            text-align: center;
            font-family: 'Inter', sans-serif;
          }

          .settings-container .settings-btn {
            background: linear-gradient(135deg, var(--primary-blue), #0053a0);
            color: var(--white);
            padding: 1.1rem 3rem;
            border-radius: 14px;
            font-size: 1.25rem;
            font-weight: 700;
            font-family: 'Inter', sans-serif;
            transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            width: 100%;
            max-width: 360px;
            margin: 0 auto;
            box-shadow: 0 6px 16px rgba(0, 48, 135, 0.25);
          }
          .settings-container .settings-btn:hover {
            background: linear-gradient(135deg, #002070, #003f87);
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0, 48, 135, 0.35);
          }
          .settings-container .settings-btn:disabled {
            background: #d1d5db;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
            animation: pulse 1.8s infinite;
          }
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.65; }
            100% { opacity: 1; }
          }

          .settings-container .message {
            font-size: 1.2rem;
            padding: 1.75rem;
            border-radius: 14px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            background-color: var(--white);
            font-family: 'Inter', sans-serif;
            margin-top: 2.5rem;
            max-width: 560px;
            width: 100%;
            opacity: 0;
            transform: translateY(10px);
            animation: fadeIn 0.5s ease forwards;
          }
          .settings-container .message.success {
            color: var(--success-green);
            border: 2px solid var(--success-green);
          }
          .settings-container .message.error {
            color: var(--danger-red);
            border: 2px solid var(--danger-red);
          }
          .settings-container .message.loading {
            color: var(--dark-gray);
            border: 2px solid var(--dark-gray);
          }
          @keyframes fadeIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            .settings-container {
              padding: 2.5rem 1rem;
            }
            .settings-container .settings-card {
              padding: 2.5rem;
            }
            .settings-container .settings-card h2 {
              font-size: 2.25rem;
            }
            .settings-container .settings-section {
              padding: 1.75rem;
            }
            .settings-container .settings-section label {
              font-size: 1.1rem;
            }
            .settings-container .affiliate-code {
              font-size: 1.1rem;
              max-width: 250px;
            }
            .settings-container .settings-btn {
              font-size: 1.15rem;
              padding: 1rem 2.5rem;
              max-width: 320px;
            }
            .settings-container .message {
              font-size: 1.1rem;
              padding: 1.5rem;
            }
          }
          @media (max-width: 576px) {
            .settings-container {
              padding: 2rem 0.75rem;
            }
            .settings-container .settings-card {
              padding: 2rem;
            }
            .settings-container .settings-card h2 {
              font-size: 1.875rem;
            }
            .settings-container .settings-section {
              padding: 1.5rem;
            }
            .settings-container .settings-section label {
              font-size: 1rem;
            }
            .settings-container .affiliate-code {
              font-size: 1rem;
              max-width: 200px;
            }
            .settings-container .settings-btn {
              font-size: 1.05rem;
              padding: 0.875rem 2rem;
              max-width: 280px;
            }
            .settings-container .message {
              font-size: 1rem;
              padding: 1.25rem;
              max-width: 100%;
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
                <FaEnvelope className="text-warning-orange text-4xl" aria-hidden="true" /> Configurações
              </h2>
              <form onSubmit={handleSubmit} aria-label="Formulário de configurações">
                <div className="settings-section">
                  <label htmlFor="email-notifications" className="cursor-pointer">
                    <FaEnvelope className="text-primary-blue" />
                    Receber e-mails de agendamentos
                    <div className="toggle-switch">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        checked={settings.receiveEmailNotifications}
                        onChange={handleToggleEmailNotifications}
                        aria-label="Ativar/desativar e-mails de agendamentos"
                      />
                      <span className="slider"></span>
                    </div>
                  </label>
                  <label htmlFor="affiliate-code">
                    <FaLink className="text-primary-blue" />
                    Código de Afiliado
                  </label>
                  <div className="affiliate-code" id="affiliate-code">
                    {settings.affiliateCode || "Nenhum código gerado"}
                  </div>
                  <button
                    type="button"
                    className="settings-btn"
                    onClick={handleGenerateAffiliateCode}
                    disabled={isSubmitting}
                    aria-label="Gerar novo código de afiliado"
                  >
                    {isSubmitting ? (
                      <FaSpinner className="fa-spin inline mr-2 text-xl" aria-hidden="true" />
                    ) : (
                      "Gerar Novo Código"
                    )}
                  </button>
                </div>
                <button
                  type="submit"
                  className="settings-btn"
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