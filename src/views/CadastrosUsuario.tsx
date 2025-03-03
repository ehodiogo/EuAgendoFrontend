import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function CadastrosUsuario() {
  return (
    <>
      <Navbar />
      <div className="container text-center py-5">
        <h1 className="mb-4 text-dark fw-bold">
          Cadastros de Empresas, Funcionários e Serviços
        </h1>
        <p className="text-muted">
          📌 Nesta seção, você pode cadastrar novas empresas🏢, funcionários👨‍💼 e
          serviços🛠️. Além disso, em cada uma dessas telas, é possível editar✏️
          ou excluir❌ os dados cadastrados.
        </p>
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          <Link
            to="/criar-empresa"
            className="btn btn-lg btn-success shadow-sm px-5 py-3"
          >
            🏢 Criar Empresa
          </Link>
          <Link
            to="/criar-funcionario"
            className="btn btn-lg btn-warning shadow-sm px-5 py-3"
          >
            👨‍💼 Criar Funcionário
          </Link>
          <Link
            to="/criar-servico"
            className="btn btn-lg btn-info shadow-sm px-5 py-3"
          >
            🛠️ Criar Serviço
          </Link>
        </div>
        <div className="mt-5 text-center">
          <h3 className="fw-bold">⚙️ Fluxo de para Cadastro Correto para Permitir a Geração de Agendamentos</h3>
          <p className="text-muted">
            📌 O fluxo do projeto segue a seguinte lógica:
          </p>

          <ul className="text-muted" style={{ listStyleType: "none" }}>
            <li>
              🏢 O usuário cria uma empresa informando seus dados, incluindo
              horário de abertura e fechamento, se há funcionamento nos finais
              de semana e se há intervalos.
            </li>
            <li>
              👨‍💼 O usuário deve adicionar funcionários para essa empresa e
              associar serviços a cada funcionário.
            </li>
            <li>
              📅 Com esses dados configurados, os clientes poderão selecionar um
              horário disponível dentro do período de funcionamento da empresa,
              escolher um funcionário e o serviço desejado para agendamento.
            </li>
            <li>
              📝 Na tela de cadastro, o usuário pode adicionar novos registros,
              editar✏️ informações existentes ou excluir❌ dados que não são
              mais necessários.
            </li>
            <li>
              💾 As informações são armazenadas no banco de dados e podem ser
              consultadas a qualquer momento.
            </li>
          </ul>

          <div className="mt-4 p-3 border rounded bg-light text-center">
            <h5 className="fw-bold">
              🔗 Relação entre os Dados que você Cadastra
            </h5>

            <pre className="text-dark bg-white p-3 rounded shadow">
              🏢 Empresa XYZ
              <br />
              - 👨‍💼 Funcionário 1
              <br />- 👨‍💼 Funcionário 2
            </pre>

            <pre className="text-dark bg-white p-3 rounded shadow">
              👨‍💼 Funcionário 1
              <br />
              - 🛠️ Serviço 1
              <br />- 🛠️ Serviço 2
            </pre>

            <p className="text-muted">
              📌 Cada empresa🏢 possui diversos funcionários👨‍💼, e cada
              funcionário pode estar associado a diferentes serviços🛠️.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
