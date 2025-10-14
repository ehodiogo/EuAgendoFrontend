import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaUser, FaCalendarAlt, FaSpinner, FaExclamationTriangle, FaEnvelope, FaPhone } from "react-icons/fa";

interface Agendamento {
  id: number;
  data: string;
  hora: string;
  servico_nome: string;
  funcionario_nome: string;
  empresa_nome: string;
  preco: string;
}

interface ClienteData {
  id: number;
  nome: string;
  telefone: string;
  email: string;
}

const ClienteDashboard: React.FC = () => {
  const { clienteIdentificador } = useParams<{ clienteIdentificador: string }>();

  const [cliente, setCliente] = useState<ClienteData | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CLIENTE_IDENTIFICADOR = clienteIdentificador || localStorage.getItem("cliente_id_token");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!CLIENTE_IDENTIFICADOR) {
      setError("Identificador do cliente não encontrado na URL ou no armazenamento.");
      setLoading(false);
      return;
    }

    const fetchClienteData = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = import.meta.env.VITE_API_URL;
        const authHeaders = { headers: { Authorization: `Token ${token}` } };

        const clienteDetalheUrl = `${url}/api/clientes/${CLIENTE_IDENTIFICADOR}/`;
        const clienteResponse = await axios.get<ClienteData>(clienteDetalheUrl, authHeaders);

        setCliente(clienteResponse.data);

        const agendamentosUrl = `${url}/api/clientes/${CLIENTE_IDENTIFICADOR}/agendamentos/`;
        const agendamentosResponse = await axios.get(agendamentosUrl, authHeaders);

        const agendamentosList = Array.isArray(agendamentosResponse.data)
            ? agendamentosResponse.data
            : Array.isArray(agendamentosResponse.data.agendamentos)
                ? agendamentosResponse.data.agendamentos
                : [];

        setAgendamentos(agendamentosList);

      } catch (err) {
        console.error("Erro ao buscar dados do cliente/agendamentos:", err);
        if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
            setError("Cliente não encontrado ou acesso negado.");
        } else {
            setError(`Não foi possível carregar os dados. Verifique a conexão com a API. Erro: ${axios.isAxiosError(err) ? err.message : 'Desconhecido'}`);
        }
        setCliente(null);

      } finally {
        setLoading(false);
      }
    };

    fetchClienteData();
  }, [CLIENTE_IDENTIFICADOR, token]);

  const formatarDataHora = (isoString: string) => {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    } catch {
        return 'Data/Hora Inválida';
    }
  };

  return (
    <>
      <Navbar />
      <div className="cliente-dashboard-container">
        <style>{`
          /* Variáveis CSS para fácil customização */
          :root {
            --primary-blue: #007bff; /* Azul vibrante para ações principais */
            --secondary-color: #6c757d; /* Cinza para textos secundários */
            --accent-color: #28a745; /* Verde para sucesso/destaque */
            --background-light: #f8f9fa; /* Fundo geral claro */
            --card-background: #ffffff; /* Fundo dos cards */
            --border-color: #e9ecef; /* Cor da borda suave */
            --text-dark: #343a40; /* Cor do texto principal */
            --text-light: #6c757d; /* Cor do texto secundário */
            --shadow-light: rgba(0, 0, 0, 0.08); /* Sombra suave */
            --error-red: #dc3545; /* Cor de erro */
          }

          /* Reset básico */
          body {
            font-family: 'Inter', sans-serif; /* Usando uma fonte moderna */
            background-color: var(--background-light);
            color: var(--text-dark);
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }

          /* Container principal do Dashboard */
          .cliente-dashboard-container {
            max-width: 1000px;
            margin: 40px auto;
            padding: 20px;
            background-color: var(--background-light);
            border-radius: 12px;
            box-shadow: 0 4px 20px var(--shadow-light);
          }

          /* Estilo dos Cards */
          .dashboard-card {
            background-color: var(--card-background);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px var(--shadow-light);
            border: 1px solid var(--border-color);
          }

          /* Títulos */
          .dashboard-title {
            font-size: 2.2rem;
            color: var(--primary-blue);
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--border-color);
            font-weight: 700;
          }

          .section-title {
            font-size: 1.6rem;
            color: var(--text-dark);
            margin-top: 40px;
            margin-bottom: 25px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
          }

          /* Mensagens de Carregamento/Erro */
          .message-block {
            padding: 18px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 10px;
            justify-content: center;
          }

          .message-block.error {
            background-color: #f8d7da; /* Fundo vermelho claro */
            color: var(--error-red);
            border: 1px solid #f5c6cb;
          }

          .text-center {
            text-align: center;
          }

          .fa-spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Informações do Cliente (Grid) */
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
          }

          .info-item {
            background-color: var(--background-light);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            box-shadow: 0 1px 5px var(--shadow-light);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }

          .info-item strong {
            display: block;
            font-size: 0.9rem;
            color: var(--text-light);
            margin-bottom: 8px;
            text-transform: uppercase;
          }

          .info-item p {
            font-size: 1.1rem;
            color: var(--text-dark);
            margin: 0;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          /* Lista de Agendamentos */
          .agendamento-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .agendamento-item {
            background-color: var(--card-background);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            margin-bottom: 15px;
            padding: 20px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.2s ease-in-out;
            box-shadow: 0 1px 5px var(--shadow-light);
          }

          .agendamento-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px var(--shadow-light);
            border-color: var(--primary-blue);
          }

          .agendamento-item-details h4 {
            font-size: 1.25rem;
            color: var(--primary-blue);
            margin-top: 0;
            margin-bottom: 8px;
            font-weight: 600;
          }

          .agendamento-item-details p {
            font-size: 1rem;
            color: var(--text-dark);
            margin: 4px 0;
          }

          .agendamento-item-details p strong {
            color: var(--secondary-color);
            font-weight: 500;
          }

          /* Responsividade */
          @media (max-width: 768px) {
            .cliente-dashboard-container {
              margin: 20px;
              padding: 15px;
            }

            .dashboard-title {
              font-size: 1.8rem;
              margin-bottom: 20px;
            }

            .section-title {
              font-size: 1.4rem;
              margin-top: 30px;
              margin-bottom: 20px;
            }

            .info-grid {
              grid-template-columns: 1fr; /* Uma coluna em telas menores */
              gap: 15px;
            }

            .agendamento-item {
              flex-direction: column;
              align-items: flex-start;
              padding: 15px;
            }

            .agendamento-item-details h4 {
              font-size: 1.1rem;
            }

            .agendamento-item-details p {
              font-size: 0.9rem;
            }
          }

          @media (max-width: 480px) {
            .dashboard-title {
              font-size: 1.5rem;
              text-align: center;
              justify-content: center;
            }
            .section-title {
              font-size: 1.2rem;
            }
            .message-block {
              font-size: 0.9rem;
              padding: 15px;
            }
          }
        `}</style>

        <div className="dashboard-card">
          <h2 className="dashboard-title">
            <FaUser /> Dashboard do Cliente
          </h2>

          {loading ? (
            <div className="text-center message-block" style={{ backgroundColor: 'var(--background-light)' }}>
              <FaSpinner className="fa-spin" style={{ fontSize: "1.5rem", color: "var(--primary-blue)" }} /> Carregando dados...
            </div>
          ) : error ? (
            <div className="message-block error">
              <FaExclamationTriangle /> {error}
            </div>
          ) : cliente ? (
            <>
              {/* Seção de Informações do Cliente */}
              <h3 className="section-title">Informações Pessoais</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Nome</strong>
                  <p><FaUser /> {cliente.nome}</p>
                </div>
                <div className="info-item">
                  <strong>Email</strong>
                  <p><FaEnvelope /> {cliente.email}</p>
                </div>
                <div className="info-item">
                  <strong>Telefone</strong>
                  <p><FaPhone /> {cliente.telefone}</p>
                </div>
              </div>

              <h3 className="section-title">
                <FaCalendarAlt /> Seus Agendamentos
              </h3>

              {agendamentos.length > 0 ? (
                <ul className="agendamento-list">
                  {agendamentos.map((agendamento) => (
                    <li key={agendamento.id} className="agendamento-item">
                      <div className="agendamento-item-details">
                        <h4>{agendamento.servico_nome} na {agendamento.empresa_nome}</h4>
                        <p>
                          Com: <strong>{agendamento.funcionario_nome}</strong> | Data/Hora: <strong>{formatarDataHora(agendamento.data)}</strong>
                        </p>
                        <p>
                          Valor: R$ {agendamento.preco}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center message-block" style={{ border: '1px dashed var(--border-color)', backgroundColor: 'var(--background-light)', color: 'var(--text-light)' }}>
                  Você não possui agendamentos futuros.
                </p>
              )}
            </>
          ) : (
             <div className="message-block error">
                <FaExclamationTriangle /> Não foi possível encontrar os dados do cliente.
             </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClienteDashboard;