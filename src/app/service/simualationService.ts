"use server";

import { SimulatedStatus, SimulatedType } from "../enum/simulated";
import { findQuestionByDiscipline } from "../repositories/questionsRepository";
import {
  createSimulated as createSimulatedInRepostitory,
  findQuestionsBySimulationId,
  findResponse,
  findSimulatedById,
  findSimulatedByUserId,
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
}: Input) => {
  if (typeOfSimuled === SimulatedType.DISCIPLINE) {
    try {
      const questionsCountByType = questionCount
        ? questionCount / subtypes.length
        : undefined;
      let questions: { id: number }[] = [];
      subtypes.map(async (subType: string) => {
        const questionsId = subType
          ? await findQuestionByDiscipline(
              subType,
              unseen,
              review,
              userId,
              questionsCountByType
            )
          : null;
        if (questionsId) questions.push(...questionsId);
      });
      createSimulatedInRepostitory(typeOfSimuled, userId, subtypes, questions);
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
  await updatesimulated(id);
};

export const getSimulationStatus = async (id: number) => {
  const simulation = await findSimulatedById(id);
  return simulation?.status || null;
};

export const getResponse = async (simulatedId: number, questionId: number) =>{
  return await findResponse(simulatedId, questionId);

}
