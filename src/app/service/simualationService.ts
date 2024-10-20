"use server";

import prisma from "../../../prisma/prisma";
import { cache } from "../data/questionIdsCache";

const addQuestionsToSimulation = async (
  simulationId: number,
  questionIds: number[]
) => {
  try {
    questionIds.map(async (id) => {
      await prisma.simulated_questions.create({
        data: { simulatedId: simulationId, questionId: id },
      });
    });
  } catch (error) {
    console.error("Erro ao adicionar questões à simulação:", error);
    throw error;
  }
};

export const createSimulation = async (
  type: string,
  disciplineName: string | null,
  subjectName: string | null,
  categoryName: string | null,
  questionCount: number | null,
  userId: string
) => {
  try {
    let simulated;
    if (userId) {
      simulated = await prisma.simulated.create({
        data: {
          type,
          userId,
          status: "Não iniciado",
        },
      });
    }

    if (type === "Área de estudo") {
      if (disciplineName && simulated) {
        const discipline = await prisma.discipline.findUnique({
          where: { name: disciplineName },
          select: { id: true },
        });
        if (discipline) {
          const questionsId = cache.questionIdsByDiscipline[discipline.id];
          const shuffledIds = questionsId.sort(() => Math.random() - 0.5);
          const selectedIds = questionCount
            ? shuffledIds.slice(0, questionCount)
            : shuffledIds;
          await addQuestionsToSimulation(simulated.id, selectedIds);
        }
      }
      return { success: true, message: "" };
    }
    if (type === "Matéria") {
      if (subjectName && simulated) {
        const subject = await prisma.subject.findUnique({
          where: { name: subjectName },
          select: { id: true },
        });
        if (subject) {
          const questionsId = cache.questionIdsBySubject[subject.id];
          const shuffledIds = questionsId.sort(() => Math.random() - 0.5);
          const selectedIds = questionCount
            ? shuffledIds.slice(0, questionCount)
            : shuffledIds;
          await addQuestionsToSimulation(simulated.id, selectedIds);
        }
      }
      return { success: true, message: "" };;
    }

    if (type === "Tópico") {
      if (categoryName && simulated) {
        const category = await prisma.category.findUnique({
          where: { name: categoryName },
          select: { id: true },
        });
        if (category) {
          const questionsId = cache.questionIdsByCategory[category.id];
          const shuffledIds = questionsId.sort(() => Math.random() - 0.5);
          const selectedIds = questionCount
            ? shuffledIds.slice(0, questionCount)
            : shuffledIds;
          await addQuestionsToSimulation(simulated.id, selectedIds);
        }
      }
      return { success: true, message: "" };
    }

    return {success: false, message: "erro"};
  } catch (error) {
    console.error("Erro ao criar simulação:", error);
    throw error;
  }
};

export const findSimulation = async (userId: string) =>{
  const simulations = await prisma.simulated.findMany({
    where:{
      userId: userId,
    }
  })
  return simulations ? simulations : [];
}
