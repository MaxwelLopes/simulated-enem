"use client";

import { Loading } from "@/app/components/Loading";
import { findSimulation } from "@/app/service/simualationService";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Simulated {
  id: number;
  type: string;
  userId: string;
  createdAt: Date;
  finishedAt: Date | null;
  status: string;
}

const SimulatedList = () => {
  const [simulatedList, setSimulatedList] = useState<Simulated[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchSimulatedList = async () => {
      if (!session) {
        setError("Usuário não autenticado.");
        return;
      }
      setLoading(true);
      setError(null);
      const userId = session.user.id;
      try {
        setSimulatedList(await findSimulation(userId as string));
        console.log(simulatedList);
      } catch (error) {
        console.error("Erro ao buscar simulados:", error);
        setError("Erro ao carregar os simulados.");
      } finally {
        setLoading(true);
      }
    };

    fetchSimulatedList();
  }, [session]);

  if (loading) {
    <Loading/>
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Simulados Criados</h1>
      <ul className="space-y-4">
        {simulatedList.map((simulated) => (
          <li key={simulated.id} className="border p-4 rounded-lg shadow-md">
            <p className="font-semibold">Tipo: {simulated.type}</p>
            <p>ID: {simulated.id}</p>
            <p>Status: {simulated.status}</p>
            <p>Criado em: {simulated.createdAt.toLocaleString()}</p>
            <p>
              Finalizado em:{" "}
              {simulated.finishedAt
                ? simulated.finishedAt.toLocaleString()
                : "Não finalizado"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default SimulatedList;
