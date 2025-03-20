import { Essay } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { SimulatedStatus } from "../enum/simulated";
import { SimulatedType } from "../enum/simulated";

export const createSimulated = async ({
  type,
  userId,
  essayId,
  subtype,
  questionsId,
  unseen = false,
  review = false,
}: {
  type: string;
  userId: string;
  essayId?: number;
  subtype?: string[];
  questionsId?: { id: number }[];
  unseen?: boolean;
  review?: boolean;
}) => {
  let simulated: {
    type: string;
    userId: string;
    essayId: number | null;
    subtype: string[];
    unseen: boolean | null;
    review: boolean | null;
    id: number;
    correctAnswers: number;
    totalQuestions: number;
    createdAt: Date;
    finishedAt: Date | null;
    status: string;
    completionTimeSeconds: number | null;
    userText: string | null;
  } | null = null;
  if (type !== SimulatedType.ESSAY) {
    const totalQuestions = questionsId?.length;

    simulated = await prisma.simulated.create({
      data: {
        type,
        userId,
        subtype,
        totalQuestions,
        status: SimulatedStatus.PENDING,
        unseen,
        review,
        ...(essayId && { essayId: essayId }),
      },
    });

    if (questionsId && simulated) {
      await prisma.simulatedQuestion.createMany({
        data: questionsId.map((question) => ({
          simulatedId: simulated!.id,
          questionId: question.id,
          hit: null,
        })),
      });
    }
  } else if (essayId) {
    simulated = await prisma.simulated.create({
      data: {
        type,
        userId,
        essayId,
        status: SimulatedStatus.PENDING,
      },
    });
  }
  return simulated!;
};

export const findSimulatedByUserId = async (userId: string) => {
  return await prisma.simulated.findMany({
    where: {
      userId: userId,
    },
  });
};

export const findQuestionsBySimulationId = async (simulatedId: number) => {
  return await prisma.simulatedQuestion.findMany({
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
  await prisma.simulatedQuestion.update({
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

interface UpdateSimulatedParams {
  simulatedId: number;
  status: string;
  essayScore?: number;
  hits?: number;
  userText?: string;
}

export const updateSimulated = async (params: UpdateSimulatedParams) => {
  const { simulatedId, status, essayScore, hits, userText } = params;
  await prisma.simulated.update({
    where: {
      id: simulatedId,
    },
    data: {
      status,
      correctAnswers: hits,
      finishedAt: new Date(),
      userText,
      essayScore
    },
  });
};

export const findSimulatedById = async (id: number) => {
  return await prisma.simulated.findUnique({
    where: {
      id,
    },
  });
};

export const findResponse = async (simulatedId: number, questionId: number) => {
  return await prisma.simulatedQuestion.findFirst({
    where: {
      simulatedId,
      questionId,
    },
    select: {
      response: true,
    },
  });
};

export const getCountCorrectAnswersBySimulatedId = async (
  simulatedId: number
) => {
  const correctAnswersCount = await prisma.simulatedQuestion.count({
    where: {
      simulatedId: simulatedId,
      hit: true,
    },
  });

  return correctAnswersCount;
};

export async function aggregateSimulated() {
  const result = await prisma.simulated.aggregate({
    _sum: {
      correctAnswers: true,
      totalQuestions: true,
    },
  });
  return result;
}

export async function findUnseenEssayForUser(
  userId: string
): Promise<Essay | null> {
  const result = await prisma.essay.findFirst({
    where: {
      isFromInep: false,
      NOT: {
        simulated: {
          some: {
            userId: userId,
          },
        },
      },
    },
  });

  console.log(result);

  return result;
}

export const getEssayScores = async (simulatedId: number) => {
  return await prisma.simulatedEssayScore.findMany({
    where: {
      simulatedId,
    },
  });
};
