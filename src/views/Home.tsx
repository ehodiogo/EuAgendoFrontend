import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/empresas");
  };

  return (
    <div className="container-fluid bg-light">
      {/* Seção Hero */}
      <div className="bg-danger text-white text-center py-5">
        <h1 className="display-3 mb-4">Bem-vindo ao EuAgendo</h1>
        <p className="lead mb-4">
          A plataforma que vai transformar a gestão de seus agendamentos.
          Simples, eficiente e totalmente integrada.
        </p>
        <button className="btn btn-light btn-lg" onClick={handleStartClick}>
          Comece agora
        </button>
      </div>

      {/* Seção Explicação do Projeto */}
      <div className="container mt-5">
        <section className="text-center mb-5">
          <h2 className="text-danger">O Que é o EuAgendo?</h2>
          <p className="lead">
            O EuAgendo é uma plataforma inteligente de agendamentos,
            desenvolvida para melhorar a eficiência de empresas de todos os
            tamanhos. Permite gerenciar compromissos, otimizando o tempo e
            oferecendo um atendimento melhor aos seus clientes.
          </p>
        </section>

        {/* Seção Cliente e Cliente do Cliente */}
        <section className="row text-center mb-5">
          <div className="col-md-6">
            <h3 className="text-danger">Para o Seu Cliente</h3>
            <p className="text-muted">
              Seu cliente pode agendar serviços facilmente, com confirmação
              instantânea e lembretes automáticos para não perder o compromisso.
            </p>
          </div>
          <div className="col-md-6">
            <h3 className="text-danger">Para o Cliente do Seu Cliente</h3>
            <p className="text-muted">
              Seus clientes poderão agendar para os seus próprios clientes, tudo
              em uma única plataforma prática e organizada.
            </p>
          </div>
        </section>

        {/* Seção Planos */}
        <section className="text-center mb-5">
          <h2 className="text-danger">Nossos Planos</h2>
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h4 className="card-title">Plano Básico</h4>
                  <p className="card-text">R$49/mês</p>
                  <ul className="list-unstyled">
                    <li>Agendamentos ilimitados</li>
                    <li>Notificações automáticas</li>
                    <li>Suporte via e-mail</li>
                  </ul>
                  <button className="btn btn-danger" onClick={handleStartClick}>
                    Assine agora
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h4 className="card-title">Plano Profissional</h4>
                  <p className="card-text">R$149/mês</p>
                  <ul className="list-unstyled">
                    <li>Todos os recursos do plano básico</li>
                    <li>Integração com calendário</li>
                    <li>Suporte prioritário</li>
                  </ul>
                  <button className="btn btn-danger" onClick={handleStartClick}>
                    Assine agora
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h4 className="card-title">Plano Corporativo</h4>
                  <p className="card-text">R$299/mês</p>
                  <ul className="list-unstyled">
                    <li>Todos os recursos dos planos anteriores</li>
                    <li>Suporte dedicado 24/7</li>
                    <li>Relatórios avançados</li>
                  </ul>
                  <button className="btn btn-danger" onClick={handleStartClick}>
                    Assine agora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Exemplos */}
        <section className="text-center mb-5">
          <h2 className="text-danger">Exemplos e Amostras</h2>
          <p className="lead text-muted mb-4">
            Veja como o EuAgendo pode transformar o seu negócio:
          </p>
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card shadow-sm">
                <img
                  src="https://via.placeholder.com/300x200"
                  className="card-img-top"
                  alt="Exemplo 1"
                />
                <div className="card-body">
                  <h5 className="card-title">Consultório Médico</h5>
                  <p className="card-text">
                    Agende consultas médicas de forma simples e com notificações
                    automáticas.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm">
                <img
                  src="https://via.placeholder.com/300x200"
                  className="card-img-top"
                  alt="Exemplo 2"
                />
                <div className="card-body">
                  <h5 className="card-title">Salão de Beleza</h5>
                  <p className="card-text">
                    Controle os agendamentos dos clientes com um sistema simples
                    e intuitivo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Rodapé */}
      <footer className="bg-dark text-white py-4 text-center">
        <div>
          <button
            onClick={() => navigate("/sobre")}
            className="btn btn-link text-white"
          >
            Sobre
          </button>
          <button
            onClick={() => navigate("/planos")}
            className="btn btn-link text-white"
          >
            Planos
          </button>
          <button
            onClick={() => navigate("/contato")}
            className="btn btn-link text-white"
          >
            Contato
          </button>
          <button
            onClick={() => navigate("/termos")}
            className="btn btn-link text-white"
          >
            Termos e Políticas
          </button>
        </div>
        <p className="mt-3">
          &copy; 2025 EuAgendo. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

export default Home;
