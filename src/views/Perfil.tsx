import { useState, useEffect } from "react";
import { useFetch } from "../functions/GetData";
import { UserProfile } from "../interfaces/User";
import Navbar from "../components/Navbar";
import { FaCreditCard, FaPix } from "react-icons/fa6";
import { Usage } from "../interfaces/Usage";

const Profile = () => {
  const token = localStorage.getItem("access_token");
  const url = token ? `api/user/?usuario_token=${token}` : "";
  const user = useFetch<UserProfile>(url);
  const usage = useFetch<Usage>(
    `api/limite-plano-usage/?usuario_token=${token}`
  );

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); 

  const [paymentHistory] = useState([
    {
      date: "2025-02-01",
      amount: "R$ 150,00",
      status: "Pago",
      method: "cartao",
    },
    { date: "2025-01-15", amount: "R$ 120,00", status: "Pago", method: "pix" },
    {
      date: "2024-12-20",
      amount: "R$ 100,00",
      status: "Pendente",
      method: "cartao",
    },
  ]);

  useEffect(() => {
    if (user.data) {
      setUserData(user.data);
    }
  }, [user.data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData!, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!userData || !token) return;
    try {
      const response = await fetch("http://localhost:8000/api/user/", {
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
        console.error("Erro ao salvar alterações.");
        return;
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao se comunicar com o servidor." + error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== newPasswordConfirm) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/change-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario_token: token,
            current_password: user.data?.password, 
            new_password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        console.error("Erro ao alterar a senha.");
        return;
      }

      alert("Senha alterada com sucesso!");
    } catch (error) {
      console.error("Erro ao se comunicar com o servidor." + error);
    }
  };

  const calculateProgress = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100); 
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage < 50) {
      return "bg-success"; 
    } else if (percentage >= 50 && percentage <= 80) {
      return "bg-warning";
    } else {
      return "bg-danger"; 
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h1 className="display-3 text-primary mb-4 text-center">
          Suas Informações
        </h1>

        <div className="card shadow-lg p-4">
          <h4 className="card-title text-primary text-center mb-4">
            Informações do Perfil
          </h4>
          {userData && (
            <form>
              <div className="mb-3">
                <label className="form-label">
                  <strong>Nome:</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  value={userData.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <strong>Nome de Usuário:</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <strong>Email:</strong>
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <strong>Senha Atual:</strong>
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={true}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <strong>Nova Senha:</strong>
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <strong>Confirmar Nova Senha:</strong>
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => setIsEditing(true)}
                >
                  Editar Informações
                </button>
              ) : (
                <div>
                  <button
                    type="button"
                    className="btn btn-success w-100 mt-3"
                    onClick={handleSave}
                  >
                    Salvar Alterações
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning w-100 mt-3"
                    onClick={handleChangePassword}
                  >
                    Alterar Senha
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        <div className="card shadow-lg p-4 mt-4 text-center border-primary">
          <h4 className="text-primary mb-3">Plano Ativo</h4>
          <p className="fw-bold fs-5">{usage.data?.plano_ativo}</p>
          <p className="text-muted">Válido até: {usage.data?.expira_em}</p>
        </div>

        <div className="card shadow-lg p-4 mt-4 border-warning">
          <h4 className="text-warning text-center mb-4">
            Limite de Empresas Criadas
          </h4>
          <div className="progress">
            <div
              className={`progress-bar ${getProgressBarColor(
                calculateProgress(
                  usage.data?.quantia_empresas_criadas || 0,
                  usage.data?.limite_empresas || 0
                )
              )}`}
              role="progressbar"
              style={{
                width: `${calculateProgress(
                  usage.data?.quantia_empresas_criadas || 0,
                  usage.data?.limite_empresas || 0
                )}%`,
              }}
              aria-valuenow={usage.data?.quantia_empresas_criadas}
              aria-valuemin={0}
              aria-valuemax={5}
            >
              {usage.data?.quantia_empresas_criadas}/
              {usage.data?.limite_empresas} Empresas Criadas
            </div>
          </div>
        </div>

        {usage.data?.funcionarios_por_empresa.map((item, index) => (
          <div key={index} className="card shadow-lg p-4 mt-4 border-success">
            <h4 className="text-success text-center mb-4">
              Limite de Funcionários por Empresa
            </h4>
            <div className="progress">
              <div
                className={`progress-bar ${getProgressBarColor(
                  calculateProgress(
                    item.total_funcionarios,
                    usage.data?.limite_funcionarios || 0
                  )
                )}`}
                role="progressbar"
                style={{
                  width: `${calculateProgress(
                    item.total_funcionarios,
                    usage.data?.limite_funcionarios || 0
                  )}% `,
                  fontSize: "0.9rem",
                }}
              >
                {item.total_funcionarios}/{usage.data?.limite_funcionarios}{" "}
              </div>
            </div>
            <p className="text-muted mt-2 text-center">Empresa: {item.empresa}</p>
            <p className="text-muted text-center">Funcionários: {item.total_funcionarios} / {usage.data?.limite_funcionarios}
            </p>
          </div>
        ))}

        <div className="card shadow-lg p-4 mt-4 border-info">
          <h4 className="text-info text-center mb-4">
            Histórico de Pagamentos
          </h4>
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
              {paymentHistory.length > 0 ? (
                paymentHistory.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.date}</td>
                    <td>{payment.amount}</td>
                    <td>
                      <span className="badge bg-success">{payment.status}</span>
                    </td>
                    <td>
                      {payment.method === "cartao" ? (
                        <FaCreditCard size={20} className="text-primary" />
                      ) : (
                        <FaPix size={20} className="text-success" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    Nenhum pagamento registrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Profile;
