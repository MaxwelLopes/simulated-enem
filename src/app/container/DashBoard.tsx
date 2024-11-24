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

import { TrendingUp, ChevronLeft, ChevronRight, FileQuestion, BarChart2 } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../components/ui/chart"
import { Button } from "../components/ui/button"
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"

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

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const CustomLegend = ({ data }: { data: { name: string; value: number; color: string; totalQuestions: number }[] }) => (
  <div className="flex flex-col space-y-2">
    {data.map((entry, index) => (
      <div key={`legend-${index}`} className="flex items-center">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: entry.color }}></div>
        <span className="text-sm">{entry.name}: {entry.value.toFixed(2)}% <br /> ({entry.totalQuestions} questões)</span>
      </div>
    ))}
  </div>
);

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
  const [simulationsData, setSimulationsData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const simulationsPerPage = 5;

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

        // Process simulation data for the chart and table
        const processedSimulations = simulationsData.map((sim, index) => ({
          id: sim.id,
          name: `Simulado ${index + 1}`,
          correct: sim.correctAnswers,
          incorrect: sim.totalQuestions - sim.correctAnswers,
          status: 'Concluído',
          date: new Date(sim.createdAt).toLocaleDateString()
        }));
        setSimulationsData(processedSimulations);
      }
    };

    fetchData();
  }, [userId]);

  const pageCount = Math.ceil(simulationsData.length / simulationsPerPage);
  const invertedPageIndex = pageCount - 1 - currentPage; // Inverte a lógica de páginas

  const displayedSimulations = [...Array(simulationsPerPage)].map((_, index) => {
    const simIndex = invertedPageIndex * simulationsPerPage + index;
    return simIndex < simulationsData.length
      ? simulationsData[simIndex]
      : {
          id: `empty-${index}`,
          name: `Simulado ${simIndex + 1}`,
          correct: 0,
          incorrect: 0,
          status: "Não realizado",
          date: "-",
        };
  })
  .reverse();



  // Combine correct and incorrect data for each category
  const categoryData = correctsByCategory.map(correct => {
    const incorrect = errorsByCategory.find(err => err.category === correct.category);
    return {
      category: correct.category,
      correctCount: correct.correctCount,
      incorrectCount: incorrect ? incorrect.incorrectCount : 0,
      totalCount: correct.correctCount + (incorrect ? incorrect.incorrectCount : 0)
    };
  });

  // Calculate average scores and prepare data for charts
  const prepareChartData = (type: 'correct' | 'incorrect') => {
    return categoryData
      .map(item => {
        const percentage = (item.correctCount / item.totalCount) * 100;
        return {
          name: item.category,
          value: percentage,
          totalQuestions: item.totalCount
        };
      })
      .sort((a, b) => type === 'correct' ? b.value - a.value : a.value - b.value)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length]
      }));
  };

  const topCorrectCategories = prepareChartData('correct');
  const topIncorrectCategories = prepareChartData('incorrect');

  return ( 
    <div className="flex flex-col items-center bg-gray-100 min-h-screen w-full p-4">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Desempenho</h1>
      
      <div className="w-full bg-white rounded-lg shadow-md p-6 overflow-y-auto flex-grow">
      <div className="grid gap-4 md:grid-cols-3 w-full mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Simulados Realizados
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSimulations}</div>
            <p className="text-xs text-muted-foreground">
              Total de simulados completados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Questões Respondidas
            </CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{correctCount + incorrectCount}</div>
            <p className="text-xs text-muted-foreground">
              Total de questões respondidas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Média Geral
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              Porcentagem média de acertos
            </p>
          </CardContent>
        </Card>
      </div>

        <Card className="w-full mb-6">
          <CardHeader>
            <CardTitle>Desempenho dos Simulados</CardTitle>
            <CardDescription>Visualização dos resultados (5 por página)</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <div className="w-full" style={{ height: "300px", maxWidth: "500px", margin: "0 auto" }}>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={"100%"}>
                    <BarChart data={displayedSimulations}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <ChartTooltip
                        cursor={false}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Corretas
                                    </span>
                                    <span className="font-bold text-green-500">{data.correct}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Incorretas
                                    </span>
                                    <span className="font-bold text-red-500">{data.incorrect}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="correct" fill="var(--color-incorrect)" stackId="a" barSize={30} />
                      <Bar dataKey="incorrect" fill="var(--color-correct)" stackId="a" barSize={30} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>{`Página ${currentPage + 1} de ${pageCount}`}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))}
              disabled={currentPage === pageCount - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Top 5 Categorias com Melhor Desempenho</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <div className="flex items-center justify-between">
                <div className="w-2/3">
                  <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topCorrectCategories}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {topCorrectCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="w-1/3">
                  <CustomLegend data={topCorrectCategories} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Top 5 categorias com maior média de acertos</p>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Top 5 Categorias com Pior Desempenho</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <div className="flex items-center justify-between">
                <div className="w-2/3">
                  <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topIncorrectCategories}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {topIncorrectCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="w-1/3">
                  <CustomLegend data={topIncorrectCategories} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Top 5 categorias com menor média de acertos</p>
            </CardFooter>
          </Card>
        </div>

        <Card className="w-full mb-6">
          <CardHeader>
            <CardTitle>Detalhes dos Simulados</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Simulado</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Acertos</TableHead>
                    <TableHead>Erros</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simulationsData.map((sim) => (
                    <TableRow key={sim.id}>
                      <TableCell>{sim.name}</TableCell>
                      <TableCell>{sim.date}</TableCell>
                      <TableCell>{sim.status}</TableCell>
                      <TableCell>{sim.correct}</TableCell>
                      <TableCell>{sim.incorrect}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        {/*
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Desempenho Geral</h3>
          <p className="mt-2 text-gray-600">Acertos: <span className="font-bold text-green-600">{correctCount}</span></p>
          <p className="mt-1 text-gray-600">Erros: <span className="font-bold text-red-600">{incorrectCount}</span></p>
          <p className="mt-1 text-gray-600">Total de Simulados: <span className="font-bold text-gray-800">{totalSimulations}</span></p>
          <p className="mt-1 text-gray-600">Média de Acertos: <span className="font-bold text-blue-600">{averageScore.toFixed(2)}%</span></p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Desempenho por Categoria</h3>
          {categoryData.length > 0 ? (
            <ul className="space-y-2">
              {categoryData.map((category) => (
                <li key={category.category} className="text-gray-600">
                  <span className="font-semibold text-gray-800">{category.category}</span>:
                  <span className="ml-2 text-green-600">{category.correctCount} acerto(s)</span> |
                  <span className="ml-2 text-red-600">{category.incorrectCount} erro(s)</span> |
                  <span className="ml-2 text-blue-600">
                    {((category.correctCount / category.totalCount) * 100).toFixed(2)}% de acertos
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum dado registrado por categoria.</p>
          )}
        </div>*/}
      </div>
    </div>
  );
}

