"use server";

import prisma from "../../../prisma/prisma";
import { findCategoryById } from "../repositories/categoryRepository";

export const findCategoryByQuestionId = async (id: number) =>{
  return await prisma.question_categories.findMany({
    where:{
      questionId: id
    },
  })
}

export const getCategoryById = async (id: number): Promise<string | null> =>{
  const nameCategory = await findCategoryById(id);
  return nameCategory;
}
