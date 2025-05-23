import { prisma } from "../../../prisma/prisma";

export const findCategoryById = async (id: number): Promise<string | null> => {
  const category = await prisma.category.findUnique({
    where: { id: id },
    select: { name: true },
  });
  return category?.name || null;
};

// Função que conta as respostas por categoria
export const getAnswersCountByUserIdAndCategory = async (userId: string) => {
  const counts = await prisma.simulatedQuestion.groupBy({
    by: ["simulatedId", "questionId"],
    where: {
      simulated: {
        userId: userId,
      },
    },
    _count: {
      hit: true,
    },
  });

  return await Promise.all(
    counts.map(async (item) => {
      const question = await prisma.question.findUnique({
        where: { id: item.questionId },
        select: { subjectId: true },
      });

      return {
        categoryId: question?.subjectId || 0,
        correctCount: item._count.hit,
        incorrectCount: await prisma.simulatedQuestion.count({
          where: {
            hit: false,
            simulatedId: item.simulatedId,
            questionId: item.questionId,
          },
        }),
      };
    })
  );
};
