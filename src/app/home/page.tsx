"use client";

import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const handleCreateSimulated = () => {
    router.push("/create-simulated");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bem-vindo ao Simulador ENEM
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Prepare-se para o ENEM criando seus simulados personalizados.
        </p>
        <button
          onClick={handleCreateSimulated}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 transition duration-200"
        >
          Criar Simulado
        </button>
      </div>
    </div>
  );
};

export default Home;
