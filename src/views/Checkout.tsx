import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCcVisa,
  faCcMastercard,
  faPix,
} from "@fortawesome/free-brands-svg-icons";

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
    const itensCarrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setCarrinho(itensCarrinho);
    setTotal(
      itensCarrinho.reduce((acc: number, plano: Plano) => acc + plano.preco, 0)
    );
  }, []);

  const handlePagamento = () => {
    // Validação para cartão
    if (metodoPagamento === "cartao") {
      if (!nome || !cartao || !dataValidade || !codigoSeguranca) {
        alert("Por favor, preencha todos os campos do cartão!");
        return;
      }
      // Validação do número do cartão (deve ter pelo menos 16 dígitos)
      if (cartao.replace(/\D/g, "").length < 16) {
        alert("O número do cartão deve ter 16 dígitos.");
        return;
      }
      // Validação de data de validade (MM/AA)
      const validade = dataValidade.split("/");
      if (
        validade.length !== 2 ||
        validade[0].length !== 2 ||
        validade[1].length !== 2 ||
        isNaN(Number(validade[0])) ||
        isNaN(Number(validade[1]))
      ) {
        alert("Data de validade inválida. Use o formato MM/AA.");
        return;
      }
      // Validação do código de segurança (CVC)
      if (codigoSeguranca.length !== 3 || isNaN(Number(codigoSeguranca))) {
        alert("Código de segurança inválido. Deve ter 3 dígitos.");
        return;
      }
    }

    // Validação para PIX
    if (metodoPagamento === "pix" && !nome) {
      alert("Por favor, preencha o seu nome para pagamento via PIX.");
      return;
    }

    alert("Pagamento realizado com sucesso!");
    localStorage.removeItem("carrinho");
    navigate("/confirmacao");
  };

  // Função para formatar o número do cartão
  const formatarCartao = (cartao: string) => {
    return cartao.replace(/(\d{4})(?=\d)/g, "$1 ****");
  };

  return (
    <div className="container mt-5">
      <h1 className="display-3 text-primary text-center">Checkout</h1>
      <div className="card p-4 mb-5">
        <h4>Itens no Carrinho</h4>
        {carrinho.map((plano, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center"
          >
            <strong>{plano.nome}</strong> - R${plano.preco}
          </div>
        ))}
        <hr />
        <p>
          <strong>Total: </strong>R${total}
        </p>
      </div>

      <div className="card p-4">
        <h4>Escolha a Forma de Pagamento</h4>
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

        {metodoPagamento === "cartao" && (
          <div>
            <div className="d-flex gap-3 mb-3">
              <FontAwesomeIcon icon={faCcVisa} size="2x" color="#1A1F71" />
              <FontAwesomeIcon
                icon={faCcMastercard}
                size="2x"
                color="#EB001B"
              />
            </div>
            <div
              className="card-preview"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "#2C3E50",
                color: "white",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ fontSize: "1.2rem", letterSpacing: "1px" }}>
                <p>{formatarCartao(cartao) || "**** **** **** 1234"}</p>
              </div>
              <p>{nome || "NOME COMPLETO"}</p>
              <div
                className="d-flex justify-content-between"
                style={{ fontSize: "1rem" }}
              >
                <p>{dataValidade || "MM/AA"}</p>
                <p>{codigoSeguranca ? "***" : "CVC"}</p>
              </div>
            </div>

            <input
              type="text"
              className="form-control mb-3"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome Completo"
            />
            <input
              type="text"
              className="form-control mb-3"
              value={cartao}
              onChange={(e) => setCartao(e.target.value)}
              placeholder="Número do Cartão"
            />
            <input
              type="text"
              className="form-control mb-3"
              value={dataValidade}
              onChange={(e) => setDataValidade(e.target.value)}
              placeholder="MM/AA"
            />
            <input
              type="text"
              className="form-control mb-3"
              value={codigoSeguranca}
              onChange={(e) => setCodigoSeguranca(e.target.value)}
              placeholder="CVC"
            />
          </div>
        )}

        {metodoPagamento === "pix" && (
          <div>
            <FontAwesomeIcon
              icon={faPix}
              size="2x"
              color="#00B4D8"
              className="mb-3"
            />
            <input
              type="text"
              className="form-control mb-3"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome Completo"
            />
            <p>Copie o código abaixo para pagamento:</p>
            <pre className="bg-light p-2 rounded">12345678ABCD0001</pre>
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
