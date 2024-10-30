"use client";

import { disciplines } from "../constants/disciplines";
import { subjects } from "../constants/subjects";
import { categories } from "../constants/categories";
import { useSimulatedCreate } from "../hook/simulatedCreate";
import { createSimulated } from "../service/simualationService";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SimulatedType } from "../enum/simulated";
import { SelectedItems } from "../components/SelectedItems";
import { years } from "../constants/years";

const CreateSimulated = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const router = useRouter();
  const {
    typeOfSimulated,
    questionCount,
    error,
    unseen,
    review,
    subtypes,
    setTypeOfSimulated,
    setQuestionCount,
    setError,
    setUnseen,
    setReview,
    setSubtype,
  } = useSimulatedCreate();

  const simulatedTypes = Object.values(SimulatedType);

  const handleClick = async () => {
    const userId = user ? user.id : null;
    if (userId) {
      const success = await createSimulated({
        typeOfSimulated,
        questionCount,
        error,
        unseen,
        review,
        subtypes,
        userId,
      });

      if(success) router.push("/simulated");
      else{
        setError("Não foi possível criar um simulado com essa combinação!")
      }
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setSubtype((prevList) => {
      const newList = [...prevList, ...selectedOptions];
      return Array.from(new Set(newList));
    });
  };

  const handleRemoveSubType = (subType: string) => {
    setSubtype((prev) => prev.filter((c) => c !== subType));
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
            value={typeOfSimulated as string}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            onChange={(e) => {
              setTypeOfSimulated(e.target.value);
              setSubtype([]);
            }}
          >
            {simulatedTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          {typeOfSimulated === "Área de estudo" && (
            <>
              <label className="block text-sm font-medium text-gray-700">
                Área de estudo
              </label>
              <select
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {disciplines.map((discipline) => (
                  <option key={discipline} value={discipline}>
                    {discipline}
                  </option>
                ))}
              </select>
              <SelectedItems
                subtypes={subtypes}
                handleRemoveSubType={handleRemoveSubType}
              />
            </>
          )}
          {typeOfSimulated === "Matéria" && (
            <>
              <label className="block text-sm font-medium text-gray-700">
                Matéria
              </label>
              <select
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <SelectedItems
                subtypes={subtypes}
                handleRemoveSubType={handleRemoveSubType}
              />
            </>
          )}
          {typeOfSimulated === "Tópico" && (
            <>
              <label className="block text-sm font-medium text-gray-700">
                Tópico
              </label>
              <select
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <SelectedItems
                subtypes={subtypes}
                handleRemoveSubType={handleRemoveSubType}
              />
            </>
          )}

          {typeOfSimulated === "Ano" && (
            <>
              <label className="block text-sm font-medium text-gray-700">
                Ano
              </label>
              <select
                onChange={(e) => setSubtype([String(e.target.value)])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </>
          )}

          {typeOfSimulated !== "Ano" && (
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700">
                Quantidade de Questões
              </label>
              <input
                type="number"
                defaultValue={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                min={1}
                max={2700}
                placeholder="Número de questões"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={unseen}
                  onChange={(e) => {
                    setUnseen(e.target.checked);
                    if (e.target.checked) setReview(false); 
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring focus:ring-blue-200"
                />
                <span className="ml-3 text-gray-800 text-base">
                  Questões Inéditas
                </span>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={review}
                  onChange={(e) => {
                    setReview(e.target.checked);
                    if (e.target.checked) setUnseen(false); 
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring focus:ring-blue-200"
                />
                <span className="ml-3 text-gray-800 text-base">
                  Revisar Questões que Errou
                </span>
              </div>
            </div>
          )}
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

export default CreateSimulated;
