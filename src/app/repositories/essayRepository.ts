import { Essay } from "@prisma/client";

import { prisma } from "../../../prisma/prisma";

export async function createEssay(
  theme: string,
  motivationalTexts: string[]
): Promise<Essay> {
  return await prisma.essay.create({
    data: {
      theme,
      motivationalTexts,
    },
  });
}

export async function getEssayById(id: number): Promise<Essay | null> {
  return await prisma.essay.findUnique({
    where: { id },
  });
}

export async function getEssayByYear(year: string): Promise<Essay | null> {
  return await prisma.essay.findFirst({
    where: { year },
  });
}

export async function getAllEssays(): Promise<Essay[]> {
  return await prisma.essay.findMany();
}

export async function updateEssay(
  id: number,
  data: Partial<Essay>
): Promise<Essay> {
  return await prisma.essay.update({
    where: { id },
    data,
  });
}

export async function deleteEssay(id: number): Promise<Essay> {
  return await prisma.essay.delete({
    where: { id },
  });
}

export const createEssayScore = async (
  criterion: string,
  score: number,
  justification: string,
  simulatedId: number
) => {
  return await prisma.simulatedEssayScore.create({
    data: {
      criterion,
      score,
      justification,
      simulatedId,
    },
  });
};

export const findEssayById = async (id: number) =>{
  return await prisma.essay.findFirst({
    where:{
      id
    }
  })
}

