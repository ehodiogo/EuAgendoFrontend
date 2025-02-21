import Navbar from "../components/Navbar";

function Contato() {
  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <section className="text-center mb-5">
          <h1 className="display-3 text-primary">Fale Conosco</h1>
          <p className="lead text-muted">
            Tem alguma dúvida ou sugestão? Estamos aqui para ajudar! Preencha o
            formulário abaixo para entrar em contato conosco.
          </p>
        </section>

        <form>
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">
              Nome
            </label>
            <input type="text" className="form-control" id="nome" required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input type="email" className="form-control" id="email" required />
          </div>
          <div className="mb-3">
            <label htmlFor="mensagem" className="form-label">
              Mensagem
            </label>
            <textarea
              className="form-control"
              id="mensagem"
              rows={5}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success">
            Enviar
          </button>
        </form>
      </div>
    </>
  );
}

export default Contato;
