import { Discipline } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { use } from "react";
import { Select } from "@radix-ui/react-select";

// Retorna a questão com as alternativas e categorias associadas.
export const findQuestionById = async (questionId: number) => {
  console.log(questionId);
  return await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      categories: {
        include: {
          category: {
            select: { name: true },
          },
        },
      },
      subject: {
        select: { name: true },
      },
      discipline: {
        select: { name: true },
      },
      alternatives: true,
    },
  });
};

// Busca questões para simulação por disciplina com ORDER BY RANDOM().
// Usamos $queryRaw para manter a randomização, sem alterar a lógica.
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

// Busca questões para simulação por assunto com ORDER BY RANDOM().
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

// Busca questões para simulação por categoria com ORDER BY RANDOM().
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
      JOIN "Category" ON "QuestionCategory"."categoryId" = "Category"."id"
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
      JOIN "Category" ON "QuestionCategory"."categoryId" = "Category"."id"
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
    JOIN "Category" ON "QuestionCategory"."categoryId" = "Category"."id"
    WHERE "Category"."name" = ${categoryName}
    ORDER BY RANDOM()
    LIMIT ${questionCount};
  `;
};

// Busca questões por ano, sem randomização.
export const findQuestionByYear = async (year: string) => {
  return await prisma.question.findMany({
    where: { year },
    select: { id: true },
  });
};

// Busca questões aleatórias, mantendo ORDER BY RANDOM() com $queryRaw.
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
      WHERE "id" NOT IN (
        SELECT "SimulatedQuestion"."questionId"
        FROM "SimulatedQuestion"
        WHERE "simulatedId" IN (
          SELECT "id"
          FROM "Simulated"
          WHERE "userId" = ${userId}::UUID
        )
      )
      ORDER BY RANDOM()
      LIMIT ${questionCount};
    `;
  }
  if (review) {
    return await prisma.$queryRaw<{ id: number }[]>`
      SELECT "id"
      FROM "Question"
      WHERE "id" IN (
        SELECT "SimulatedQuestion"."questionId"
        FROM "SimulatedQuestion"
        WHERE "hit" = false
        AND "simulatedId" IN (
          SELECT "id"
          FROM "Simulated"
          WHERE "userId" = ${userId}::UUID
        )
      )
      ORDER BY RANDOM()
      LIMIT ${questionCount};
    `;
  }
  return await prisma.$queryRaw<{ id: number }[]>`
    SELECT "id"
    FROM "Question"
    ORDER BY RANDOM()
    LIMIT ${questionCount};
  `;
};

// Conta as respostas corretas do usuário.
export const getCorrectAnswersCountByUserId = async (userId: string) => {
  return await prisma.simulatedQuestion.count({
    where: {
      hit: true,
      simulated: { userId },
    },
  });
};

// Conta as respostas incorretas do usuário.
export const getIncorrectAnswersCountByUserId = async (userId: string) => {
  return await prisma.simulatedQuestion.count({
    where: {
      hit: false,
      simulated: { userId },
    },
  });
};

// Busca todas as questões associadas ao usuário (por simulação).
export const findAllQuestionsByIdUser = async (
  userId: string
): Promise<{ id: number; context: string | null }[]> => {
  return await prisma.question.findMany({
    where: {
      simulatedQuestions: {
        some: { simulated: { userId } },
      },
    },
    select: {
      id: true,
      context: true,
    },
  });
};

// Calcula a contagem de erros por categoria usando query raw para manter a lógica de joins.
export const findIncorrectAnswersCountByCategory = async (userId: string) => {
  return await prisma.$queryRaw<{ category: string; incorrectCount: number }[]>`
    SELECT c."name" AS category, COUNT(*)::int AS "incorrectCount"
    FROM "SimulatedQuestion" AS sq
    JOIN "Question" AS q ON sq."questionId" = q."id"
    JOIN "QuestionCategory" AS qc ON q."id" = qc."questionId"
    JOIN "Category" AS c ON qc."categoryId" = c."id"
    WHERE sq."simulatedId" IN (
      SELECT s."id" FROM "Simulated" AS s
      WHERE s."userId" = ${userId}::UUID
    ) AND sq."hit" = false
    GROUP BY c."name";
  `;
};

// Calcula a contagem de acertos por categoria usando query raw.
export const findCorrectAnswersCountByCategory = async (userId: string) => {
  return await prisma.$queryRaw<{ category: string; correctCount: number }[]>`
    SELECT c."name" AS category, COUNT(*)::int AS "correctCount"
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
};

// Busca questões por disciplina sem randomização.
export const findQuestionByDiscipline = async (discipline: Discipline) => {
  return await prisma.question.findMany({
    where: { disciplineId: discipline.id },
    select: { id: true },
  });
};

// Busca questões associadas ao usuário via simulação.
export const findQuestionsByUser = async (userId: string) => {
  return await prisma.simulatedQuestion.findMany({
    where: { simulated: { userId } },
    select: {
      hit: true,
      question: {
        select: {
          disciplineId: true,
          discipline: { select: { name: true } },
        },
      },
    },
  });
};

// Busca questões aleatórias por assunto, mantendo ORDER BY RANDOM() com $queryRaw.
export const findRandomQuestionsByDiscipline = async (
  disciplineName: string,
  questionCount = 45
): Promise<{ id: number }[]> => {
  return await prisma.$queryRaw<{ id: number }[]>`
    SELECT "Question"."id"
    FROM "Question"

    JOIN "Discipline" ON "Question"."disciplineId" = "Discipline"."id"
    WHERE "Discipline"."name" = ${disciplineName}
    ORDER BY RANDOM()
    LIMIT ${questionCount};
  `;
};
