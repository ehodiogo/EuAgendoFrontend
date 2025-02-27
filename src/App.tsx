import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Carregamento preguiçoso dos componentes
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

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem("access_token");
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/empresas" element={<EmpresasSearch />} />
        <Route path="/empresas/:empresa" element={<EmpresaDetails />} />
        <Route path="/agendar/:empresa" element={<Agendar />} />
        <Route path="/agendamentos" element={<h1>Agendamentos</h1>} />

        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />

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
          path="/historico"
          element={
            <ProtectedRoute>
              <h1>Histórico</h1>
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

        <Route path="/payment/success" element={
          <ProtectedRoute>
            <SuccessPage />
          </ProtectedRoute>
        }
        />

        <Route path="/payment/failure" element={
          <ProtectedRoute>
            <FailurePage />
          </ProtectedRoute>
        }

        />

        <Route path="/payment/pending" element={
          <ProtectedRoute>
            <PendingPage />
          </ProtectedRoute>
        }
        />

        <Route path="/contato" element={<Contato />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/termos" element={<Termos />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;
