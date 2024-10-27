import prisma from "../../../prisma/prisma";

export const createSimulated = async (
  type: string,
  userId: string,
  subtype: string[],
  questionsId: { id: number }[]
) => {
  const simulated = await prisma.simulated.create({
    data: {
      type,
      userId,
      subtype,
      status: "Não iniciado",
    },
  });

  await prisma.simulated_questions.createMany({
    data: questionsId.map((question) => ({
      simulatedId: simulated.id,
      questionId: question.id,
      hit: null,
    })),
  });

  return simulated;
};

export const findSimulatedByUserId = async (userId: string) => {
  return await prisma.simulated.findMany({
    where: {
      userId: userId,
    },
  });
};

export const findQuestionsBySimulationId = async (simulatedId: number) => {
  return await prisma.simulated_questions.findMany({
    where: {
      simulatedId: simulatedId,
    },
  });
};
