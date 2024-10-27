import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getSimulations } from "../service/simualationService";
import { Simulated } from "@prisma/client";

export const Simulateds = () => {
  const [simulatedList, setSimulatedList] = useState<Simulated[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchSimulatedList = async () => {
      if (!session) {
        return;
      }
      setLoading(true);
      setError(null);
      const userId = session.user.id;
      try {
        setSimulatedList(await getSimulations(userId as string));
      } catch (error) {
        console.error("Erro ao buscar simulados:", error);
        setError("Erro ao carregar os simulados.");
      } finally {
        setLoading(true);
      }
    };

    fetchSimulatedList();
  }, [session]);

  return {
    simulatedList,
    loading,
    error,
  };
};
