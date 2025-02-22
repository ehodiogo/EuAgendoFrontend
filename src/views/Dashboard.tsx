import { Line, Bar } from "react-chartjs-2";
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

interface DashboardData {
  customersGrowth: number[];
  weeklyAppointments: number[];
  appointmentsToday: number;
  weeklyEarnings: number[];
}
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom"; // Importando Link para navegação

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

  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Aqui você pode adicionar lógica para buscar os dados reais
    setData({
      customersGrowth: [10, 20, 30, 40, 50, 60, 70],
      weeklyAppointments: [3, 5, 8, 6, 7, 10, 11],
      appointmentsToday: 5,
      weeklyEarnings: [100, 150, 200, 250, 300, 350, 400], // Ganhos semanais
    });
  }, []);

  if (!data) return <div>Carregando...</div>;

  const customerGrowthChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Crescimento de Clientes",
        data: data.customersGrowth,
        fill: false,
        borderColor: "#3498db",
        tension: 0.1,
      },
    ],
  };

  const weeklyAppointmentsChartData = {
    labels: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    datasets: [
      {
        label: "Agendamentos Semanais",
        data: data.weeklyAppointments,
        backgroundColor: "#f39c12",
        borderColor: "#f39c12",
        borderWidth: 1,
      },
    ],
  };

  const weeklyEarningsChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Valor Ganho por Semana",
        data: data.weeklyEarnings,
        fill: false,
        borderColor: "#2ecc71",
        tension: 0.1,
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/";
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      {/* Painel do Usuário */}
      <div className="jogos-container">
        <div className="card shadow-lg border-0 p-4 mb-4">
          <h2 className="text-primary mb-4">📊 Painel do Usuário</h2>
          <p>
            Bem-vindo ao seu painel! Aqui você pode gerenciar suas configurações
            e visualizar seus dados.
          </p>

          {/* Links para Perfil e Financeiro */}
          <div className="d-flex justify-content-center mb-4 p-4 m-1">
            <Link to="/perfil" className="btn btn-primary w-48 me-2">
              Ir para Perfil
            </Link>
            <Link to="/financeiro" className="btn btn-success w-48">
              Ir para Financeiro
            </Link>
          </div>

          <div className="d-flex justify-content-between mb-4">
            <div className="d-flex flex-column align-items-center">
              <h4 className="text-primary">Agendamentos Hoje</h4>
              <h2 className="text-primary">{data.appointmentsToday}</h2>
            </div>
            <div className="d-flex flex-column align-items-center">
              <h4 className="text-primary">Clientes</h4>
              <h2 className="text-primary">
                {data.customersGrowth[data.customersGrowth.length - 1]}
              </h2>
            </div>
          </div>

          <div className="mb-4" style={{ height: "300px" }}>
            <h4 className="text-primary mb-3">
              Crescimento de Clientes (Mensal)
            </h4>
            <Line
              data={customerGrowthChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>

          <div className="mb-4 mt-4" style={{ height: "300px" }}>
            <h4 className="text-primary mb-3">Agendamentos Semanais</h4>
            <Bar
              data={weeklyAppointmentsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>

          <div className="mb-4 mt-4" style={{ height: "300px" }}>
            <h4 className="text-primary mb-3">Valor Ganho por Semana</h4>
            <Line
              data={weeklyEarningsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>

          <button onClick={handleLogout} className="btn btn-danger w-100 mt-4">
            Sair
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-3">
        <p className="mb-0">
          &copy; 2025 EuAgendo. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
