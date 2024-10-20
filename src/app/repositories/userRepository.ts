"use server";

import prisma from "../../../prisma/prisma";

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
    });
};