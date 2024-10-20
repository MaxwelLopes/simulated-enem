"use client";

import { disciplines } from "../constants/disciplines";
import { subjects } from "../constants/subjects";
import { categories } from "../constants/categories";
import { simuledCreate } from "../hook/simuledCreate";
import { createSimulation } from "../service/simualationService";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const CreateSimuled = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    typeOfSimuled,
    discipline,
    subject,
    category,
    questionCount,
    error,
    setTypeOfSimuled,
    setDiscipline,
    setSubject,
    setCategory,
    setQuestionCount,
    setError,
  } = simuledCreate();

  const handleClick = async () => {
    if (!session) {
      setError("Usuário não autenticado.");
      return;
    }
    const userId = session.user.id;
    const status = await createSimulation(
      typeOfSimuled,
      discipline,
      subject,
      category,
      questionCount,
      userId as string
    );
    if (status.success) {
      router.push("/simulations");
    } else {
      setError("deu errado :(((((((((((((((");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Criar Simulado</h1>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Filtro
          </label>
          <select
            value={typeOfSimuled as string}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            onChange={(e) => setTypeOfSimuled(e.target.value)}
          >
            <option value={"Área de estudo"}>Área de estudo</option>
            <option value={"Matéria"}>Matéria</option>
            <option value={"Tópico"}>Tópico</option>
          </select>
        </div>

        <div className="mb-4">
          {typeOfSimuled === "Área de estudo" && (
            <>
              <label className="block text-sm font-medium text-gray-700">
                Área de estudo
              </label>
              <select
                value={discipline || ""}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {disciplines.map((discipline) => (
                  <option key={discipline} value={discipline}>
                    {discipline}
                  </option>
                ))}
              </select>
            </>
          )}
          {typeOfSimuled === "Matéria" && (
            <>
              <label className="block text-sm font-medium text-gray-700">
                Matéria
              </label>
              <select
                value={subject || ""}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </>
          )}
          {typeOfSimuled === "Tópico" && (
            <>
              <label className="block text-sm font-medium text-gray-700">
                Tópico
              </label>
              <select
                value={category || ""}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </>
          )}

          <div className="pt-4">
            <label className="block text-sm font-medium text-gray-700">
              Quantidade de Questões
            </label>
            <input
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              min={1}
              max={50}
              placeholder="Número de questões"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <button
          onClick={() => {
            handleClick();
          }}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 transition duration-200"
        >
          Criar Simulado
        </button>
      </div>
    </div>
  );
};

export default CreateSimuled;
