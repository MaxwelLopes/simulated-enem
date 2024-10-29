import { useState } from "react";


export const simuledCreate = () => {
  const [typeOfSimuled, setTypeOfSimuled] = useState<string>("Área de estudo");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);
  const [unseen, setUnseen] = useState<boolean>(false);
  const [review, setReview] = useState<boolean>(false);
  const [subtypes, setSubtype] = useState<string[]>([]);

  return {
    typeOfSimuled,
    questionCount,
    error,
    unseen,
    review,
    subtypes,
    setTypeOfSimuled,
    setQuestionCount,
    setError,
    setUnseen,
    setReview,
    setSubtype,
  };
};
