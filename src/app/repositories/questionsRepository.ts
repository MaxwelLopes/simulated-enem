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
