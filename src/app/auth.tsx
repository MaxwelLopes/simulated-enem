"use client";

import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
  return (
    <button
      onClick={() => signIn()}
      className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      Entrar
    </button>
  );
};

export const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
    >
      Sair
    </button>
  );
};
