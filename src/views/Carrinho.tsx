import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Carrinho() {
  interface Plano {
    nome: string;
    preco: number;
  }

  const [carrinho, setCarrinho] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const itensCarrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setCarrinho(itensCarrinho);
  }, []);

  const total = carrinho.reduce((acc, plano) => acc + plano.preco, 0);

  const removerItem = (index: number) => {
    const carrinhoAtualizado = carrinho.filter((_, i) => i !== index);
    setCarrinho(carrinhoAtualizado);
    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtualizado));
  };

  const finalizarCompra = async () => {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    const usuario_token = localStorage.getItem("access_token");
    if (!usuario_token) {
      alert("Usuário não autenticado!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/pagamento-plano/",
        {
          plano_nome: carrinho[0].nome,
          usuario_token: usuario_token,
        }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Erro ao processar o pagamento:", error);
      alert("Erro ao iniciar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="container mt-5">
      <h1 className="display-4 text-center text-primary fw-bold mb-4">
        🛒 Seu Carrinho
      </h1>
      <div className="card shadow-lg p-4">
        {carrinho.length === 0 ? (
          <div className="text-center text-muted">
            <h5>Seu carrinho está vazio!</h5>
          </div>
        ) : (
          <div>
            <ul className="list-group mb-3">
              {carrinho.map((plano, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h6 className="my-0">{plano.nome}</h6>
                    <small className="text-muted">
                      R${plano.preco.toFixed(2)}
                    </small>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removerItem(index)}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold">Total: R${total.toFixed(2)}</h5>
              <button
                className="btn btn-success btn-lg"
                onClick={finalizarCompra}
                disabled={loading}
              >
                {loading ? "🔄 Processando..." : "💳 Ir para o Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default Carrinho;
