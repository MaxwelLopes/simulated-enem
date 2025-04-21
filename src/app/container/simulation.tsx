"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GenericError } from "@/app/components/GenericError";
import { Loading } from "@/app/components/Loading";
import ProgressBar from "@/app/components/ProgressBar";
import { QuestionView } from "@/app/components/QuestionView";
import { useSimulation } from "@/app/hook/simulation";
import {
  finishSimulation,
  getSimulationStatus,
} from "@/app/service/simualationService";
import { SimulatedStatus } from "../enum/simulated";
import { Button } from "../components/ui/button";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { SimulationFooter } from "../components/SimulationFooter";
import { IntroductionEssay } from "../components/IntroductionEssay";
import { cn } from "@/lib/utils";
import { EssayPresentation } from "../components/EssayPresentation";
import SimulationResult from "./SimulationResult";
import { EssayForm } from "../components/EssayForm";

interface SimulationProps {
  id: string;
}

export const Simulation = ({ id }: SimulationProps) => {
  const router = useRouter();
  const {
    setSimulatedId,
    currentQuestion,
    nextQuestion,
    previousQuestion,
    loading,
    setResponse,
    questionOrder,
    currentIndex,
    setCurrentIndex,
    simulationStatus,
    setSimulationStatus,
    totalQuestions,
    handleAnswerQuestion,
    essay,
    showEssayInstructions,
    setShowEssayInstructions,
    showEssay,
    setShowEssay,
    showEssayForm,
    setShowEssayForm,
    timeSpent,
    setLoading,
  } = useSimulation();

  // Inicializa simulado e busca status
  useEffect(() => {
    setLoading(true);
    const fetchStatus = async () => {
      try {
        const status = await getSimulationStatus(id);
        setSimulationStatus(status);
      } catch (error) {
        console.error("Erro ao buscar status do simulado:", error);
      }
    };

    if (id) {
      setSimulatedId(id);
      fetchStatus();
    }
    setLoading(false);
  }, [id, setSimulatedId, setSimulationStatus, setLoading]);

  useEffect(() => {
    if (!currentQuestion) {
      setLoading(true);
    }
  }, [currentQuestion, setLoading, setSimulatedId]);

  const handleFinishSimulation = async () => {
    if (simulationStatus !== SimulatedStatus.COMPLETED) {
      try {
        if (essay && simulationStatus === SimulatedStatus.PENDING) {
          setShowEssayForm(true);
        } else {
          await finishSimulation(id);
          router.push("/simulated");
        }
      } catch (error) {
        console.error("Erro ao finalizar simulado:", error);
        return;
      }

    }
    else {
      router.push("/simulated");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (showEssay && simulationStatus === SimulatedStatus.COMPLETED) {
    return <SimulationResult id={id} />;
  }

  if (essay && showEssayInstructions && simulationStatus !== SimulatedStatus.COMPLETED) {
    return <IntroductionEssay handleClick={setShowEssayInstructions} />;
  }

  if (showEssayForm) {
    return <EssayForm simulatedId={id} simulationStatus={simulationStatus as string} theme={essay?.theme || ""} />;
  }

  return (
    <>
      {showEssay && essay && !showEssayInstructions && <EssayPresentation essay={essay} />}
      <ProgressBar
        totalQuestions={questionOrder.length}
        questionOrder={questionOrder}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        essay={!!essay}
        showEssay={showEssay}
        setShowEssay={setShowEssay}
        simulatedStatus={simulationStatus}
        initialTime={timeSpent}
      />

      {/* Seção de Questões */}
      {questionOrder.length > 0 && !showEssay && (
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow pb-16">
            {currentQuestion ? (
              <QuestionView
                currentQuestion={{ ...currentQuestion, index: currentIndex }}
                setResponse={setResponse}
                simulationStatus={simulationStatus}
                handleAnswerQuestion={(response) => handleAnswerQuestion(response)}
              />
            ) : (
              <GenericError />
            )}
          </div>
        </div>
      )}

      <SimulationFooter
        leftContent={
          <Button
            onClick={handleFinishSimulation}
            variant="default"
            size="sm"
            className="rounded-lg px-4 py-2 font-medium transition-all hover:shadow-lg md:px-5 md:py-2.5"
          >
            {simulationStatus === SimulatedStatus.PENDING ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm md:text-base">Finalizar</span>
              </span>
            ) : (
              <span className="text-sm md:text-base">Voltar</span>
            )}
          </Button>
        }

        rightContent={
          <div className="flex items-center justify-center space-x-2 rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-gray-800 md:space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={previousQuestion}
              disabled={currentIndex === -1 || showEssay || currentIndex === 0 && !essay}
              className={cn(
                "h-9 w-9 rounded-lg transition-all",
                "hover:bg-gray-200 dark:hover:bg-gray-700",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
            </Button>

            <span className="min-w-[100px] text-center text-sm font-medium md:min-w-[140px] md:text-base">
              {showEssay ? "Redação" : `Questão ${currentIndex + 1} de ${totalQuestions}`}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextQuestion}
              disabled={currentIndex + 1 === totalQuestions}
              className={cn(
                "h-9 w-9 rounded-lg transition-all",
                "hover:bg-gray-200 dark:hover:bg-gray-700",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próxima</span>
            </Button>
          </div>}
      />


      {currentQuestion == null && essay === null && <GenericError />}
    </>
  );
};
