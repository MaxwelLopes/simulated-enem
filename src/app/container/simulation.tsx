"use client";

import { useEffect, useState } from "react";
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
import { CheckCircle, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { SimulationFooter } from "../components/SimulationFooter";
import EssayForm from "../components/EssayForm";
import { IntroductionEssay } from "../components/IntroductionEssay";
import { cn } from "@/lib/utils";
import { EssayPresentation } from "../components/EssayPresentation";
import { Timer } from "../components/ui/timer";

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
    showEssayForm,
    setShowEssayForm,
    timeSpent,
  } = useSimulation();

  // Inicializa simulado e busca status
  useEffect(() => {
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
  }, [id, setSimulatedId, setSimulationStatus]);

  const handleFinishSimulation = async () => {
    if (simulationStatus !== SimulatedStatus.COMPLETED) {
      try {
        await finishSimulation(id);
      } catch (error) {
        console.error("Erro ao finalizar simulado:", error);
        return;
      }
    }
    if (essay) {
      setShowEssayForm(true);
    } else {
      router.push("/simulated");
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Se houver redação e as instruções devem ser exibidas, renderiza a tela de instruções.
  if (essay && showEssayInstructions && simulationStatus !== SimulatedStatus.COMPLETED) {
    <IntroductionEssay handleClick={setShowEssayInstructions} />;
  }

  // Se o formulário de redação estiver ativo, renderiza o componente de formulário.
  if (showEssayForm) {
    return <EssayForm simulatedId={id} theme={essay?.theme || ""} />;
  }

  const showTimer = true;

  return (
    <>
      {showEssay && <EssayPresentation essay={essay} />}
      {questionOrder.length > 0 && (
        <ProgressBar
          totalQuestions={questionOrder.length}
          questionOrder={questionOrder}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          essay={!!essay}
          showEssay={showEssay}
          setShowEssay={setShowEssayInstructions}
          simulatedStatus={simulationStatus}
        />)}

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
      {timeSpent && < Timer initialTime={timeSpent} />}

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
        centerContent={
          <div className="flex items-center justify-center space-x-2 rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-gray-800 md:space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={previousQuestion}
              disabled={currentIndex === 0 || showEssay}
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
              disabled={currentIndex + 1 === totalQuestions || showEssay}
              className={cn(
                "h-9 w-9 rounded-lg transition-all",
                "hover:bg-gray-200 dark:hover:bg-gray-700",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próxima</span>
            </Button>
          </div>
        }
        rightContent={timeSpent &&
          <div className="flex items-center justify-center rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300 md:text-base">
            <Timer initialTime={timeSpent} />
          </div>
        }
      />


      {currentQuestion == null && essay === null && <GenericError />}
    </>
  );
};
