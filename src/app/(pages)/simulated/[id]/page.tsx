"use client";

import { GenericError } from "@/app/components/GenericError";
import { Loading } from "@/app/components/Loading";
import { QuestionView } from "@/app/components/QuestionView";
import { simulation } from "@/app/hook/simulation";
import { finishSimulation } from "@/app/service/simualationService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SimulationsPage = ({ params }: { params: { id: string } }) => {
  const {
    setSimulatedId,
    currentQuestion,
    nextQuestion,
    previousQuestion,
    loading,
    setResponse,
  } = simulation();

  useEffect(() => {
    setSimulatedId(Number(params.id));
  }, [params.id, setSimulatedId]);
  const router = useRouter()

  return (
    <div>
      {loading && <Loading />}
      <>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow pb-16">
            {currentQuestion && (
              <QuestionView
                currentQuestion={currentQuestion}
                setResponse={setResponse}
              />
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-between items-center">
            <button
              onClick={() => {
                finishSimulation(Number(params.id));
                router.push('/home')
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
            >
              Finalizar
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

export default SimulationsPage;
