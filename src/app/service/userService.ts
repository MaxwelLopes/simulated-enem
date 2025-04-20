"use server";

import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import {
  findUserByEmail,
  createUser as createUserRepository,
  findUserById,
  updateUser,
} from "../repositories/userRepository";
import { UserPen } from "lucide-react";

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return { success: false, message: "Usuário já existe" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: uuidv4(),
      name: name,
      email: email,
      password: hashedPassword,
    };

    const newUser = createUserRepository(user);

    return { success: true, user: newUser, message: "" };
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return { success: false, message: "Erro ao registrar usuário" };
  }
};

export const canUserWriteEssay = async (userId: string) => {
  try {
    const user = await findUserById(userId);

    if (user?.lastEssayDate) {
      const lastEssayDate = new Date(user.lastEssayDate);
      const now = new Date();
      const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

      if (now.getTime() - lastEssayDate.getTime() < oneWeekInMilliseconds) {
        const timeRemaining =
          oneWeekInMilliseconds - (now.getTime() - lastEssayDate.getTime());
        const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor(
          (timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
        );
        const minutes = Math.floor(
          (timeRemaining % (60 * 60 * 1000)) / (60 * 1000)
        );

        return {
          canWrite: false,
          message: `Faltam ${days} dias, ${hours} horas e ${minutes} minutos para realizar outro simulado que inclua redação`,
        };
      }
    }
    return { canWrite: true, message: "Usuário pode escrever uma redação." };
  } catch (error) {
    console.error(`Erro ao verificar permissão do usuário ${userId}: `, error);
    return {
      canWrite: false,
      message: "Erro ao verificar permissão do usuário.",
    };
  }
};

export const updateUserLastEssayDate = async (userId: string, date: Date) => {
  try {
    const updatedUser = await updateUser(userId, { lastEssayDate: date });

    return {
      success: true,
      user: updatedUser,
      message: "Data atualizada com sucesso.",
    };
  } catch (error) {
    console.error(
      `Erro ao atualizar a última data de redação do usuário ${userId}: `,
      error
    );
    return {
      success: false,
      message: "Erro ao atualizar a última data de redação.",
    };
  }
};
