"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "Usuário já existe" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        id: uuidv4(),
        name: name,
        email: email,
        password: hashedPassword,
    }

    const newUser = await prisma.user.create({
      data: user,
    });

    return { success: true, user: newUser, message: ''};
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return { success: false, message: "Erro ao registrar usuário" };
  }
};
