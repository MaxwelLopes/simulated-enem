import { use } from "react";
import prisma from "../../../prisma/prisma";

export const findQuestionById = async (questionId: number) => {
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
};

export const findQuestionByDiscipline = async (
  disciplineName: string,
  questionCount: number
): Promise<{ id: number }[]> => {
  const questionIds = await prisma.$queryRaw<{ id: number }[]>`
    SELECT "Question"."id" FROM "Question"
    JOIN "Discipline" ON "Question"."disciplineId" = "Discipline"."id"
    WHERE "Discipline"."name" = ${disciplineName}
    ORDER BY RANDOM()
    LIMIT ${questionCount};
  `;

  return questionIds;
};

export const findQuestionByDisciplineUnseen = async (
  disciplineName: string,
  userId: string,
  questionCount: number
): Promise<{ id: number }[]> => {
  const questionIds = await prisma.$queryRaw<{ id: number }[]>`
    SELECT "Question"."id" FROM "Question"
    JOIN "Discipline" ON "Question"."disciplineId" = "Discipline"."id"
    WHERE "Discipline"."name" = ${disciplineName}
    AND "Question"."id" NOT IN (
      SELECT "Simulated_questions"."questionId" FROM "Simulated_questions"
      WHERE "Simulated_questions"."simulatedId" IN (
        SELECT "Simulated"."id" FROM "Simulated"
        WHERE "Simulated"."userId" = ${userId}::UUID 
      )
    )
    ORDER BY RANDOM()
    LIMIT ${questionCount};  
  `;

  return questionIds;
};

export const findQuestionByDisciplineReview = async (
  disciplineName: string,
  userId: string,
  questionCount: number
): Promise<{ id: number }[]> => {
  const questionIds = await prisma.$queryRaw<{ id: number }[]>`
    SELECT "Question"."id" FROM "Question"
    JOIN "Discipline" ON "Question"."disciplineId" = "Discipline"."id"
    WHERE "Discipline"."name" = ${disciplineName}
    AND "Question"."id" IN (
      SELECT "Simulated_questions"."questionId" FROM "Simulated_questions"
      WHERE "Simulated_questions"."hit" = false
      AND "Simulated_questions"."simulatedId" IN (
        SELECT "Simulated"."id" FROM "Simulated"
        WHERE "Simulated"."userId" = ${userId}::UUID  
      )
    )
    ORDER BY RANDOM()
    LIMIT ${questionCount};
  `;

  return questionIds;
};

export const findQuestionBySubject = async (
  subjectName: string,
  questionCount: number
): Promise<{ id: number }[]> => {
  const questionIds = await prisma.$queryRaw<{ id: number }[]>`
    SELECT "Question"."id" FROM "Question"
    JOIN "Subject" ON "Question"."subjectId" = "Subject"."id"
    WHERE "Subject"."name" = ${subjectName}
    ORDER BY RANDOM()
    LIMIT ${questionCount};
  `;

  return questionIds;
};

export const findQuestionBySubjectUnseen = async (
  subjectName: string,
  userId: string,
  questionCount: number
): Promise<{ id: number }[]> => {
  const questionIds = await prisma.$queryRaw<{ id: number }[]>`
    SELECT "Question"."id" FROM "Question"
    JOIN "Subject" ON "Question"."subjectId" = "Subject"."id"
    WHERE "Subject"."name" = ${subjectName}
    AND "Question"."id" NOT IN (
      SELECT "Simulated_questions"."questionId" FROM "Simulated_questions"
      WHERE "Simulated_questions"."simulatedId" IN (
        SELECT "Simulated"."id" FROM "Simulated"
        WHERE "Simulated"."userId" = ${userId}::UUID 
      )
    )
    ORDER BY RANDOM()
    LIMIT ${questionCount};  
  `;

  return questionIds;
};

export const findQuestionBySubjectReview = async (
  subjectName: string,
  userId: string,
  questionCount: number
): Promise<{ id: number }[]> => {
  const questionIds = await prisma.$queryRaw<{ id: number }[]>`
    SELECT "Question"."id" FROM "Question"
    JOIN "Subject" ON "Question"."subjectId" = "Subject"."id"
    WHERE "Subject"."name" = ${subjectName}
    AND "Question"."id" IN (
      SELECT "Simulated_questions"."questionId" FROM "Simulated_questions"
      WHERE "Simulated_questions"."hit" = false
      AND "Simulated_questions"."simulatedId" IN (
        SELECT "Simulated"."id" FROM "Simulated"
        WHERE "Simulated"."userId" = ${userId}::UUID  
      )
    )
    ORDER BY RANDOM()
    LIMIT ${questionCount};
  `;

  return questionIds;
};

