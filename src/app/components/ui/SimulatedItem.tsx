
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { SimulatedStatus, SimulatedType } from "@/app/enum/simulated";
import { CheckCircle, Circle, FileText } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Simulated } from "@prisma/client";
import { getTheme } from "@/app/service/essayService";
import { useEffect, useState } from "react";

export function getStatusBadge(status: string) {
  switch (status as SimulatedStatus) {
    case SimulatedStatus.COMPLETED:
      return <Badge variant="completed">Concluído</Badge>
    case SimulatedStatus.IN_PROGRESS:
      return <Badge variant="inProgress">Em Progresso</Badge>
    case SimulatedStatus.PENDING:
      return <Badge variant="pending">Pendente</Badge>
    case SimulatedStatus.NOTSTARTED:
      return <Badge variant="pending">Não iniciado</Badge>
    case SimulatedStatus.CORRECTING_ESSAY:
      return <Badge variant="warning">Corrigindo Redação</Badge>
  }
}

interface SimulatedItemProps {
  simulated: Simulated
  onSelect: (id: string, simulated: Simulated) => void
}

export function SimulatedItem({ simulated, onSelect }: SimulatedItemProps) {
  const [essayTheme, setEssayTheme] = useState<string | null>(null);

  useEffect(() => {
    if (simulated && simulated.type === SimulatedType.ESSAY) {
      const fetchTheme = async () => {
          const theme = await getTheme(simulated.id); 
          setEssayTheme(theme ?? null); 
      };
      fetchTheme(); 
    } else {
      setEssayTheme(null);
    }
  }, [simulated]);

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{simulated.type}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 pt-2">{simulated.subtype.join(", ")}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {simulated.unseen && <Badge variant="secondary">Inéditas</Badge>}
          {simulated.review && <Badge variant="secondary">Revisão</Badge>}
          {getStatusBadge(simulated.status)}
        </div>

        {simulated.type === SimulatedType.ESSAY ? (
          <div className="space-y-2">
            {essayTheme && (
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tema:</p>
                  <p className="text-sm text-muted-foreground">{essayTheme}</p>
                </div>
              </div>
            )}
            {simulated.status === SimulatedStatus.COMPLETED && simulated.essayScore !== undefined && (
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Nota: {simulated.essayScore}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4" />
              <span>Total: {simulated.totalQuestions}</span>
            </div>
            {simulated.status === SimulatedStatus.COMPLETED && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Acertos: {simulated.correctAnswers}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 mt-auto">
        <p className="text-sm text-muted-foreground">Criado em: {simulated.createdAt.toLocaleDateString()}</p>
        {simulated.finishedAt && (
          <p className="text-sm text-muted-foreground">Concluído em: {simulated.finishedAt.toLocaleDateString()}</p>
        )}
        <Button className="w-full mt-2" onClick={() => onSelect(simulated.id, simulated)}>
          {simulated.status === SimulatedStatus.COMPLETED ? "Ver Resultado" : "Continuar"}
        </Button>
      </CardFooter>
    </Card>
  )
}


