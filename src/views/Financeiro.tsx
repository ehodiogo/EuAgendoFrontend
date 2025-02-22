import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Financeiro() {
  interface EarningsData {
    mesAtual: number[];
    ultimaSemana: number[];
    ultimoMes: number[];
    meses: { month: string; earnings: number }[];
    ano: number[];
  }

  interface Data {
    earnings: EarningsData;
  }

  const [data, setData] = useState<Data | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("mesAtual");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  ); // Pega o mês atual, com a base 0
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  ); // Pega o ano atual

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    setData({
      earnings: {
        mesAtual: [1000, 1200, 1400, 1300, 1100, 1600, 1800],
        ultimaSemana: [200, 250, 300, 350, 400, 450, 500],
        ultimoMes: [1500, 1600, 1700, 1800, 1900, 2000, 2100],
        meses: [
          { month: "Jan", earnings: 1200 },
          { month: "Feb", earnings: 1300 },
          { month: "Mar", earnings: 1400 },
          { month: "Apr", earnings: 1100 },
          { month: "May", earnings: 1600 },
          { month: "Jun", earnings: 1800 },
          { month: "Jul", earnings: 1900 },
          { month: "Aug", earnings: 2000 },
          { month: "Sep", earnings: 2100 },
          { month: "Oct", earnings: 2200 },
          { month: "Nov", earnings: 2300 },
          { month: "Dec", earnings: 2400 },
        ],
        ano: [15000, 16000, 17000, 18000, 19000, 20000],
      },
    });
  }, []);

  console.log("ano atual", selectedYear);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(e.target.value) - 1); // Ajusta o mês para o valor correto
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  if (!data) return <div>Carregando...</div>;

  const earningsChartData = {
    labels:
      selectedPeriod === "mesAtual"
        ? ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
        : selectedPeriod === "ultimaSemana"
        ? ["1", "2", "3", "4", "5", "6", "7"]
        : selectedPeriod === "ultimoMes"
        ? [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ]
        : selectedPeriod === "escolherMes"
        ? ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
        : [],
    datasets: [
      {
        label: "Ganhos",
        data:
          selectedPeriod === "mesAtual"
            ? data.earnings.mesAtual
            : selectedPeriod === "ultimaSemana"
            ? data.earnings.ultimaSemana
            : selectedPeriod === "ultimoMes"
            ? data.earnings.ultimoMes
            : selectedPeriod === "escolherMes"
            ? data.earnings.meses[selectedMonth]?.earnings
            : [],
        fill: false,
        borderColor: "#3498db",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      {/* Painel Financeiro */}
      <div className="container">
        <div className="card shadow-lg border-0 p-4 mb-4">
          <h2 className="text-primary mb-4">📊 Painel Financeiro</h2>

          <div className="d-flex justify-content-between mb-4">
            <button
              className="btn btn-primary"
              onClick={() => handlePeriodChange("ultimaSemana")}
            >
              Última Semana
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handlePeriodChange("mesAtual")}
            >
              Mês Atual
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handlePeriodChange("ultimoMes")}
            >
              Último Mês
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handlePeriodChange("escolherMes")}
            >
              Escolher Mês
            </button>
            <select
              className="form-select w-auto"
              onChange={handleMonthChange}
              disabled={selectedPeriod !== "escolherMes"}
            >
              {data.earnings.meses?.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month.month}
                </option>
              ))}
            </select>
            <select className="form-select w-auto" onChange={handleYearChange}>
              <option value={new Date().getFullYear()}>
                {new Date().getFullYear()}
              </option>
              <option value={new Date().getFullYear() - 1}>
                {new Date().getFullYear() - 1}
              </option>
            </select>
          </div>

          <div className="mb-4" style={{ height: "300px" }}>
            <h4 className="text-primary mb-3">Ganhos</h4>
            <Line
              data={earningsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
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

export default Financeiro;
