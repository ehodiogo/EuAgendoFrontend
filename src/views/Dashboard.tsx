import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { Empresa } from "../interfaces/Empresa";
import { useFetch } from "../functions/GetData";
import DashBoardDados from "../components/DashboardDados";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const token = localStorage.getItem("access_token");
  const empresas_usuario = useFetch<Empresa[]>(
    `api/empresas-usuario/?usuario_token=${token}`
  );
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);

  const handleToggleDropdown = async (empresaId: number) => {
    if (dropdownAberto === empresaId) {
      setDropdownAberto(null);
      return;
    }

    setDropdownAberto(empresaId);
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      {/* Painel do Usuário */}
      <div className="jogos-container">
        <div className="card shadow-lg border-0 p-4 mb-4">
          <h2 className="text-primary mb-4 text-center">
            📊 Painel do Usuário
          </h2>
          <p className="lead text-muted text-center">
            Bem-vindo ao seu painel! Aqui você pode gerenciar suas configurações
            e visualizar seus dados.
          </p>

          <div className="d-flex justify-content-center mb-4 p-4 m-1">
            <div className="text-center me-3">
              <Link to="/perfil" className="btn btn-primary w-100 mb-1">
                Ir para Perfil e Pagamentos
              </Link>
              <p className="text-muted small">
                Gerencie suas informações pessoais, histórico de pagamentos e
                planos ativos.
              </p>
            </div>

            <div className="text-center me-3">
              <Link to="/financeiro" className="btn btn-success w-100 mb-1">
                Ir para Relatório Financeiro e Estatísticas das Empresas
              </Link>
              <p className="text-muted small">
                Acompanhe seu rendimento, serviços mais rentaveis e menos
                rentaveis.
              </p>
            </div>

            <div className="text-center">
              <Link
                to="/minhas-empresas"
                className="btn btn-warning w-100 mb-1"
              >
                Ir para Agendamentos de Hoje das Empresas
              </Link>
              <p className="text-muted small">
                Verifique os agendamentos que estão agendados para suas empresas
                hoje.
              </p>
            </div>
          </div>

          <p className="lead text-muted text-center">
            Selecione uma empresa para ver seus dados de Dashboard.
          </p>

          <div className="row justify-content-center">
            {empresas_usuario.data?.map((empresa: Empresa) => (
              <div className="col-md-6 col-lg-4 mb-4" key={empresa.id}>
                <div
                  className="card shadow-lg"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleToggleDropdown(empresa.id)}
                >
                  <div className="card-body text-center">
                    <h4 className="card-title">{empresa.nome}</h4>
                    <p className="card-text">{empresa.cnpj}</p>
                  </div>
                </div>

                {dropdownAberto === empresa.id && (
                  <div className="card shadow-lg mt-2">
                    <div className="card-body">
                      <DashBoardDados empresa_id={empresa.id} />
                      <Link
                        to={`/empresas/${empresa.nome}`}
                        className="btn btn-primary mt-3 w-100"
                      >
                        Ver Detalhes da Empresa
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
