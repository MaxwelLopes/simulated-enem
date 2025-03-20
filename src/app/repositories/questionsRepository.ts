import { Discipline } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";

export const findQuestionById = async (questionId: number) => {
  return await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
      questionCategories: {
        include: {
          category: true,
        },
      },
    },
  });
};

export const findSimulationQuestionsByDiscipline = async (
  disciplineName: string,
  questionCount: number,
  userId: string,
  unseen: boolean,
  review: boolean
): Promise<{ id: number }[]> => {
  if (unseen) {
    return await prisma.$queryRaw<{ id: number }[]>`
      SELECT "Question"."id" FROM "Question"
      JOIN "Discipline" ON "Question"."disciplineId" = "Discipline"."id"
      WHERE "Discipline"."name" = ${disciplineName}
      AND "Question"."id" NOT IN (
        SELECT "SimulatedQuestion"."questionId" FROM "SimulatedQuestion"
        WHERE "SimulatedQuestion"."simulatedId" IN (
          SELECT "Simulated"."id" FROM "Simulated"
          WHERE "Simulated"."userId" = ${userId}::UUID 
        )
      )
      ORDER BY RANDOM()
      LIMIT ${questionCount};  
    `;
  }

  if (review) {
    return await prisma.$queryRaw<{ id: number }[]>`
      SELECT "Question"."id" FROM "Question"
      JOIN "Discipline" ON "Question"."disciplineId" = "Discipline"."id"
      WHERE "Discipline"."name" = ${disciplineName}
      AND "Question"."id" IN (
        SELECT "SimulatedQuestion"."questionId" FROM "SimulatedQuestion"
        WHERE "SimulatedQuestion"."hit" = false
        AND "SimulatedQuestion"."simulatedId" IN (
          SELECT "Simulated"."id" FROM "Simulated"
          WHERE "Simulated"."userId" = ${userId}::UUID  
        )
      )
      ORDER BY RANDOM()
      LIMIT ${questionCount};
    `;
  }

  return await prisma.$queryRaw<{ id: number }[]>`
    SELECT "Question"."id" FROM "Question"
    JOIN "Discipline" ON "Question"."disciplineId" = "Discipline"."id"
    WHERE "Discipline"."name" = ${disciplineName}
    ORDER BY RANDOM()
    LIMIT ${questionCount};
  `;
};

export const findSimulationQuestionsBySubject = async (
  subjectName: string,
  questionCount: number,
  userId: string,
  unseen: boolean,
  review: boolean
): Promise<{ id: number }[]> => {
  if (unseen) {
    return await prisma.$queryRaw<{ id: number }[]>`
      SELECT "Question"."id" FROM "Question"
      JOIN "Subject" ON "Question"."subjectId" = "Subject"."id"
      WHERE "Subject"."name" = ${subjectName}
      AND "Question"."id" NOT IN (
        SELECT "SimulatedQuestion"."questionId" FROM "SimulatedQuestion"
        WHERE "SimulatedQuestions"."simulatedId" IN (
          SELECT "Simulated"."id" FROM "Simulated"
          WHERE "Simulated"."userId" = ${userId}::UUID 
        )
      )
      ORDER BY RANDOM()
      LIMIT ${questionCount};  
    `;
  }

  if (review) {
    return await prisma.$queryRaw<{ id: number }[]>`
      SELECT "Question"."id" FROM "Question"
      JOIN "Subject" ON "Question"."subjectId" = "Subject"."id"
      WHERE "Subject"."name" = ${subjectName}
      AND "Question"."id" IN (
        SELECT "SimulatedQuestion"."questionId" FROM "SimulatedQuestion"
        WHERE "SimulatedQuestion"."hit" = false
        AND "SimulatedQuestion"."simulatedId" IN (
          SELECT "Simulated"."id" FROM "Simulated"
          WHERE "Simulated"."userId" = ${userId}::UUID  
        )
      )
      ORDER BY RANDOM()
      LIMIT ${questionCount};
    `;
  }
  return await prisma.$queryRaw<{ id: number }[]>`
    SELECT "Question"."id" FROM "Question"
    JOIN "Subject" ON "Question"."subjectId" = "Subject"."id"
    WHERE "Subject"."name" = ${subjectName}
    ORDER BY RANDOM()
    LIMIT ${questionCount};
  `;
};

export const findSimulationQuestionsByCategory = async (
  categoryName: string,
  questionCount: number,
  userId: string,
  unseen: boolean,
  review: boolean
): Promise<{ id: number }[]> => {
  if (unseen) {
    return await prisma.$queryRaw<{ id: number }[]>`
      SELECT "Question"."id" FROM "Question"
      JOIN "QuestionCategory" ON "Question"."id" = "QuestionCategory"."questionId"
      JOIN "Category" ON "QuestionCategory"."categoriesId" = "Category"."id"
      WHERE "Category"."name" = ${categoryName}
      AND "Question"."id" NOT IN (
        SELECT "SimulatedQuestion"."questionId" FROM "SimulatedQuestion"
        WHERE "SimulatedQuestion"."simulatedId" IN (
          SELECT "Simulated"."id" FROM "Simulated"
          WHERE "Simulated"."userId" = ${userId}::UUID 
        )
      )
      ORDER BY RANDOM()
      LIMIT ${questionCount};  
    `;
  }

  if (review) {
    return await prisma.$queryRaw<{ id: number }[]>`
      SELECT "Question"."id" FROM "Question"
      JOIN "QuestionCategory" ON "Question"."id" = "QuestionCategory"."questionId"
      JOIN "Category" ON "QuestionCategory"."categoriesId" = "Category"."id"
      WHERE "Category"."name" = ${categoryName}
      AND "Question"."id" IN (
        SELECT "SimulatedQuestion"."questionId" FROM "SimulatedQuestion"
        WHERE "SimulatedQuestion"."hit" = false
        AND "SimulatedQuestion"."simulatedId" IN (
          SELECT "Simulated"."id" FROM "Simulated"
          WHERE "Simulated"."userId" = ${userId}::UUID
        )
      )
      ORDER BY RANDOM()
      LIMIT ${questionCount};  
    `;
  }
  return await prisma.$queryRaw<{ id: number }[]>`
    SELECT "Question"."id" FROM "Question"
    JOIN "QuestionCategory" ON "Question"."id" = "QuestionCategory"."questionId"
    JOIN "Category" ON "QuestionCategory"."categoriesId" = "Category"."id"
    WHERE "Category"."name" = ${categoryName}
    ORDER BY RANDOM()
    LIMIT ${questionCount};
  `;
};

