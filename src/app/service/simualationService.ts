"use server";

import { Essay, Simulated } from "@prisma/client";
import { SimulatedStatus, SimulatedType } from "../enum/simulated";
import { createEssay, getEssayByYear } from "../repositories/essayRepository";
import {
  findQuestionByYear,
  findQuestionRandom,
  findRandomQuestionsByDiscipline,
  findSimulationQuestionsByCategory,
  findSimulationQuestionsByDiscipline,
  findSimulationQuestionsBySubject,
} from "../repositories/questionsRepository";
import {
  createSimulated as createSimulatedInRepostitory,
  findByUserAndId,
  findQuestionsBySimulationId,
  findResponse,
  findSimulatedById,
  findSimulatedByUserId,
  findSimulationElapsedTimeById,
  findUnseenEssayForUser,
  getCountCorrectAnswersBySimulatedId,
  getEssayScores,
  updateAnswerBySilulation,
  updateSimulated,
} from "../repositories/simulatedRepository";
import { generateTheme } from "./essayService";
import { dayOne, dayTwo } from "../constants/enem";
import { disciplines } from "../constants/disciplines";
import { canUserWriteEssay, updateUserLastEssayDate } from "./userService";

type Input = {
  typeOfSimulated: string;
  questionCount?: number;
  error?: string | null;
  unseen: boolean;
  review: boolean;
  subtypes: string[];
  userId: string;
  nonInepEssay?: boolean;
  isDayOne?: boolean;
  isDayTwo?: boolean;
  language?: "english" | "spanish";
};

export const createSimulated = async ({
  typeOfSimulated,
  questionCount = 1,
  unseen,
  review,
  subtypes,
  userId,
  nonInepEssay = false,
  isDayOne,
  isDayTwo,
  language,
}: Input): Promise<
  { success: boolean; message?: string; id?: string } | undefined
