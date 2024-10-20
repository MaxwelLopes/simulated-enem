import { cache } from "./questionIdsCache";

export function getQuestionIdsByDiscipline(disciplineId: number): number[] {
  return cache.questionIdsByDiscipline[disciplineId] || [];
}

export function getQuestionIdsBySubject(subjectIdId: number): number[] {
  return cache.questionIdsBySubject[subjectIdId] || [];
}

export function getQuestionIdsByCategory(categoryId: number): number[] {
  return cache.questionIdsByCategory[categoryId] || [];
}
