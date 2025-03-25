"use client";

import { Question, Alternative } from "@prisma/client";
import AlternativeItem from "./AlternativeItem";
import { useQuestion } from "../hook/Question";
import TextFormatter from "../utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "@radix-ui/react-separator";

interface QuestionWithCategories
  extends Omit<
    Question,
    "alternativeA" | "alternativeB" | "alternativeC" | "alternativeD" | "alternativeE"
  > {
  questionCategories: {
    category: {
      id: number;
      name: string;
    };
  }[];
  alternatives: Alternative[];
}

type QuestionViewProps = {
  currentQuestion: {
    question: QuestionWithCategories;
    // Alinhado com o hook, usamos "response" em vez de "selectedResponse"
    response: string;
    index: number;
  };
  setResponse: (response: string) => void;
  simulationStatus: string | null;
  handleAnswerQuestion: (response: string) => void;
};

export const QuestionView = ({
  currentQuestion,
  setResponse,
  simulationStatus,
  handleAnswerQuestion,
}: QuestionViewProps) => {
  const {
    year,
    context,
    disciplineId,
    subjectId,
    alternativesIntroduction,
    questionCategories,
    alternatives,
  } = currentQuestion.question;

  // Pegamos "response" do objeto passado pelo hook
  const response = currentQuestion.response;
  const index = currentQuestion.index + 1;
  const { disciplineName, subjectName } = useQuestion(disciplineId, subjectId);

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-3xl font-bold">Questão {index}</CardTitle>
          {year && (
            <Badge variant="secondary" className="text-lg">
              {year}
            </Badge>
          )}
        </div>
        {disciplineName && (
          <h3 className="text-2xl font-semibold text-muted-foreground">
            {disciplineName}
          </h3>
        )}
        {subjectName && (
          <h4 className="text-xl font-medium text-muted-foreground">
            {subjectName}
          </h4>
        )}
        {questionCategories && questionCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {questionCategories.map(({ category }) => (
              <Badge key={category.id} variant="outline">
                {category.name}
              </Badge>
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
          {[...alternatives]
            .sort((a, b) => a.letter.localeCompare(b.letter))
            .map((alt) => (
              <AlternativeItem
                key={alt.id}
                letter={alt.letter}
                text={alt.text}
                response={response}
                setResponse={setResponse}
                simulationStatus={simulationStatus}
                handleAnswerQuestion={handleAnswerQuestion}
              />
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
