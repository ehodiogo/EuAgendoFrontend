import {
  FaPix,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmazonPay,
  FaCcApplePay,
  FaCreditCard,
  FaCcAmex,
  FaCcJcb,
  FaRegCreditCard,
} from "react-icons/fa6";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Planos() {
  const navigate = useNavigate();

  interface Plano {
    nome: string;
    preco: number;
  }

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

        <div className="mt-5 text-center">
          <h5 className="text-dark">O que acontece se meu plano vencer?</h5>
          <p className="text-muted">
            Veja abaixo o que pode acontecer dependendo de quanto tempo se
            passar após o vencimento do seu plano:
          </p>

          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped table-hover">
              <thead>
                <tr>
                  <th>Tempo após Vencimento</th>
                  <th>Consequências</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Até 24 horas</td>
                  <td>
                    Seus clientes ainda podem agendar para o <span className="text-danger fw-bold">DIA ATUAL OU DIA SEGUINTE</span>.
                  </td>
                </tr>
                <tr>
                  <td>Entre 24 e 49 horas</td>
                  <td>
                    Seus clientes <span className="text-danger fw-bold">SÓ</span> podem agendar para o <span className="text-danger fw-bold">DIA ATUAL</span>.
                  </td>
                </tr>
                <tr>
                  <td>Mais de 49 horas</td>
                  <td>
                    Acesso completo ao serviço fica <span className="text-danger fw-bold">BLOQUEADO</span> até a renovação da
                    assinatura. Seus clientes <span className="text-danger fw-bold">NÃO</span> podem agendar.
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="text-muted">
              <span className="text-danger fw-bold">IMPORTANTE:</span> Para reativar o acesso completo ao nosso serviço, basta renovar o plano.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planos;
