"use client";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import { FaGithub, FaInstagram, FaLinkedin, FaRoad } from "react-icons/fa";
import { BsFillFileLockFill } from "react-icons/bs";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      <header
        className="d-flex align-items-center text-white bg-primary py-5"
        data-aos="fade-down"
      >
        <div className="container d-flex align-items-center">
          <div className="text-center">
            <h1 className="display-4 fw-bold">
              Gerencie seus Agendamentos com Facilidade
            </h1>
            <p className="lead">
              Organize compromissos, reduza faltas e aumente sua produtividade.
            </p>
            <button
              className="btn btn-warning btn-lg px-4 shadow-sm fw-semibold"
              onClick={() => navigate("/empresas")}
            >
              Comece agora
            </button>
          </div>
          <div className="ms-5">
            <img
              src={"eu-agendo.png"}
              alt="Imagem do EuAgendo"
              className="img-fluid rounded"
              style={{ maxWidth: "300px", height: "auto" }}
            />
          </div>
        </div>
      </header>

      <section className="container py-5 text-center" data-aos="fade-up">
        <h2 className="text-primary fw-bold">O que é o EuAgendo?</h2>
        <p className="text-muted mx-auto w-75">
          O EuAgendo é uma plataforma inteligente que simplifica o agendamento
          de compromissos para empresas e clientes. Nossa ferramenta permite um
          gerenciamento eficiente, envio de lembretes automáticos e maior
          organização.
        </p>
      </section>

      <section className="container py-5 text-center" data-aos="fade-up">
        <h2 className="text-primary fw-bold">Benefícios para Você</h2>
        <div className="row mt-4">
          {[
            {
              title: "Para Empresas",
              desc: "Otimize sua agenda e evite falhas na organização dos serviços.",
            },
            {
              title: "Para Clientes",
              desc: "Agendamentos fáceis com confirmações instantâneas.",
            },
            {
              title: "Para Gestores",
              desc: "Aumente a produtividade e reduza o tempo buscando um horário compatível.",
            },
          ].map((item, index) => (
            <div key={index} className="col-md-4">
              <div className="card border-0 shadow-sm p-4">
                <h3 className="text-primary">{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-5 bg-light" data-aos="fade-up">
        <div className="container">
          <h2 className="text-primary fw-bold text-center">
            O que nossos clientes dizem
          </h2>
          <div className="row mt-4 justify-content-center">
            {[
              {
                name: "Mariana R.",
                review:
                  "O EuAgendo revolucionou meu negócio! Nunca foi tão fácil organizar meus clientes.",
                stars: "⭐⭐⭐⭐⭐",
              },
              {
                name: "Carlos M.",
                review:
                  "Reduziu o tempo de organizar meus atendimentos em 90% com a facilidade para visualizar horários disponíveis!",
                stars: "⭐⭐⭐⭐⭐",
              },
              {
                name: "Fernanda T.",
                review:
                  "Prático, eficiente e muito intuitivo. Recomendo para todos os autônomos!",
                stars: "⭐⭐⭐⭐⭐",
              },
            ].map((item, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card border-0 shadow-lg d-flex flex-column h-100 p-4">
                  <p className="fw-semibold">"{item.review}"</p>
                  <p className="text-warning fs-4">{item.stars}</p>
                  <h5 className="text-muted">- {item.name}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" data-aos="fade-up">
        <div className="container text-center">
          <h2 className="text-primary fw-bold">Escolha seu Plano</h2>
          <div className="row mt-4">
            {["Básico", "Profissional", "Corporativo"].map((plano, index) => (
              <div key={index} className="col-md-4">
                <div className="card border-0 shadow-lg p-4">
                  <h3 className="text-primary">{plano}</h3>
                  <p className="text-muted">
                    {plano === "Básico"
                      ? "Ideal para pequenos negócios"
                      : plano === "Profissional"
                      ? "Para negócios crescentes"
                      : "Para grandes empresas"}
                    .
                  </p>
                  <button
                    className="btn btn-warning px-4 fw-semibold"
                    onClick={() => navigate("/planos")}
                  >
                    Assine agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light" data-aos="fade-up">
        <div className="container text-center">
          <h2 className="text-primary fw-bold">Lançamentos Futuros</h2>

          <p className="text-muted">Confira o que está por vir no EuAgendo.</p>
          <button
            className="btn btn-warning mt-3 px-4 fw-semibold"
            onClick={() => navigate("/roadmap")}
          >
            Ver Roadmap
          </button>
        </div>
      </section>

      <footer className="bg-primary text-white text-center py-5">
        <div className="container">
          <p className="mb-0">
            &copy; 2025 EuAgendo. Todos os direitos reservados.
          </p>
          <div className="d-flex justify-content-center gap-4 mt-3">
            <a
              href="/termos"
              className="text-white text-decoration-none d-flex align-items-center"
            >
              <BsFillFileLockFill className="me-2" />
              Termos de Serviço
            </a>
            <a
              href="https://www.github.com/ehodiogo"
              className="text-white text-decoration-none d-flex align-items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="me-2" />
              GitHub
            </a>
            <a
              href="https://www.instagram.com/ehodiogo"
              className="text-white text-decoration-none d-flex align-items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="me-2" />
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/dabpereira"
              className="text-white text-decoration-none d-flex align-items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="me-2" />
              LinkedIn
            </a>
            <a
              href="/roadmap"
              className="text-white text-decoration-none d-flex align-items-center"
            >
              <FaRoad className="me-2" />
              Roadmap
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
