"use client";

import { useEffect, useState } from "react";
import {
  answerQuestion,
  getQuestionOfSimulated,
  getSimulatedById,
} from "../service/simualationService";
import { getQuestion } from "../service/QuestionService";
import { Essay, Question } from "@prisma/client";
import { SimulatedStatus } from "../enum/simulated";
import { getEssayById } from "../service/essayService";

interface QuestionWithCategories extends Question {
  questionCategories: { category: { name: string; id: number } }[];
}

export const useSimulation = () => {
  const [simulatedId, setSimulatedId] = useState<number>();
  const [questionOrder, setQuestionOrder] = useState<
    { id: number; index: number }[]
  >([]);
  const [questionsCache, setQuestionsCache] = useState<
    Record<
      number,
      {
        question: QuestionWithCategories;
        selectedResponse: string;
        index: number;
        response: boolean;
        hit: boolean | null;
      }
    >
  >({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponseState] = useState<string>("");
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [essay, setEssay] = useState<null | Essay>(null);
  const [showEssayInstructions, setShowEssayInstructions] = useState(false);
  const [showEssay, setShowEssay] = useState(false);
  const [showEssayForm, setShowEssayForm] = useState(false);

  useEffect(() => {
    if (simulatedId) fetchQuestionsOrder();
  }, [simulatedId]);

  useEffect(() => {
    if (questionOrder[currentIndex])
      loadQuestion(questionOrder[currentIndex].id);
  }, [currentIndex, questionOrder]);

  const fetchQuestionsOrder = async () => {
    setLoading(true);
    try {
      let essay;
      const simulatedQuestions = await getQuestionOfSimulated(simulatedId!);
      const questionIds = simulatedQuestions.map((question, index) => ({
        id: question.questionId,
        index,
        hit: question.hit,
      }));
      const simulated = await getSimulatedById(simulatedId!);
      if (simulated?.essayId) {
        essay = await getEssayById(simulated.essayId);
        setEssay(essay);
      }
      setQuestionOrder(questionIds);
      setTotalQuestions(simulatedQuestions.length);
      if (essay) {
        setShowEssayInstructions(true);
        setShowEssay(true);
      } else {
        setShowEssayInstructions(false);
        setShowEssay(false);
      }
    } catch (error) {
      console.error("Erro ao buscar questões do simulado:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestion = async (questionId: number) => {
    if (questionsCache[questionId]) {
      setResponseState(questionsCache[questionId].selectedResponse);
      return;
    }
    setLoading(true);
    try {
      const question = await getQuestion(questionId);
      if (question) cacheQuestion(question);
    } catch (error) {
      console.error("Erro ao buscar questão:", error);
    } finally {
      setLoading(false);
    }
  };

  const cacheQuestion = (question: QuestionWithCategories) => {
    setQuestionsCache((prevCache) => ({
      ...prevCache,
      [question.id]: {
        question,
        selectedResponse: "",
        index: currentIndex,
        response: false,
        hit: null,
      },
    }));
  };

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

  const handleAnswerQuestion = () => {
    if (response !== "") {
      const { question, selectedResponse } =
        questionsCache[questionOrder[currentIndex].id];
      if (selectedResponse !== "") {
        answerQuestion(
          simulatedId!,
          question.id,
          question.correctAlternative,
          selectedResponse
        );
      }
    }
  };

  const nextQuestion = () => {
    if (showEssay) {
      setShowEssay(false);
      setCurrentIndex(0);
      return;
    }
    if (simulationStatus !== SimulatedStatus.COMPLETED) {
      handleAnswerQuestion();
    }

    if (currentIndex < questionOrder.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  const previousQuestion = () => {
    if (simulationStatus !== SimulatedStatus.COMPLETED) {
      handleAnswerQuestion();
    }

    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const currentQuestionData = questionsCache[questionOrder[currentIndex]?.id];

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
    questionOrder,
    currentIndex,
    setCurrentIndex,
    simulationStatus,
    setSimulationStatus,
    setLoading,
    totalQuestions,
    handleAnswerQuestion,
    essay,
    setEssay,
    showEssayInstructions,
    setShowEssayInstructions,
    showEssay,
    setShowEssay,
    showEssayForm,
    setShowEssayForm,
  };
};
