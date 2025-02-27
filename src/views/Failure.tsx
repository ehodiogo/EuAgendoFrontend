import { Link } from "react-router-dom";

const FailurePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full text-center">
        <h1 className="text-2xl font-semibold text-red-700 mb-4">
          ❌ Pagamento Falhou
        </h1>
        <p className="text-gray-700">
          Ocorreu um erro ao processar seu pagamento. Tente novamente.
        </p>
        <Link
          to="/checkout"
          className="mt-4 inline-block px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
        >
          Tentar Novamente
        </Link>
      </div>
    </div>
  );
};

export default FailurePage;
