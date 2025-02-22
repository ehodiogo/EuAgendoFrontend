import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <h1 className="display-1 text-primary">404</h1>
      <h2 className="mb-4">Página Não Encontrada</h2>
      <p className="lead text-muted text-center">
        A página que você está procurando não existe ou foi movida.
      </p>
      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate("/")} 
      >
        Voltar para a Página Inicial
      </button>
    </div>
  );
};

export default NotFound;
