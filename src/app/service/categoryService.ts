"use server";

import { findCategoryById } from "../repositories/categoryRepository";

export const getCategoryById = async (id: number): Promise<string | null> =>{
  const nameCategory = await findCategoryById(id);
  return nameCategory;
}
