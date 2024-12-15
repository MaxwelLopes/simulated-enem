import { prisma } from "../../../prisma/prisma";

export const findIdDisciplineByName = async (name: string) => {
  return await prisma.discipline.findUnique({
    where: {
      name: name,
    },
    select: {
      id: true,
    },
  });
};

export const findIdDisciplineById = async (id: number) => {
  return await prisma.discipline.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
    },
  });
};
