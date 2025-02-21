import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

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

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/empresas" element={<EmpresasSearch />} />
      <Route path="/empresas/:empresa" element={<EmpresaDetails />} />
      <Route path="/agendar/:empresa" element={<Agendar />} />
      <Route path="/agendamentos" element={<h1>Agendamentos</h1>} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/esqueci-senha" element={<ForgotPassword />} />

      <Route path="/perfil" element={<h1>Perfil</h1>} />

      <Route path="/contato" element={<Contato />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/planos" element={<Planos />} />
      <Route path="/termos" element={<Termos />} />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;
