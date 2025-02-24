import { useState, useEffect } from "react";
import { useFetch } from "../functions/GetData";
import { UserProfile } from "../interfaces/User";
import Navbar from "../components/Navbar";
import { FaCreditCard, FaPix } from "react-icons/fa6";

const Profile = () => {
  const token = localStorage.getItem("access_token");
  const url = token ? `api/user/?usuario_token=${token}` : "";
  const user = useFetch<UserProfile>(url);

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [paymentHistory] = useState([
    {
      date: "2025-01-15",
      amount: "R$249,99",
      status: "Pago",
      method: "cartao",
    },
    { date: "2024-12-15", amount: "R$249,99", status: "Pago", method: "pix" },
  ]);
  const [planDetails] = useState({
    name: "Plano Premium",
    expiry_date: "2024-12-31",
  });

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
              {!isEditing ? (
                <button
                  type="button"
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => setIsEditing(true)}
                >
                  Editar Informações
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success w-100 mt-3"
                  onClick={handleSave}
                >
                  Salvar Alterações
                </button>
              )}
            </form>
          )}
        </div>

        {/* Plano Ativo */}
        <div className="card shadow-lg p-4 mt-4 text-center border-primary">
          <h4 className="text-primary mb-3">Plano Ativo</h4>
          <p className="fw-bold fs-5">{planDetails.name}</p>
          <p className="text-muted">Válido até: {planDetails.expiry_date}</p>
        </div>

        {/* Histórico de Pagamentos */}
        <div className="card shadow-lg p-4 mt-4 border-info">
          <h4 className="text-info text-center mb-4">
            Histórico de Pagamentos
          </h4>
          {paymentHistory.length > 0 ? (
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
                {paymentHistory.map((payment, index) => (
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
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">Nenhum pagamento registrado.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
