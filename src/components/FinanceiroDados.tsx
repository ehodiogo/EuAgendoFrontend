import { useFetch } from "../functions/GetData";
import { Financeiro } from "../interfaces/DashboardEarnings";
import { FaDollarSign, FaSpinner, FaChartPie, FaBriefcase, FaUsers, FaClock, FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FinanceiroProps {
  empresa_id: number;
}

const FinanceiroDados = ({ empresa_id }: FinanceiroProps) => {
  const dadosFinanceiros = useFetch<Financeiro>(`/api/financeiro/?empresa_id=${empresa_id}`);

  const empresaTipo = dadosFinanceiros.data?.tipo;
  const isLocacao = empresaTipo === "Locação";

  const formatValue = (value: number | undefined) => (value ? `R$ ${value.toFixed(2)}` : "R$ 0.00");

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
          "rgba(0, 48, 135, 0.9)", // primary-blue
          "rgba(0, 86, 179, 0.9)", // accent-blue
          "rgba(40, 167, 69, 0.9)" // success-green
        ],
        borderColor: [
          "rgba(0, 48, 135, 1)",
          "rgba(0, 86, 179, 1)",
          "rgba(40, 167, 69, 1)"
        ],
        borderWidth: 1,
        borderRadius: 4,
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
        text: "Resumo de Receita (Total, Mês, Semana)",
        color: "#003087",
        font: { size: 16, weight: "700" },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Receita: ${formatValue(context.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        title: {
          display: true,
          text: "Receita (R$)",
          color: "#212529",
          font: { size: 14, weight: '600' },
        },
        ticks: {
          color: "#212529",
          callback: (value: any) => `R$ ${value.toFixed(0)}`,
        },
      },
      x: {
        grid: { display: false },
        title: {
          display: false,
        },
        ticks: { color: "#212529", font: { weight: '600' } },
      },
    },
  };

  const FinanceiroItem = ({ icon: Icon, label, value, isMonetary = true }: { icon: any, label: string, value: string, isMonetary?: boolean }) => (
    <div className="financeiro-item">
      <Icon className="text-primary-blue" />
      <div className="financeiro-item-content">
        <strong className="d-block">{label}</strong>
        <span className={`text-${isMonetary ? 'success-green' : 'dark-gray'} fw-bold`}>{value}</span>
      </div>
    </div>
  );

  return (
    <div className="financeiro-dados-content">
      <style>{`
        /* Novas variáveis de cor */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --medium-gray: #6c757d;
          --light-gray-bg: #f5f7fa;
          --white: #ffffff;
          --success-green: #28a745;
          --danger-red: #dc3545;
          --border-light: #e0e0e0;
        }

        /* Estilos do Container Principal */
        .financeiro-dados-content { padding: 0; }
        
        /* Card interno de Dados Detalhados */
        .details-card {
          background-color: var(--light-gray-bg);
          border-radius: 8px;
          padding: 1.5rem;
          height: 100%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .details-card h5 {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid var(--border-light);
          padding-bottom: 0.5rem;
        }

        /* Itens Detalhados */
        .financeiro-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px dashed var(--border-light);
        }
        .financeiro-item:last-child { border-bottom: none; }
        .financeiro-item-content strong {
            font-size: 0.95rem;
            color: var(--dark-gray);
            font-weight: 600;
        }
        .financeiro-item-content span {
            font-size: 1rem;
            color: var(--success-green); 
            display: block;
            margin-top: 2px;
        }
        .financeiro-item svg {
          color: var(--primary-blue);
          font-size: 1.5rem;
          margin-top: 4px; 
        }
        
        /* Controles de Loading e Erro */
        .loading-container, .error-container {
          text-align: center;
          color: var(--medium-gray);
          font-size: 1.1rem;
          padding: 2rem;
        }
        .error-container {
          color: var(--danger-red);
          font-weight: 500;
        }
        
        /* Estilo do Container do Gráfico */
        .chart-container {
          padding: 1.5rem;
          background-color: var(--white);
          border-radius: 8px;
          height: 400px; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* Layout em colunas para desktop */
        @media (min-width: 992px) {
            .financeiro-row {
                display: flex;
                gap: 1.5rem; 
            }
            .financeiro-col-details {
                flex: 1; 
                max-width: 40%;
            }
            .financeiro-col-chart {
                flex: 1; 
                max-width: 60%;
            }
        }
        /* Responsividade móvel */
        @media (max-width: 991px) {
            .financeiro-col-details {
                margin-bottom: 1.5rem;
            }
            .chart-container {
                height: 350px;
            }
        }
      `}</style>

      {dadosFinanceiros.loading ? (
        <div className="loading-container">
          <FaSpinner className="fa-spin me-2" /> Carregando dados financeiros da empresa...
        </div>
      ) : !dadosFinanceiros.data ? (
        <div className="error-container alert alert-info">
          Nenhum dado financeiro disponível para esta empresa.
        </div>
      ) : (
        <div className="row financeiro-row">

          <div className="col-lg-5 financeiro-col-details">
            <div className="details-card">
              <h5><FaChartPie className="me-2"/> Principais Indicadores</h5>

              <FinanceiroItem
                icon={FaDollarSign}
                label="Receita Total"
                value={formatValue(dadosFinanceiros.data.total_ganhos)}
              />
              <FinanceiroItem
                icon={FaClock}
                label="Receita Mensal Atual"
                value={formatValue(dadosFinanceiros.data.ganhos_por_mes)}
              />
              <FinanceiroItem
                icon={FaClock}
                label="Receita Semanal Atual"
                value={formatValue(dadosFinanceiros.data.ganhos_por_semana)}
              />

              <hr className="my-3 text-medium-gray" />

              {isLocacao ? (
                <>
                  <FinanceiroItem
                    icon={FaArrowUp}
                    label="Locação Mais Rentável"
                    value={`${dadosFinanceiros.data.locacao_mais_rentavel?.locacao__nome || "Nenhuma"} (${formatValue(dadosFinanceiros.data.locacao_mais_rentavel?.total)})`}
                    isMonetary={false}
                  />
                  <FinanceiroItem
                    icon={FaArrowDown}
                    label="Locação Menos Rentável"
                    value={`${dadosFinanceiros.data.locacao_menos_rentavel?.locacao__nome || "Nenhuma"} (${formatValue(dadosFinanceiros.data.locacao_menos_rentavel?.total)})`}
                    isMonetary={false}
                  />
                </>
              ) : (
                <>
                  <FinanceiroItem
                    icon={FaUsers}
                    label="Funcionário Top"
                    value={`${dadosFinanceiros.data.funcionario_top?.funcionario__nome || "Nenhum"} (${formatValue(dadosFinanceiros.data.funcionario_top?.total)})`}
                    isMonetary={false}
                  />
                  <FinanceiroItem
                    icon={FaBriefcase}
                    label="Serviço Mais Rentável"
                    value={`${dadosFinanceiros.data.servico_mais_rentavel?.servico__nome || "Nenhum"} (${formatValue(dadosFinanceiros.data.servico_mais_rentavel?.total)})`}
                    isMonetary={false}
                  />
                  <FinanceiroItem
                    icon={FaBriefcase}
                    label="Serviço Menos Rentável"
                    value={`${dadosFinanceiros.data.servico_menos_rentavel?.servico__nome || "Nenhum"} (${formatValue(dadosFinanceiros.data.servico_menos_rentavel?.total)})`}
                    isMonetary={false}
                  />
                </>
              )}

            </div>
          </div>

          <div className="col-lg-7 financeiro-col-chart">
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions as any} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceiroDados;