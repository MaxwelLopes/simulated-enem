"user server";

import prisma from "../../../prisma/prisma";

export const findCategoryByQuestionId = async (id: number) =>{
  return await prisma.question_categories.findMany({
    where:{
      questionId: id
    },
  })
}
