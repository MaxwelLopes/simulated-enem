"use client"

import { useState } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { SimulatedStatus } from "../enum/simulated"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Button } from "./ui/button"
import { Timer } from "./ui/timer"

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

function Progress({
  questionOrder,
  currentIndex,
  onQuestionSelect,
  essay,
  showEssay,
  setShowEssay,
  simulatedStatus,
}: ProgressProps) {
  const isCompleted = simulatedStatus === SimulatedStatus.COMPLETED

  return (
    <ScrollArea className="max-h-[calc(100vh-20rem)] w-full">
      <div className="grid grid-cols-5 gap-2 p-2">
        {essay && (
          <Button
            key="essay"
            onClick={() => {
              setShowEssay(true);
              onQuestionSelect(-1)
            }}
            variant={showEssay ? "secondary" : "outline"}
            className={cn(
              "font-semibold transition-all col-span-5 mb-2",
              showEssay && "bg-gray-200 text-black ring-2 ring-primary ring-offset-2",
              !showEssay && "opacity-80 hover:opacity-100",
            )}
          >
            Redação
          </Button>
        )}

        {questionOrder.map((question, index) => {
          const isCurrent = index === currentIndex
          const isAnswered = question.response && question.response.trim() !== ""
          const buttonClass = cn(
            "w-full h-10 p-0 font-semibold transition-all duration-200",

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
                    isCurrent && "ring-primary", // Mantém o ring padrão
                  )
              : isAnswered
                ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white border border-blue-300 hover:shadow-sm ring-blue-300"
                : cn(
                  "bg-white border border-slate-200 text-slate-700 opacity-70 hover:opacity-100 hover:border-slate-300",
                  isCurrent && "ring-primary", // Mantém o ring padrão
                ),
          )

          return (
            <Button
              key={question.id}
              onClick={() => {
                onQuestionSelect(index);
                setShowEssay(false)
              }}
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
  setShowEssay: (show: boolean) => void
  simulatedStatus: string | null
  initialTime?: number
}

export function ProgressBar({
  totalQuestions,
  questionOrder,
  currentIndex,
  setCurrentIndex,
  essay,
  showEssay,
  setShowEssay,
  simulatedStatus,
  initialTime,
}: ProgressBarProps) {
  const [open, setOpen] = useState(false)

  const goToQuestion = (index: number) => {
    setCurrentIndex(index)
    setOpen(false)
  }

  return (
    <>
      {!open && (
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 right-4 z-40 transition-all duration-200 mt-20 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-sm"
          onClick={() => setOpen(true)}
          aria-label="Abrir painel de navegação"
          aria-expanded={open}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Progress sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 botton-20 w-64 bg-white dark:bg-gray-950 shadow-lg transition-transform duration-300 ease-out z-50 mt-24",
          "border-l border-slate-200 dark:border-slate-800",
          open ? "translate-x-0" : "translate-x-[100%]",
        )}
        aria-hidden={!open}
      >
        <div className="flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                aria-label="Fechar navegação"
                className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Timer initialTime={initialTime} />
          </div>

          <div className="p-4 overflow-y-auto">
            <h3 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-3">Questões</h3>
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
        </div>
      </div>
    </>
  )
}

export default ProgressBar