> => {
  if (
    typeOfSimulated !== SimulatedType.ESSAY &&
    typeOfSimulated !== SimulatedType.YEAR &&
    typeOfSimulated !== SimulatedType.ENEM &&
    (questionCount < 1 || questionCount > 180)
  ) {
    return {
      success: false,
      message: "O número de questões deve estar entre 1 e 180.",
    };
  }

  if (
    (typeOfSimulated === SimulatedType.ENEM && isDayOne) ||
    typeOfSimulated === SimulatedType.ESSAY
  ) {
    const userCanWriteEssay = await canUserWriteEssay(userId);
    const { canWrite, message } = userCanWriteEssay;
    if (!canWrite) {
      return { success: false, message };
    }
  }
  if (typeOfSimulated === SimulatedType.ENEM) {
    try {
      if (!isDayOne && !isDayTwo) {
        return {
          success: false,
          message:
            "É necessário especificar se é o primeiro ou segundo dia do ENEM.",
        };
      }

      if (isDayOne && !language) {
        return {
          success: false,
          message:
            "É necessário especificar o idioma para o primeiro dia do ENEM.",
        };
      }
      let essay;
      const questions: { id: number }[] = [];
      if (isDayOne) {
        const questionLanguage = await findSimulationQuestionsBySubject(
          language === "english" ? "Inglês" : "Espanhol",
          5,
          userId,
          false,
          false
        );
        questions.push(...questionLanguage);
        await Promise.all(
          dayOne.map(async (type) => {
            if (disciplines.includes(type)) {
              const questionsId = await findRandomQuestionsByDiscipline(
                type,
                type === "Linguagens, Códigos e suas Tecnologias" ? 40 : 45
              );
              questions.push(...questionsId);
            }
          })
        );
        essay = await findUnseenEssayForUser(userId, true);
        if (!essay) {
          const generatedEssay = await generateTheme();
          essay = await createEssay(
            generatedEssay.theme,
            generatedEssay.motivationalTexts
          );
        }
      }
      if (isDayTwo) {
        await Promise.all(
          dayTwo.map(async (type) => {
            if (disciplines.includes(type)) {
              const questionsId = await findRandomQuestionsByDiscipline(type);
              questions.push(...questionsId);
            }
          })
        );
      }
      const simulated: Simulated = await createSimulatedInRepostitory({
        type: typeOfSimulated,
        userId,
        subtype: isDayOne ? dayOne : dayTwo,
        essayId: essay?.id,
        questionsId: questions,
      });
      if (simulated) {
        updateUserLastEssayDate(userId, new Date());
        return { success: true, id: simulated.id };
      }
      return { success: false, message: "Falha ao criar o simulado." };
    } catch (error) {
      console.error("Erro ao criar simulado do tipo redação:", error);
      return {
        success: false,
        message: "Ocorreu um erro ao criar o simulado.",
      };
    }
  }
  if (typeOfSimulated === SimulatedType.GENERAL) {
    try {
      const questions: { id: number }[] = await findQuestionRandom(
        questionCount,
        userId,
        unseen,
        review
      );

      if (questions.length < 1) {
        return {
          success: false,
          message: "Nenhuma questão encontrada para essa combinação!",
        };
      }
      const simulated: Simulated = await createSimulatedInRepostitory({
        type: typeOfSimulated,
        userId,
        subtype: subtypes,
        questionsId: questions,
      });
      if (simulated) {
        return { success: true, id: simulated.id };
      }
      return { success: false, message: "Falha ao criar o simulado." };
    } catch (error) {
      console.error("Erro ao criar simulado do tipo redação:", error);
      return {
        success: false,
        message: "Ocorreu um erro ao criar o simulado.",
      };
    }
  }

  if (typeOfSimulated === SimulatedType.DISCIPLINE) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      const questions: { id: number }[] = [];

      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findSimulationQuestionsByDiscipline(
                subType,
                questionsPerSubtype,
                userId,
                unseen,
                review
              )
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );

      if (questions.length < 1) {
        return {
          success: false,
          message: "Nenhuma questão encontrada para essa combinação!",
        };
      }
      const simulated: Simulated = await createSimulatedInRepostitory({
        type: typeOfSimulated,
        userId,
        subtype: subtypes,
        questionsId: questions,
      });
      if (simulated) {
        return { success: true, id: simulated.id };
      }
      return { success: false, message: "Falha ao criar o simulado." };
    } catch (error) {
      console.error("Erro ao criar simulado do tipo redação:", error);
      return {
        success: false,
        message: "Ocorreu um erro ao criar o simulado.",
      };
    }
  }

  if (typeOfSimulated === SimulatedType.SUBJECT) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      const questions: { id: number }[] = [];
      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findSimulationQuestionsBySubject(
                subType,
                questionsPerSubtype,
                userId,
                unseen,
                review
              )
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );
      if (questions.length < 1) {
        return {
          success: false,
          message: "Nenhuma questão encontrada para essa combinação!",
        };
      }
      const simulated: Simulated = await createSimulatedInRepostitory({
        type: typeOfSimulated,
        userId,
        subtype: subtypes,
        questionsId: questions,
      });
      if (simulated) {
        return { success: true, id: simulated.id };
      }
      return { success: false, message: "Falha ao criar o simulado." };
    } catch (error) {
      console.error("Erro ao criar simulado do tipo redação:", error);
      return {
        success: false,
        message: "Ocorreu um erro ao criar o simulado.",
      };
    }
  }

  if (typeOfSimulated === SimulatedType.CATEGOTY) {
    try {
      const questionsPerSubtype = questionCount
        ? Math.floor(questionCount / subtypes.length)
        : subtypes.length;
      const questions: { id: number }[] = [];
      await Promise.all(
        subtypes.map(async (subType: string) => {
          const questionsId: { id: number }[] | null = subType
            ? await findSimulationQuestionsByCategory(
                subType,
                questionsPerSubtype,
                userId,
                unseen,
                review
              )
            : null;

          if (questionsId) questions.push(...questionsId);
        })
      );
      if (questions.length < 1) {
        return {
          success: false,
          message: "Nenhuma questão encontrada para essa combinação!",
        };
      }
      const simulated: Simulated = await createSimulatedInRepostitory({
        type: typeOfSimulated,
        userId,
        subtype: subtypes,
        questionsId: questions,
      });
      if (simulated) {
        return { success: true, id: simulated.id };
      }
      return { success: false, message: "Falha ao criar o simulado." };
    } catch (error) {
      console.error("Erro ao criar simulado do tipo redação:", error);
      return {
        success: false,
        message: "Ocorreu um erro ao criar o simulado.",
      };
    }
  }

  if (typeOfSimulated === SimulatedType.YEAR) {
    try {
      const questions = await findQuestionByYear(subtypes[0]);
      if (questions.length < 1) {
        return {
          success: false,
          message: "Nenhuma questão encontrada para essa combinação!",
        };
      }
      const simulated: Simulated = await createSimulatedInRepostitory({
        type: typeOfSimulated,
        userId,
        subtype: subtypes,
        questionsId: questions,
      });
      if (simulated) {
        return { success: true, id: simulated.id };
      }
      return { success: false, message: "Falha ao criar o simulado." };
    } catch (error) {
      console.error("Erro ao criar simulado do tipo redação:", error);
      return {
        success: false,
        message: "Ocorreu um erro ao criar o simulado.",
      };
    }
  }

  if (typeOfSimulated === SimulatedType.ESSAY) {
    try {
      if (nonInepEssay) {
        let essay = await findUnseenEssayForUser(userId);
        if (!essay) {
          const generatedEssay = await generateTheme();
          essay = await createEssay(
            generatedEssay.theme,
            generatedEssay.motivationalTexts
          );
        }

        if (!essay || !essay.id) {
          return { success: false, message: "Erro ao obter redação." };
        }

        const simulated: Simulated = await createSimulatedInRepostitory({
          type: typeOfSimulated,
          userId,
          subtype: subtypes,
          essayId: essay.id,
        });
        if (simulated) {
          updateUserLastEssayDate(userId, new Date());
          return { success: true, id: simulated.id };
        }
      } else {
        const essay = await getEssayByYear(subtypes[0]);
        if (!essay || !essay.id) {
          return { success: false, message: "Erro ao obter redação." };
        }
        const simulated: Simulated = await createSimulatedInRepostitory({
          type: typeOfSimulated,
          userId,
          subtype: subtypes,
          essayId: essay.id,
        });
        if (simulated) {
          updateUserLastEssayDate(userId, new Date());
          return { success: true, id: simulated.id };
        }
      }
      return { success: false, message: "Falha ao criar o simulado." };
    } catch (error) {
      console.error("Erro ao criar simulado do tipo redação:", error);
      return {
        success: false,
        message: "Ocorreu um erro ao criar o simulado.",
      };
    }
  }
};

