"use server";

import prisma from "../../../prisma/prisma";
import { findQuestionById } from "../repositories/questionsRepository";


export const getQuestion = async (id: number) =>{
  return await findQuestionById(id);
}

