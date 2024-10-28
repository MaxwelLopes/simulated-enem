"use client";

import { useEffect, useState } from "react";
import {
  answerQuestion,
  getQuestionOfSimulated,
} from "../service/simualationService";
import { getQuestion } from "../service/QuestionService";
import { Question, Simulated_questions } from "@prisma/client";

interface QuestionWithCategories extends Question {
  Question_categories: {
    Category: {
      name: string;
      id: number;
    };
  }[];
}

export const simulation = () => {
  const [simulatedId, setSimulatedId] = useState<number>();
  const [questionOrder, setQuestionOrder] = useState<
    { id: number; index: number }[]
  >([]);
  const [questionsCache, setQuestionsCache] = useState<{
    [id: number]: {
      question: QuestionWithCategories;
      selectedResponse: string;
      index: number;
      response: boolean;
    };
  }>({});

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponseState] = useState<string>("");

  useEffect(() => {
    const fetchQuestionsOrder = async () => {
      if (!simulatedId) return;
      setLoading(true);
      try {
        const simulatedQuestions = await getQuestionOfSimulated(simulatedId);
        const questionIds = simulatedQuestions.map(
          (question: Simulated_questions, index: number) => ({
            id: question.questionId,
            index: index,
          })
        );

        setQuestionOrder(questionIds);
      } catch (error) {
        console.error("Erro ao buscar questões do simulado:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsOrder();
  }, [simulatedId]);

  const loadQuestion = async (questionId: number) => {
    if (!questionsCache[questionId]) {
      setLoading(true);
      try {
        const question = await getQuestion(questionId);
        if (question) {
          setQuestionsCache((prevCache) => ({
            ...prevCache,
            [question.id]: {
              question,
              selectedResponse: "",
              index: currentIndex,
              response: false,
            },
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar questão:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setResponseState(questionsCache[questionId].selectedResponse);
    }
  };

  useEffect(() => {
    if (questionOrder[currentIndex]) {
      loadQuestion(questionOrder[currentIndex].id);
    }
  }, [currentIndex, questionOrder]);

  const questionId = questionOrder[currentIndex]; 
  const currentQuestionData = questionsCache[questionId?.id];

  const setResponse = (selectedResponse: string) => {
    const questionId = questionOrder[currentIndex].id;
    setResponseState(selectedResponse);
    setQuestionsCache((prevCache) => ({
      ...prevCache,
      [questionId]: {
        ...prevCache[questionId],
        selectedResponse,
        response: true,
      },
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questionOrder.length - 1) {
      if (response !== "") {
        const { id: questionId, correctAlternative } =
          currentQuestionData.question;
        const { selectedResponse } = currentQuestionData;
        answerQuestion(
          simulatedId as number,
          questionId,
          correctAlternative,
          selectedResponse
        );
      }
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      if (response !== "") {
        const { id: questionId, correctAlternative } =
          currentQuestionData.question;
        const { selectedResponse } = currentQuestionData;
        answerQuestion(
          simulatedId as number,
          questionId,
          correctAlternative,
          selectedResponse
        );
      }
      setCurrentIndex(currentIndex - 1);
    }
  };

  return {
    simulatedId,
    setSimulatedId,
    currentQuestion: currentQuestionData,
    nextQuestion,
    previousQuestion,
    loading,
    response,
    setResponse,
    selectedResponse: currentQuestionData?.selectedResponse,
    questionsCache,
  };
};
