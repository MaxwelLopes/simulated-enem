import { useEffect, useState } from "react";
import { getQuestionOfSimulated } from "../service/simualationService";
import { getQuestion } from "../service/QuestionService";
import { Question, Simulated_questions } from "@prisma/client";

export const simulation = () => {
  const [simulatedId, setSimulatedId] = useState<number>();
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [questionsCache, setQuestionsCache] = useState<{
    [id: number]: { question: Question; selectedResponse: string };
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
          (question: Simulated_questions) => question.questionId
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
            [question.id]: { question, selectedResponse: "" },  
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
      loadQuestion(questionOrder[currentIndex]);
    }
  }, [currentIndex, questionOrder]);

  const currentQuestionData = questionsCache[questionOrder[currentIndex]];

  const setResponse = (selectedResponse: string) => {
    const questionId = questionOrder[currentIndex];
    setResponseState(selectedResponse);
    setQuestionsCache((prevCache) => ({
      ...prevCache,
      [questionId]: {
        ...prevCache[questionId],
        selectedResponse,
      },
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questionOrder.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
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
  };
};
