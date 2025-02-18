function Sobre() {
  return (
    <div className="container mt-5">
      {/* Seção Introdução */}
      <section className="text-center mb-5">
        <h1 className="display-3 text-danger">Sobre o EuAgendo</h1>
        <p className="lead text-muted">
          O EuAgendo é uma plataforma inovadora de agendamento que visa
          facilitar a gestão de compromissos e melhorar a experiência do
          cliente. Desenvolvemos uma solução prática e eficaz para empresas de
          todos os portes.
        </p>
      </section>

      {/* Seção Missão e Visão */}
      <section className="row text-center mb-5">
        <div className="col-md-6">
          <h3 className="text-danger">Nossa Missão</h3>
          <p className="text-muted">
            A missão do EuAgendo é simplificar a forma como as empresas
            gerenciam seus agendamentos, trazendo mais eficiência e menos
            sobrecarga administrativa.
          </p>
        </div>
        <div className="col-md-6">
          <h3 className="text-danger">Nossa Visão</h3>
          <p className="text-muted">
            Buscamos ser a plataforma de agendamento mais acessível e confiável
            do mercado, ajudando empresas a oferecerem uma experiência impecável
            aos seus clientes.
          </p>
        </div>
      </section>

      {/* Seção Equipe */}
      <section className="text-center mb-5">
        <h2 className="text-danger">Nossa Equipe</h2>
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <img
                src="https://via.placeholder.com/200"
                className="card-img-top"
                alt="Equipe 1"
              />
              <div className="card-body">
                <h5 className="card-title">João Silva</h5>
                <p className="card-text">CEO & Fundador</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <img
                src="https://via.placeholder.com/200"
                className="card-img-top"
                alt="Equipe 2"
              />
              <div className="card-body">
                <h5 className="card-title">Maria Oliveira</h5>
                <p className="card-text">Diretora de Tecnologia</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Sobre;
