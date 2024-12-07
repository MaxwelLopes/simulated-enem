"use client";

import { Question } from "@prisma/client";
import AlternativeItem from "./AlternativeItem";
import { useQuestion } from "../hook/Question";
import TextFormatter from "../utils/utils";

interface QuestionWithCategories extends Question {
  Question_categories: {
    Category: {
      name: string;
      id: number;
    };
  }[];
}

type props = {
  currentQuestion: {
    question: QuestionWithCategories;
    selectedResponse: string;
    index: number;
  };
  setResponse: Function;
  simulationStatus: string | null;
};

export const QuestionView = ({
  currentQuestion,
  setResponse,
  simulationStatus,
}: props) => {
  const {
    year,
    context,
    disciplineId,
    subjectId,
    alternativesIntroduction,
    alternativeA,
    alternativeB,
    alternativeC,
    alternativeD,
    alternativeE,
    Question_categories,
  } = currentQuestion.question;

  const response = currentQuestion.selectedResponse;
  const index = currentQuestion.index + 1;

  const { disciplineName, subjectName } = useQuestion(disciplineId, subjectId);
  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-2xl mx-auto my-4 border border-gray-300">
      <p className="text-2xl font-semibold text-gray-800 mb-1">
        Questão {index}
      </p>
      {year && <p className="text-lg font-semibold text-gray-600">{year}</p>}
      {disciplineName && (
        <p className="text-xl font-semibold text-gray-800 mb-1">
          {disciplineName}
        </p>
      )}

      {subjectName && (
        <p className="text-lg font-semibold text-gray-700 mb-1">
          {subjectName}
        </p>
      )}

      {Question_categories && (
        <div className="flex flex-wrap mb-1">
          <span className="text-sm font-semibold text-gray-700">
            Tópicos:{" "}
            {Question_categories.map(({ Category }) => Category.name).join(
              ", "
            )}
          </span>
        </div>
      )}

      {context && (
        <div className="text-gray-800 mb-4 pt-2">
          <TextFormatter text={context} />
        </div>
      )}

      {alternativesIntroduction && (
        <div className="text-gray-600 mb-2">
          <TextFormatter text={alternativesIntroduction} />
        </div>
      )}

      <ul className="space-y-2">
        <AlternativeItem
          letter="A"
          text={alternativeA}
          response={response}
          setResponse={setResponse}
          simulationStatus={simulationStatus}
        />
        <AlternativeItem
          letter="B"
          text={alternativeB}
          response={response}
          setResponse={setResponse}
          simulationStatus={simulationStatus}
        />
        <AlternativeItem
          letter="C"
          text={alternativeC}
          response={response}
          setResponse={setResponse}
          simulationStatus={simulationStatus}
        />
        <AlternativeItem
          letter="D"
          text={alternativeD}
          response={response}
          setResponse={setResponse}
          simulationStatus={simulationStatus}
        />
        <AlternativeItem
          letter="E"
          text={alternativeE}
          response={response}
          setResponse={setResponse}
          simulationStatus={simulationStatus}
        />
      </ul>
    </div>
  );
};
