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
      console.error("Erro: carrinho vazio ou usuário não autenticado.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/payment-success/", {
          plano_nome: carrinho[0].nome,
          usuario_token: usuario_token
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full text-center">
          <h1 className="text-2xl font-semibold text-green-700 mb-4">
            ✅ Pagamento Aprovado!
          </h1>
          <p className="text-gray-700">
            Seu pagamento foi processado com sucesso. Obrigado pela compra!
          </p>

          <button
            onClick={ativarPlano}
            className="mt-4 px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 disabled:bg-gray-400"
            disabled={loading || success}
          >
            {loading
              ? "Ativando..."
              : success
              ? "Plano Ativado!"
              : "Ativar Plano"}
          </button>

          <Link
            to="/"
            className="mt-4 inline-block px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;
