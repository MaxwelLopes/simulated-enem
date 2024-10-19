"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>(""); // Definindo o tipo como string
  const [password, setPassword] = useState<string>(""); // Definindo o tipo como string
  const [error, setError] = useState<string | null>(null); // Permite null ou string

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      // Verifica se há um erro e define uma mensagem de erro apropriada
      if (res.error === "CredentialsSignin") {
        setError("Email ou senha incorretos.");
      } else {
        setError("Ocorreu um erro ao tentar fazer login. Tente novamente.");
      }
    } else {
      router.push("/home"); // Redirecionar para a página inicial após o login
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Login</h1>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required // Campo obrigatório
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required // Campo obrigatório
            />
          </div>
          {error && <div className="text-red-600 mb-4">{error}</div>}

          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="pt-2">
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 transition duration-200"
          >
            Criar Novo Usuário
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
