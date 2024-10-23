"use server";

import prisma from "../../../prisma/prisma";
import { cache } from "../data/questionIdsCache";
import { SimulatedType } from "../enum/simulated";
import { findIdDisciplineByName } from "../repositories/disciplineRepository";
import { findQuestionByDiscipline } from "../repositories/questionsRepository";
import { createSimulated as createSimulatedInRepostitory } from "../repositories/simulatedRepository";

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
  error,
  unseen,
  review,
  subtypes,
  userId
}: Input) => {
  if (typeOfSimuled === SimulatedType.DISCIPLINE) {
    try {
      const questionsCountByType = questionCount ? questionCount / subtypes.length : undefined;
      let questions:{id: number}[] = [];
      subtypes.map(async (subType: string) => {
        const questionsId = subType ? await findQuestionByDiscipline(subType, unseen, review, userId, questionsCountByType) : null;
        if(questionsId) questions.push(...questionsId);
      });
      console.log(questions);
      createSimulatedInRepostitory(typeOfSimuled, userId, questions)
    } catch {}
  }
};

export const findSimulation = async (userId: string) =>{
  const simulations = await prisma.simulated.findMany({
    where:{
      userId: userId,
    }
  })
  return simulations ? simulations : [];
}
