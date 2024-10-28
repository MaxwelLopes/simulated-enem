import prisma from "../../../prisma/prisma";

export const findQuestionById = async (questionId: number) =>{
  return await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
      Question_categories: {
        include: {
          Category: true, 
        },
      },
    },
  });
}

export const findQuestionByDiscipline = async (
  disciplineName: string,
  unseen?: boolean,
  review?: boolean,
  userId?: string,
  questionCount?: number
) => {
  const question = await prisma.question.findMany({
    where: {
      Discipline: { name: disciplineName },
      ...((unseen !== false || review !== false) && {
        Simulated_questions: {
          some: {
            Simulated: {
              userId: userId,
              ...(unseen !== false && { unseen: unseen }),
              ...(review !== false && { review: review }),
            },
          },
        },
      }),
    },
    select: {
      id: true,
    },
  });

  const shuffledQuestions = question.sort(() => 0.5 - Math.random());

  return questionCount
    ? shuffledQuestions.slice(0, questionCount)
    : shuffledQuestions;
};
