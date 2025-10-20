import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaStar, FaBuilding, FaRegFrown, FaChartLine } from 'react-icons/fa';
import Navbar from "../components/Navbar";

interface PontoData {
    empresa: string;
    pontos: number;
}

interface ClienteInfo {
    nome: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const PontosClienteDetalhe: React.FC = () => {
    const { identificador } = useParams<{ identificador: string }>();
    const [clienteNome, setClienteNome] = useState<string>('Cliente');
    const [pontosPorEmpresa, setPontosPorEmpresa] = useState<PontoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!identificador) {
            setError("Identificador do cliente não fornecido na URL.");
            setLoading(false);
            return;
        }

        const fetchAllData = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            const authHeaders = token ? { headers: { Authorization: `Token ${token}` } } : {};

            try {
                const clienteResponse = await axios.get<ClienteInfo>(
                    `${API_BASE_URL}/api/clientes/${identificador}/`,
                    authHeaders
                );
                setClienteNome(clienteResponse.data.nome);

                const pontosResponse = await axios.get<PontoData[]>(
                    `${API_BASE_URL}/api/cliente/${identificador}/pontos`,
                    authHeaders
                );

                const sortedData = pontosResponse.data.sort((a, b) => b.pontos - a.pontos);
                setPontosPorEmpresa(sortedData);

            } catch (err) {
                console.error("Erro ao buscar dados do cliente/pontos:", err);
                if (axios.isAxiosError(err) && err.response) {
                    const status = err.response.status;
                    let detail = err.response.data?.detail || err.message;

                    if (status === 404) {
                         detail = "Cliente ou dados de pontos não encontrados.";
                    } else if (status === 403 || status === 401) {
                         detail = "Acesso negado. Por favor, faça login novamente.";
                    }
                    setError(`Erro ao carregar dados: ${detail}`);
                } else {
                    setError("Erro ao carregar os dados de fidelidade. Verifique a conexão.");
                }

            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [identificador]);


    const styleSheet = `
        /* Variáveis CSS */
        :root {
            --primary-blue: #007bff;
            --secondary-color: #28a745;
            --accent-color: #ffc107; /* Amarelo para Pontos */
            --background-light: #f8f9fa;
            --card-background: #ffffff;
            --border-color: #e9ecef;
            --text-dark: #343a40;
            --text-light: #6c757d;
            --shadow-light: rgba(0, 0, 0, 0.08);
            --error-red: #dc3545;
        }

        /* Container principal */
        .cliente-dashboard-container { 
            max-width: 1000px;
            margin: 40px auto;
            padding: 20px;
            background-color: var(--background-light);
            border-radius: 12px;
            box-shadow: 0 4px 20px var(--shadow-light);
            font-family: 'Inter', sans-serif;
        }
        
        /* O card de dashboard engloba tudo */
        .dashboard-card { 
            background-color: var(--card-background);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px var(--shadow-light);
            border: 1px solid var(--border-color);
        }

        /* Título Principal - MAIS PROFISSIONAL */
        .main-title {
            font-size: 2.5rem; /* Aumentado um pouco */
            color: var(--text-dark); /* Cor escura para parecer um título principal */
            text-align: left;
            margin-bottom: 5px;
            font-weight: 700;
        }

        /* Subtítulo */
        .main-subtitle {
            font-size: 1.2rem;
            color: var(--primary-blue);
            text-align: left;
            margin-bottom: 40px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--border-color);
        }

        /* Card de Pontos por Empresa */
        .ponto-card {
            background-color: var(--card-background);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px var(--shadow-light);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .ponto-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px var(--shadow-light);
            border-color: var(--primary-blue);
        }

        /* Cabeçalho da Empresa */
        .empresa-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border-color);
        }

        .empresa-header h2 {
            margin: 0;
            font-size: 1.6rem;
            color: var(--text-dark);
            font-weight: 600;
        }

        .empresa-icon {
            color: var(--primary-blue);
            font-size: 1.8rem;
            margin-right: 12px;
        }

        /* Exibição dos Pontos */
        .pontos-display {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 15px 0;
        }

        .pontos-badge {
            background-color: var(--accent-color);
            background-image: linear-gradient(135deg, var(--accent-color), #ffdb58);
            color: var(--text-dark);
            border-radius: 10px;
            padding: 20px 40px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            width: fit-content;
        }

        .pontos-icon {
            font-size: 2.5rem;
            margin-bottom: 5px;
            color: var(--text-dark);
        }

        .pontos-value {
            display: block;
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1;
            margin-bottom: 5px;
            color: var(--text-dark);
        }

        .pontos-label {
            display: block;
            font-size: 1.1rem;
            opacity: 0.9;
            color: var(--text-dark);
        }

        /* Mensagens de Estado */
        .message-block {
            padding: 25px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 10px;
            justify-content: center;
            text-align: center;
        }

        .message-block.loading {
            background-color: #e3f2fd;
            color: var(--primary-blue);
            border: 1px solid #bbdefb;
        }

        .message-block.error {
            background-color: #f8d7da;
            color: var(--error-red);
            border: 1px solid #f5c6cb;
        }

        .message-block.empty {
            border: 1px dashed var(--border-color);
            background-color: var(--background-light);
            color: var(--text-light);
            padding: 40px;
        }

        .fa-spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Responsividade */
        @media (max-width: 768px) {
            .cliente-dashboard-container {
                margin: 20px;
                padding: 15px;
            }
            .main-title {
                font-size: 2rem;
            }
            .main-subtitle {
                font-size: 1rem;
            }
            .empresa-header h2 {
                font-size: 1.4rem;
            }
            .pontos-value {
                font-size: 3rem;
            }
            .pontos-badge {
                padding: 15px 30px;
            }
        }
    `;

    return (
        <>
            <Navbar />

            <div className="cliente-dashboard-container">
                <style>{styleSheet}</style>

                <div className="dashboard-card">
                    <h1 className="main-title">
                        Olá, {loading ? 'Carregando...' : clienteNome.split(' ')[0]}!
                    </h1>
                    <h2 className="main-subtitle">
                        <FaChartLine /> Seu Histórico de Pontos de Fidelidade
                    </h2>

                    {loading ? (
                        <div className="message-block loading">
                            <FaSpinner className="fa-spin" style={{ fontSize: "1.5rem" }} /> Carregando seus dados...
                        </div>
                    ) : error ? (
                        <div className="message-block error">
                            <FaRegFrown /> {error}
                        </div>
                    ) : pontosPorEmpresa.length === 0 ? (
                        <div className="message-block empty">
                            <FaStar style={{ color: 'var(--accent-color)' }} /> Você ainda não acumulou pontos em nenhuma empresa.
                        </div>
                    ) : (
                        <>
                            {pontosPorEmpresa.map((item) => (
                                <div key={item.empresa} className="ponto-card">
                                    <div className="empresa-header">
                                        <FaBuilding className="empresa-icon" />
                                        <h2>{item.empresa}</h2>
                                    </div>

                                    <div className="pontos-display">
                                        <div className="pontos-badge">
                                            <FaStar className="pontos-icon" />
                                            <span className="pontos-value">{item.pontos}</span>
                                            <span className="pontos-label">Pontos Acumulados</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default PontosClienteDetalhe;