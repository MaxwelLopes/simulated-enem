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
import TextFormatter from "../utils/utils";
import EssayForm from "../components/EssayForm";
import { IntroductionEssay } from "../components/IntroductionEssay";
import { cn } from "@/lib/utils";
import { EssayPresentation } from "../components/EssayPresentation";

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
    questionsCache,
    questionOrder,
    currentIndex,
    setCurrentIndex,
    simulationStatus,
    setSimulationStatus,
    totalQuestions,
    handleAnswerQuestion,
    essay,
    setEssay,
    showEssayInstructions,
    setShowEssayInstructions,
    showEssay,
    setShowEssay,
    showEssayForm,
    setShowEssayForm,
  } = useSimulation();

  const [seconds, setSeconds] = useState(0);

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

      <SimulationFooter
        leftContent={
          <Button
            onClick={handleFinishSimulation}
            variant="default"
            size="sm"
            className="rounded-full px-3 py-1.5 font-medium transition-all hover:shadow-md md:px-4 md:py-2"
          >
            {simulationStatus === SimulatedStatus.PENDING ? (
              <span className="flex items-center">
                <CheckCircle className="mr-1.5 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" />
                <span className="text-sm md:text-base">Finalizar</span>
              </span>
            ) : (
              <span className="text-sm md:text-base">Voltar</span>
            )}
          </Button>
        }
        centerContent={
          <div className="flex items-center justify-center space-x-1 md:space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1 md:px-3 md:py-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={previousQuestion}
              disabled={currentIndex === 0 || showEssay}
              className={cn(
                "h-7 w-7 md:h-8 md:w-8 rounded-full",
                "hover:bg-gray-200 dark:hover:bg-gray-700",
                "disabled:opacity-40",
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="sr-only">Anterior</span>
            </Button>

            <span className="text-xs md:text-sm font-medium px-1 md:px-2 min-w-[90px] md:min-w-[120px] text-center">
              {showEssay ? "Redação" : `Questão ${currentIndex + 1} de ${totalQuestions}`}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextQuestion}
              disabled={currentIndex + 1  === totalQuestions}
              className={cn(
                "h-7 w-7 md:h-8 md:w-8 rounded-full",
                "hover:bg-gray-200 dark:hover:bg-gray-700",
                "disabled:opacity-40",
              )}
            >
              <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="sr-only">Próxima</span>
            </Button>
          </div>
        }
      />

      {currentQuestion == null && essay === null && <GenericError />}
    </>
  );
};
