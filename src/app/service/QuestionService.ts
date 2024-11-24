"use server";

import prisma from "../../../prisma/prisma";
import { getAnswersCountByUserIdAndCategory } from "../repositories/categoryRepository";
import { findAllQuestionsByIdUser, findCorrectAnswersCountByCategory, findIncorrectAnswersCountByCategory, findQuestionById } from "../repositories/questionsRepository";
import { getCorrectAnswersCountByUserId, getIncorrectAnswersCountByUserId } from "../repositories/questionsRepository";


export const getQuestion = async (id: number) =>{
  return await findQuestionById(id);
}

// Função que retorna o total de respostas corretas de um usuário
export const getUserCorrectAnswersCount = async (userId: string): Promise<number> => {
  const correctCount = await getCorrectAnswersCountByUserId(userId);
  return correctCount;
};

// Função que retorna o total de respostas incorretas de um usuário
export const getUserIncorrectAnswersCount = async (userId: string): Promise<number> => {
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
export const getUserAnswersCountByCategory = async (userId: string): Promise<CategoryAnswerCount[]> => {
  const categoryCounts = await getAnswersCountByUserIdAndCategory(userId);
  return categoryCounts;
};

// Função que retorna todas as questões de um usuário
export const getAllQuestionsByUserId = async (userId: string): Promise<{ id: number; context?: string }[]> => {
  const allQuestions = await findAllQuestionsByIdUser(userId);
  return allQuestions;
};

// Função que retorna todas as questões erradas de um usuário
export const getIncorrectAnswersCountByCategory = async (userId: string): Promise<{ category: string; incorrectCount: number }[]> => {
  const incorrectAnswersCountByCategory = await findIncorrectAnswersCountByCategory(userId);
  return incorrectAnswersCountByCategory;
};

// Função que retorna os acertos por categoria
export const getCorrectAnswersCountByCategory = async (userId: string): Promise<{ category: string; correctCount: number }[]> => {
  const correctAnswersCountByCategory = await findCorrectAnswersCountByCategory(userId);
  return correctAnswersCountByCategory;
};

export const getOverallAverageScore = async (): Promise<number> => {
  const result = await prisma.simulated.aggregate({
    _sum: {
      correctAnswers: true,
      totalQuestions: true,
    },
  });
  
  const totalCorrect = result._sum.correctAnswers || 0;
  const totalQuestions = result._sum.totalQuestions || 0;
  
  if (totalQuestions === 0) {
    return 0;
  }
  
  return (totalCorrect / totalQuestions) * 100;
};

export const getDisciplineAffinity = async (userId: string): Promise<{ name: string; affinity: number }[]> => {

  const disciplines = await prisma.discipline.findMany();

  const rawAffinityData = await Promise.all(
    disciplines.map(async (discipline) => {

      const questions = await prisma.question.findMany({
        where: { disciplineId: discipline.id },
        select: { id: true }
      });

      const questionIds = questions.map(q => q.id);

      const simulatedQuestions = await prisma.simulated_questions.findMany({
        where: {
          questionId: { in: questionIds },
          Simulated: { userId: userId }
        },
        select: {
          hit: true
        }
      });

      const totalQuestions = simulatedQuestions.length;
      const correctAnswers = simulatedQuestions.filter(sq => sq.hit === true).length;

      const rawAffinity = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      return {
        name: discipline.name,
        affinity: rawAffinity
      };
    })
  );

  const maxAffinity = Math.max(...rawAffinityData.map(d => d.affinity));

  const scaledAffinityData = rawAffinityData.map(d => ({
    name: d.name,
    affinity: maxAffinity > 0 ? Math.round((d.affinity / maxAffinity) * 100 * 100) / 100 : 0
  }));

  return scaledAffinityData;
};
