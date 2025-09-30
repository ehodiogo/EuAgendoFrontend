import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { lazy, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Home = lazy(() => import("./views/Home"));
const EmpresasSearch = lazy(() => import("./views/EmpresasSearch"));
const Agendar = lazy(() => import("./views/Agendar"));
const EmpresaDetails = lazy(() => import("./views/Empresa"));

const Sobre = lazy(() => import("./views/Sobre"));
const Planos = lazy(() => import("./views/Planos"));
const Termos = lazy(() => import("./views/Termos"));
const Contato = lazy(() => import("./views/Contato"));
const Dashboard = lazy(() => import("./views/Dashboard"));
const Login = lazy(() => import("./views/Login"));
const Register = lazy(() => import("./views/Cadastro"));
const ForgotPassword = lazy(() => import("./views/EsqueciSenha"));
const Financeiro = lazy(() => import("./views/Financeiro"));
const NotFound = lazy(() => import("./views/404NotFound"));
const EmpresasUsuario = lazy(() => import("./views/AgendamentosEmpresa"));
const Profile = lazy(() => import("./views/Perfil"));
const Carrinho = lazy(() => import("./views/Carrinho"));
const Confirmacao = lazy(() => import("./views/Confirmacao"));
const SuccessPage = lazy(() => import("./views/Success"));
const FailurePage = lazy(() => import("./views/Failure"));
const PendingPage = lazy(() => import("./views/Pending"));
const ValidarPlano = lazy(() => import("./views/ValidarPlano"));
const Roadmap = lazy(() => import("./views/Roadmap"));
const CadastrosUsuario = lazy(() => import("./views/CadastrosUsuario"));
const AvaliacaoAgendamento = lazy(() => import("./views/AvaliarAgendamento"))
const EmpresaCreate = lazy(() => import("./views/EmpresaCriar"));
const FuncionarioCreate = lazy(() => import("./views/FuncionarioCriar"));
const ServicoCreate = lazy(() => import("./views/ServicosCriar"));
const Configuracao = lazy(() => import("./views/Configuracoes"));
const Checkin = lazy(() => import("./views/Checkin"));
const CheckinEmpresa = lazy(() => import("./views/CheckinEmpresa"));

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem("access_token");
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const verificaTempoConexao = () => {
      const token = localStorage.getItem("access_token");
      const ultimoAcesso = localStorage.getItem("ultimo_acesso");
      const agora = new Date().getTime();

      if (ultimoAcesso && token) {
        const diferenca = agora - parseInt(ultimoAcesso);
        const minutos = Math.floor(diferenca / 60000);

        if (minutos > 1439) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("ultimo_acesso");
          localStorage.removeItem("carrinho");
          navigate("/login");
        }
      }
    };

    verificaTempoConexao();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/empresas" element={<EmpresasSearch />} />
      <Route path="/empresas/:empresa" element={<EmpresaDetails />} />
      <Route path="/agendar/:empresa" element={<Agendar />} />
      <Route path="/agendamentos" element={<h1>Agendamentos</h1>} />
      <Route path="/agendamento/:identificador/avaliar" element={<AvaliacaoAgendamento />} />

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/esqueci-senha" element={<ForgotPassword />} />

      <Route
        path="/criar-empresa"
        element={
          <ProtectedRoute>
            <EmpresaCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/criar-funcionario/:empresa?"
        element={
          <ProtectedRoute>
            <FuncionarioCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/criar-servico/:funcionario?"
        element={
          <ProtectedRoute>
            <ServicoCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/minhas-empresas"
        element={
          <ProtectedRoute>
            <EmpresasUsuario />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/carrinho"
        element={
          <ProtectedRoute>
            <Carrinho />
          </ProtectedRoute>
        }
      />
      <Route
        path="/confirmacao"
        element={
          <ProtectedRoute>
            <Confirmacao />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cadastros-usuario"
        element={
          <ProtectedRoute>
            <CadastrosUsuario />
          </ProtectedRoute>
        }
      />
      <Route
        path="/financeiro"
        element={
          <ProtectedRoute>
            <Financeiro />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment/success"
        element={
          <ProtectedRoute>
            <SuccessPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment/failure"
        element={
          <ProtectedRoute>
            <FailurePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment/pending"
        element={
          <ProtectedRoute>
            <PendingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/validar-plano"
        element={
          <ProtectedRoute>
            <ValidarPlano />
          </ProtectedRoute>
        }
      />

        <Route path="/configuracoes"
               element={
            <ProtectedRoute>
                <Configuracao />
            </ProtectedRoute>
           }
       />

        <Route path="/checkin"
               element={
            <ProtectedRoute>
                <Checkin />
            </ProtectedRoute>
           }
       />

        <Route path="/checkin/empresa/:empresaId"
               element={
            <ProtectedRoute>
                <CheckinEmpresa />
            </ProtectedRoute>
           }
       />

      <Route path="/contato" element={<Contato />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/planos" element={<Planos />} />
      <Route path="/termos" element={<Termos />} />
      <Route path="/roadmap" element={<Roadmap />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
