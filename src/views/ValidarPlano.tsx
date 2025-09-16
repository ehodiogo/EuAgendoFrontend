import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const ValidarPlano = () => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [statusPagamento, setStatusPagamento] = useState<string | null>(null);

  useEffect(() => {
    // Se desejar, pode adicionar um useEffect para buscar o status assim que a página for carregada.
    verificarPagamento();
  }, []);

  const verificarPagamento = async () => {
    const usuario_token = localStorage.getItem("access_token");

    if (!usuario_token) {
      console.error("Erro: usuário não autenticado.");
      return;
    }

    setLoading(true);
    try {
      const url = window.location.origin.includes("localhost:5173")
        ? "http://localhost:8000"
        : "https://backend-production-7438.up.railway.app";

      console.log("URL: " + url);

      const response = await axios.post(
        url + "/api/payment-success/",
        {
          usuario_token: usuario_token,
        }
      );

      if (response.data.status === "approved") {
        setVerified(true);
        setStatusPagamento(
          "Pagamento aprovado! Você pode acessar seus recursos."
        );
      } else if (response.data.status === "pending") {
        setStatusPagamento("Pagamento pendente. Aguarde a confirmação.");
      } else {
        setStatusPagamento(
          "Pagamento não aprovado. Tente novamente mais tarde."
        );
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      setStatusPagamento("Erro ao verificar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
        <div
          className="card shadow-lg p-4 text-center"
          style={{ maxWidth: "500px" }}
        >
          <div className="card-body">
            <h1 className="text-success fw-bold">
              🛡️ Verificação de Pagamento
            </h1>
            <p className="text-muted">
              Verifique o status do pagamento de seu plano abaixo.
            </p>

            <div className="mb-4">
              {loading ? (
                <p className="text-muted">Verificando status...</p>
              ) : (
                <p className={`text-${verified ? "success" : "danger"}`}>
                  {statusPagamento}
                </p>
              )}
            </div>

            <button
              onClick={verificarPagamento}
              className="btn btn-success w-100 my-2"
              disabled={loading || verified}
            >
              {loading
                ? "Verificando..."
                : verified
                ? "Pagamento Confirmado!"
                : "Verificar Status do Pagamento"}
            </button>

            <Link to="/" className="btn btn-outline-success w-100">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ValidarPlano;
