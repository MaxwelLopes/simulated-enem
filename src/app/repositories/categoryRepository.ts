"use server";

import { findIdSubjectById } from "../repositories/subjectRepository";

export const getSubjectName = async (id: number): Promise<string | null> => {
  const subjectId = await findIdSubjectById(Number(id));
  return subjectId?.name || null;
};
