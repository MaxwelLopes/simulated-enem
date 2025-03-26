import { cn } from "@/lib/utils";
import { SimulatedStatus } from "../enum/simulated";
import TextFormatter from "../utils/utils";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type AlternativeItemProps = {
  letter: string;
  text: string;
  response: string;
  setResponse: Function;
  simulationStatus: string | null;
  handleAnswerQuestion: Function;
  correctAlternative: string;
};

const AlternativeItem = ({
  letter,
  text,
  response,
  setResponse,
  simulationStatus,
  handleAnswerQuestion,
  correctAlternative
}: AlternativeItemProps) => {
  const isSelected = response == letter;
  const isCorrectAnswer = correctAlternative === letter;
  const hasResponse =  response !== '' && response !== null;
  const isCompleted = simulationStatus === SimulatedStatus.COMPLETED;

  
  const handleClick = () => {
    if (simulationStatus !== SimulatedStatus.COMPLETED) {
      isSelected;
      setResponse(letter);
    }
    handleAnswerQuestion(letter);
  };

  return (
    <RadioGroup value={response} onValueChange={handleClick} disabled={isSelected}>
      <div className="mb-3">
        <RadioGroupItem
          value={letter}
          id={`alternative-${letter}`}
          className="peer sr-only"
        />
        <Label
          htmlFor={`alternative-${letter}`}
          className={cn(
            "flex items-center p-4 rounded-lg cursor-pointer transition-colors duration-300 ease-in-out border",
            isCompleted
              ? isCorrectAnswer
                ? hasResponse ? "bg-green-50 border-green-400 text-green-800" : "bg-gray-50 border-green-400 text-gray-700"
                : isSelected
                  ? "bg-red-50 border-red-400 text-red-800"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              :
              isSelected
                ? "bg-blue-50 border-blue-400 text-blue-800"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
          )}
        >
          <span
            className={cn(

              "flex items-center justify-center w-8 h-8 rounded-full font-bold transition-colors ml-2",

              isCompleted
                ? isCorrectAnswer
                  ? "bg-green-500 text-white shadow-sm"
                  : isSelected
                    ? "bg-red-500 text-white shadow-sm"
                    : "bg-gray-200 text-gray-700"
                :
                isSelected
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-gray-200 text-gray-700"
            )}
          >
            {letter}
          </span>

          <span className="flex-1 ml-4 text-lg">
            <TextFormatter text={text} />
          </span>
        </Label>

      </div>
    </RadioGroup>
  );
};

export default AlternativeItem;
