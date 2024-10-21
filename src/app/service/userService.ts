"use server";

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { findUserByEmail, createUser as createUserRepository } from '../repositories/userRepository';

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
    }

    const newUser = createUserRepository(user);

    return { success: true, user: newUser, message: ''};
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return { success: false, message: "Erro ao registrar usuário" };
  }
};
