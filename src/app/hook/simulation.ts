import { useState, useEffect } from "react";
import {
  answerQuestion,
  getQuestionOfSimulated,
  // answerQuestion, // Caso necessário, adicione funções para enviar respostas.
} from "../service/simualationService";
import { getQuestion } from "../service/QuestionService";

interface QuestionOrderItem {
  id: number;
  index: number;
  response: string | null;
}

interface QuestionCacheItem {
  question: any; // Substitua "any" por uma tipagem mais específica, se disponível.
  response: string;
}

export const useSimulation = () => {
  // ID do simulado
  const [simulatedId, setSimulatedId] = useState<string | null>(null);
  // Ordem das questões (com resposta já salva, se houver)
  const [questionOrder, setQuestionOrder] = useState<QuestionOrderItem[]>([]);
  // Cache de questões carregadas
  const [questionsCache, setQuestionsCache] = useState<
    Record<number, QuestionCacheItem>
  >({});
  // Índice da questão atual
  const [currentIndex, setCurrentIndex] = useState(0);
  // Estado de loading
  const [loading, setLoading] = useState(false);

  // Estados extras para redação
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);
  const [essay, setEssay] = useState<any>(null);
  const [showEssayInstructions, setShowEssayInstructions] =
    useState<boolean>(false);
  const [showEssay, setShowEssay] = useState<boolean>(false);
  const [showEssayForm, setShowEssayForm] = useState<boolean>(false);

  // Quando o simulatedId for definido, busca a ordem das questões.
  useEffect(() => {
    if (simulatedId) {
      fetchQuestionsOrder(simulatedId);
    }
  }, [simulatedId]);

  const fetchQuestionsOrder = async (simulatedId: string) => {
    setLoading(true);
    try {
      const simulatedQuestions = await getQuestionOfSimulated(simulatedId);
      const questionIds = simulatedQuestions.map((q: any, index: number) => ({
        id: q.questionId,
        index,
        response: q.response, // Pode conter resposta já salva.
      }));
      setQuestionOrder(questionIds);
    } catch (error) {
      console.error("Erro ao buscar questões do simulado:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestion = async (questionId: number) => {
    if (questionsCache[questionId]) return;
    setLoading(true);
    try {
      const question = await getQuestion(questionId);
      // Busca o item na ordem para obter o index e a resposta, se houver.
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
    if (response !== "") {
      const { question } = questionsCache[questionOrder[currentIndex].id];
      const selectedResponse =
        questionsCache[questionOrder[currentIndex].id].response;

      answerQuestion(
        simulatedId!,
        question.id,
        question.correctAlternative,
        response
      )
        .then(() => {
          setQuestionsCache((prevCache) => ({
            ...prevCache,
            [question.id]: {
              ...prevCache[question.id],
              response,
            },
          }));
        })
        .catch((error) => {
          console.error("Erro ao enviar a resposta:", error);
        });
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questionOrder.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      loadQuestion(questionOrder[nextIndex].id);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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
  };
};
