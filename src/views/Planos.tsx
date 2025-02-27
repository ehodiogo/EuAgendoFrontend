import { FaPix, FaCcVisa, FaCcMastercard, FaCcAmazonPay, FaCcApplePay, FaCreditCard, FaCcAmex, FaCcJcb, FaRegCreditCard } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Planos() {
  const navigate = useNavigate();

  interface Plano {
    nome: string;
    preco: number;
  }
  // TODO: COLOCAR O QUE CADA PLANO OFERECE

  const adicionarAoCarrinho = (plano: Plano) => {
    console.log(`Adicionando ao carrinho: ${plano.nome} - R$${plano.preco}`);
    const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    carrinho.push(plano);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    navigate("/carrinho");
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container mt-5 text-center">
        <h1 className="display-4 text-dark fw-bold">Nossos Planos</h1>
        <p className="lead text-muted">Escolha o plano ideal para você.</p>

        <div className="row justify-content-center mt-4">
          {[
            { nome: "Free Trial", preco: 0, cor: "secondary" },
            { nome: "Plano Básico", preco: 49, cor: "success" },
            { nome: "Plano Profissional", preco: 149, cor: "danger" },
            { nome: "Plano Corporativo", preco: 299, cor: "primary" },
          ].map((plano, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card shadow-lg border-0">
                <div className="card-body text-center">
                  <h4 className={`card-title text-${plano.cor}`}>
                    {plano.nome}
                  </h4>
                  <p className="card-text fw-bold">R${plano.preco}/mês</p>
                  <ul className="list-unstyled text-muted">
                    <li>Agendamentos ilimitados</li>
                    <li>Suporte via e-mail</li>
                    <li>Relatórios avançados</li>
                    <li>Painel financeiro</li>
                  </ul>
                  <button
                    className="btn btn-success w-100"
                    onClick={() => adicionarAoCarrinho(plano)}
                  >
                    Adquirir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 text-center">
          <h5 className="text-dark">Formas de Pagamento Aceitas</h5>
          <div className="d-flex justify-content-center gap-3 mt-2">
            <FaPix size={40} className="text-success" />
            <FaCcVisa size={40} className="text-primary" />
            <FaCcMastercard size={40} className="text-danger" />
            <FaCcAmazonPay size={40} className="text-warning" />
            <FaCcApplePay size={40} className="text-black" />
            <FaCreditCard size={40} className="text-secondary" />
            <FaCcAmex size={40} className="text-info" />
            <FaCcJcb size={40} className="text-dark" />
            <FaRegCreditCard size={40} className="text-dark" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planos;
