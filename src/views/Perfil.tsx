import React, { useState, useEffect } from "react";
import { useFetch } from "../functions/GetData";
import { UserProfile } from "../interfaces/User";
import { Usage } from "../interfaces/Usage";
import { Pagamentos } from "../interfaces/Pagamentos";

import Navbar from "../components/Navbar";
import {
  FaUser, FaEnvelope, FaKey, FaEye, FaEyeSlash, FaChartSimple, FaGaugeHigh, FaCalendarCheck, FaMoneyBillTransfer,
  FaBusinessTime, FaUsers, FaSpinner, FaCircleCheck,
  FaCircleXmark, FaArrowRight, FaCheck
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import {FaEdit, FaExclamationTriangle} from "react-icons/fa";

interface ConsolidatedUsageItem {
  empresa: string;
  tipo: 'Serviço' | 'Locação';
  current: number;
  max: number;
}

const Profile = () => {
  const token = localStorage.getItem("access_token");
  const url = token ? `/api/user/?usuario_token=${token}` : "";
  const user = useFetch<UserProfile>(url);
  const usage = useFetch<Usage>(`/api/limite-plano-usage/?usuario_token=${token}`);
  const payments = useFetch<Pagamentos>(`/api/pagamentos-usuario/?usuario_token=${token}`);

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [consolidatedUsage, setConsolidatedUsage] = useState<ConsolidatedUsageItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatExpiryDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formatted = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (diffDays <= 0) {
      return <span className="text-danger fw-bold">Expirado</span>;
    } else if (diffDays <= 3) {
      return <span className="text-warning fw-bold">Expira em {diffDays} dia{diffDays > 1 ? 's' : ''}</span>;
    }

    return <span>{formatted}</span>;
  };

  useEffect(() => {
    if (user.data) setUserData(user.data);
  }, [user.data]);

  useEffect(() => {
    if (usage.data) {
      const { limite_funcionarios, limite_locacoes, funcionarios_por_empresa, locacoes_por_empresa } = usage.data;

      const locacaoItems: ConsolidatedUsageItem[] = locacoes_por_empresa.map(item => ({
        empresa: item.empresa,
        tipo: 'Locação',
        current: item.total_locativos,
        max: limite_locacoes,
      }));

      const servicoItems: ConsolidatedUsageItem[] = funcionarios_por_empresa.map(item => ({
        empresa: item.empresa,
        tipo: 'Serviço',
        current: item.total_funcionarios,
        max: limite_funcionarios,
      }));

      setConsolidatedUsage([...locacaoItems, ...servicoItems]);
    }
  }, [usage.data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData!, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!userData || !token) {
      setError("Dados do usuário ou token não disponíveis.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!userData.first_name || !userData.username || !userData.email) {
      setError("Todos os campos do perfil são obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      const url = import.meta.env.VITE_API_URL;
      const response = await fetch(url + "/api/user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_token: token,
          first_name: userData.first_name,
          username: userData.username,
          email: userData.email,
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar alterações.");
      setSuccess("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (e: any) {
      setError(e.message || "Erro ao salvar alterações.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== newPasswordConfirm) {
      setError("As senhas não coincidem!");
      return;
    }
    if (!currentPassword) {
      setError("Digite a senha atual.");
      return;
    }
    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const url = import.meta.env.VITE_API_URL;
      const response = await fetch(url + "/api/change-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_token: token,
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Erro ao alterar a senha");
        return;
      }

      setSuccess("Senha alterada com sucesso!");
      setNewPassword("");
      setNewPasswordConfirm("");
      setCurrentPassword("");
    } catch (e: any) {
      setError(e.message || "Erro de conexão ao alterar a senha.");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (current: number, max: number) => {
    return max > 0 ? Math.min((current / max) * 100, 100) : 0;
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage < 50) return "bg-success";
    if (percentage <= 80) return "bg-warning";
    return "bg-danger";
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Pago":
        return <span className="badge bg-success"><FaCircleCheck /> {status}</span>;
      case "Pendente":
        return <span className="badge bg-warning text-dark"><FaCalendarCheck /> {status}</span>;
      default:
        return <span className="badge bg-danger"><FaCircleXmark /> {status}</span>;
    }
  };

  if (user.loading || usage.loading || payments.loading) {
    return (
      <div className="min-vh-100 hero-bg">
        <Navbar />
        <div className="d-flex align-items-center justify-content-center flex-column min-vh-100">
          <FaSpinner className="fa-spin text-white" size={48} />
          <p className="text-white mt-3 fs-5">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  const renderUsageProgress = (item: ConsolidatedUsageItem) => {
    const { current, max, tipo } = item;
    const percentage = calculateProgress(current, max);

    return (
      <div className="progress-wrapper">
        <div className="progress">
          <div
            className={`progress-bar ${getProgressBarColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          >
            {current}/{max}
          </div>
        </div>
        <p className="text-muted small text-center mt-1">
          {tipo === 'Locação' ? 'Locações ativas' : 'Funcionários cadastrados'}
        </p>
      </div>
    );
  };

  return (
    <div className="min-vh-100">
      <style>{`
        :root {
          --primary: #003087;
          --primary-dark: #00205b;
          --accent: #f6c107;
          --success: #28a745;
          --warning: #fd7e14;
          --danger: #dc3545;
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

        .hero-bg {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 80%, rgba(246,193,7,0.15), transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1), transparent 50%);
          pointer-events: none;
        }

        .profile-content {
          padding: 3rem 1rem;
          position: relative;
          z-index: 1;
        }

        .profile-header {
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeInUp 0.8s ease-out;
        }
        .profile-header h1 {
          color: white;
          font-weight: 800;
          font-size: 2.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          text-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .profile-header p {
          color: rgba(255,255,255,0.9);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 1rem auto 0;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .profile-card {
          background: white;
          border-radius: var(--radius);
          padding: 2.5rem;
          box-shadow: var(--shadow-lg);
          border-top: 6px solid var(--accent);
          animation: fadeInUp 0.8s ease-out;
          position: relative;
          overflow: hidden;
        }
        .profile-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 6px;
          background: linear-gradient(90deg, var(--primary), var(--info), var(--accent));
        }

        .section-title {
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px dashed var(--gray-200);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--primary);
        }

        .input-wrapper {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--info);
          font-size: 1.2rem;
          pointer-events: none;
        }
        .form-control {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid var(--gray-200);
          border-radius: 14px;
          font-size: 1rem;
          transition: var(--transition);
        }
        .form-control:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(0, 48, 135, 0.15);
          outline: none;
        }
        .form-control:disabled {
          background: var(--gray-100);
          color: var(--gray-600);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--info);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.5rem;
        }
        .password-toggle:hover { color: var(--primary); }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--info));
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 14px;
          font-weight: 700;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: var(--transition);
          box-shadow: 0 6px 16px rgba(0, 48, 135, 0.25);
        }
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--info), var(--primary));
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 48, 135, 0.35);
        }

        .btn-success {
          background: linear-gradient(135deg, var(--success), #1e7e34);
          color: white;
        }
        .btn-success:hover:not(:disabled) {
          background: linear-gradient(135deg, #1e7e34, var(--success));
          transform: translateY(-3px);
        }

        .btn-warning {
          background: linear-gradient(135deg, var(--warning), #e66a00);
          color: white;
        }
        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .progress-wrapper { margin-bottom: 1.5rem; }
        .progress {
          height: 2.2rem;
          border-radius: 12px;
          background: var(--gray-200);
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        .progress-bar {
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .bg-success { background: linear-gradient(135deg, #28a745, #1e7e34); }
        .bg-warning { background: linear-gradient(135deg, #fd7e14, #e66a00); }
        .bg-danger { background: linear-gradient(135deg, #dc3545, #c82333); }

        .table {
          margin-bottom: 0;
          font-size: 0.95rem;
        }
        .table th {
          background: var(--primary);
          color: white;
          font-weight: 600;
          text-align: center;
          vertical-align: middle;
        }
        .table td { vertical-align: middle; text-align: center; }
        .badge {
          font-weight: 600;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .plan-card, .payment-card, .usage-card {
          border-top: 6px solid;
        }
        .plan-card { border-color: var(--info); }
        .payment-card { border-color: var(--success); }
        .usage-card { border-color: var(--warning); }

        .alert {
          padding: 1rem 1.25rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: fadeInUp 0.4s ease-out;
        }
        .alert-success { background: rgba(40,167,69,0.1); color: var(--success); border: 1px solid var(--success); }
        .alert-danger { background: rgba(220,53,69,0.1); color: var(--danger); border: 1px solid var(--danger); }

        @media (max-width: 992px) {
          .profile-grid { grid-template-columns: 1fr; }
          .profile-header h1 { font-size: 2.2rem; }
        }
        @media (max-width: 576px) {
          .profile-card { padding: 2rem 1.5rem; }
          .section-title { font-size: 1.3rem; }
        }
      `}</style>

      <div className="hero-bg">
        <Navbar />

        <div className="profile-content container">
          <div className="profile-header">
            <h1><FaUser /> Meu Perfil</h1>
            <p>Gerencie suas informações, plano e limites de uso com total controle.</p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <FaExclamationTriangle /> {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <FaCheck /> {success}
            </div>
          )}

          <div className="profile-grid">
            {/* Coluna Esquerda - Perfil e Senha */}
            <div className="profile-card">
              <h4 className="section-title"><FaUser /> Dados Pessoais</h4>
              {userData && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (isEditing) {
                        handleSave();
                      }
                    }}
                  >
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      className="form-control"
                      name="first_name"
                      value={userData.first_name || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Nome completo"
                      required
                    />
                  </div>

                  <div className="input-wrapper">
                    <FaChartSimple className="input-icon" />
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={userData.username || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Nome de usuário"
                      required
                    />
                  </div>

                  <div className="input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={userData.email || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <h5 className="section-title mt-4"><FaKey /> Alterar Senha</h5>

                  <div className="input-wrapper">
                    <FaKey className="input-icon" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Senha atual"
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                      {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <div className="input-wrapper">
                    <FaKey className="input-icon" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Nova senha (mín. 6 caracteres)"
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <div className="input-wrapper">
                    <FaKey className="input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Confirmar nova senha"
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <div className="d-grid gap-2 mt-4">
                    {!isEditing ? (
                      <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)} disabled={loading}>
                        <FaEdit /> Editar Perfil
                      </button>
                    ) : (
                      <>
                        <button type="button" className="btn btn-success" onClick={handleSave} disabled={loading}>
                          {loading ? <FaSpinner className="fa-spin" /> : <FaCircleCheck />} Salvar Alterações
                        </button>
                        <button type="button" className="btn btn-warning" onClick={handleChangePassword} disabled={loading || !newPassword}>
                          {loading ? <FaSpinner className="fa-spin" /> : <FaKey />} Alterar Senha
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={loading}>
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Coluna Direita - Plano, Pagamentos, Uso */}
            <div>
              <div className="d-grid gap-3 mb-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {/* Plano Ativo */}
                <div className="profile-card plan-card">
                  <h4 className="section-title"><FaCalendarCheck /> Plano Atual</h4>
                  {usage.data?.plano_ativo ? (
                    <div className="text-center">
                      <p className="fw-bold fs-4 text-primary">{usage.data.plano_ativo}</p>
                      <p className="text-muted small"><strong>{formatExpiryDate(usage.data.expira_em)}</strong></p>
                      <Link to="/planos" className="btn btn-sm btn-primary mt-2">
                        Gerenciar Plano <FaArrowRight />
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-muted">Nenhum plano ativo</p>
                      <Link to="/planos" className="btn btn-sm btn-success">
                        Ver Planos <FaArrowRight />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Últimos Pagamentos */}
                <div className="profile-card payment-card">
                  <h4 className="section-title"><FaMoneyBillTransfer /> Últimos Pagamentos</h4>
                  <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Valor</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.data?.pagamentos?.slice(0, 4).map((p, i) => (
                          <tr key={i}>
                            <td>{p.data}</td>
                            <td>R$ {p.valor.toFixed(2)}</td>
                            <td>{getPaymentStatusBadge(p.status)}</td>
                          </tr>
                        )) || (
                          <tr><td colSpan={3} className="text-center text-muted">Nenhum</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Uso de Limites */}
              <div className="profile-card usage-card">
                <h4 className="section-title"><FaGaugeHigh /> Uso do Plano</h4>

                <div className="progress-wrapper">
                  <h6 className="mb-2"><FaBusinessTime /> Empresas Criadas</h6>
                  <div className="progress">
                    <div
                      className={`progress-bar ${getProgressBarColor(calculateProgress(usage.data?.quantia_empresas_criadas || 0, usage.data?.limite_empresas || 1))}`}
                      style={{ width: `${calculateProgress(usage.data?.quantia_empresas_criadas || 0, usage.data?.limite_empresas || 1)}%` }}
                    >
                      {usage.data?.quantia_empresas_criadas || 0}/{usage.data?.limite_empresas || 0}
                    </div>
                  </div>
                </div>

                {consolidatedUsage.length > 0 ? (
                  consolidatedUsage.map((item, i) => (
                    <div key={i} className="progress-wrapper">
                      <h6 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {item.tipo === 'Locação' ? <FaCalendarCheck /> : <FaUsers />}
                        {item.tipo === 'Locação'
                          ? `Limite de Locações para ${item.empresa}: ${item.current} / ${item.max}`
                          : `Limite de Funcionários para ${item.empresa}: ${item.current} / ${item.max}`
                        }
                      </h6>
                      {renderUsageProgress(item)}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted small">Nenhuma empresa criada.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center py-4 text-white" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
          Gerencie seu perfil com segurança • Alterações salvas automaticamente
        </footer>
      </div>
    </div>
  );
};

export default Profile;