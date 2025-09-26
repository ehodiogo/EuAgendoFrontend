import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const SuccessPage = () => {
  interface Plano {
    nome: string;
    preco: number;
  }

  const [carrinho, setCarrinho] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const itensCarrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setCarrinho(itensCarrinho);
  }, []);

  const usuario_token = localStorage.getItem("access_token");

  const ativarPlano = async () => {
    if (!carrinho.length || !usuario_token) {
      return;
    }

    setLoading(true);
    try {
      const url = window.location.origin.includes("localhost:5173")
        ? "http://localhost:8000"
        : "https://backend-production-7438.up.railway.app";

      await axios.post(url + "/api/payment-success/", {
        plano_nome: carrinho[0].nome,
        usuario_token: usuario_token,
      });
      setSuccess(true);

      window.localStorage.removeItem("carrinho");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Erro ao ativar o plano:", error);
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
            <h1 className="text-success fw-bold">✅ Pagamento Aprovado!</h1>
            <p className="text-muted">
              Seu pagamento foi processado com sucesso. Obrigado pela compra!
            </p>

            <button
              onClick={ativarPlano}
              className="btn btn-success w-100 my-2"
              disabled={loading || success}
            >
              {loading
                ? "Ativando..."
                : success
                ? "Plano Ativado!"
                : "Ativar Plano"}
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

export default SuccessPage;
