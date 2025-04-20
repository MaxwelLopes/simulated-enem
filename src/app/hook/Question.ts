import { useEffect, useState } from "react";

export const useQuestion = (question: any) => {
  const [disciplineName, setDisciplineName] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState<string | null>(null);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  
  useEffect(() => {
    if (question?.discipline) {
      setDisciplineName(question.discipline?.name || null);
    }
    
    if (question?.subject) {
      setSubjectName(question.subject?.name || null);
    }

    if (question?.questionCategories) {
      const categories = question.questionCategories.map(
        (category: { category: { name: string } }) => category.category.name
      );
      setCategoryNames(categories);
    }
  }, [question]);

  return { disciplineName, subjectName, categoryNames };
};
