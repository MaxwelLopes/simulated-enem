"use server";

import prisma from "../../../prisma/prisma";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

type User = {
    id: string,
    name: string,
    email: string,
    password: string,
} 

export const createUser = async (user: User) => {
  return await prisma.user.create({
    data: user,
  });
};
