import { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="container mt-5">
      <h1 className="display-3 text-primary text-center">Carrinho</h1>
      <div className="card p-4">
        {carrinho.length === 0 ? (
          <p>Seu carrinho está vazio!</p>
        ) : (
          <div>
            <h4>Itens no Carrinho</h4>
            {carrinho.map((plano, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{plano.nome}</strong> - R${plano.preco}
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removerItem(index)}
                >
                  Remover
                </button>
              </div>
            ))}
            <hr />
            <p>
              <strong>Total: </strong>R${total}
            </p>
            <button
              className="btn btn-success"
              onClick={finalizarCompra}
              disabled={loading}
            >
              {loading ? "Processando..." : "Ir para o Checkout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrinho;
