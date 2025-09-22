import React, { useState, useEffect } from "react";
import { useFetch } from "../functions/GetData";
import { UserProfile } from "../interfaces/User";
import Navbar from "../components/Navbar";
import { FaCreditCard, FaPix, FaRegCreditCard, FaUser, FaEnvelope, FaKey, FaEye, FaEyeSlash } from "react-icons/fa6";
import { Usage } from "../interfaces/Usage";
import { Pagamentos } from "../interfaces/Pagamentos";
import { FaSpinner } from "react-icons/fa";
import "aos/dist/aos.css";
import AOS from "aos";

const Profile = () => {
  const token = localStorage.getItem("access_token");
  const url = token ? `api/user/?usuario_token=${token}` : "";
  const user = useFetch<UserProfile>(url);
  const usage = useFetch<Usage>(`api/limite-plano-usage/?usuario_token=${token}`);
  const payments = useFetch<Pagamentos>(`api/pagamentos-usuario/?usuario_token=${token}`);

  const [userData, setUserData] = useState<UserProfile | null>(null);
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

  useEffect(() => {
    AOS.init({ duration: 1000 });
    if (user.data) {
      setUserData(user.data);
    }
  }, [user.data]);

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
    try {
      const url = window.location.origin.includes("localhost:5173")
        ? "http://localhost:8000"
        : "https://backend-production-7438.up.railway.app";

      const response = await fetch(url + "/api/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_token: token,
          first_name: userData.first_name,
          username: userData.username,
          email: userData.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar alterações.");
      }

      setSuccess("Alterações salvas com sucesso!");
      setIsEditing(false);
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
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const url = window.location.origin.includes("localhost:5173")
        ? "http://localhost:8000"
        : "https://backend-production-7438.up.railway.app";

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
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage < 50) return "bg-success";
    if (percentage <= 80) return "bg-warning";
    return "bg-danger";
  };

  if (!usage.data) return null;

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
          --success-green: #28a745;
          --danger-red: #dc3545;
          --warning-orange: #fd7e14;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray);
        }

        /* Container */
        .profile-container {
          padding: 3rem 0;
        }
        .profile-container h1 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Cartão */
        .profile-card, .plan-card, .usage-card, .payment-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 2rem;
        }
        .profile-card:hover, .plan-card:hover, .usage-card:hover, .payment-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .profile-card h4, .plan-card h4, .usage-card h4, .payment-card h4 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .plan-card h4 { color: var(--primary-blue); }
        .usage-card h4 { color: var(--warning-orange); }
        .payment-card h4 { color: var(--light-blue); }

        /* Formulário */
        .form-label {
          color: var(--primary-blue);
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .form-control {
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          font-size: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-control:focus {
          border-color: var(--light-blue);
          box-shadow: 0 0 0 0.2rem rgba(77, 171, 247, 0.25);
          outline: none;
        }
        .form-control::placeholder {
          color: #9ca3af;
        }
        .form-control:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }
        .input-icon {
          position: relative;
        }
        .input-icon svg {
          position: absolute;
          top: 50%;
          left: 0.75rem;
          transform: translateY(-50%);
          color: var(--light-blue);
          font-size: 1.2rem;
          z-index: 1;
        }
        .password-toggle {
          position: absolute;
          top: 50%;
          right: 0.75rem;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--light-blue);
          font-size: 1.2rem;
          cursor: pointer;
        }
        .password-toggle:hover {
          color: var(--primary-blue);
        }

        /* Botões */
        .btn-primary, .btn-success, .btn-warning {
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-primary { background-color: var(--primary-blue); border-color: var(--primary-blue); }
        .btn-success { background-color: var(--success-green); border-color: var(--success-green); }
        .btn-warning { background-color: var(--accent-yellow); border-color: var(--accent-yellow); color: var(--dark-gray); }
        .btn-primary:hover, .btn-success:hover, .btn-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
          opacity: 0.7;
        }

        /* Progress bars */
        .progress {
          height: 1.5rem;
          border-radius: 8px;
          overflow: hidden;
        }
        .progress-bar {
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Tabela de pagamentos */
        .table {
          border-radius: 8px;
          overflow: hidden;
        }
        .table th {
          background-color: var(--primary-blue);
          color: var(--white);
          font-weight: 600;
        }
        .table td {
          vertical-align: middle;
        }
        .badge {
          font-size: 0.85rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
        }

        /* Mensagens de erro e sucesso */
        .alert-danger, .alert-success {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 500;
        }
        .alert-danger {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .alert-success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        /* Loading e erro */
        .loading-container, .error-container {
          text-align: center;
          color: var(--dark-gray);
          font-size: 1.1rem;
          padding: 2rem;
        }
        .error-container {
          color: var(--danger-red);
        }

        /* Responsividade */
        @media (max-width: 576px) {
          .profile-container {
            padding: 2rem 1rem;
          }
          .profile-container h1 {
            font-size: 2rem;
          }
          .profile-card, .plan-card, .usage-card, .payment-card {
            padding: 1.5rem;
          }
          .profile-card h4, .plan-card h4, .usage-card h4, .payment-card h4 {
            font-size: 1.25rem;
          }
          .form-control {
            font-size: 0.9rem;
            padding-left: 2.25rem;
          }
          .input-icon svg {
            font-size: 1rem;
            left: 0.5rem;
          }
          .password-toggle {
            font-size: 1rem;
            right: 0.5rem;
          }
          .table {
            font-size: 0.85rem;
          }
          .badge {
            font-size: 0.75rem;
          }
        }
      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="profile-container container">
          <h1 data-aos="fade-up">
            <FaUser /> Suas Informações
          </h1>
          {user.loading || usage.loading || payments.loading ? (
            <div className="loading-container" data-aos="fade-up">
              <FaSpinner className="fa-spin me-2" /> Carregando dados...
            </div>
          ) : user.error || usage.error || payments.error ? (
            <div className="error-container" data-aos="fade-up">
              Erro ao carregar dados: {user.error || usage.error || payments.error}
            </div>
          ) : (
            <>
              <div className="profile-card" data-aos="fade-up" data-aos-delay="100">
                <h4>Informações do Perfil</h4>
                {error && <div className="alert-danger">{error}</div>}
                {success && <div className="alert-success">{success}</div>}
                {userData && (
                  <form>
                    <div className="mb-3 input-icon">
                      <label htmlFor="first_name" className="form-label">Nome</label>
                      <FaUser />
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        value={userData.first_name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Digite seu nome"
                      />
                    </div>
                    <div className="mb-3 input-icon">
                      <label htmlFor="username" className="form-label">Nome de Usuário</label>
                      <FaUser />
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Digite seu nome de usuário"
                      />
                    </div>
                    <div className="mb-3 input-icon">
                      <label htmlFor="email" className="form-label">E-mail</label>
                      <FaEnvelope />
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Digite seu e-mail"
                      />
                    </div>
                    <div className="mb-3 input-icon">
                      <label htmlFor="currentPassword" className="form-label">Senha Atual</label>
                      <FaKey />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        className="form-control"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Digite sua senha atual"
                      />
                      {isEditing && (
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          aria-label={showCurrentPassword ? "Ocultar senha atual" : "Mostrar senha atual"}
                        >
                          {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      )}
                    </div>
                    <div className="mb-3 input-icon">
                      <label htmlFor="newPassword" className="form-label">Nova Senha</label>
                      <FaKey />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className="form-control"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Digite a nova senha"
                      />
                      {isEditing && (
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          aria-label={showNewPassword ? "Ocultar nova senha" : "Mostrar nova senha"}
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      )}
                    </div>
                    <div className="mb-3 input-icon">
                      <label htmlFor="newPasswordConfirm" className="form-label">Confirmar Nova Senha</label>
                      <FaKey />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        id="newPasswordConfirm"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Confirme a nova senha"
                      />
                      {isEditing && (
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      )}
                    </div>
                    {!isEditing ? (
                      <button
                        type="button"
                        className="btn btn-primary w-100 mt-3"
                        onClick={() => setIsEditing(true)}
                        disabled={loading}
                      >
                        Editar Informações
                      </button>
                    ) : (
                      <div>
                        <button
                          type="button"
                          className="btn btn-success w-100 mt-3"
                          onClick={handleSave}
                          disabled={loading}
                        >
                          {loading ? "Salvando..." : "Salvar Alterações"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-warning w-100 mt-3"
                          onClick={handleChangePassword}
                          disabled={loading}
                        >
                          {loading ? "Alterando..." : "Alterar Senha"}
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </div>
              <div className="plan-card" data-aos="fade-up" data-aos-delay="200">
                <h4>Plano Ativo</h4>
                {usage.data?.plano_ativo ? (
                  <>
                    <p className="fw-bold fs-5 text-center">{usage.data.plano_ativo}</p>
                    <p className="text-muted text-center">Válido até: {usage.data.expira_em}</p>
                  </>
                ) : (
                  <p className="text-center text-muted">Nenhum plano ativo.</p>
                )}
              </div>
              {(usage.data?.quantia_empresas_criadas && usage.data?.quantia_empresas_criadas > 0) ? (
                <div className="usage-card" data-aos="fade-up" data-aos-delay="300">
                  <h4>Limite de Empresas Criadas</h4>
                  <div className="progress">
                    <div
                      className={`progress-bar ${getProgressBarColor(calculateProgress(usage.data.quantia_empresas_criadas, usage.data.limite_empresas))}`}
                      role="progressbar"
                      style={{ width: `${calculateProgress(usage.data.quantia_empresas_criadas, usage.data.limite_empresas)}%` }}
                      aria-valuenow={usage.data.quantia_empresas_criadas}
                      aria-valuemin={0}
                      aria-valuemax={usage.data.limite_empresas}
                    >
                      {usage.data.quantia_empresas_criadas}/{usage.data.limite_empresas} Empresas Criadas
                    </div>
                  </div>
                </div>
              ) : (
                <div className="usage-card" data-aos="fade-up" data-aos-delay="300">
                  <h4>Limite de Empresas Criadas</h4>
                  <p className="text-center text-muted">Nenhuma empresa criada.</p>
                </div>
              )}
              {usage.data && usage.data.funcionarios_por_empresa && (
                usage.data.funcionarios_por_empresa.map((item, index) => (
                  <div key={index} className="usage-card" data-aos="fade-up" data-aos-delay="400">
                    <h4>Limite de Funcionários por Empresas</h4>
                    <div className="progress">
                      <div
                        className={`progress-bar ${getProgressBarColor(calculateProgress(item.total_funcionarios, usage.data.limite_funcionarios))}`}
                        role="progressbar"
                        style={{ width: `${calculateProgress(item.total_funcionarios, usage.data.limite_funcionarios)}%` }}
                        aria-valuenow={item.total_funcionarios}
                        aria-valuemin={0}
                        aria-valuemax={usage.data.limite_funcionarios}
                      >
                        {item.total_funcionarios}/{usage.data.limite_funcionarios}
                      </div>
                    </div>
                    <p className="text-muted mt-2 text-center">Empresa: {item.empresa}</p>
                    <p className="text-muted text-center">
                      Funcionários: {item.total_funcionarios}/{usage.data.limite_funcionarios}
                    </p>
                  </div>
                ))
              )}
              {usage.data?.funcionarios_por_empresa.length === 0 && (
                <div className="usage-card" data-aos="fade-up" data-aos-delay="400">
                  <h4>Limite de Funcionários Totais</h4>
                  <p className="text-center text-muted">Nenhuma empresa criada para possuir funcionários.</p>
                </div>
              )}
              <div className="payment-card" data-aos="fade-up" data-aos-delay="500">
                <h4>Histórico de Pagamentos</h4>
                <table className="table table-striped text-center">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Método</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.data?.pagamentos && Array.isArray(payments.data.pagamentos) && payments.data.pagamentos.length > 0 ? (
                      payments.data.pagamentos.map((payment, index) => (
                        <tr key={index}>
                          <td>{payment.data}</td>
                          <td>R$ {payment.valor.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${payment.status === "Pago" ? "bg-success" : payment.status === "Pendente" ? "bg-warning text-dark" : "bg-danger"}`}>
                              {payment.status}
                            </span>
                          </td>
                          <td>
                            {payment.tipo === "cartao_credito" ? (
                              <FaCreditCard size={20} className="text-primary" />
                            ) : payment.tipo === "pix" ? (
                              <FaPix size={20} className="text-success" />
                            ) : (
                              <FaRegCreditCard size={20} className="text-primary" />
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">
                          Nenhum pagamento registrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;