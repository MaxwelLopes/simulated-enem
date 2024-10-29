import prisma from "../../../prisma/prisma";
import { SimulatedStatus } from "../enum/simulated";

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
      status: SimulatedStatus.PENDING,
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

export const updateAnswerBySilulation = async (
  simulatedId: number,
  questionId: number,
  hit: boolean,
  response: string
) => {
  await prisma.simulated_questions.update({
    where: {
      simulatedId_questionId: {
        simulatedId: simulatedId,
        questionId: questionId,
      },
    },
    data: {
      hit,
      lastSeenAt: new Date(),
      response,
    },
  });
};

export const updatesimulated = async (simulatedId: number) => {
  await prisma.simulated.update({
    where: {
      id: simulatedId,
    },
    data: {
      status: SimulatedStatus.COMPLETED
    },
  });
};

export const findSimulatedById = async (id: number) =>{
  return await prisma.simulated.findUnique({
    where:{
      id
    }
  })
}

export const findResponse = async (simulatedId: number, questionId: number) =>{
  return await prisma.simulated_questions.findFirst({
    where:{
      simulatedId,
      questionId,
    },
    select:{
      response: true,
    }
  })
}