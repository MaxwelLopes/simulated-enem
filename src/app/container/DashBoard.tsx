"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import {
  getIncorrectAnswersCountByCategory,
  getCorrectAnswersCountByCategory,
  getOverallAverageScore,
  getDisciplineAffinity,
} from "../service/QuestionService"
import { getSimulations } from "../service/simualationService"

import {
  ChevronLeft,
  ChevronRight,
  FileQuestion,
  ArrowUp,
  ArrowDown,
  Minus,
  BookOpen,
  Award,
  PieChartIcon,
  Activity,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { Button } from "../components/ui/button"
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"

const chartConfig = {
  correct: {
    label: "Acertos",
    color: "hsl(var(--chart-1))",
  },
  incorrect: {
    label: "Erros",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const essayChartConfig = {
  essayScore: {
    label: "Nota da Redação",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

const CustomLegend = ({
  data,
  darkMode = false,
}: {
  data: { name: string; value: number; color: string; totalQuestions: number }[]
  darkMode?: boolean
}) => (
  <div className="flex flex-col space-y-2">
    {data.map((entry, index) => (
      <div key={`legend-${index}`} className="flex items-center">
        <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: entry.color }}></div>
        <span className={`text-sm ${darkMode ? "text-muted-foreground" : ""}`}>
          {entry.name}: {entry.value.toFixed(2)}% <br /> ({entry.totalQuestions} questões)
        </span>
      </div>
    ))}
  </div>
)

export default function DashBoard() {
  const { data: session } = useSession()
  const userId = session?.user?.id ?? null
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)
  const [errorsByCategory, setErrorsByCategory] = useState<{ category: string; incorrectCount: number }[]>([])
  const [correctsByCategory, setCorrectsByCategory] = useState<{ category: string; correctCount: number }[]>([])
  const [averageScore, setAverageScore] = useState(0)
  const [totalSimulations, setTotalSimulations] = useState(0)
  const [simulationsData, setSimulationsData] = useState<
    {
      id: string
      name: string
      type?: string
      isEssay?: boolean
      correct: number
      incorrect: number
      essayScore?: number | null
      status: string
      date: string
    }[]
  >([])
  const [currentPage, setCurrentPage] = useState(0)
  const simulationsPerPage = 5
  const [overallAverageScore, setOverallAverageScore] = useState(0)
  const [disciplineAffinity, setDisciplineAffinity] = useState<{ name: string; affinity: number }[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const simulationsData = await getSimulations(userId)
        const incorrectByCategory = await getIncorrectAnswersCountByCategory(userId)
        const correctByCategory = await getCorrectAnswersCountByCategory(userId)
        const overallAverage = await getOverallAverageScore()
        const affinityData = await getDisciplineAffinity(userId)

        // Calcular o total de acertos e erros a partir dos dados dos simulados
        let totalCorrect = 0
        let totalIncorrect = 0

        // Processar dados dos simulados
        simulationsData.forEach((sim) => {
          // Acumular totais gerais
          totalCorrect += sim.correctAnswers
          totalIncorrect += sim.totalQuestions - sim.correctAnswers
        })

        setDisciplineAffinity(affinityData)
        setOverallAverageScore(overallAverage)
        setCorrectCount(totalCorrect)
        setIncorrectCount(totalIncorrect)
        setErrorsByCategory(incorrectByCategory)
        setCorrectsByCategory(correctByCategory)
        setTotalSimulations(simulationsData.length)

        const totalAnswers = totalCorrect + totalIncorrect
        const average = totalAnswers > 0 ? (totalCorrect / totalAnswers) * 100 : 0
        setAverageScore(average)

        // Processar dados dos simulados para exibição
        const processedSimulations = simulationsData.map((sim, index) => ({
          id: String(sim.id),
          name: `Simulado ${index + 1}`,
          type: sim.type,
          isEssay: sim.type === "essay" || sim.type === "redação" || sim.type === "Redação",
          correct: sim.correctAnswers,
          incorrect: sim.totalQuestions - sim.correctAnswers,
          essayScore: sim.essayScore || null,
          status: "Concluído",
          date: new Date(sim.createdAt).toLocaleDateString(),
        }))

        // Also, let's add some debugging to check the simulation types
        console.log(
          "Simulation types:",
          simulationsData.map((sim) => ({ id: sim.id, type: sim.type, essayScore: sim.essayScore })),
        )

        setSimulationsData(processedSimulations)
      }
    }

    if (userId) {
      fetchData()
    }
  }, [userId])

  const pageCount = Math.ceil(simulationsData.length / simulationsPerPage)
  const invertedPageIndex = pageCount - 1 - currentPage // Inverte a lógica de páginas

  const displayedSimulations = [...Array(simulationsPerPage)]
    .map((_, index) => {
      const simIndex = invertedPageIndex * simulationsPerPage + index
      return simIndex < simulationsData.length
        ? simulationsData[simIndex]
        : {
            id: `empty-${index}`,
            name: `Simulado ${simIndex + 1}`,
            correct: 0,
            incorrect: 0,
            isEssay: false, // Add this line to ensure isEssay is always defined
            status: "Não realizado",
            date: "-",
          }
    })
    .reverse()

  const categoryData = correctsByCategory.map((correct) => {
    const incorrect = errorsByCategory.find((err) => err.category === correct.category)
    return {
      category: correct.category,
      correctCount: correct.correctCount,
      incorrectCount: incorrect ? incorrect.incorrectCount : 0,
      totalCount: correct.correctCount + (incorrect ? incorrect.incorrectCount : 0),
    }
  })

  const prepareChartData = (type: "correct" | "incorrect") => {
    return categoryData
      .map((item) => {
        const percentage = (item.correctCount / item.totalCount) * 100
        return {
          name: item.category,
          value: percentage,
          totalQuestions: item.totalCount,
        }
      })
      .sort((a, b) => (type === "correct" ? b.value - a.value : a.value - b.value))
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length],
      }))
  }

  const topCorrectCategories = prepareChartData("correct")
  const topIncorrectCategories = prepareChartData("incorrect")

  const difference = averageScore - overallAverageScore
  const isHigher = difference > 0
  const isEqual = difference === 0

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-indigo-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* Header with stats summary */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-8 px-6 rounded-xl shadow-lg mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard de Desempenho</h1>
            <p className="text-white/80">Acompanhe seu progresso e desempenho nos simulados</p>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Simulados</CardTitle>
                <div className="bg-indigo-100 p-2 rounded-full">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSimulations}</div>
                <p className="text-xs text-muted-foreground">Total de simulados realizados</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Questões</CardTitle>
                <div className="bg-indigo-100 p-2 rounded-full">
                  <FileQuestion className="h-4 w-4 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{correctCount + incorrectCount}</div>
                <p className="text-xs text-muted-foreground">Total de questões respondidas</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Sua Média</CardTitle>
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Award className="h-4 w-4 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
                <div className="flex items-center mt-1">
                  {isEqual ? (
                    <Minus className="h-3 w-3 text-yellow-500 mr-1" />
                  ) : isHigher ? (
                    <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <p
                    className={`text-xs ${isEqual ? "text-yellow-500" : isHigher ? "text-green-600" : "text-red-600"}`}
                  >
                    {isHigher ? "+" : ""}
                    {difference.toFixed(1)}% vs média geral
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Activity className="h-4 w-4 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {correctCount > 0 ? ((correctCount / (correctCount + incorrectCount)) * 100).toFixed(1) : "0"}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {correctCount} acertos / {incorrectCount} erros
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid grid-cols-4 mb-8 bg-white shadow-md p-1 rounded-lg">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Desempenho
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Categorias
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                Histórico
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Trend - Using the exact bar chart implementation provided */}
                <Card className="flex flex-col bg-white shadow-md">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-gray-800">Desempenho dos Simulados</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Visualização dos resultados de questões (5 por página)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ScrollArea className="w-full">
                      <div className="w-full" style={{ height: "300px", maxWidth: "500px", margin: "0 auto" }}>
                        <ChartContainer config={chartConfig}>
                          <ResponsiveContainer width="100%" height={"100%"}>
                            <BarChart
                              data={displayedSimulations.filter((sim) => sim && sim.isEssay === false)}
                              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#4b5563" }} />
                              <YAxis tick={{ fontSize: 13, fill: "#4b5563" }} />
                              <ChartTooltip
                                cursor={false}
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    return (
                                      <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                          <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                              Corretas
                                            </span>
                                            <span className="font-bold text-green-600">{data.correct}</span>
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                              Incorretas
                                            </span>
                                            <span className="font-bold text-red-600">{data.incorrect}</span>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  }
                                  return null
                                }}
                              />
                              <Bar dataKey="correct" fill="#4f46e5" stackId="a" barSize={30} name="Acertos" />
                              <Bar
                                dataKey="incorrect"
                                fill="#ef4444"
                                stackId="a"
                                barSize={30}
                                radius={[3, 3, 0, 0]}
                                name="Erros"
                              />
                              <Tooltip />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center border-t border-gray-200 pt-4">
                    <Button
                      variant="outline"
                      className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-gray-800">{`Página ${currentPage + 1} de ${pageCount}`}</span>
                    <Button
                      variant="outline"
                      className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1))}
                      disabled={currentPage === pageCount - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* Essay Scores Card - Only shown if there are essay simulations */}
                {simulationsData.some((sim) => sim.isEssay) ? (
                  <Card className="flex flex-col bg-white shadow-md">
                    <CardHeader className="border-b border-gray-200">
                      <CardTitle className="text-gray-800">Desempenho em Redações</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Visualização das notas de redação
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ScrollArea className="w-full">
                        <div className="w-full" style={{ height: "300px", maxWidth: "500px", margin: "0 auto" }}>
                          <ChartContainer config={essayChartConfig}>
                            <ResponsiveContainer width="100%" height={"100%"}>
                              <BarChart
                                data={displayedSimulations.filter((sim) => sim && sim.isEssay === true)}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#4b5563" }} />
                                <YAxis domain={[0, 1000]} tick={{ fontSize: 13, fill: "#4b5563" }} />
                                <Bar
                                  dataKey="essayScore"
                                  fill="#10b981"
                                  barSize={40}
                                  name="Nota da Redação"
                                  radius={[4, 4, 0, 0]}
                                />
                                <Tooltip
                                  formatter={(value) => [`${value}/1000`, "Nota da Redação"]}
                                  cursor={false}
                                  contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "0.375rem",
                                  }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t border-gray-200 pt-4">
                      <Button
                        variant="outline"
                        className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                        size="icon"
                        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-gray-800">{`Página ${currentPage + 1} de ${pageCount}`}</span>
                      <Button
                        variant="outline"
                        className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                        size="icon"
                        onClick={() => setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1))}
                        disabled={currentPage === pageCount - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Melhores Categorias</CardTitle>
                        <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardDescription>Top 5 categorias com maior média de acertos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="w-full md:w-2/3">
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={topCorrectCategories}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  labelLine={false}
                                >
                                  {topCorrectCategories.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip
                                  formatter={(value) => [
                                    `${typeof value === "number" ? value.toFixed(2) : value}%`,
                                    "Média de Acertos",
                                  ]}
                                  contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div className="w-full md:w-1/3 mt-4 md:mt-0">
                          <CustomLegend data={topCorrectCategories} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Discipline Affinity - Fixed with proper Card structure */}
                <Card className="flex flex-col bg-white shadow-md">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-gray-800">Afinidade por Disciplina</CardTitle>
                    <CardDescription className="text-muted-foreground">Baseado na média de acertos</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 flex justify-center items-center">
                    <ChartContainer
                      config={{
                        affinity: {
                          label: "Afinidade",
                          color: "hsl(var(--primary))",
                        },
                      }}
                      className="w-full max-w-md h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={disciplineAffinity}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="name" tick={{ fill: "#4b5563" }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#4b5563" }} />
                          <Radar
                            name="Afinidade"
                            dataKey="affinity"
                            stroke="#4f46e5"
                            fill="#4f46e5"
                            fillOpacity={0.6}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Categorias para Melhorar */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Categorias para Melhorar</CardTitle>
                      <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardDescription>Top 5 categorias com menor média de acertos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="w-full md:w-2/3">
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={topIncorrectCategories}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {topIncorrectCategories.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value) => [
                                  `${typeof value === "number" ? value.toFixed(2) : value}%`,
                                  "Média de Acertos",
                                ]}
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="w-full md:w-1/3 mt-4 md:mt-0">
                        <CustomLegend data={topIncorrectCategories} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Simulations */}
              <Card>
                <CardHeader>
                  <CardTitle>Simulados Recentes</CardTitle>
                  <CardDescription>Últimos simulados realizados</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Simulado</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Acertos</TableHead>
                        <TableHead>Erros</TableHead>
                        <TableHead>Taxa</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {simulationsData.slice(0, 5).map((sim) => (
                        <TableRow key={sim.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{sim.name}</TableCell>
                          <TableCell>{sim.date}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-indigo-100 text-indigo-600 border-indigo-20">
                              {sim.status}
                            </Badge>
                          </TableCell>
                          {sim.isEssay ? (
                            <>
                              <TableCell colSpan={3} className="text-center font-medium">
                                Nota da Redação: <span className="text-indigo-600">{sim.essayScore || 0}/1000</span>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell className="text-green-600">{sim.correct}</TableCell>
                              <TableCell className="text-red-600">{sim.incorrect}</TableCell>
                              <TableCell>{((sim.correct / (sim.correct + sim.incorrect)) * 100).toFixed(1)}%</TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    variant="outline"
                    className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                    size="sm"
                    onClick={() => setActiveTab("history")}
                  >
                    Ver todos os simulados
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Comparação com a Média Geral</CardTitle>
                    <CardDescription>Seu desempenho comparado com a média de todos os usuários</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-6">
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Sua Média</div>
                        <div className="text-5xl font-bold text-indigo-600">{averageScore.toFixed(1)}%</div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-16 h-1 bg-border rounded-full md:w-1 md:h-16"></div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Média Geral</div>
                        <div className="text-5xl font-bold">{overallAverageScore.toFixed(1)}%</div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-16 h-1 bg-border rounded-full md:w-1 md:h-16"></div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Diferença</div>
                        <div
                          className={`text-5xl font-bold ${isEqual ? "text-yellow-500" : isHigher ? "text-green-600" : "text-red-600"}`}
                        >
                          {isHigher ? "+" : ""}
                          {difference.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center mt-4">
                      <Badge
                        variant={isHigher ? "secondary" : isEqual ? "outline" : "destructive"}
                        className={`text-sm py-1 ${isHigher ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}`}
                      >
                        {isEqual
                          ? "Sua média está igual à média geral"
                          : isHigher
                            ? "Sua média está acima da média geral"
                            : "Sua média está abaixo da média geral"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Using the exact bar chart implementation provided */}
                <Card className="flex flex-col bg-white shadow-md">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-gray-800">Desempenho dos Simulados</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Visualização dos resultados de questões (5 por página)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ScrollArea className="w-full">
                      <div className="w-full" style={{ height: "300px", maxWidth: "500px", margin: "0 auto" }}>
                        <ChartContainer config={chartConfig}>
                          <ResponsiveContainer width="100%" height={"100%"}>
                            <BarChart
                              data={displayedSimulations.filter((sim) => sim && sim.isEssay === false)}
                              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#4b5563" }} />
                              <YAxis tick={{ fontSize: 13, fill: "#4b5563" }} />
                              <ChartTooltip
                                cursor={false}
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    return (
                                      <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                          <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                              Corretas
                                            </span>
                                            <span className="font-bold text-green-600">{data.correct}</span>
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                              Incorretas
                                            </span>
                                            <span className="font-bold text-red-600">{data.incorrect}</span>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  }
                                  return null
                                }}
                              />
                              <Bar dataKey="correct" fill="#4f46e5" stackId="a" barSize={30} name="Acertos" />
                              <Bar
                                dataKey="incorrect"
                                fill="#ef4444"
                                stackId="a"
                                barSize={30}
                                radius={[3, 3, 0, 0]}
                                name="Erros"
                              />
                              <Tooltip />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center border-t border-gray-200 pt-4">
                    <Button
                      variant="outline"
                      className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-gray-800">{`Página ${currentPage + 1} de ${pageCount}`}</span>
                    <Button
                      variant="outline"
                      className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1))}
                      disabled={currentPage === pageCount - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* Essay Scores Card - Only shown if there are essay simulations */}
                {simulationsData.some((sim) => sim.isEssay) && (
                  <Card className="flex flex-col bg-white shadow-md">
                    <CardHeader className="border-b border-gray-200">
                      <CardTitle className="text-gray-800">Desempenho em Redações</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Visualização das notas de redação
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ScrollArea className="w-full">
                        <div className="w-full" style={{ height: "300px", maxWidth: "500px", margin: "0 auto" }}>
                          <ChartContainer config={essayChartConfig}>
                            <ResponsiveContainer width="100%" height={"100%"}>
                              <BarChart
                                data={displayedSimulations.filter((sim) => sim && sim.isEssay === true)}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#4b5563" }} />
                                <YAxis domain={[0, 1000]} tick={{ fontSize: 13, fill: "#4b5563" }} />
                                <Bar
                                  dataKey="essayScore"
                                  fill="#10b981"
                                  barSize={40}
                                  name="Nota da Redação"
                                  radius={[4, 4, 0, 0]}
                                />
                                <Tooltip
                                  formatter={(value) => [`${value}/1000`, "Nota da Redação"]}
                                  cursor={false}
                                  contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "0.375rem",
                                  }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t border-gray-200 pt-4">
                      <Button
                        variant="outline"
                        className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                        size="icon"
                        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-gray-800">{`Página ${currentPage + 1} de ${pageCount}`}</span>
                      <Button
                        variant="outline"
                        className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                        size="icon"
                        onClick={() => setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1))}
                        disabled={currentPage === pageCount - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                )}

                <Card className="flex flex-col bg-white shadow-md">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-gray-800">Afinidade por Disciplina</CardTitle>
                    <CardDescription className="text-muted-foreground">Baseado na média de acertos</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ChartContainer
                      config={{
                        affinity: {
                          label: "Afinidade",
                          color: "hsl(var(--primary))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={disciplineAffinity}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="name" tick={{ fill: "#4b5563" }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#4b5563" }} />
                          <Radar
                            name="Afinidade"
                            dataKey="affinity"
                            stroke="#4f46e5"
                            fill="#4f46e5"
                            fillOpacity={0.6}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Melhores Categorias</CardTitle>
                      <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardDescription>Top 5 categorias com maior média de acertos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="w-full md:w-2/3">
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={topCorrectCategories}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {topCorrectCategories.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value) => [
                                  `${typeof value === "number" ? value.toFixed(2) : value}%`,
                                  "Média de Acertos",
                                ]}
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="w-full md:w-1/3 mt-4 md:mt-0">
                        <CustomLegend data={topCorrectCategories} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Categorias para Melhorar</CardTitle>
                      <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardDescription>Top 5 categorias com menor média de acertos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="w-full md:w-2/3">
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={topIncorrectCategories}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {topIncorrectCategories.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value) => [
                                  `${typeof value === "number" ? value.toFixed(2) : value}%`,
                                  "Média de Acertos",
                                ]}
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="w-full md:w-1/3 mt-4 md:mt-0">
                        <CustomLegend data={topIncorrectCategories} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recomendações de Estudo</CardTitle>
                    <CardDescription>Baseado no seu desempenho por categoria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topIncorrectCategories.slice(0, 3).map((category, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
                          <div className="bg-indigo-100 p-2 rounded-full">
                            <BookOpen className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium">{category.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Sua média de acertos nesta categoria é de {category.value.toFixed(1)}%. Recomendamos
                              dedicar mais tempo de estudo para melhorar seu desempenho nesta área.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                      Ver todas as categorias
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico Completo de Simulados</CardTitle>
                  <CardDescription>Todos os simulados realizados</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Simulado</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Acertos</TableHead>
                          <TableHead>Erros</TableHead>
                          <TableHead>Taxa de Acerto</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {simulationsData.map((sim) => (
                          <TableRow key={sim.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{sim.name}</TableCell>
                            <TableCell>{sim.date}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-indigo-100 text-indigo-600 border-indigo-20">
                                {sim.status}
                              </Badge>
                            </TableCell>
                            {sim.isEssay ? (
                              <>
                                <TableCell colSpan={3} className="text-center font-medium">
                                  Nota da Redação: <span className="text-indigo-600">{sim.essayScore || 0}/1000</span>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className="text-green-600 font-medium">{sim.correct}</TableCell>
                                <TableCell className="text-red-600 font-medium">{sim.incorrect}</TableCell>
                                <TableCell>
                                  {((sim.correct / (sim.correct + sim.incorrect)) * 100).toFixed(1)}%
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                    Exportar dados
                  </Button>
                  <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">
                    Novo simulado
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
