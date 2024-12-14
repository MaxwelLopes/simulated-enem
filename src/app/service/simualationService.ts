"use server";

import { SimulatedStatus, SimulatedType } from "../enum/simulated";
import {
  findQuestionByCategory,
  findQuestionByDiscipline,
  findQuestionBySubject,
  findQuestionByYear,
  findQuestionRandom,
} from "../repositories/questionsRepository";
import {
  createSimulated as createSimulatedInRepostitory,
  findQuestionsBySimulationId,
  findResponse,
  findSimulatedById,
  findSimulatedByUserId,
  getCountCorrectAnswersBySimulatedId,
  updateAnswerBySilulation,
  updatesimulated,
} from "../repositories/simulatedRepository";

type Input = {
  typeOfSimulated: string;
  questionCount?: number;
  error?: string | null;
  unseen: boolean;
  review: boolean;
  subtypes: string[];
  userId: string;
};

export const createSimulated = async ({
  typeOfSimulated,
  questionCount = 10,
  unseen,
  review,
  subtypes,
  userId,
}: Input): Promise<boolean | undefined> => {
  console.log(typeOfSimulated, questionCount, unseen, review, subtypes, userId);

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
      createSimulatedInRepostitory(
        typeOfSimulated,
        userId,
        subtypes,
        questions
      );
      return true;
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
            ? await findQuestionByDiscipline(
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
      createSimulatedInRepostitory(
        typeOfSimulated,
        userId,
        subtypes,
        questions
      );
      return true;
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
            ? await findQuestionBySubject(
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
      createSimulatedInRepostitory(
        typeOfSimulated,
        userId,
        subtypes,
        questions
      );
      return true;
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
            ? await findQuestionByCategory(
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
      createSimulatedInRepostitory(
        typeOfSimulated,
        userId,
        subtypes,
        questions
      );
      return true;
    } catch {}
  }

  if (typeOfSimulated === SimulatedType.YEAR) {
    try {
      const questions = await findQuestionByYear(subtypes[0]);
      if (questions.length < 1) {
        return false;
      }
      createSimulatedInRepostitory(
        typeOfSimulated,
        userId,
        subtypes,
        questions
      );
      return true;
    } catch {}
  }
};

export const getSimulations = async (userId: string) => {
  const simulations = await findSimulatedByUserId(userId);
  return simulations;
};

export const getQuestionOfSimulated = async (simulatedId: number) => {
  return await findQuestionsBySimulationId(simulatedId);
};

export const answerQuestion = async (
  simulatedId: number,
  questionId: number,
  rightAnswer: string,
  response: string
) => {
  const hit = rightAnswer === response;
  const status = await getSimulationStatus(simulatedId);
  if (status !== SimulatedStatus.COMPLETED)
    await updateAnswerBySilulation(simulatedId, questionId, hit, response);
};

export const finishSimulation = async (id: number) => {
  const hits = await getCountCorrectAnswersBySimulatedId(id);
  const status = SimulatedStatus.COMPLETED;
  await updatesimulated(id, hits, status);
};

export const getSimulationStatus = async (id: number) => {
  const simulation = await findSimulatedById(id);
  return simulation?.status || null;
};

export const getResponse = async (simulatedId: number, questionId: number) => {
  return await findResponse(simulatedId, questionId);
};
