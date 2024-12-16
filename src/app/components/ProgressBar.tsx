import { useState } from "react";
import { Question } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";

interface ProgressProps {
  totalQuestions: number;
  questionsCache: Record<
    number,
    {
      question: Question;
      selectedResponse: string;
      index: number;
      response: boolean;
    }
  >;
  currentIndex: number;
  onQuestionSelect: (index: number) => void;
}

function Progress({
  totalQuestions,
  questionsCache,
  currentIndex,
  onQuestionSelect,
}: ProgressProps) {
  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="flex flex-col gap-2 items-center p-4">
        {[...Array(totalQuestions)].map((_, index) => {
          const isAnswered = Object.values(questionsCache).some(
            (q) => q.index === index && q.response
          );
          const isCurrent = index === currentIndex;

          return (
            <Button
              key={index}
              onClick={() => onQuestionSelect(index)}
              variant={
                isCurrent ? "default" : isAnswered ? "secondary" : "outline"
              }
              className={cn(
                "w-10 h-10 p-0 font-semibold transition-opacity",
                isCurrent && "ring-2 ring-primary ring-offset-2",
                isAnswered ? "bg-gray-200 text-black" : "opacity-50"
              )}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
interface ProgressBarProps {
  totalQuestions: number;
  questionsCache: Record<
    number,
    {
      question: Question;
      selectedResponse: string;
      index: number;
      response: boolean;
    }
  >;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export function ProgressBar({
  totalQuestions,
  questionsCache,
  currentIndex,
  setCurrentIndex,
}: ProgressBarProps) {
  const [open, setOpen] = useState(false);

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
          open ? "translate-x-[-100px]" : ""
        }`}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {open && (
        <div
          className={`fixed top-0 right-0 w-min h-full bg-white p-4 shadow-lg transition-transform duration-300 ease-in-out ${
            open ? "translate-x-0" : "translate-x-[100%]"
          }`}
        >
          <Progress
            totalQuestions={totalQuestions}
            questionsCache={questionsCache}
            currentIndex={currentIndex}
            onQuestionSelect={goToQuestion}
          />
        </div>
      )}
    </>
  );
}
export default ProgressBar;