export const findQuestionByYear = async (year: string) => {
  return await prisma.question.findMany({
    where: {
      year,
    },
    select: {
      id: true,
    },
  });
};

export const findQuestionRandom = async (
  questionCount: number,
  userId: string,
  unseen: boolean,
  review: boolean
) => {
  if (unseen) {
    return await prisma.$queryRaw<{ id: number }[]>`
      SELECT "id"
      FROM "Question"
      WHERE "Question"."id" NOT IN (
        SELECT "SimulatedQuestion"."questionId"
        FROM "SimulatedQuestion"
        WHERE "SimulatedQuestion"."simulatedId" IN (
          SELECT "Simulated"."id"
          FROM "Simulated"
          WHERE "Simulated"."userId" = ${userId}::UUID
        )
      )
      ORDER BY RANDOM()
      LIMIT ${questionCount};`;
  }
  if (review) {
    return await prisma.$queryRaw<{ id: number }[]>`
      SELECT "id"
      FROM "Question"
      WHERE "Question"."id" IN (
        SELECT "SimulatedQuestion"."questionId"
        FROM "SimulatedQuestion"
        WHERE "SimulatedQuestion"."hit" = false
        AND "SimulatedQuestion"."simulatedId" IN (
          SELECT "Simulated"."id"
          FROM "Simulated"
          WHERE "Simulated"."userId" = ${userId}::UUID
        )
      )
      ORDER BY RANDOM()
      LIMIT ${questionCount};`;
  }
  return await prisma.$queryRaw<{ id: number }[]>`
    SELECT "id"
    FROM "Question"
    ORDER BY RANDOM()
    LIMIT ${questionCount};`;
};

export const getCorrectAnswersCountByUserId = async (userId: string) => {
  const correctAnswers = await prisma.simulatedQuestion.count({
    where: {
      hit: true,
      simulated: {
        userId: userId,
      },
    },
  });

  return correctAnswers;
};

// Contar erros gerais e por categoria
export const getIncorrectAnswersCountByUserId = async (userId: string) => {
  const incorrectAnswers = await prisma.simulatedQuestion.count({
    where: {
      hit: false,
      simulated: {
        userId: userId,
      },
    },
  });

  return incorrectAnswers;
};
export const findAllQuestionsByIdUser = async (
  userId: string
): Promise<{ id: number; context?: string }[]> => {
  const questions = await prisma.$queryRaw<{ id: number; context?: string }[]>`
    SELECT "Question"."id", "Question"."context" 
    FROM "SimulatedQuestion"
    JOIN "Question" ON "SimulatedQuestion"."questionId" = "Question"."id"
    WHERE "SimulatedQuestion"."simulatedId" IN (
      SELECT "Simulated"."id" FROM "Simulated"
      WHERE "Simulated"."userId" = ${userId}::UUID
    );
  `;

  return questions;
};

export const findIncorrectAnswersCountByCategory = async (userId: string) => {
  const incorrectAnswers = await prisma.$queryRaw<
    { category: string; incorrectCount: number }[]
  >`
    SELECT c."name" AS category, COUNT(*)::int AS "incorrectCount"
    FROM "SimulatedQuestion" AS sq
    JOIN "Question" AS q ON sq."questionId" = q."id"
    JOIN "QuestionCategory" AS qc ON q."id" = qc."questionId"
    JOIN "Category" AS c ON qc."categoryId" = c."id"  -- Corrigido aqui
    WHERE sq."simulatedId" IN (
      SELECT s."id" FROM "Simulated" AS s
      WHERE s."userId" = ${userId}::UUID
    ) AND sq."hit" = false
    GROUP BY c."name";
  `;

  return incorrectAnswers;
};

// Repository Function for Correct Answers
export const findCorrectAnswersCountByCategory = async (userId: string) => {
  const correctAnswers = await prisma.$queryRaw<
    { category: string; correctCount: number }[]
  >`
    SELECT c."name" AS category, COUNT(*)::int AS "correctCount"  -- for consistency with Prisma
    FROM "SimulatedQuestion" AS sq
    JOIN "Question" AS q ON sq."questionId" = q."id"
    JOIN "QuestionCategory" AS qc ON q."id" = qc."questionId"
    JOIN "Category" AS c ON qc."categoryId" = c."id"
    WHERE sq."simulatedId" IN (
      SELECT s."id" FROM "Simulated" AS s
      WHERE s."userId" = ${userId}::UUID
    ) AND sq."hit" = true
    GROUP BY c."name";
  `;

  return correctAnswers;
};

export const findQuestionByDiscipline = async (discipline: Discipline) => {
  return await prisma.question.findMany({
    where: { disciplineId: discipline.id },
    select: { id: true },
  });
};

export const findQuestionsByUser = async (userId: string) => {
  return prisma.simulatedQuestion.findMany({
    where: {
      simulated: { userId: userId }
    },
    select: {
      hit: true,
      question: {
        select: {
          disciplineId: true,
          discipline: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
};
