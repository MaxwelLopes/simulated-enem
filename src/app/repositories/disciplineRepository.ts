import { prisma } from "../../../prisma/prisma";

export const findDiscipline = async () => {
  return prisma.discipline.findMany();
};

export const findDisciplineByName = async (name: string) => {
  return await prisma.discipline.findUnique({
    where: {
      name: name,
    },
    select: {
      id: true,
    },
  });
};

export const findDisciplineById = async (id: number) => {
  return await prisma.discipline.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
    },
  });
};
