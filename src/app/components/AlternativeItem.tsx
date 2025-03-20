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
};

const AlternativeItem = ({
  letter,
  text,
  response,
  setResponse,
  simulationStatus,
  handleAnswerQuestion,
}: AlternativeItemProps) => {
  const isSelected = response == letter;
  const handleClick = () => {
    if(simulationStatus !== SimulatedStatus.COMPLETED){
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
            "flex items-center p-4 rounded-lg cursor-pointer transition-colors duration-300 ease-in-out",
            isSelected
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-blue-100",
            isSelected && "opacity-50 cursor-not-allowed"
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full font-bold",
              isSelected ? "bg-white text-blue-500" : "bg-blue-500 text-white"
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
