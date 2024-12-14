"use client";

import { Loading } from "@/app/components/Loading";
import { useRouter } from "next/navigation";
import { useSimulateds } from "../hook/simulateds";
import { Skeleton } from "../components/ui/skeleton";
import { SimulatedItem } from "../components/ui/SimulatedItem";
import { Button } from "../components/ui/button";

const SimulatedList = () => {
  const router = useRouter();
  const { simulatedList, loading } = useSimulateds();

  const handleSelectSimulated = (id: number) => {
    router.push(`/simulated/${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meus Simulados</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="aspect-[4/3] w-full rounded-md" />
          ))}
        </div>
      ) : (
        <>
          {simulatedList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {simulatedList.map((simulated) => (
                <SimulatedItem
                  key={simulated.id}
                  simulated={simulated}
                  onSelect={handleSelectSimulated}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg">
              <h2 className="text-lg font-semibold">
                Nenhum simulado encontrado
              </h2>
              <p className="text-muted-foreground mt-2">
                Crie seu primeiro simulado clicando no botão abaixo.
              </p>
              <Button onClick={() => {router.push('/createSimulated')}} className="mt-4">
                Criar Simulado
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SimulatedList;
