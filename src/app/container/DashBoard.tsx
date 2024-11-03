"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { 
  getAllQuestionsByUserId, 
  getUserCorrectAnswersCount, 
  getUserIncorrectAnswersCount, 
  getIncorrectAnswersCountByCategory,
  getCorrectAnswersCountByCategory
} from "../service/QuestionService";
import { getSimulations } from "../service/simualationService";

export default function DashBoard() {
    const { data: session } = useSession();
    const userId = session?.user.id;
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [errorsByCategory, setErrorsByCategory] = useState<{ category: string; incorrectCount: number }[]>([]);
    const [correctsByCategory, setCorrectsByCategory] = useState<{ category: string; correctCount: number }[]>([]);
    const [averageScore, setAverageScore] = useState(0);
    const [totalSimulations, setTotalSimulations] = useState(0);
    const [averageDuration, setAverageDuration] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                const simulationsData = await getSimulations(userId);
                const allQuestions = await getAllQuestionsByUserId(userId);
                const correct = await getUserCorrectAnswersCount(userId);
                const incorrect = await getUserIncorrectAnswersCount(userId);
                const incorrectByCategory = await getIncorrectAnswersCountByCategory(userId);
                const correctByCategory = await getCorrectAnswersCountByCategory(userId);

                setCorrectCount(correct);
                setIncorrectCount(incorrect);
                setErrorsByCategory(incorrectByCategory);
                setCorrectsByCategory(correctByCategory);
                setTotalSimulations(simulationsData.length);

                const totalAnswers = correct + incorrect;
                const average = totalAnswers > 0 ? (correct / totalAnswers) * 100 : 0;
                setAverageScore(average);

                const totalDuration = simulationsData.reduce((total, sim) => {
                    if (sim.createdAt && sim.finishedAt) {
                        const start = new Date(sim.createdAt).getTime();
                        const end = new Date(sim.finishedAt).getTime();
                        const durationInMinutes = (end - start) / (1000 * 60);
                        return total + durationInMinutes;
                    }
                    return total;
                }, 0);

                const avgDuration = simulationsData.length > 0 ? totalDuration / simulationsData.length : 0;
                setAverageDuration(avgDuration);
            }
        };

        fetchData();
    }, [userId]);

    return ( 
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-700 mb-6">Desempenho</h1>
            
            {/* Aumente a largura máxima aqui */}
            <div className="w-full max-w-8xl bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-500 mb-6">Usuário: <span className="text-gray-800">{session?.user.name}</span></p>
                
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-700">Desempenho do Usuário</h3>
                    <p className="mt-2 text-gray-600">Acertos: <span className="font-bold text-green-600">{correctCount}</span></p>
                    <p className="mt-1 text-gray-600">Erros: <span className="font-bold text-red-600">{incorrectCount}</span></p>
                    <p className="mt-1 text-gray-600">Total de Simulados: <span className="font-bold text-gray-800">{totalSimulations}</span></p>
                    <p className="mt-1 text-gray-600">Média de Acertos: <span className="font-bold text-blue-600">{averageScore.toFixed(2)}%</span></p>
                    <p className="mt-1 text-gray-600">Média de Duração dos Simulados: <span className="font-bold text-purple-600">{averageDuration.toFixed(2)} horas</span></p>
                </div>
    
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Desempenho por Categoria (Erros)</h3>
                    {errorsByCategory.length > 0 ? (
                        <ul className="space-y-2">
                            {errorsByCategory.map((error) => (
                                <li key={error.category} className="text-gray-600">
                                    <span className="font-semibold text-gray-800">{error.category}</span>: {error.incorrectCount} erro(s)
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Nenhum erro registrado por categoria.</p>
                    )}
                </div>
    
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Desempenho por Categoria (Acertos)</h3>
                    {correctsByCategory.length > 0 ? (
                        <ul className="space-y-2">
                            {correctsByCategory.map((correct) => (
                                <li key={correct.category} className="text-gray-600">
                                    <span className="font-semibold text-gray-800">{correct.category}</span>: {correct.correctCount} acerto(s)
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Nenhum acerto registrado por categoria.</p>
                    )}
                </div>
            </div>
        </div>
    );
    
}
