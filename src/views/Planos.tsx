import Navbar from "../components/Navbar";

function Planos() {
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
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title">Plano Básico</h4>
                <p className="card-text">R$49/mês</p>
                <ul className="list-unstyled">
                  <li>Agendamentos ilimitados</li>
                  <li>Notificações automáticas</li>
                  <li>Suporte via e-mail</li>
                </ul>
                <button className="btn btn-success">Assine agora</button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title">Plano Profissional</h4>
                <p className="card-text">R$149/mês</p>
                <ul className="list-unstyled">
                  <li>Integração com calendário</li>
                  <li>Suporte prioritário</li>
                  <li>Relatórios básicos</li>
                </ul>
                <button className="btn btn-success">Assine agora</button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title">Plano Corporativo</h4>
                <p className="card-text">R$299/mês</p>
                <ul className="list-unstyled">
                  <li>Todos os recursos anteriores</li>
                  <li>Suporte dedicado 24/7</li>
                  <li>Relatórios avançados</li>
                </ul>
                <button className="btn btn-success">Assine agora</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planos;
