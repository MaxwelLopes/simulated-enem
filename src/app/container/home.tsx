"use client";

import { useSession } from "next-auth/react";
import { Loading } from "@/app/components/Loading"; 

export default function Home() {

  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-50 to-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Bem-vindo ao Simulador ENEM
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Usuário:{" "}
          <span className="text-indigo-600 font-semibold">
            {session?.user?.name || "Desconhecido"}
          </span>
        </p>
        <p className="text-md text-gray-500 mb-8">
          Prepare-se para o ENEM com simulados personalizados.
        </p>
      </div>
    </div>
  );
}
