'use client';

import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
    return (
        <button
            onClick={() => signIn()}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition duration-200"
        >
            Sign In
        </button>
    );
};

export const LogoutButton = () => {
    return (
        <button
            onClick={() => signOut()}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition duration-200"
        >
            Sign Out
        </button>
    );
};
