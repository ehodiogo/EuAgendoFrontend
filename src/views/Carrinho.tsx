import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Carrinho() {
  const navigate = useNavigate();
  interface Plano {
    nome: string;
    preco: number;
  }

  const [carrinho, setCarrinho] = useState<Plano[]>([]);

  useEffect(() => {
    // Recupera os itens do carrinho do localStorage
    const itensCarrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setCarrinho(itensCarrinho);
  }, []);

  const total = carrinho.reduce((acc, plano) => acc + plano.preco, 0);

  const removerItem = (index: number) => {
    // Remove o item do carrinho
    const carrinhoAtualizado = carrinho.filter((_, i) => i !== index);
    setCarrinho(carrinhoAtualizado);
    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtualizado));
  };

  const irParaCheckout = () => {
    // Redireciona para a página de checkout
    navigate("/checkout");
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
            <button className="btn btn-success" onClick={irParaCheckout}>
              Ir para o Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrinho;
