"use client";

import { useRouter } from "next/navigation";
import { createUser } from "@/app/service/userService";
import { useSingup } from "../hook/userSingup";

const Signup = () => {
  const router = useRouter();

  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    success,
    setSuccess,
  } = useSingup();

  const handleSubmitWithRedirect = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const result = await createUser(name, email, password);

    if (result?.success) {
      setSuccess("Usuário registrado com sucesso! Você pode fazer login.");
      setError("");
      setTimeout(() => {
        router.push("/login");
      }, 500);
    } else {
      setError(
        result?.message ||
          "Ocorreu um erro ao tentar registrar. Tente novamente."
      );
      setSuccess("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Registro</h1>
      <form
        onSubmit={handleSubmitWithRedirect}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nome:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Senha:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 transition duration-200"
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Signup;
