import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaSpinner, FaEnvelope, FaSignInAlt, FaHome } from "react-icons/fa";
import { FaCircleCheck, FaCircleXmark} from "react-icons/fa6";

interface ConfirmationResponse {
    status: string;
    message: string;
}

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const EmailConfirmation: React.FC = () => {
    const query = useQuery();
    const uid = query.get("uid");
    const token = query.get("token");

    const [loading, setLoading] = useState(true);
    const [confirmationStatus, setConfirmationStatus] = useState<'pending' | 'success' | 'error'>('pending');
    const [message, setMessage] = useState("Verificando seu link de confirmação...");

    useEffect(() => {
        if (!uid || !token) {
            setLoading(false);
            setConfirmationStatus('error');
            setMessage("Link de confirmação inválido ou incompleto. Verifique se copiou a URL inteira.");
            return;
        }

        const confirmEmail = async () => {
            setLoading(true);
            const baseUrl = import.meta.env.VITE_API_URL;
            const endpoint = `${baseUrl}/api/confirmar-conta/?uid=${uid}&token=${token}`;

            try {
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const data: ConfirmationResponse = await response.json();

                if (response.ok) {
                    setConfirmationStatus('success');
                    setMessage(data.message || "Sua conta foi confirmada com sucesso! Você já pode fazer login.");
                } else {
                    setConfirmationStatus('error');
                    setMessage(data.message || "Ocorreu um erro ao confirmar sua conta. O link pode ter expirado ou sido usado.");
                }

            } catch (e) {
                setConfirmationStatus('error');
                setMessage("Erro de conexão. Não foi possível acessar o serviço de confirmação. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        confirmEmail();
    }, [uid, token]);


    const renderContent = () => {
        if (loading) {
            return (
                <div className="message pending">
                    <FaSpinner className="fa-spin icon" />
                    <p>{message}</p>
                </div>
            );
        }

        if (confirmationStatus === 'success') {
            return (
                <div className="message success">
                    <FaCircleCheck className="icon" />
                    <h2>Sucesso!</h2>
                    <p>{message}</p>
                    <Link to="/login" className="btn btn-success mt-3">
                        <FaSignInAlt className="me-2" /> Fazer Login Agora
                    </Link>
                </div>
            );
        }

        return (
            <div className="message error">
                <FaCircleXmark className="icon" />
                <h2>Falha na Confirmação</h2>
                <p>{message}</p>
                <Link to="/" className="btn btn-primary mt-3">
                    <FaHome className="me-2" /> Ir para a Página Inicial
                </Link>
            </div>
        );
    };

    return (
        <div className="min-vh-100">
            <style>{`
                /* Estilos base (pode reutilizar do seu Profile.tsx) */
                :root {
                    --primary-blue: #003087;
                    --light-gray-bg: #f5f7fa;
                    --white: #ffffff;
                    --success-green: #28a745;
                    --danger-red: #dc3545;
                    --warning-orange: #fd7e14;
                    --text-dark: #212529;
                }

                .custom-bg {
                    background-color: var(--light-gray-bg);
                }
                
                .confirmation-container {
                    padding: 5rem 1rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: calc(100vh - 56px); /* Altura da tela menos Navbar */
                }

                .confirmation-box {
                    background-color: var(--white);
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    padding: 3rem;
                    max-width: 500px;
                    width: 100%;
                    text-align: center;
                }
                
                .confirmation-box h1 {
                    color: var(--primary-blue);
                    font-weight: 800;
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    font-size: 2rem;
                }

                .message {
                    padding: 1.5rem;
                    border-radius: 10px;
                }

                .message h2 {
                    font-weight: 700;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                    font-size: 1.8rem;
                }

                .message .icon {
                    font-size: 3rem;
                    margin-bottom: 0.5rem;
                }

                .message.pending {
                    background-color: #e3f2fd; /* Light Blue */
                    color: var(--primary-blue);
                }

                .message.success {
                    background-color: #eaf8ee; /* Light Green */
                    color: var(--success-green);
                }
                .message.success .icon {
                    color: var(--success-green);
                }
                .message.success h2, .message.success p {
                    color: var(--text-dark); /* Texto escuro para melhor contraste */
                }


                .message.error {
                    background-color: #fce4e4; /* Light Red */
                    color: var(--danger-red);
                }
                .message.error .icon {
                    color: var(--danger-red);
                }
                .message.error h2, .message.error p {
                    color: var(--text-dark); /* Texto escuro para melhor contraste */
                }

                .btn-success { background-color: var(--success-green); border-color: var(--success-green); }
                .btn-primary { background-color: var(--primary-blue); border-color: var(--primary-blue); }
            `}</style>
            <Navbar />
            <div className="custom-bg min-vh-100">
                <div className="confirmation-container">
                    <div className="confirmation-box">
                        <h1>
                            <FaEnvelope /> Confirmação de E-mail
                        </h1>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;