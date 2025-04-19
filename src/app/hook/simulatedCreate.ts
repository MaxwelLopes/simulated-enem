import { useState } from "react";

export const useSimulatedCreate = () => {
  const [typeOfSimulated, setTypeOfSimulated] =
    useState<string>("Área de estudo");
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [unseen, setUnseen] = useState<boolean>(false);
  const [review, setReview] = useState<boolean>(false);
  const [subtypes, setSubtype] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [essay, setEssay] = useState<"specific" | "random">("specific");
  const [nonInepEssay, setNonInepEssay] = useState<boolean>(false);
  const [isDayOne, setIsDayOne] = useState<boolean>(false);
  const [isDayTwo, setIsDayTwo] = useState<boolean>(false);
  const [language, setLanguage] = useState<"english" | "spanish">("english");

  return {
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
    loading,
    setLoading,
    essay,
    setEssay,
    nonInepEssay,
    setNonInepEssay,
    isDayOne,
    setIsDayOne,
    isDayTwo,
    setIsDayTwo,
    language,
    setLanguage,
  };
};
