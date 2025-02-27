import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const FailurePage = () => {
  return (
    <>
    <Navbar />
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
      <div
        className="card shadow-lg p-4 text-center"
        style={{ maxWidth: "500px" }}
      >
        <div className="card-body">
          <h1 className="text-danger fw-bold">❌ Pagamento Falhou</h1>
          <p className="text-muted">
            Ocorreu um erro ao processar seu pagamento. Tente novamente.
          </p>

          <Link to="/carrinho" className="btn btn-danger w-100">
            Tentar Novamente
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default FailurePage;
