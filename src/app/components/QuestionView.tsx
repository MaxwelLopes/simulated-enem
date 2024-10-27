import { Question } from "@prisma/client";
import AlternativeItem from "./AlternativeItem";

type props = {
  currentQuestion: { question: Question; selectedResponse: string };
  setResponse: Function;
};

export const QuestionView = ({ currentQuestion, setResponse }: props) => {
  const {
    year,
    context,
    alternativesIntroduction,
    alternativeA,
    alternativeB,
    alternativeC,
    alternativeD,
    alternativeE,
  } = currentQuestion.question;

  const response = currentQuestion.selectedResponse;
  console.log("repsonse: ", response)

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-2xl mx-auto my-4 border border-gray-300">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Ano: {year}</h2>

      {context && <p className="text-gray-800 mb-4">{context}</p>}

      {alternativesIntroduction && (
        <p className="text-gray-600 mb-2">{alternativesIntroduction}</p>
      )}

      <ul className="space-y-2">
        <AlternativeItem
          letter="A"
          text={alternativeA}
          response={response}
          setResponse={setResponse}
        />
        <AlternativeItem
          letter="B"
          text={alternativeB}
          response={response}
          setResponse={setResponse}
        />
        <AlternativeItem
          letter="C"
          text={alternativeC}
          response={response}
          setResponse={setResponse}
        />
        <AlternativeItem
          letter="D"
          text={alternativeD}
          response={response}
          setResponse={setResponse}
        />
        <AlternativeItem
          letter="E"
          text={alternativeE}
          response={response}
          setResponse={setResponse}
        />
      </ul>
    </div>
  );
};
