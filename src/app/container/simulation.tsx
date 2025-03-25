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
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Instruções para Redação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                Leia o Tema e os Textos Motivadores
              </h3>
              <p>
                O tema da redação e os textos motivadores serão disponibilizados. Utilize-os como referência para estruturar sua argumentação de forma coerente e fundamentada.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Redija o Texto Manualmente</h3>
              <p>
                Utilize uma folha de redação ou papel adequado para escrever seu texto à mão, seguindo a estrutura dissertativo-argumentativa exigida pelo ENEM.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Gerencie o Tempo</h3>
              <p>
                Acompanhe o cronômetro para simular as condições reais de uma prova e organizar sua escrita dentro do tempo disponível.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Transcreva o Texto</h3>
              <p>
                Ao concluir a redação, clique em "Finalizar" para avançar para a próxima etapa. Nessa fase, você deverá digitar o texto exatamente como foi escrito à mão, sem alterações ou correções.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Envio e Correção Automática</h3>
              <p>
                Após a transcrição, envie a redação para correção. O texto será avaliado por um sistema de Inteligência Artificial, que analisará a estrutura, argumentação e outros critérios conforme os padrões exigidos.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
            <Button
              size="lg"
              className="px-8 py-6 text-lg font-medium"
              onClick={() => setShowEssayInstructions(false)}
            >
              Ir para Redação
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Se o formulário de redação estiver ativo, renderiza o componente de formulário.
  if (showEssayForm) {
    return <EssayForm simulatedId={id} theme={essay?.theme || ""} />;
  }

  return (
    <>
      {essay && (
        <div className="max-w-4xl mx-auto p-4 space-y-6 mb-8">
          <div className="sticky top-4 z-10 flex justify-end">
            <Badge
              variant="outline"
              className="px-3 py-1.5 text-base bg-white shadow-md"
            >
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-mono font-medium">10:00</span>
            </Badge>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-xl text-primary">
                PROPOSTA DE REDAÇÃO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-center text-justify py-2">
                Com base na leitura dos textos motivadores seguintes e nos
                conhecimentos construídos ao longo de sua formação, redija texto
                dissertativo-argumentativo em norma culta escrita da língua
                portuguesa sobre o tema <strong>{essay?.theme}</strong>,
                apresentando proposta de ação social, que respeite os direitos
                humanos. Selecione, organize e relacione coerentemente
                argumentos e fatos para defesa de seu ponto de vista.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-lg flex items-center">
                <div className="w-1 h-5 bg-primary mr-2 rounded-full"></div>
                Textos Motivadores
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {essay?.motivationalTexts.map((text: string, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center mb-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium mr-2">
                        {index + 1}
                      </span>
                      <p className="text-sm font-medium text-gray-500">
                        Texto {index + 1}
                      </p>
                    </div>
                    <TextFormatter text={text} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ProgressBar
        totalQuestions={questionOrder.length}
        questionOrder={questionOrder}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        essay={!!essay}
        showEssay={showEssay}
        setShowEssay={setShowEssayInstructions}
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
          <Button onClick={handleFinishSimulation} variant="default">
            {simulationStatus !== SimulatedStatus.COMPLETED ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Finalizar
              </>
            ) : (
              <>Voltar</>
            )}
          </Button>
        }
        centerContent={
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={previousQuestion}
              disabled={currentIndex === 0 || showEssay}
              className="p-1 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Questão anterior</span>
            </Button>

            <span className="text-sm font-medium">
              {showEssay
                ? "Redação"
                : `Questão ${currentIndex + 1} de ${totalQuestions}`}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextQuestion}
              disabled={currentIndex === totalQuestions - 1 || showEssay}
              className="p-1 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próxima questão</span>
            </Button>
          </div>
        }
      />

      {currentQuestion == null && essay === null && <GenericError />}
    </>
  );
};
