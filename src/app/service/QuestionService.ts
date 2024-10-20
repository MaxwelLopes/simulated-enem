"use server";

import prisma from "../../../prisma/prisma";
import { getQuestionIdsByDiscipline, getQuestionIdsBySubject } from "../data/questionCache";


export const findQuestionByDisciplineId = async (disciplineName: string, numberOfQuestions: number) => {
  try {
    const discipline = await prisma.discipline.findUnique({
      where:{ name: disciplineName },
      select: {id: true}
      }
    )
    if(discipline){
      const questions = getQuestionIdsByDiscipline(discipline.id);
      console.log(questions);
    } 
  } catch (error) {
    console.error("Erro ao buscar IDs das questões:", error);
    throw error;
  }
};

export const findQuestionBySubjectId = async (subjectId: number, numberOfQuestions: number) => {
  try {
    getQuestionIdsBySubject(subjectId)
  } catch (error) {
    console.error("Erro ao buscar IDs das questões:", error);
    throw error;
  }
};

export const findQuestionByCategoryId = async (categoryId: number) => {
  try {
    const questionIds = await prisma.question_categories.findMany({
      where: { categoriesId: categoryId },
      select: { questionId: true },
    });

    return questionIds.map((question) => question.questionId);
  } catch (error) {
    console.error("Erro ao buscar questões por categoria:", error);
    throw error;
  }
};