export const findQuestionByCategory = async (
  categoryName: string,
  questionCount: number
): Promise<{ id: number }[]> => {
  const questionIds = await prisma.$queryRaw<{ id: number }[]>`
    SELECT "Question"."id" FROM "Question"
    JOIN "Question_categories" ON "Question"."id" = "Question_categories"."questionId"
    JOIN "Category" ON "Question_categories"."categoriesId" = "Category"."id"
    WHERE "Category"."name" = ${categoryName}
    ORDER BY RANDOM()
    LIMIT ${questionCount};
  `;

  return questionIds;
};

export const findQuestionByCategoryUnseen = async (
  categoryName: string,
  userId: string,
  questionCount: number
): Promise<{ id: number }[]> => {
  const questionIds = await prisma.$queryRaw<{ id: number }[]>`
    SELECT "Question"."id" FROM "Question"
    JOIN "Question_categories" ON "Question"."id" = "Question_categories"."questionId"
    JOIN "Category" ON "Question_categories"."categoriesId" = "Category"."id"
    WHERE "Category"."name" = ${categoryName}
    AND "Question"."id" NOT IN (
      SELECT "Simulated_questions"."questionId" FROM "Simulated_questions"
      WHERE "Simulated_questions"."simulatedId" IN (
        SELECT "Simulated"."id" FROM "Simulated"
        WHERE "Simulated"."userId" = ${userId}::UUID 
      )
    )
    ORDER BY RANDOM()
    LIMIT ${questionCount};  
  `;

  return questionIds;
};

export const findQuestionByCategoryReview = async (
  categoryName: string,
  userId: string,
  questionCount: number
): Promise<{ id: number }[]> => {
  const questionIds = await prisma.$queryRaw<{ id: number }[]>`
    SELECT "Question"."id" FROM "Question"
    JOIN "Question_categories" ON "Question"."id" = "Question_categories"."questionId"
    JOIN "Category" ON "Question_categories"."categoriesId" = "Category"."id"
    WHERE "Category"."name" = ${categoryName}
    AND "Question"."id" IN (
      SELECT "Simulated_questions"."questionId" FROM "Simulated_questions"
      WHERE "Simulated_questions"."hit" = false
      AND "Simulated_questions"."simulatedId" IN (
        SELECT "Simulated"."id" FROM "Simulated"
        WHERE "Simulated"."userId" = ${userId}::UUID
      )
    )
    ORDER BY RANDOM()
    LIMIT ${questionCount};  
  `;

  return questionIds;
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

// Contar acertos gerais e por categoria
export const getCorrectAnswersCountByUserId = async (userId: string) => {
  const correctAnswers = await prisma.simulated_questions.count({
    where: {
      hit: true,
      Simulated: {
        userId: userId,
      },
    },
  });

  return correctAnswers;
};

// Contar erros gerais e por categoria
export const getIncorrectAnswersCountByUserId = async (userId: string) => {
  const incorrectAnswers = await prisma.simulated_questions.count({
    where: {
      hit: false,
      Simulated: {
        userId: userId,
      },
    },
  });

  return incorrectAnswers;
}
export const findAllQuestionsByIdUser = async (userId: string): Promise<{ id: number; context?: string }[]> => {
  const questions = await prisma.$queryRaw<{ id: number; context?: string }[]>`
    SELECT "Question"."id", "Question"."context" 
    FROM "Simulated_questions"
    JOIN "Question" ON "Simulated_questions"."questionId" = "Question"."id"
    WHERE "Simulated_questions"."simulatedId" IN (
      SELECT "Simulated"."id" FROM "Simulated"
      WHERE "Simulated"."userId" = ${userId}::UUID
    );
  `;

  return questions;
};

export const findIncorrectAnswersCountByCategory = async (userId: string) => {
  const incorrectAnswers = await prisma.$queryRaw<{ category: string; incorrectCount: number }[]>`
    SELECT c."name" AS category, COUNT(*)::int AS "incorrectCount"  -- for consistency with Prisma
    FROM "Simulated_questions" AS sq
    JOIN "Question" AS q ON sq."questionId" = q."id"
    JOIN "Question_categories" AS qc ON q."id" = qc."questionId"
    JOIN "Category" AS c ON qc."categoriesId" = c."id"
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
  const correctAnswers = await prisma.$queryRaw<{ category: string; correctCount: number }[]>`
    SELECT c."name" AS category, COUNT(*)::int AS "correctCount"  -- for consistency with Prisma
    FROM "Simulated_questions" AS sq
    JOIN "Question" AS q ON sq."questionId" = q."id"
    JOIN "Question_categories" AS qc ON q."id" = qc."questionId"
    JOIN "Category" AS c ON qc."categoriesId" = c."id"
    WHERE sq."simulatedId" IN (
      SELECT s."id" FROM "Simulated" AS s
      WHERE s."userId" = ${userId}::UUID
    ) AND sq."hit" = true
    GROUP BY c."name";
  `;

  return correctAnswers;
};

