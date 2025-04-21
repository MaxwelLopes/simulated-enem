"use server";

import { getAnswersCountByUserIdAndCategory } from "../repositories/categoryRepository";
import {
  findAllQuestionsByIdUser,
  findCorrectAnswersCountByCategory,
  findIncorrectAnswersCountByCategory,
  findQuestionById,
  findQuestionsByUser,
} from "../repositories/questionsRepository";
import {
  getCorrectAnswersCountByUserId,
  getIncorrectAnswersCountByUserId,
} from "../repositories/questionsRepository";
import { aggregateSimulated } from "../repositories/simulatedRepository";

export const getQuestion = async (id: number) => {
  return await findQuestionById(id);
};

// Função que retorna o total de respostas corretas de um usuário
export const getUserCorrectAnswersCount = async (
  userId: string
): Promise<number> => {
  const correctCount = await getCorrectAnswersCountByUserId(userId);
  return correctCount;
};

// Função que retorna o total de respostas incorretas de um usuário
export const getUserIncorrectAnswersCount = async (
  userId: string
): Promise<number> => {
  const incorrectCount = await getIncorrectAnswersCountByUserId(userId);
  return incorrectCount;
};

// Tipo para o resultado por categoria
type CategoryAnswerCount = {
  categoryId: number;
  correctCount: number;
  incorrectCount: number;
};

// Função que retorna o total de respostas por categoria de um usuário
export const getUserAnswersCountByCategory = async (
  userId: string
): Promise<CategoryAnswerCount[]> => {
  const categoryCounts = await getAnswersCountByUserIdAndCategory(userId);
  return categoryCounts;
};

// Função que retorna todas as questões de um usuário
export const getAllQuestionsByUserId = async (
  userId: string
): Promise<{ id: number; context: string | null }[]> => {
  const allQuestions = await findAllQuestionsByIdUser(userId);
  return allQuestions;
};

// Função que retorna todas as questões erradas de um usuário
export const getIncorrectAnswersCountByCategory = async (
  userId: string
): Promise<{ category: string; incorrectCount: number }[]> => {
  const incorrectAnswersCountByCategory =
    await findIncorrectAnswersCountByCategory(userId);
  return incorrectAnswersCountByCategory;
};

// Função que retorna os acertos por categoria
export const getCorrectAnswersCountByCategory = async (
  userId: string
): Promise<{ category: string; correctCount: number }[]> => {
  const correctAnswersCountByCategory = await findCorrectAnswersCountByCategory(
    userId
  );
  return correctAnswersCountByCategory;
};

export const getOverallAverageScore = async (): Promise<number> => {
  const result = await aggregateSimulated();

  const totalCorrect = result._sum.correctAnswers || 0;
  const totalQuestions = result._sum.totalQuestions || 0;

  if (totalQuestions === 0) {
    return 0;
  }

  return (totalCorrect / totalQuestions) * 100; //
};

export const getDisciplineAffinity = async (
  userId: string
): Promise<{ name: string; affinity: number }[]> => {
  const simulatedQuestions = await findQuestionsByUser(userId);
  const disciplineStats: Record<string, { total: number; correct: number }> =
    {};

  simulatedQuestions.forEach((sq) => {
    if (sq.question.discipline) {
      const disciplineName = sq.question.discipline.name;

      if (!disciplineStats[disciplineName]) {
        disciplineStats[disciplineName] = { total: 0, correct: 0 };
      }

      disciplineStats[disciplineName].total += 1;
      if (sq.hit) {
        disciplineStats[disciplineName].correct += 1;
      }
    }
  });

  const disciplineAffinity = Object.keys(disciplineStats).map(
    (disciplineName) => {
      const { total, correct } = disciplineStats[disciplineName];
      const affinity = total > 0 ? (correct / total) * 100 : 0;
      return { name: disciplineName, affinity };
    }
  );
  return disciplineAffinity;
};
