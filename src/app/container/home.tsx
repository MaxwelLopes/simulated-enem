"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Loading } from "@/app/components/Loading"
import {
  getUserCorrectAnswersCount,
  getUserIncorrectAnswersCount,
} from "@/app/service/QuestionService"
import { getSimulations } from "@/app/service/simualationService"
import { BookOpen, BarChart2, Award, Clock, ChevronRight } from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession()
  const userId = session?.user?.id ?? null

  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)
  const [averageScore, setAverageScore] = useState(0)
  const [totalSimulations, setTotalSimulations] = useState(0)
  const [recentSimulations, setRecentSimulations] = useState<
    {
      id: string
      name: string
      correct: number
      incorrect: number
      date: string
      percentage: number
    }[]
  >([])

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const simulationsData = await getSimulations(userId)
        const correct = await getUserCorrectAnswersCount(userId)
        const incorrect = await getUserIncorrectAnswersCount(userId)

        setCorrectCount(correct)
        setIncorrectCount(incorrect)
        setTotalSimulations(simulationsData.length)

        const totalAnswers = correct + incorrect
        const average = totalAnswers > 0 ? (correct / totalAnswers) * 100 : 0
        setAverageScore(average)

        // Processar os simulados e pegar os 3 mais recentes
        const processedSimulations = simulationsData
          .map((sim, index) => ({
            id: String(sim.id), // Convertendo para string explicitamente
            name: `Simulado ${index + 1}`,
            correct: sim.correctAnswers,
            incorrect: sim.totalQuestions - sim.correctAnswers,
            date: new Date(sim.createdAt).toLocaleDateString(),
            percentage: (sim.correctAnswers / sim.totalQuestions) * 100,
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)

        setRecentSimulations(processedSimulations)
      }
    }

    if (userId) {
      fetchData()
    }
  }, [userId])

  if (status === "loading") return <Loading />

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100">
      {/* Header com boas-vindas */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-12 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bem-vindo ao Simulador ENEM</h1>
          <p className="text-xl opacity-90">
            Olá, <span className="font-semibold">{session?.user?.name || "Estudante"}</span>! Prepare-se para o ENEM com
            simulados personalizados.
          </p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Simulados Realizados</p>
                  <h3 className="text-2xl font-bold">{totalSimulations}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <BarChart2 className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Média Geral</p>
                  <h3 className="text-2xl font-bold">{averageScore.toFixed(1)}%</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Award className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Questões Respondidas</p>
                  <h3 className="text-2xl font-bold">{correctCount + incorrectCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Caixa preta com estatísticas */}
        <div className="bg-gray-900 text-white rounded-xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BarChart2 className="mr-2 h-6 w-6" />
            Seu Desempenho
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Estatísticas gerais */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Taxa de Acertos</span>
                  <span className="font-medium">{averageScore.toFixed(1)}%</span>
                </div>
                <Progress value={averageScore} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Acertos</p>
                  <p className="text-2xl font-bold text-green-400">{correctCount}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Erros</p>
                  <p className="text-2xl font-bold text-red-400">{incorrectCount}</p>
                </div>
              </div>

              <Button
                onClick={() => router.push("/desempenho")}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                Ver Estatísticas Completas
              </Button>
            </div>

            {/* Últimos simulados */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Últimos Simulados
              </h3>

              {recentSimulations.length > 0 ? (
                <div className="space-y-4">
                  {recentSimulations.map((sim) => (
                    <div key={sim.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{sim.name}</h4>
                        <span className="text-sm text-gray-400">{sim.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-green-400 mr-2">{sim.correct} acertos</span>
                          <span className="text-red-400">{sim.incorrect} erros</span>
                        </div>
                        <span
                          className={`font-bold ${
                            sim.percentage >= 70
                              ? "text-green-400"
                              : sim.percentage >= 50
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {sim.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-400 mb-4">Você ainda não realizou nenhum simulado</p>
                    <Button
                      variant="outline"
                      className="border-indigo-500 text-indigo-400 hover:bg-indigo-950"
                      onClick={() => router.push("/createSimulated")}
                      >
                      Iniciar Primeiro Simulado
                  </Button>
                </div>
              )}

              {recentSimulations.length > 0 && (
                <Button variant="link" className="mt-2 text-indigo-400 w-full" onClick={() => router.push("/simulated")}>
                  Ver Todos os Simulados <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 h-16 text-lg"
              onClick={() => router.push("/createSimulated")}
              >
              Iniciar Novo Simulado
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 h-16 text-lg"
            onClick={() => router.push("/createSimulated")}
            >
            Praticar por Matéria
          </Button>
        </div>
      </div>
    </div>
  )
}
