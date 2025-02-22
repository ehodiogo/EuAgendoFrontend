import { useFetch } from "../functions/GetData";
import { UserProfile } from "../interfaces/User";
import Navbar from "../components/Navbar";

const Profile = () => {

  const token = localStorage.getItem("access_token");

  const url = token ? `api/user/?usuario_token=${token}` : "";

  const user = useFetch<UserProfile>(url);

  return (
    <>
    <Navbar />
    <div className="container my-5">
      <h1 className="display-3 text-primary mb-4 text-center">Suas Informações</h1>
      <div className="card shadow-lg p-4">
        <h4 className="card-title text-primary text-center mb-4">Informações do Perfil</h4>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Nome:</strong> {user.data?.first_name}
          </li>
          <li className="list-group-item">
            <strong>Nome de Usuário:</strong> {user.data?.username}
          </li>
          <li className="list-group-item">
            <strong>Email:</strong> {user.data?.email}
          </li>
        </ul>
      </div>
    </div>
    </>
  );
};

export default Profile;
