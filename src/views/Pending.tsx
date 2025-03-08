import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const PendingPage = () => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  interface Plano {
    nome: string;
    preco: number;
  }

  const [carrinho, setCarrinho] = useState<Plano[]>([]);

  useEffect(() => {
    const itensCarrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setCarrinho(itensCarrinho);
  }, []);

  const verificarPagamento = async () => {
    const usuario_token = localStorage.getItem("access_token");

    if (!usuario_token) {
      console.error("Erro: usuário não autenticado.");
      return;
    }

    if (!carrinho.length) {
      console.error("Erro: carrinho vazio.");
      return;
    }

    setLoading(true);
    try {

      const url = window.location.origin.includes("localhost:5173")
        ? "http://localhost:8000"
        : "https://backend-production-7438.up.railway.app";

      const response = await axios.post(
        url + "/api/payment-success/",
        {
          plano_nome: carrinho[0].nome,
          usuario_token: usuario_token,
        }
      );

      if (response.data.status === "approved") {
        setVerified(true);
        window.location.href = "/dashboard";
      } else {
        alert("Pagamento ainda não foi aprovado. Tente novamente mais tarde.");
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      alert("Erro ao verificar pagamento. Tente novamente.");
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
            <h1 className="text-warning fw-bold">⏳ Pagamento Pendente</h1>
            <p className="text-muted">
              Seu pagamento está sendo processado. Você pode clicar no botão
              abaixo para verificar manualmente.
            </p>
            <p className="text-muted fw-bold">
              Verificar o pagamento a cada 5 minutos pode agilizar a liberação
              do seu plano!
            </p>

            <button
              onClick={verificarPagamento}
              className="btn btn-warning w-100 my-2"
              disabled={loading || verified}
            >
              {loading
                ? "Verificando..."
                : verified
                ? "Pagamento Confirmado!"
                : "Verificar Pagamento"}
            </button>

            <Link to="/" className="btn btn-outline-warning w-100">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingPage;
