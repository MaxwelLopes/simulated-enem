import { useState } from "react";
import { Question } from "@prisma/client";

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

const Progress = ({
  totalQuestions,
  questionsCache,
  currentIndex,
  onQuestionSelect,
}: ProgressProps) => {
  return (
    <div className="flex flex-col gap-2 items-center my-4 bg-gray-100 p-4 rounded-lg shadow-md w-16">
      {[...Array(totalQuestions)].map((_, index) => {
        const isAnswered = Object.values(questionsCache).some(
          (q) => q.index === index && q.response
        );
        const isCurrent = index === currentIndex;

        return (
          <button
            key={index}
            onClick={() => onQuestionSelect(index)}
            className={`w-10 h-10 flex items-center shadow-lg justify-center font-semibold text-sm rounded-md
                  transition-colors duration-300 
                  ${
                    isCurrent
                      ? "bg-blue-500 text-white"
                      : isAnswered
                      ? "bg-gray-400 text-gray-900"
                      : "bg-gray-200 text-gray-700"
                  }
                  hover:bg-blue-400 hover:text-white`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
};

const ProgressBar = ({
  totalQuestions,
  questionsCache,
  currentIndex,
  setCurrentIndex,
}: ProgressBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 right-4 bg-blue-500 text-white p-2 rounded-full transition-all duration-300 ease-in-out z-30
    ${isVisible ? "translate-x-[-64px]" : "translate-x-0"}`}
      >
        {isVisible ? ">" : "<"}
      </button>

      <div
        className={`h-screen w-auto fixed right-0 top-0 flex flex-col items-center overflow-y-scroll transition-transform duration-300 z-20 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Progress
          totalQuestions={totalQuestions}
          questionsCache={questionsCache}
          currentIndex={currentIndex}
          onQuestionSelect={goToQuestion}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
