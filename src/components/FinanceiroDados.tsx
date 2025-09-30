import { useFetch } from "../functions/GetData";
import { Financeiro } from "../interfaces/DashboardEarnings";
import { FaChartLine, FaDollarSign, FaSpinner } from "react-icons/fa";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FinanceiroProps {
  empresa_id: number;
}

const FinanceiroDados = ({ empresa_id }: FinanceiroProps) => {
  const dadosFinanceiros = useFetch<Financeiro>(`/api/financeiro/?empresa_id=${empresa_id}`);

  const chartData = {
    labels: ["Total", "Mensal", "Semanal"],
    datasets: [
      {
        label: "Receita (R$)",
        data: [
          dadosFinanceiros.data?.total_ganhos || 0,
          dadosFinanceiros.data?.ganhos_por_mes || 0,
          dadosFinanceiros.data?.ganhos_por_semana || 0,
        ],
        backgroundColor: [
          "rgba(0, 48, 135, 0.8)", // primary-blue
          "rgba(77, 171, 247, 0.8)", // light-blue
          "rgba(40, 167, 69, 0.8)" // success-green
        ],
        borderColor: [
          "rgba(0, 48, 135, 1)",
          "rgba(77, 171, 247, 1)",
          "rgba(40, 167, 69, 1)"
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Resumo de Receita",
        color: "#003087",
        font: { size: 16, weight: "600" },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `R$ ${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Receita (R$)",
          color: "#2d3748",
          font: { size: 14 },
        },
        ticks: {
          color: "#2d3748",
          callback: (value: any) => `R$ ${value.toFixed(2)}`,
        },
      },
      x: {
        title: {
          display: true,
          text: "Período",
          color: "#2d3748",
          font: { size: 14 },
        },
        ticks: { color: "#2d3748" },
      },
    },
  };

  return (
    <div>
      <style>{`
        :root {
          --primary-blue: #003087;
          --light-blue: #4dabf7;
          --dark-gray: #2d3748;
          --light-gray: #f7fafc;
          --white: #ffffff;
          --accent-yellow: #f6c107;
          --success-green: #28a745;
          --danger-red: #dc3545;
        }
        .financeiro-dados-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          padding: 2rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .financeiro-dados-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }
        .financeiro-dados-card h4 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .financeiro-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e2e8f0;
          transition: background-color 0.3s ease;
        }
        .financeiro-item:last-child {
          border-bottom: none;
        }
        .financeiro-item:hover {
          background-color: rgba(77, 171, 247, 0.05);
        }
        .financeiro-item svg {
          color: var(--light-blue);
          font-size: 1.2rem;
        }
        .financeiro-item strong {
          color: var(--dark-gray);
          font-weight: 600;
          font-size: 1rem;
        }
        .financeiro-item span {
          color: var(--dark-gray);
          font-size: 1rem;
        }
        .loading-container, .error-container {
          text-align: center;
          color: var(--dark-gray);
          font-size: 1.1rem;
          padding: 2rem;
        }
        .error-container {
          color: var(--danger-red);
          font-weight: 500;
        }
        .chart-container {
          margin-top: 2rem;
          padding: 1rem;
          background-color: var(--light-gray);
          border-radius: 8px;
          height: 300px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        @media (max-width:576px){
          .financeiro-dados-card{padding:1.5rem;}
          .financeiro-dados-card h4{font-size:1.25rem;}
          .financeiro-item{font-size:0.9rem;}
          .financeiro-item svg{font-size:1rem;}
          .chart-container{padding:0.5rem;height:250px;}
        }
      `}</style>

      <div className="financeiro-dados-card">
        <h4>
          <FaChartLine /> Informações Financeiras
        </h4>

        {dadosFinanceiros.loading ? (
          <div className="loading-container">
            <FaSpinner className="fa-spin me-2" /> Carregando dados...
          </div>
        ) : dadosFinanceiros.error ? (
          <div className="error-container">
            Erro ao carregar dados: {dadosFinanceiros.error}
          </div>
        ) : !dadosFinanceiros.data ? (
          <div className="error-container">
            Nenhum dado financeiro disponível para esta empresa.
          </div>
        ) : (
          <>
            <div className="list-group list-group-flush">
              <div className="financeiro-item">
                <FaDollarSign />
                <strong>Receita Total:</strong>
                <span>R$ {dadosFinanceiros.data.total_ganhos?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="financeiro-item">
                <FaDollarSign />
                <strong>Receita Mensal Atual:</strong>
                <span>R$ {dadosFinanceiros.data.ganhos_por_mes?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="financeiro-item">
                <FaDollarSign />
                <strong>Receita Semanal Atual:</strong>
                <span>R$ {dadosFinanceiros.data.ganhos_por_semana?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="financeiro-item">
                <FaDollarSign />
                <strong>Funcionário que mais gerou receita:</strong>
                <span>{dadosFinanceiros.data.funcionario_top?.funcionario__nome || "Nenhum"} - R$ {dadosFinanceiros.data.funcionario_top?.total?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="financeiro-item">
                <FaDollarSign />
                <strong>Serviço mais rentável:</strong>
                <span>{dadosFinanceiros.data.servico_mais_rentavel?.servico__nome || "Nenhum"} - R$ {dadosFinanceiros.data.servico_mais_rentavel?.total?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="financeiro-item">
                <FaDollarSign />
                <strong>Serviço que menos gerou receita:</strong>
                <span>{dadosFinanceiros.data.servico_menos_rentavel?.servico__nome || "Nenhum"} - R$ {dadosFinanceiros.data.servico_menos_rentavel?.total?.toFixed(2) || "0.00"}</span>
              </div>
            </div>

            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FinanceiroDados;
