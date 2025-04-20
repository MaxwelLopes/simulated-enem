"use server";

import { prisma } from "../../../prisma/prisma";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  lastEssayDate?: Date | null;
};

export const createUser = async (user: User) => {
  return await prisma.user.create({
    data: user,
  });
};

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const updateUser = async (id: string, data: Partial<User>) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};
