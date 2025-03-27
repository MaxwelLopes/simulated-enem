"use client";

import { useState, useEffect } from "react";
import {
  answerQuestion,
  getQuestionOfSimulated,
  getSimulatedById,
} from "../service/simualationService";
import { getQuestion } from "../service/QuestionService";
import { getEssayBySimulatedId } from "../service/essayService";
import { SimulatedStatus } from "../enum/simulated";
import { Simulated } from "@prisma/client";
import { calculateElapsedTime } from "../utils/utils";

interface QuestionOrderItem {
  id: number;
  index: number;
  response: string | null;
  hit?: boolean;
}

interface QuestionCacheItem {
  question: any;
  response: string;
}

export const useSimulation = () => {
  const [simulatedId, setSimulatedId] = useState<string | null>(null);
  const [questionOrder, setQuestionOrder] = useState<QuestionOrderItem[]>([]);
  const [questionsCache, setQuestionsCache] = useState<
    Record<number, QuestionCacheItem>
  >({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);
  const [essay, setEssay] = useState<any>(null);
  const [showEssayInstructions, setShowEssayInstructions] =
    useState<boolean>(false);
  const [showEssay, setShowEssay] = useState<boolean>(false);
  const [showEssayForm, setShowEssayForm] = useState<boolean>(false);
  const [simualted, setSimulated] = useState<Simulated>();
  const [timeSpent, setTimeSpent] = useState<number>();

  useEffect(() => {
    setLoading(true);
    if (simulatedId) {
      fetchQuestionsOrder(simulatedId);
      fetchEssay(simulatedId);
      fetchSimulated(simulatedId);
    }
    setLoading(false);
  }, [simulatedId]);

  useEffect(() => {
    if (questionOrder[currentIndex]?.id) {
      setLoading(true);
      loadQuestion(questionOrder[currentIndex]?.id);
      setLoading(false);
    }
  }, [currentIndex]);

  const fetchQuestionsOrder = async (simulatedId: string) => {
    try {
      const simulatedQuestions = await getQuestionOfSimulated(simulatedId);
      const questionIds = simulatedQuestions.map((q: any, index: number) => ({
        id: q.questionId,
        index,
        response: q.response,
        hit: q.hit,
      }));
      setQuestionOrder(questionIds);
    } catch (error) {
      console.error("Erro ao buscar questões do simulado:", error);
    }
  };

  const fetchEssay = async (simulatedId: string) => {
    const essay = await getEssayBySimulatedId(simulatedId);
    if (essay) {
      setShowEssayInstructions(true);
      setEssay(essay);
      setShowEssay(true);
    }
  };

  const fetchSimulated = async (simulatedId: string) => {
    const simulatedData = await getSimulatedById(simulatedId);
    if (simulatedData) {
      setSimulated(simulatedData as Simulated);
      console.log(simulatedData);
      setTimeSpent(calculateElapsedTime(simulatedData?.createdAt));
    }
  };

  const loadQuestion = async (questionId: number) => {
    if (questionsCache[questionId]) return;
    try {
      const question = await getQuestion(questionId);
      const existing = questionOrder.find((q) => q.id === questionId);
      const existingResponse = existing?.response || "";
      const indexValue = existing?.index ?? 0;
      setQuestionsCache((prevCache) => ({
        ...prevCache,
        [questionId]: {
          question,
          response: existingResponse,
          index: indexValue,
        },
      }));
    } catch (error) {
      console.error("Erro ao buscar questão:", error);
    } finally {
      setLoading(false);
    }
  };

  const setResponse = (selectedResponse: string) => {
    const questionId = questionOrder[currentIndex]?.id;
    if (!questionId) return;
    setQuestionsCache((prevCache) => ({
      ...prevCache,
      [questionId]: {
        ...prevCache[questionId],
        response: selectedResponse,
      },
    }));
  };

  const handleAnswerQuestion = (response: string) => {
    if (response !== "" && simulationStatus === SimulatedStatus.PENDING) {
      const currentQuestionId = questionOrder[currentIndex].id;
      const { question } = questionsCache[currentQuestionId];

      answerQuestion(
        simulatedId!,
        question.id,
        question.correctAlternative,
        response
      )
        .then(() => {
          const isHit = response === question.correctAlternative;

          setQuestionsCache((prevCache) => ({
            ...prevCache,
            [question.id]: {
              ...(prevCache[question.id] || {}),
              response,
            },
          }));

          setQuestionOrder((prevOrder) => {
            return prevOrder.map((item) =>
              item.id === currentQuestionId
                ? { ...item, hit: isHit, response }
                : item
            );
          });
        })

        .catch((error) => {
          console.error("Erro ao enviar a resposta:", error);
        });
    }
  };

  const nextQuestion = () => {
    if (showEssay) {
      setCurrentIndex(0);
      loadQuestion(questionOrder[0].id);
      setShowEssay(false);
    } else if (currentIndex + 1 < questionOrder.length) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      loadQuestion(questionOrder[nextIndex].id);
    }
  };

  const previousQuestion = () => {
    if (currentIndex === 0) {
      setShowEssay(true);
    } else {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      loadQuestion(questionOrder[newIndex].id);
    }
  };

  useEffect(() => {
    if (questionOrder.length > 0 && !questionsCache[questionOrder[0].id]) {
      loadQuestion(questionOrder[0].id);
    }
  }, [questionOrder]);

  return {
    simulatedId,
    setSimulatedId,
    currentQuestion: questionsCache[questionOrder[currentIndex]?.id],
    nextQuestion,
    previousQuestion,
    loading,
    setResponse,
    questionsCache,
    questionOrder,
    currentIndex,
    setCurrentIndex,
    simulationStatus,
    setSimulationStatus,
    essay,
    setEssay,
    showEssayInstructions,
    setShowEssayInstructions,
    showEssay,
    setShowEssay,
    showEssayForm,
    setShowEssayForm,
    totalQuestions: questionOrder.length,
    handleAnswerQuestion,
    timeSpent,
  };
};
