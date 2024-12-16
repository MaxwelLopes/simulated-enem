"use server";

import { findDisciplineById } from "../repositories/disciplineRepository";

export const getDisciplineName = async (id: number): Promise<string | null> => {
  const discipline = await findDisciplineById(Number(id));
  return discipline?.name || null;
};
