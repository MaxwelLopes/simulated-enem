import { Essay, Simulated } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { SimulatedStatus } from "../enum/simulated";
import { SimulatedType } from "../enum/simulated";

interface CreateSimulatedInput {
  type: string;
  userId: string;
  essayId?: number;
  subtype?: string[];
  questionsId?: { id: number }[];
  unseen?: boolean;
  review?: boolean;
}

export const createSimulated = async ({
  type,
  userId,
  essayId,
  subtype,
  questionsId,
  unseen = false,
  review = false,
}: CreateSimulatedInput): Promise<Simulated> => {
  try {
    // Validação básica dos dados
    if (!type || !userId) {
      throw new Error("Type and userId are required.");
    }

    if (
      type !== SimulatedType.ESSAY &&
      (!questionsId || questionsId.length === 0)
    ) {
      throw new Error("Questions are required for non-essay simulations.");
    }

    if (type === SimulatedType.ESSAY && !essayId) {
      throw new Error("EssayId is required for essay simulations.");
    }

    // Criação do simulado
    const simulated = await prisma.simulated.create({
      data: {
        type,
        userId,
        subtype,
        totalQuestions: questionsId?.length || 0,
        status: SimulatedStatus.PENDING,
        unseen,
        review,
        ...(essayId && { essayId }),
      },
    });

    // Criação das questões associadas (se houver)
    console.log(simulated.id, 'simulated.id');
    if (questionsId && questionsId.length > 0) {
      await prisma.simulatedQuestion.createMany({
        data: questionsId.map((question) => ({
          simulatedId: simulated.id,
          questionId: question.id,
          hit: null,
        })),
      });
    }

    return simulated;
  } catch (error) {
    console.error("Error creating simulated:", error);
    throw new Error("Failed to create simulated.");
  }
};

export const findSimulatedByUserId = async (userId: string) => {
  return await prisma.simulated.findMany({
    where: {
      userId: userId,
    },
  });
};

export const findQuestionsBySimulationId = async (simulatedId: string) => {
  return await prisma.simulatedQuestion.findMany({
    where: {
      simulatedId: simulatedId,
    },
  });
};

export const updateAnswerBySilulation = async (
  simulatedId: string,
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
  simulatedId: string;
  status: string;
  essayScore?: number;
  hits?: number;
  userText?: string;
  completionTimeSeconds?: number;
}

export const updateSimulated = async (params: UpdateSimulatedParams) => {
  const { simulatedId, status, essayScore, hits, userText, completionTimeSeconds } = params;
  await prisma.simulated.update({
    where: {
      id: simulatedId,
    },
    data: {
      status,
      correctAnswers: hits,
      finishedAt: new Date(),
      userText,
      essayScore,
      completionTimeSeconds
    },
  });
};

export const findSimulatedById = async (id: string) => {
  return await prisma.simulated.findUnique({
    where: {
      id,
    },
  });
};

export const findResponse = async (simulatedId: string, questionId: number) => {
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
  simulatedId: string
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
  userId: string,
  includeInep: boolean = false
): Promise<Essay | null> {
  const result = await prisma.essay.findFirst({
    where: {
      ...(includeInep ? {} : { isFromInep: false }),
      NOT: {
        simulated: {
          some: {
            userId: userId,
          },
        },
      },
    },
  });
  return result;
}
 

export const getEssayScores = async (simulatedId: string) => {
  return await prisma.simulatedEssayScore.findMany({
    where: {
      simulatedId,
    },
  });
};

export const findEssayBySimulatedId = async (simulatedId: string) => {
  return await prisma.essay.findFirst({
    where: {
      simulated: {
        some: {
          id: simulatedId,
        },
      },
    },
  });
};

export const findSimulationElapsedTimeById = async (simulatedId: string) =>{
  return await prisma.simulated.findUnique({
    where: {
      id: simulatedId
    },
    select: {
      completionTimeSeconds: true 
    }
    
  })
}
