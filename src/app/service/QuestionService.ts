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

