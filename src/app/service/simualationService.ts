"use server";

import { SimulatedStatus, SimulatedType } from "../enum/simulated";
import {
  findQuestionByCategory,
  findQuestionByCategoryReview,
  findQuestionByCategoryUnseen,
  findQuestionByDiscipline,
  findQuestionByDisciplineReview,
  findQuestionByDisciplineUnseen,
  findQuestionBySubject,
  findQuestionBySubjectReview,
  findQuestionBySubjectUnseen,
  findQuestionByYear,
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
  typeOfSimuled: string;
  questionCount?: number;
  error?: string | null;
  unseen?: boolean;
  review?: boolean;
  subtypes: string[];
  userId: string;
};

export const createSimulated = async ({
  typeOfSimuled,
  questionCount,
  unseen,
  review,
  subtypes,
  userId,
}: Input): Promise<boolean | undefined> => {
  console.log(typeOfSimuled,
    questionCount,
    unseen,
    review,
    subtypes,
    userId,)
  if (typeOfSimuled === SimulatedType.DISCIPLINE && !unseen && !review) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      let questions: { id: number }[] = [];

      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findQuestionByDiscipline(subType, questionsPerSubtype)
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );
      if (questions.length < 1) {
        return false;
      }
      createSimulatedInRepostitory(typeOfSimuled, userId, subtypes, questions);
      return true;
    } catch {}
  }

  if (typeOfSimuled === SimulatedType.DISCIPLINE && unseen && !review) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      let questions: { id: number }[] = [];

      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findQuestionByDisciplineUnseen(
                subType,
                userId,
                questionsPerSubtype
              )
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );
      if (questions.length < 1) {
        return false;
      }
      createSimulatedInRepostitory(
        typeOfSimuled,
        userId,
        subtypes,
        questions,
        unseen,
        review
      );
      return true;
    } catch {}
  }

  if (typeOfSimuled === SimulatedType.DISCIPLINE && !unseen && review) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      let questions: { id: number }[] = [];

      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findQuestionByDisciplineReview(
                subType,
                userId,
                questionsPerSubtype
              )
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );
      if (questions.length < 1) {
        return false;
      }
      createSimulatedInRepostitory(
        typeOfSimuled,
        userId,
        subtypes,
        questions,
        unseen,
        review
      );
      return true;
    } catch {}
  }

  if (typeOfSimuled === SimulatedType.SUBJECT && !unseen && !review) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      let questions: { id: number }[] = [];
      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findQuestionBySubject(subType, questionsPerSubtype)
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );
      if (questions.length < 1) {
        return false;
      }
      createSimulatedInRepostitory(typeOfSimuled, userId, subtypes, questions);
      return true;
    } catch {}
  }

  if (typeOfSimuled === SimulatedType.SUBJECT && unseen && !review) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      let questions: { id: number }[] = [];
      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findQuestionBySubjectUnseen(subType, userId, questionsPerSubtype)
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );
      if (questions.length < 1) {
        return false;
      }
      createSimulatedInRepostitory(typeOfSimuled, userId, subtypes, questions);
      return true;
    } catch {}
  }

  if (typeOfSimuled === SimulatedType.SUBJECT && !unseen && review) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      let questions: { id: number }[] = [];
      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findQuestionBySubjectReview(
                subType,
                userId,
                questionsPerSubtype
              )
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );
      if (questions.length < 1) {
        return false;
      }
      createSimulatedInRepostitory(
        typeOfSimuled,
        userId,
        subtypes,
        questions,
        unseen,
        review
      );
      return true;
    } catch {}
  }

  if (typeOfSimuled === SimulatedType.CATEGOTY && !unseen && !review) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      let questions: { id: number }[] = [];
      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findQuestionByCategory(subType, questionsPerSubtype)
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );
      if (questions.length < 1) {
        return false;
      }
      createSimulatedInRepostitory(typeOfSimuled, userId, subtypes, questions);
      return true;
    } catch {}
  }

  if (typeOfSimuled === SimulatedType.CATEGOTY && unseen && !review) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      let questions: { id: number }[] = [];

      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findQuestionByCategoryUnseen(
                subType,
                userId,
                questionsPerSubtype
              )
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );
      if (questions.length < 1) {
        return false;
      }
      createSimulatedInRepostitory(
        typeOfSimuled,
        userId,
        subtypes,
        questions,
        unseen,
        review
      );
      return true;
    } catch {}
  }

  if (typeOfSimuled === SimulatedType.CATEGOTY && !unseen && review) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      let questions: { id: number }[] = [];

      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findQuestionByCategoryReview(
                subType,
                userId,
                questionsPerSubtype
              )
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );
      if (questions.length < 1) {
        return false;
      }
      createSimulatedInRepostitory(
        typeOfSimuled,
        userId,
        subtypes,
        questions,
        unseen,
        review
      );
      return true;
    } catch {}
  }

  if (typeOfSimuled === SimulatedType.YEAR) {
    try {
      const questions = await findQuestionByYear(subtypes[0]);
      if (questions.length < 1) {
        return false;
      }
      createSimulatedInRepostitory(typeOfSimuled, userId, subtypes, questions);
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
