"use client";

import { Question } from "@prisma/client";
import AlternativeItem from "./AlternativeItem";
import { useQuestion } from "../hook/Question";
import TextFormatter from "../utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "@radix-ui/react-select";

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
  setLoading: Function;
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
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-3xl font-bold">Questão {index}</CardTitle>
          {year && <Badge variant="secondary" className="text-lg">{year}</Badge>}
        </div>
        {disciplineName && (
          <h3 className="text-2xl font-semibold text-muted-foreground">{disciplineName}</h3>
        )}
        {subjectName && (
          <h4 className="text-xl font-medium text-muted-foreground">{subjectName}</h4>
        )}
        {Question_categories && Question_categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Question_categories.map(({ Category }) => (
              <Badge key={Category.id} variant="outline">{Category.name}</Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {context && (
          <div className="text-lg leading-relaxed">
            <TextFormatter text={context} />
          </div>
        )}
        {alternativesIntroduction && (
          <>
            <Separator />
            <div className="text-lg font-medium">
              <TextFormatter text={alternativesIntroduction} />
            </div>
          </>
        )}
        <div className="space-y-4">
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
        </div>
      </CardContent>
    </Card>
  );
}
