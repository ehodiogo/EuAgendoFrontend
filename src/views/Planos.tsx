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

    // Recuperar o carrinho atual do localStorage
    const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");

    // Adicionar o novo plano ao carrinho
    carrinho.push(plano);

    // Salvar o carrinho de volta no localStorage
    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    // Redireciona para o checkout
    navigate("/carrinho");
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <section className="text-center mb-5">
          <h1 className="display-3 text-primary">Nossos Planos</h1>
          <p className="lead text-muted">
            Escolha o plano que melhor se adapta às suas necessidades.
          </p>
        </section>

        <div className="row justify-content-center">
          {/* Plano Básico */}
          <div className="col-md-4">
            <div className="card shadow-lg">
              <div className="card-body text-center">
                <h4 className="card-title text-success">Plano Básico</h4>
                <p className="card-text fw-bold">R$49/mês</p>
                <ul className="list-unstyled">
                  <li>Agendamentos ilimitados</li>
                  <li className="fw-bold">1 empresa</li>
                  <li>Suporte via e-mail</li>
                  <li>Relatórios básicos</li>
                  <li>Painel financeiro</li>
                </ul>
                <button
                  className="btn btn-success"
                  onClick={() =>
                    adicionarAoCarrinho({
                      nome: "Plano Básico",
                      preco: 49,
                    })
                  }
                >
                  Adquirir
                </button>
              </div>
            </div>
          </div>

          {/* Plano Profissional */}
          <div className="col-md-4">
            <div className="card shadow-lg">
              <div className="card-body text-center">
                <h4 className="card-title text-danger">Plano Profissional</h4>
                <p className="card-text fw-bold">R$149/mês</p>
                <ul className="list-unstyled">
                  <li>Agendamentos ilimitados</li>
                  <li className="fw-bold">5 empresas</li>
                  <li>Suporte via e-mail</li>
                  <li>Relatórios avançados</li>
                  <li>Painel financeiro</li>
                </ul>
                <button
                  className="btn btn-success"
                  onClick={() =>
                    adicionarAoCarrinho({
                      nome: "Plano Profissional",
                      preco: 149,
                    })
                  }
                >
                  Adquirir
                </button>
              </div>
            </div>
          </div>

          {/* Plano Corporativo */}
          <div className="col-md-4">
            <div className="card shadow-lg">
              <div className="card-body text-center">
                <h4 className="card-title text-primary">Plano Corporativo</h4>
                <p className="card-text fw-bold">R$299/mês</p>
                <ul className="list-unstyled">
                  <li>Agendamentos ilimitados</li>
                  <li className="fw-bold">20 empresas</li>
                  <li>Suporte via e-mail</li>
                  <li>Relatórios avançados</li>
                  <li>Painel financeiro</li>
                </ul>
                <button
                  className="btn btn-success"
                  onClick={() =>
                    adicionarAoCarrinho({
                      nome: "Plano Corporativo",
                      preco: 299,
                    })
                  }
                >
                  Adquirir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planos;
