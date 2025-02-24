import { useState, useEffect } from "react";
import { useFetch } from "../functions/GetData";
import { UserProfile } from "../interfaces/User";
import Navbar from "../components/Navbar";

const Profile = () => {
  const token = localStorage.getItem("access_token");
  const url = token ? `api/user/?usuario_token=${token}` : "";
  const user = useFetch<UserProfile>(url);

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
      </div>
    </>
  );
};

export default Profile;
