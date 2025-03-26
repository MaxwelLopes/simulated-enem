"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { ChevronRight, Menu } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import { SimulatedStatus, SimulatedType } from "../enum/simulated"

interface QuestionItem {
  id: number
  index: number
  response: string | null
  hit?: boolean
}

interface ProgressProps {
  totalQuestions: number
  questionOrder: QuestionItem[]
  currentIndex: number
  onQuestionSelect: (index: number) => void
  essay: boolean
  showEssay: boolean
  setShowEssay: (show: boolean) => void
  simulatedStatus: string | null
}

function Progress({ questionOrder, currentIndex, onQuestionSelect, essay, showEssay, setShowEssay, simulatedStatus }: ProgressProps) {
  const isCompleted = simulatedStatus === SimulatedStatus.COMPLETED;
  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="flex flex-col gap-2 items-center p-4 mb-24">
        {essay && (
          <Button
            key="essay"
            onClick={() => setShowEssay(true)}
            variant={showEssay ? "secondary" : "outline"}
            className={cn(
              "font-semibold transition-all",
              showEssay && "bg-gray-200 text-black ring-2 ring-primary ring-offset-2",
              !showEssay && "opacity-80 hover:opacity-100",
            )}
          >
            Redação
          </Button>
        )}

        {questionOrder.map((question, index) => {
          const isCurrent = index === currentIndex;
          const isAnswered = question.response && question.response.trim() !== "";
          const buttonClass = cn(
            "w-10 h-10 p-0 font-semibold transition-all duration-200",

            // Estilo base do current (será sobrescrito se necessário)
            isCurrent && "ring-2 ring-offset-2 shadow-md transform scale-105",

            // Lógica condicional completa
            isCompleted
              ? question.hit === true
                ? "bg-gradient-to-br from-green-100 to-green-200 text-green-600 border border-green-300 hover:shadow-sm ring-green-300"
                : question.hit === false
                  ? "bg-gradient-to-br from-red-100 to-red-200 text-red-600 border border-red-300 hover:shadow-sm ring-red-300"
                  : cn(
                    "bg-white border border-slate-200 text-slate-700 opacity-70 hover:opacity-100 hover:border-slate-300",
                    isCurrent && "ring-primary" // Mantém o ring padrão
                  )
              : isAnswered
                ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white border border-blue-300 hover:shadow-sm ring-blue-300"
                : cn(
                  "bg-white border border-slate-200 text-slate-700 opacity-70 hover:opacity-100 hover:border-slate-300",
                  isCurrent && "ring-primary" // Mantém o ring padrão
                )
          );

          return (
            <Button
              key={question.id}
              onClick={() => onQuestionSelect(index)}
              variant="outline"
              className={buttonClass}
              aria-label={`Question ${index + 1}`}
              aria-current={isCurrent ? "true" : "false"}
            >
              {index + 1}
            </Button>

          )
        })}
      </div>
    </ScrollArea>
  )
}

interface ProgressBarProps {
  totalQuestions: number
  questionOrder: QuestionItem[]
  currentIndex: number
  setCurrentIndex: (index: number) => void
  essay: boolean
  showEssay: boolean
  setShowEssay: (show: boolean) => void,
  simulatedStatus: string | null
}

export function ProgressBar({
  totalQuestions,
  questionOrder,
  currentIndex,
  setCurrentIndex,
  essay,
  showEssay,
  setShowEssay,
  simulatedStatus
}: ProgressBarProps) {
  const [open, setOpen] = useState(false)

  const goToQuestion = (index: number) => {
    setCurrentIndex(index)
    setOpen(false)
  }

  return (
    <>
      {/* Navigation button - now integrated in the top-right corner */}
      <Button
        variant="secondary"
        size="sm"
        className={cn(
          "fixed top-4 right-4 z-40 transition-all duration-300 shadow-md rounded-full px-4 flex items-center gap-2 mt-20",
          open && "translate-x-[-260px]",
        )}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close navigation panel" : "Open navigation panel"}
        aria-expanded={open}
      >
        {open ? (
          <>
            <ChevronRight className="h-4 w-4" />
            <span>Fechar</span>
          </>
        ) : (
          <>
            <Menu className="h-4 w-4" />
            <span>Questões</span>
          </>
        )}
      </Button>

      {/* Progress sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 w-min h-full bg-white dark:bg-gray-950 p-4 shadow-lg transition-transform duration-300 ease-in-out z-50 mt-24",
          open ? "translate-x-0" : "translate-x-[100%]",
        )}
        aria-hidden={!open}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Navegação</h2>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Fechar navegação">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Progress
          totalQuestions={totalQuestions}
          questionOrder={questionOrder}
          currentIndex={currentIndex}
          onQuestionSelect={goToQuestion}
          essay={essay}
          showEssay={showEssay}
          setShowEssay={setShowEssay}
          simulatedStatus={simulatedStatus}
        />
      </div>
    </>
  )
}

export default ProgressBar;