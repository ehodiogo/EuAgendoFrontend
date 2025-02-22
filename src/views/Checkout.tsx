import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  interface Plano {
    nome: string;
    preco: number;
  }

  const [carrinho, setCarrinho] = useState<Plano[]>([]);
  const [nome, setNome] = useState("");
  const [cartao, setCartao] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [codigoSeguranca, setCodigoSeguranca] = useState("");
  const [total, setTotal] = useState(0);
  const [metodoPagamento, setMetodoPagamento] = useState("cartao");

  useEffect(() => {
    // Recupera os itens do carrinho do localStorage
    const itensCarrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setCarrinho(itensCarrinho);

    // Calcula o total
    const totalCarrinho: number = itensCarrinho.reduce(
      (acc: number, plano: Plano) => acc + plano.preco,
      0
    );
    setTotal(totalCarrinho);
  }, []);

  const handlePagamento = () => {
    if (metodoPagamento === "cartao") {
      // Verificação para pagamento com cartão
      if (!nome || !cartao || !dataValidade || !codigoSeguranca) {
        alert("Por favor, preencha todos os campos do cartão!");
        return;
      }
    } else if (metodoPagamento === "pix") {
      // Validação simples para pagamento via PIX
      if (!nome) {
        alert("Por favor, preencha o seu nome para pagamento via PIX.");
        return;
      }
    }

    alert("Pagamento realizado com sucesso!");
    localStorage.removeItem("carrinho");
    navigate("/confirmacao");
  };

  return (
    <div className="container mt-5">
      <h1 className="display-3 text-primary text-center">Checkout</h1>

      {/* Itens do Carrinho */}
      <div className="card p-4 mb-5">
        <h4>Itens no Carrinho</h4>
        {carrinho.map((plano, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{plano.nome}</strong> - R${plano.preco}
            </div>
          </div>
        ))}
        <hr />
        <p>
          <strong>Total: </strong>R${total}
        </p>
      </div>

      {/* Formulário de Pagamento */}
      <div className="card p-4">
        <h4>Escolha a Forma de Pagamento</h4>

        {/* Selecione o método de pagamento */}
        <div className="mb-3">
          <label className="form-label">Método de Pagamento</label>
          <select
            className="form-select"
            value={metodoPagamento}
            onChange={(e) => setMetodoPagamento(e.target.value)}
          >
            <option value="cartao">Cartão de Crédito/Débito</option>
            <option value="pix">PIX</option>
          </select>
        </div>

        {/* Formulário para Cartão de Crédito/Débito */}
        {metodoPagamento === "cartao" && (
          <div>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">
                Nome Completo
              </label>
              <input
                type="text"
                className="form-control"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cartao" className="form-label">
                Número do Cartão
              </label>
              <input
                type="text"
                className="form-control"
                id="cartao"
                value={cartao}
                onChange={(e) => setCartao(e.target.value)}
                placeholder="1234 5678 9101 1121"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="validade" className="form-label">
                Data de Validade
              </label>
              <input
                type="text"
                className="form-control"
                id="validade"
                value={dataValidade}
                onChange={(e) => setDataValidade(e.target.value)}
                placeholder="MM/AA"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="codigoSeguranca" className="form-label">
                Código de Segurança
              </label>
              <input
                type="text"
                className="form-control"
                id="codigoSeguranca"
                value={codigoSeguranca}
                onChange={(e) => setCodigoSeguranca(e.target.value)}
                placeholder="123"
              />
            </div>

            {/* Marcas de Cartão */}
            <div className="mb-3">
              <label className="form-label">Marcas de Cartão</label>
              <div className="d-flex gap-3">
                <img
                  src="/imagens/visa.png"
                  alt="Visa"
                  style={{ width: "50px" }}
                />
                <img
                  src="/imagens/mastercard.png"
                  alt="Mastercard"
                  style={{ width: "50px" }}
                />
                <img
                  src="/imagens/amex.png"
                  alt="American Express"
                  style={{ width: "50px" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Formulário para pagamento via PIX */}
        {metodoPagamento === "pix" && (
          <div>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">
                Nome Completo
              </label>
              <input
                type="text"
                className="form-control"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <p>
              Para realizar o pagamento via PIX, por favor, copie o código
              abaixo e faça o pagamento:
            </p>
            <pre style={{ fontSize: "1.2rem", fontFamily: "monospace" }}>
              12345678ABCD0001
            </pre>
            <p>
              Após realizar o pagamento, você será redirecionado para a
              confirmação.
            </p>
          </div>
        )}

        <button
          type="button"
          className="btn btn-success"
          onClick={handlePagamento}
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
}

export default Checkout;
