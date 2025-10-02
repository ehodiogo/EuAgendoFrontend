import React, { useState, useEffect } from "react";
import { useFetch } from "../functions/GetData";
import { UserProfile } from "../interfaces/User";
import Navbar from "../components/Navbar";
import { FaUser, FaEnvelope, FaKey, FaEye, FaEyeSlash, FaCreditCard, FaPix,
  FaRegCreditCard, FaChartSimple, FaGaugeHigh, FaCalendarCheck, FaMoneyBillTransfer,
  FaBusinessTime, FaBriefcase, FaUsers } from "react-icons/fa6";
import { Usage } from "../interfaces/Usage";
import { Pagamentos } from "../interfaces/Pagamentos";
import { FaSpinner, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import {FaEdit} from "react-icons/fa";
import { Link } from "react-router-dom";

const Profile = () => {
  const token = localStorage.getItem("access_token");
  const url = token ? `/api/user/?usuario_token=${token}` : "";
  const user = useFetch<UserProfile>(url);
  const usage = useFetch<Usage>(`/api/limite-plano-usage/?usuario_token=${token}`);
  const payments = useFetch<Pagamentos>(`/api/pagamentos-usuario/?usuario_token=${token}`);

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

    // Validação mínima para não salvar com campos vazios (opcional, mas profissional)
    if (!userData.first_name || !userData.username || !userData.email) {
        setError("Todos os campos do perfil são obrigatórios.");
        setLoading(false);
        return;
    }

    try {
      const url = import.meta.env.VITE_API_URL;

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

      setSuccess("Alterações salvas com sucesso! (Dados do Perfil)");
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
            return <span className="badge bg-success-soft text-success"><FaCircleCheck className="me-1" /> {status}</span>;
        case "Pendente":
            return <span className="badge bg-warning-soft text-warning"><FaCalendarCheck className="me-1" /> {status}</span>;
        default:
            return <span className="badge bg-danger-soft text-danger"><FaCircleXmark className="me-1" /> {status}</span>;
    }
  };

  // Se estiver carregando, mostra apenas o spinner com Navbar
  if (user.loading || usage.loading || payments.loading) {
    return (
        <div className="min-vh-100 custom-bg">
            <Navbar />
            <div className="profile-container container">
                <div className="loading-container text-center py-5">
                    <FaSpinner className="fa-spin text-primary" size={30} />
                    <p className="text-muted mt-2">Carregando dados do perfil...</p>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-vh-100">
      <style>{`
        /* Paleta de cores (Ajustadas para mais profissionalismo) */
        :root {
          --primary-blue: #003087; /* Foco Principal */
          --accent-blue: #0056b3; /* Destaque */
          --dark-gray: #212529; /* Texto Principal */
          --medium-gray: #6c757d; /* Texto Secundário */
          --light-gray-bg: #f5f7fa; /* Fundo do Corpo */
          --white: #ffffff;
          --success-green: #28a745;
          --warning-orange: #fd7e14;
          --danger-red: #dc3545;
          --border-light: #e0e0e0;

          /* Soft Backgrounds para Badges */
          --success-soft: #d4edda;
          --warning-soft: #fff3cd;
          --danger-soft: #f8d7da;
          --primary-soft: #cfe2ff;
        }

        /* Estilos gerais */
        .custom-bg {
          background-color: var(--light-gray-bg);
        }

        /* Container & Título */
        .profile-container {
          padding: 3.5rem 0;
        }
        .profile-container h1 {
          color: var(--primary-blue);
          font-weight: 800;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          text-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
        }

        /* Cartões Base */
        .base-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          margin-bottom: 1.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-left: 5px solid var(--primary-blue); /* Linha de destaque padrão */
          height: 100%; /* Para alinhar na grid */
        }
        .base-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }
        .base-card h4 {
          font-weight: 700;
          font-size: 1.4rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--dark-gray);
        }
        
        /* Ajuste de Cor da Borda e Título por Seção */
        .plan-card { border-left-color: var(--accent-blue); }
        .plan-card h4 { color: var(--accent-blue); }
        .usage-card { border-left-color: var(--warning-orange); }
        .usage-card h4 { color: var(--warning-orange); }
        .payment-card { border-left-color: var(--success-green); }
        .payment-card h4 { color: var(--success-green); }

        /* Formulário de Perfil */
        .input-icon {
          position: relative;
        }
        .input-icon svg {
          position: absolute;
          top: 50%;
          left: 0.8rem;
          transform: translateY(-50%);
          color: var(--medium-gray);
          font-size: 1.1rem;
          z-index: 1;
        }
        .form-control {
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 0.75rem 1rem 0.75rem 2.8rem; /* Aumenta o padding para o ícone */
          font-size: 1rem;
          color: var(--dark-gray);
        }
        .form-control:focus {
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 0.2rem rgba(0, 48, 135, 0.15);
        }
        .form-control:disabled {
          background-color: #f8f9fa;
          color: var(--medium-gray);
        }
        .form-label {
          color: var(--primary-blue);
          font-weight: 600;
        }

        /* Botões */
        .btn {
          padding: 0.8rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .btn-success { background-color: var(--success-green); border-color: var(--success-green); }
        .btn-warning { background-color: var(--warning-orange); border-color: var(--warning-orange); color: var(--dark-gray); }
        .btn-secondary { background-color: var(--medium-gray); border-color: var(--medium-gray); }

        /* Progress Bars (Uso) */
        .progress-section {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border-radius: 8px;
            background-color: var(--light-gray-bg);
            border: 1px solid var(--border-light);
        }
        .progress-section h6 {
            font-weight: 600;
            color: var(--dark-gray);
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .progress {
          height: 1.25rem;
          border-radius: 6px;
        }
        .progress-bar {
          font-weight: 500;
          font-size: 0.85rem;
          white-space: nowrap; /* Impede a quebra de linha do texto */
        }

        /* Tabela de pagamentos */
        .table-striped > tbody > tr:nth-of-type(odd) > * {
            background-color: #f0f3f6; /* Listra mais clara */
        }
        .table th {
          background-color: var(--primary-blue);
          color: var(--white);
          font-weight: 600;
          vertical-align: middle;
        }
        .badge {
          font-size: 0.85rem;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-weight: 600;
        }
        .bg-success-soft { background-color: var(--success-soft) !important; color: var(--success-green) !important; }
        .bg-warning-soft { background-color: var(--warning-soft) !important; color: var(--warning-orange) !important; }
        .bg-danger-soft { background-color: var(--danger-soft) !important; color: var(--danger-red) !important; }
        
        /* LAYOUT EM COLUNAS */
        @media (min-width: 992px) {
            /* Grid principal: Perfil/Acesso e Limites (Lado a Lado) */
            .profile-grid {
                display: grid;
                grid-template-columns: 1fr 1.5fr; /* Perfil menor, Limites e Pagamentos maior */
                gap: 2rem;
            }
            .info-column {
                display: flex;
                flex-direction: column;
            }
            /* Sub-Grid dentro da info-column para Plano e Pagamentos (Lado a Lado) */
            .plan-payment-grid {
                display: grid;
                grid-template-columns: 1fr 1fr; 
                gap: 1.5rem;
                margin-bottom: 1.5rem; /* Margem entre a sub-grid e o card de uso */
            }
            .usage-card-compact {
                margin-bottom: 0.75rem;
            }
        }
        
        /* Responsividade */
        @media (max-width: 991px) {
            /* Em telas menores que 992px, vira pilha (coluna) */
            .profile-grid, .plan-payment-grid {
                display: block;
            }
            .base-card {
                margin-bottom: 1.5rem;
            }
        }

      `}</style>
      <div className="custom-bg min-vh-100">
        <Navbar />
        <div className="profile-container container">
          <h1>
            <FaUser /> Perfil e Assinatura
          </h1>

          <div className="profile-grid">
            {/* COLUNA 1: DADOS DO PERFIL E SENHA */}
            <div className="profile-form-column">
                <div className="base-card">
                    <h4><FaUser /> Dados Pessoais e Acesso</h4>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    {userData && (
                    <form onSubmit={(e) => {e.preventDefault(); isEditing ? handleSave() : setIsEditing(true);}}>
                        <div className="mb-3 input-icon">
                        <label htmlFor="first_name" className="form-label">Nome Completo</label>
                        <FaUser />
                        <input
                            type="text"
                            className="form-control"
                            id="first_name"
                            name="first_name"
                            value={userData.first_name || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                        </div>
                        <div className="mb-3 input-icon">
                        <label htmlFor="username" className="form-label">Nome de Usuário</label>
                        <FaChartSimple />
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={userData.username || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                        </div>
                        <div className="mb-4 input-icon">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <FaEnvelope />
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={userData.email || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                        </div>

                        {/* Seção de Troca de Senha */}
                        <h5 className="text-primary mt-4 mb-3" style={{fontWeight: 600}}>Alterar Senha</h5>
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
                            placeholder="Necessária para qualquer alteração de senha"
                        />
                        {isEditing && (
                            <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                            placeholder="Mínimo 6 caracteres"
                        />
                        {isEditing && (
                            <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        )}
                        </div>
                        <div className="mb-4 input-icon">
                        <label htmlFor="newPasswordConfirm" className="form-label">Confirmar Nova Senha</label>
                        <FaKey />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control"
                            id="newPasswordConfirm"
                            value={newPasswordConfirm}
                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            disabled={!isEditing}
                            placeholder="Repita a nova senha"
                        />
                        {isEditing && (
                            <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        )}
                        </div>

                        {/* Botões de Ação */}
                        <div className="d-grid gap-2">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setIsEditing(true)}
                                    disabled={loading}
                                >
                                    <FaEdit /> Editar Informações
                                </button>
                            ) : (
                                <>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? <FaSpinner className="fa-spin" /> : <FaCircleCheck />} Salvar Alterações
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning text-white"
                                    onClick={handleChangePassword}
                                    disabled={loading || !newPassword}
                                >
                                    {loading ? <FaSpinner className="fa-spin" /> : <FaKey />} Alterar Senha (Se preenchida)
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsEditing(false)}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                </>
                            )}
                        </div>
                    </form>
                    )}
                </div>
            </div>

            {/* COLUNA 2: PLANO, USO E PAGAMENTOS */}
            <div className="info-column">

                {/* Sub-Grid 1: Plano Ativo e Histórico de Pagamentos (LADO A LADO) */}
                <div className="plan-payment-grid">
                    {/* Card de Plano Ativo */}
                    <div className="base-card plan-card">
                        <h4><FaCalendarCheck /> Plano Ativo</h4>
                        {usage.data?.plano_ativo ? (
                            <div className="text-center py-2">
                                <p className="fw-bold fs-4 text-primary">{usage.data.plano_ativo}</p>
                                <p className="text-muted mb-0">Válido até: <strong>{usage.data.expira_em}</strong></p>
                                <Link to="/planos" className="btn btn-sm btn-primary mt-3">Gerenciar/Renovar Plano</Link>
                            </div>
                        ) : (
                            <div className="text-center py-2">
                                <p className="text-muted fs-5">Nenhum plano ativo.</p>
                                <Link to="/planos" className="btn btn-sm btn-success mt-3">Ver Planos Disponíveis</Link>
                            </div>
                        )}
                    </div>

                    {/* Card de Histórico de Pagamentos */}
                    <div className="base-card payment-card">
                        <h4><FaMoneyBillTransfer /> Histórico (5 Recentes)</h4>
                        <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <table className="table table-striped text-center align-middle mb-0">
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
                                        payments.data.pagamentos.slice(0, 5).map((payment, index) => ( // Exibe os 5 mais recentes
                                            <tr key={index}>
                                                <td>{payment.data}</td>
                                                <td>R$ {payment.valor.toFixed(2)}</td>
                                                <td>{getPaymentStatusBadge(payment.status)}</td>
                                                <td>
                                                    {payment.tipo === "cartao_credito" ? (
                                                        <FaCreditCard size={20} className="text-primary" title="Cartão de Crédito" />
                                                    ) : payment.tipo === "pix" ? (
                                                        <FaPix size={20} className="text-success" title="PIX" />
                                                    ) : (
                                                        <FaRegCreditCard size={20} className="text-muted" title="Outro/Não Especificado" />
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted">
                                                Nenhum pagamento.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Card de Limites de Uso (Abaixo da sub-grid) */}
                <div className="base-card usage-card">
                    <h4><FaGaugeHigh /> Limites de Uso (Plano)</h4>

                    {/* Limite de Empresas */}
                    <div className="progress-section">
                        <h6><FaBusinessTime /> Limite de Empresas Criadas</h6>
                        <div className="progress">
                            <div
                                className={`progress-bar ${getProgressBarColor(calculateProgress(usage.data.quantia_empresas_criadas, usage.data.limite_empresas))}`}
                                role="progressbar"
                                style={{ width: `${calculateProgress(usage.data.quantia_empresas_criadas, usage.data.limite_empresas)}%` }}
                                aria-valuenow={usage.data.quantia_empresas_criadas}
                                aria-valuemin={0}
                                aria-valuemax={usage.data.limite_empresas}
                            >
                                {usage.data.quantia_empresas_criadas}/{usage.data.limite_empresas}
                            </div>
                        </div>
                        <p className="text-muted text-center mt-2" style={{fontSize: '0.9rem'}}>Empresas em uso</p>
                    </div>

                    {/* Limite de Funcionários por Empresa */}
                    {usage.data?.funcionarios_por_empresa && usage.data.funcionarios_por_empresa.length > 0 ? (
                        <>
                        <h6 className="mt-3"><FaBriefcase /> Limite de Funcionários (Total por Empresa)</h6>
                        {usage.data.funcionarios_por_empresa.map((item, index) => (
                            <div key={index} className="progress-section usage-card-compact">
                                <h6><FaUsers /> {item.empresa}</h6>
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
                                <p className="text-muted text-center mt-2" style={{fontSize: '0.8rem'}}>Funcionários em uso</p>
                            </div>
                        ))}
                        </>
                    ) : (
                        <div className="progress-section">
                           <p className="text-center text-muted mb-0">Nenhuma empresa criada para acompanhar o limite de funcionários.</p>
                        </div>
                    )}
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;