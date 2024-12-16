"use client";

import { GenericError } from "@/app/components/GenericError";
import { Loading } from "@/app/components/Loading";
import ProgressBar from "@/app/components/ProgressBar";
import { QuestionView } from "@/app/components/QuestionView";
import { useSimulation } from "@/app/hook/simulation";
import {
  finishSimulation,
  getSimulationStatus,
} from "@/app/service/simualationService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SimulatedStatus } from "../enum/simulated";
import { Button } from "../components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const Simulation = (simulated: { id: string }) => {
  const id = Number(simulated.id);
  const {
    setSimulatedId,
    currentQuestion,
    nextQuestion,
    previousQuestion,
    loading,
    setResponse,
    questionsCache,
    questionOrder,
    currentIndex,
    setCurrentIndex,
    simulationStatus,
    setSimulationStatus,
    setLoading,
    totalQuestions,
  } = useSimulation();

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getSimulationStatus(id);
      setSimulationStatus(status);
    };
    fetchStatus();
    setSimulatedId(id);
  }, [id, setSimulatedId]);

  const router = useRouter();

  return (
    <div>
      {loading && <Loading />}
      <>
        <ProgressBar
          totalQuestions={questionOrder.length}
          questionsCache={questionsCache}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />

        <div className="flex flex-col min-h-screen">
          <div className="flex-grow pb-16">
            {currentQuestion && (
              <QuestionView
                currentQuestion={currentQuestion}
                setResponse={setResponse}
                simulationStatus={simulationStatus}
                setLoading={setLoading}
              />
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex items-center justify-between">
            <Button
              onClick={() => {
                if (simulationStatus !== SimulatedStatus.COMPLETED)
                  finishSimulation(id);
                router.push("/simulated");
              }}
              variant="default"
              className="w-full w-min"
            >
              {simulationStatus !== SimulatedStatus.COMPLETED ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Finalizar
                </>
              ) : (
                <>
                  Voltar
                </>
              )}
            </Button>
            <div className="flex items-center flex-1 justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={previousQuestion}
                disabled={currentIndex === 0}
                className="p-1 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Questão anterior</span>
              </Button>

              <span className="text-sm font-medium">
                Questão {currentIndex + 1} de {totalQuestions}
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextQuestion}
                disabled={currentIndex === totalQuestions - 1}
                className="p-1 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Próxima questão</span>
              </Button>
            </div>
          </div>
        </div>
      </>
      {currentQuestion == null && <GenericError />}
    </div>
  );
};
