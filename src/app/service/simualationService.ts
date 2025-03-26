"use server";

import { Essay, Simulated } from "@prisma/client";
import { SimulatedStatus, SimulatedType } from "../enum/simulated";
import { createEssay, getEssayByYear } from "../repositories/essayRepository";
import {
  findQuestionByYear,
  findQuestionRandom,
  findSimulationQuestionsByCategory,
  findSimulationQuestionsByDiscipline,
  findSimulationQuestionsBySubject,
} from "../repositories/questionsRepository";
import {
  createSimulated as createSimulatedInRepostitory,
  findQuestionsBySimulationId,
  findResponse,
  findSimulatedById,
  findSimulatedByUserId,
  findUnseenEssayForUser,
  getCountCorrectAnswersBySimulatedId,
  getEssayScores,
  updateAnswerBySilulation,
  updateSimulated,
} from "../repositories/simulatedRepository";
import { generateTheme } from "./essayService";

type Input = {
  typeOfSimulated: string;
  questionCount?: number;
  error?: string | null;
  unseen: boolean;
  review: boolean;
  subtypes: string[];
  userId: string;
  nonInepEssay?: boolean;
};

export const createSimulated = async ({
  typeOfSimulated,
  questionCount = 1,
  unseen,
  review,
  subtypes,
  userId,
  nonInepEssay = false,
}: Input): Promise<string | boolean | undefined> => {
  if (typeOfSimulated !== SimulatedType.ESSAY && typeOfSimulated !== SimulatedType.YEAR && (questionCount < 1 || questionCount > 180)) {
    return false;
  }
  if (typeOfSimulated === SimulatedType.GENERAL) {
    try {
      let questions: { id: number }[] = await findQuestionRandom(
        questionCount,
        userId,
        unseen,
        review
      );

      if (questions.length < 1) {
        return false;
      }
      const simulated: Simulated = await createSimulatedInRepostitory({
        type: typeOfSimulated,
        userId,
        subtype: subtypes,
        questionsId: questions,
      });
      if (simulated) {
        return simulated.id;
      }
      return false;
    } catch {}
  }

  if (typeOfSimulated === SimulatedType.DISCIPLINE) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      let questions: { id: number }[] = [];

      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findSimulationQuestionsByDiscipline(
                subType,
                questionsPerSubtype,
                userId,
                unseen,
                review
              )
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );

      if (questions.length < 1) {
        return false;
      }
      const simulated: Simulated = await createSimulatedInRepostitory({
        type: typeOfSimulated,
        userId,
        subtype: subtypes,
        questionsId: questions,
      });
      if (simulated) {
        return simulated.id;
      }
      return false;
    } catch {}
  }

  if (typeOfSimulated === SimulatedType.SUBJECT) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      let questions: { id: number }[] = [];
      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findSimulationQuestionsBySubject(
                subType,
                questionsPerSubtype,
                userId,
                unseen,
                review
              )
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );
      if (questions.length < 1) {
        return false;
      }
      const simulated: Simulated = await createSimulatedInRepostitory({
        type: typeOfSimulated,
        userId,
        subtype: subtypes,
        questionsId: questions,
      });
      if (simulated) {
        return simulated.id;
      }
      return false;
    } catch {}
  }

  if (typeOfSimulated === SimulatedType.CATEGOTY) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      let questions: { id: number }[] = [];
      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findSimulationQuestionsByCategory(
                subType,
                questionsPerSubtype,
                userId,
                unseen,
                review
              )
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );
      if (questions.length < 1) {
        return false;
      }
      const simulated: Simulated = await createSimulatedInRepostitory({
        type: typeOfSimulated,
        userId,
        subtype: subtypes,
        questionsId: questions,
      });
      if (simulated) {
        return simulated.id;
      }
      return false;
    } catch {}
  }

  if (typeOfSimulated === SimulatedType.YEAR) {
    try {
      const questions = await findQuestionByYear(subtypes[0]);
      if (questions.length < 1) {
        return false;
      }
      const simulated: Simulated = await createSimulatedInRepostitory({
        type: typeOfSimulated,
        userId,
        subtype: subtypes,
        questionsId: questions,
      });
      if (simulated) {
        return simulated.id;
      }
      return false;
    } catch {}
  }

  if (typeOfSimulated === SimulatedType.ESSAY) {
    try {
      if (nonInepEssay) {
        let essay = await findUnseenEssayForUser(userId);
        if (!essay) {
          const generatedEssay = await generateTheme();
          essay = await createEssay(
            generatedEssay.theme,
            generatedEssay.motivationalTexts
          );
        }

        if (!essay || !essay.id) {
          throw new Error("Falha ao criar.");
        }

        const simulated: Simulated = await createSimulatedInRepostitory({
          type: typeOfSimulated,
          userId,
          subtype: subtypes,
          essayId: essay.id,
        });
        if (simulated) {
          return simulated.id;
        }
      } else {
        const essay = await getEssayByYear(subtypes[0]);
        if (!essay || !essay.id) {
          throw new Error("Falha ao obter a redação.");
        }
        const simulated: Simulated = await createSimulatedInRepostitory({
          type: typeOfSimulated,
          userId,
          subtype: subtypes,
          essayId: essay.id,
        });
        if (simulated) {
          return simulated.id;
        }
      }
      return false;
    } catch {}
  }
};

export const getSimulations = async (userId: string) => {
  const simulations = await findSimulatedByUserId(userId);
  return simulations;
};

export const getQuestionOfSimulated = async (simulatedId: string) => {
  return await findQuestionsBySimulationId(simulatedId);
};

export const answerQuestion = async (
  simulatedId: string,
  questionId: number,
  rightAnswer: string,
  response: string
) => {
  console.log(rightAnswer, response);
  const hit = rightAnswer === response;
  const status = await getSimulationStatus(simulatedId);
  if (status !== SimulatedStatus.COMPLETED)
    await updateAnswerBySilulation(simulatedId, questionId, hit, response);
};

export const finishSimulation = async (simulatedId: string) => {
  const hits = await getCountCorrectAnswersBySimulatedId(simulatedId);
  const status = SimulatedStatus.COMPLETED;
  await updateSimulated({ simulatedId, status, hits });
};

export const getSimulationStatus = async (id: string) => {
  const simulation = await findSimulatedById(id);
  return simulation?.status || null;
};

export const getResponse = async (simulatedId: string, questionId: number) => {
  return await findResponse(simulatedId, questionId);
};

export const getSimulatedById = async (id: string) => {
  return await findSimulatedById(id);
};

export const getCriteria = async (simulatedId: string) => {
  const scores = await getEssayScores(simulatedId);
  const criteria = scores.map((score) => {
    return {
      criterion: score.criterion,
      score: score.score,
      justification: score.justification,
    };
  });
  return criteria;
};

export const getUserText = async (simulatedId: string) => {
  const simulated = await findSimulatedById(simulatedId);
  return simulated?.userText || null;
};
