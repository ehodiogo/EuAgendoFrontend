import { Link } from "react-router-dom";

const PendingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full text-center">
        <h1 className="text-2xl font-semibold text-yellow-700 mb-4">
          ⏳ Pagamento Pendente
        </h1>
        <p className="text-gray-700">
          Seu pagamento está sendo processado. Verifique sua conta mais tarde.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
};

export default PendingPage;
