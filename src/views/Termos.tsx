import Navbar from "../components/Navbar";

function Termos() {
  return (

    <div>

      <Navbar />
      <div className="container mt-5">
        <section className="text-center mb-5">
          <h1 className="display-3 text-primary">Termos e Políticas</h1>
          <p className="lead text-muted">
            Antes de usar nossos serviços, por favor, leia nossos Termos de Uso e
            Políticas de Privacidade.
          </p>
        </section>

        <section className="mb-5">
          <h4 className="text-primary">Termos de Uso</h4>
          <p className="text-muted">
            Ao utilizar nossos serviços, você concorda com os termos descritos
            neste documento. Caso não concorde, não utilize a plataforma.
          </p>
        </section>

        <section className="mb-5">
          <h4 className="text-primary">Política de Privacidade</h4>
          <p className="text-muted">
            Sua privacidade é muito importante para nós. Coletamos e utilizamos
            informações pessoais conforme descrito em nossa política de
            privacidade.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Termos;
