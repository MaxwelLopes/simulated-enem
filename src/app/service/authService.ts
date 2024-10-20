"use server";

import { compare } from 'bcryptjs';
import { findUserByEmail } from '../repositories/userRepository';

export const authenticateUser = async (credentials: { email: string, password: string }) => {
    if (!credentials?.email || !credentials.password) {
        return null;
    }

    const user = await findUserByEmail(credentials.email);

    if (!user) {
        return null;
    }

    const isPasswordValid = await compare(credentials.password, user.password);

    if (!isPasswordValid) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        randomKey: 'Hey cool'
    };
};
