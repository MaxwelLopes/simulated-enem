"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { ChevronRight, Menu } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"

interface QuestionItem {
  id: number
  index: number
  response: string | null
}

interface ProgressProps {
  totalQuestions: number
  questionOrder: QuestionItem[]
  currentIndex: number
  onQuestionSelect: (index: number) => void
  essay: boolean
  showEssay: boolean
  setShowEssay: (show: boolean) => void
}

function Progress({ questionOrder, currentIndex, onQuestionSelect, essay, showEssay, setShowEssay }: ProgressProps) {
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
          const isAnswered = question.response !== null && question.response.trim() !== ""
          const isCurrent = index === currentIndex

          return (
            <Button
              key={question.id}
              onClick={() => onQuestionSelect(index)}
              variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
              className={cn(
                "w-10 h-10 p-0 font-semibold transition-all",
                isCurrent && "ring-2 ring-primary ring-offset-2",
                isAnswered ? "bg-gray-200 text-black" : "opacity-50 hover:opacity-80",
              )}
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
}

export function ProgressBar({
  totalQuestions,
  questionOrder,
  currentIndex,
  setCurrentIndex,
  essay,
  showEssay,
  setShowEssay,
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
        />
      </div>
    </>
  )
}

export default ProgressBar;