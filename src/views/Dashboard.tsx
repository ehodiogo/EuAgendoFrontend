import { Link } from "react-router-dom";

interface DashboardData {
  customersGrowth: number[];
  weeklyAppointments: number[];
  appointmentsToday: number;
  customerSatisfaction: number[];
}

import { Line, Bar, Doughnut } from "react-chartjs-2";
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
  ArcElement,
} from "chart.js";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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
      customerSatisfaction: [90, 85, 88, 92, 93],
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

  const customerSatisfactionChartData = {
    labels: ["Satisfeito", "Neutro", "Insatisfeito"],
    datasets: [
      {
        data: data.customerSatisfaction,
        backgroundColor: ["#27ae60", "#f39c12", "#e74c3c"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
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

          <div className="mb-4" style={{ height: "300px" }}>
            <h4 className="text-primary mb-3">Agendamentos Semanais</h4>
            <Bar
              data={weeklyAppointmentsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>

          <div className="mb-4" style={{ height: "300px" }}>
            <h4 className="text-primary mb-3">Satisfação dos Clientes</h4>
            <Doughnut
              data={customerSatisfactionChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>

          <Link to="/" className="btn btn-success w-100 mt-4">
            Sair
          </Link>
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
