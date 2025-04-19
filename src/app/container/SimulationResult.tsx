"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Separator } from "@radix-ui/react-select"
import { Badge } from "@/app/components/ui/badge"
import { useEffect, useState } from "react"
import { getCriteria, getSimulatedById } from "../service/simualationService"
import { getTheme } from "../service/essayService"
import { SimulatedStatus } from "../enum/simulated"
import { Progress } from "../components/ui/progress"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider } from "../components/ui/toolTip"


export default function SimulationResult({ id }: { id: string }) {
    interface Criterion {
        criterion: string
        score: number
        justification: string | null
    }

    const [criteria, setCriteria] = useState<Criterion[]>([])
    const [theme, setTheme] = useState<string>("")
    const [essay, setEssay] = useState<string>("")
    const [essayScore, setEssayScore] = useState<number | null>()
    const [simulatedStatus, setSimulatedSatus] = useState<string | undefined>("")

    // Descrições dos critérios para os tooltips
    const criteriaDescriptions: Record<string, string> = {
        "Competência 1": "Demonstrar domínio da norma padrão da língua escrita.",
        "Competência 2":
            "Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento para desenvolver o tema.",
        "Competência 3": "Selecionar, relacionar, organizar e interpretar informações em defesa de um ponto de vista.",
        "Competência 4":
            "Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.",
        "Competência 5": "Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos.",
    }

    useEffect(() => {
        const fetchSimulated = async () => {
            const simulatedId = id
            const criteria = await getCriteria(simulatedId)
            setCriteria(criteria)
            const theme = await getTheme(simulatedId)
            setTheme(theme as string)
            const simulated = await getSimulatedById(simulatedId)
            setEssay(simulated?.userText as string)
            setEssayScore(simulated?.essayScore)
            setSimulatedSatus(simulated?.status)
        }
        fetchSimulated()
    }, [id])

    const maxScoreCriterion = 200
    const maxScore = 1000

    // Função para obter a descrição do critério
    const getCriterionDescription = (criterionName: string) => {
        // Tenta encontrar a descrição exata ou busca por palavras-chave
        const exactMatch = criteriaDescriptions[criterionName]
        if (exactMatch) return exactMatch

        // Busca por palavras-chave se não encontrar correspondência exata
        for (const [key, description] of Object.entries(criteriaDescriptions)) {
            if (criterionName.includes(key)) {
                return description
            }
        }

        return "Descrição não disponível para este critério."
    }

    return (
        <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
            <h1 className="text-2xl font-bold mb-6 text-center">Correção de Redação</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                {/* Lado esquerdo - Redação */}
                <div className="flex flex-col h-full">
                    <Card className="flex-1 flex flex-col">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl">Tema da Redação</CardTitle>
                            <p className="text-muted-foreground font-medium mt-2">{theme}</p>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6 flex-1 overflow-hidden">
                            <h3 className="font-semibold mb-3">Texto do Candidato</h3>
                            <div className="bg-muted/40 p-4 rounded-md whitespace-pre-wrap text-sm leading-relaxed overflow-y-auto flex-1">
                                {essay}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Lado direito - Critérios de Avaliação */}
                <div className="flex flex-col h-full">
                    <Card className="flex-1 flex flex-col">
                        {simulatedStatus !== SimulatedStatus.CORRECTING_ESSAY ? (
                            <>
                                {criteria.length !== 1 && (
                                    <>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-xl">Critérios de Avaliação</CardTitle>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-muted-foreground">Nota Total:</p>
                                                <Badge variant="outline" className="text-lg font-bold">
                                                    {essayScore} / {maxScore}
                                                </Badge>
                                            </div>
                                            <div className="mt-2">
                                                <Progress value={((essayScore || 0) / maxScore) * 100} className="h-2.5" />
                                            </div>
                                        </CardHeader>
                                        <Separator />
                                    </>
                                )}
                                <CardContent className="pt-6 flex-1 overflow-hidden">
                                    <div className="space-y-6 overflow-y-auto pr-2 flex-1">
                                        {criteria.map((criterion, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                {criteria.length === 1 ? (
                                                    <>
                                                        <h3 className="font-semibold">{criterion.criterion}</h3>
                                                        <p className="text-sm">{criterion.justification}</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-semibold">{criterion.criterion}</h3>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipContent className="max-w-xs">
                                                                            <p>{getCriterionDescription(criterion.criterion)}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>
                                                            <Badge variant={criterion.score >= maxScoreCriterion * 0.8 ? "default" : "secondary"}>
                                                                {criterion.score} / {maxScoreCriterion}
                                                            </Badge>
                                                        </div>
                                                        <div className="mb-3">
                                                            <Progress value={(criterion.score / maxScoreCriterion) * 100} className="h-2" />
                                                        </div>
                                                        <Separator className="my-3" />
                                                        <p className="text-sm">{criterion.justification}</p>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </>
                        ) : (
                            <div className="flex justify-center items-center text-lg font-semibold text-gray-500">
                                A avaliação está em revisão. Por favor, aguarde...
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}


