"use server";

import { findIdDisciplineById } from "../repositories/disciplineRepository";

export const getDisciplineName = async (id: number): Promise<string | null> => {
  const discipline = await findIdDisciplineById(Number(id));
  return discipline?.name || null;
};
