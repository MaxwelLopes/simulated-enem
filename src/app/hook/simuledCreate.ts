import { useEffect, useState } from "react";
import { disciplines } from "../constants/disciplines";
import { subjects } from "../constants/subjects";
import { categories } from "../constants/categories";

export const simuledCreate = () => {
  const [typeOfSimuled, setTypeOfSimuled] = useState<string>("Área de estudo");
  const [discipline, setDiscipline] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeOfSimuled === "Área de estudo") {
      setDiscipline(disciplines[0]);
      setSubject(null);
      setCategory(null);
    }

    if (typeOfSimuled === "Matéria") {
      setDiscipline(null);
      setCategory(null);
      setSubject(subjects[0]);
    }

    if (typeOfSimuled === "Tópico") {
      setDiscipline(null);
      setSubject(null);
      setCategory(categories[0]);
    }
  }, [typeOfSimuled]);

  return {
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
    setError
  };
};
