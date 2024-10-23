import prisma from "../../../prisma/prisma";

export const createSimulated = async (type: string, userId: string, questionsId: {id: number}[]) => {
  const simulated = await prisma.simulated.create({
    data: {
      type,
      userId,
      status: "Não iniciado",
    },
  });

 await prisma.simulated_questions.createMany({
    data: questionsId.map(question => ({
      simulatedId: simulated.id,
      questionId: question.id,
      hit: null, 
    })),
  });

  return simulated; 
};