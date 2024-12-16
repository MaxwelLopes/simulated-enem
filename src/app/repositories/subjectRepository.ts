import { prisma } from "../../../prisma/prisma";

export const findIdSubjectById = async (id: number) => {
  return await prisma.subject.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
    },
  });
};