export const getSimulations = async (userId: string) => {
  const simulations = await findSimulatedByUserId(userId);
  return simulations;
};

export const getQuestionOfSimulated = async (simulatedId: string) => {
  return await findQuestionsBySimulationId(simulatedId);
};

export const answerQuestion = async (
  simulatedId: string,
  questionId: number,
  rightAnswer: string,
  response: string
) => {
  const hit = rightAnswer === response;
  const status = await getSimulationStatus(simulatedId);
  if (status !== SimulatedStatus.COMPLETED)
    await updateAnswerBySilulation(simulatedId, questionId, hit, response);
};

export const finishSimulation = async (simulatedId: string) => {
  const hits = await getCountCorrectAnswersBySimulatedId(simulatedId);
  const status = SimulatedStatus.COMPLETED;
  await updateSimulated({ simulatedId, status, hits });
};

export const getSimulationStatus = async (id: string) => {
  const simulation = await findSimulatedById(id);
  return simulation?.status || null;
};

export const getResponse = async (simulatedId: string, questionId: number) => {
  return await findResponse(simulatedId, questionId);
};

export const getSimulatedById = async (id: string) => {
  const simulated = await findSimulatedById(id);
  return simulated;
};

export const getCriteria = async (simulatedId: string) => {
  const scores = await getEssayScores(simulatedId);
  const criteria = scores.map((score) => {
    return {
      criterion: score.criterion,
      score: score.score,
      justification: score.justification,
    };
  });
  return criteria;
};

export const getUserText = async (simulatedId: string) => {
  const simulated = await findSimulatedById(simulatedId);
  return simulated?.userText || null;
};

export const getTime = async (simulatedId: string) => {
  const time = await findSimulationElapsedTimeById(simulatedId);
  if (time) {
    return time;
  }
  return 0;
};

export const saveTimeSpent = async (
  simulatedId: string,
  completionTimeSeconds: number,
  status: string
) => {
  updateSimulated({ simulatedId, completionTimeSeconds, status });
};

export const verifyOwnership = async (simulationId: string, userId: string) => {
  const simulation = await findByUserAndId(userId, simulationId);
  console.log("simulation", simulation);
  return !!simulation;
};
