import { useEffect, useState } from "react";
import { getDisciplineName } from "../service/disciplineService";
import { getSubjectName } from "../service/subjectService";

export const useQuestion = (disciplineId: number | null, subjectId: number | null) => {
  const [disciplineName, setDisciplineName] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState<string | null>(null); 

  useEffect(() => {
    const fetchDisciplineName = async () => {
      if (disciplineId) {
        const name = await getDisciplineName(disciplineId);
        setDisciplineName(name);
      }
      if(subjectId) {
        const name = await getSubjectName(subjectId);
        setSubjectName(name)
      }
    };

    fetchDisciplineName();
  }, [disciplineId]);



  return { disciplineName, subjectName };
};
