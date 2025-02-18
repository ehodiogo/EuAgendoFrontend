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

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/empresas" element={<EmpresasSearch />} />
      <Route path="/empresas/:empresa" element={<EmpresaDetails />} />
      <Route path="/agendar/:empresa" element={<Agendar />} />
      <Route path="/agendamentos" element={<h1>Agendamentos</h1>} />
      <Route path="/dashboard" element={<h1>Dashboard</h1>} />

      <Route path="/login" element={<h1>Login</h1>} />
      <Route path="/cadastro" element={<h1>Cadastro</h1>} />
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
