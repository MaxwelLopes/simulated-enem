"use client";

import { Loading } from "@/app/components/Loading";
import { useRouter } from "next/navigation";
import { Simulateds } from "../hook/simulateds";
import { Simulated } from "@prisma/client";
import { SimulatedStatus } from "../enum/simulated";

const SimulatedList = () => {
  const router = useRouter();
  const { simulatedList, loading } = Simulateds();

  if (loading) {
    <Loading />;
  }



  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Todos os Simulados</h1>
      <div className="grid grid-cols-1 gap-6">
        {simulatedList.map((simulated) => (
          <div
            key={simulated.id}
            className="bg-white shadow-lg rounded-lg p-6 transition-transform transform"
          >
            <h2 className="text-xl font-semibold mb-2">{simulated.type}</h2>
            <p className="text-gray-600">{simulated.subtype.join(", ")}</p>
            <p className="text-gray-500">
              Criado em: {simulated.createdAt.toString()}
            </p>
            <p
              className={`text-sm ${
                simulated.status === "Completo"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Status: {simulated.status}
            </p>
            <button
              onClick={() => router.push(`/simulated/${simulated.id}`)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Ver Simulado
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SimulatedList;
