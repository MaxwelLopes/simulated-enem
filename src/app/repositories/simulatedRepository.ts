import prisma from "../../../prisma/prisma";
import { SimulatedStatus } from "../enum/simulated";

export const createSimulated = async (
  type: string,
  userId: string,
  subtype: string[],
  questionsId: { id: number }[],
  unseen: boolean = false,
  review: boolean = false,
) => {
  const totalQuestions = questionsId.length;
  const simulated = await prisma.simulated.create({
    data: {
      type,
      userId,
      subtype,
      totalQuestions,
      status: SimulatedStatus.PENDING,
      unseen,
      review,
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

export const updatesimulated = async (simulatedId: number, hits: number, status: string) => {
  await prisma.simulated.update({
    where: {
      id: simulatedId,
    },
    data: {
      status,
      correctAnswers: hits,
      finishedAt: new Date()
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

export const getCountCorrectAnswersBySimulatedId = async (simulatedId: number) => {
  const correctAnswersCount = await prisma.simulated_questions.count({
    where: {
      simulatedId: simulatedId,
      hit: true,
    },
  });

  return correctAnswersCount;
};