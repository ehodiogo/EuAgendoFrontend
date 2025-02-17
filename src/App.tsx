import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import EmpresasSearch from "./views/EmpresasSearch";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/empresas" element={<EmpresasSearch />} />
        <Route path="/agendar/:empresa" element={<h1>Agendar</h1>} />
        <Route path="/agendamentos" element={<h1>Agendamentos</h1>} />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />

        <Route path="/login" element={<h1>Login</h1>} />
        <Route path="/cadastro" element={<h1>Cadastro</h1>} />
        <Route path="/perfil" element={<h1>Perfil</h1>} />
        <Route path="/contato" element={<h1>Contato</h1>} />


        <Route path="*" element={<h1>404</h1>} />
      </Routes>
  );
}

export default App;
