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
              />
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-between items-center">
            <button
              onClick={() => {
                if(simulationStatus !== SimulatedStatus.COMPLETED) finishSimulation(id);
                router.push("/simulated");
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
            >
             { simulationStatus !== SimulatedStatus.COMPLETED ? "Finalizar": "Voltar"}
            </button>

            <div className="flex space-x-2">
              <button
                onClick={previousQuestion}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Anterior
              </button>

              <button
                onClick={nextQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </>
      {currentQuestion == null && <GenericError />}
    </div>
  );
};
