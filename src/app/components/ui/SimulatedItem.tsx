import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { SimulatedStatus } from "@/app/enum/simulated";
import { CheckCircle, Circle } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Simulated } from "@prisma/client";

interface SimulatedItemProps {
  simulated: Simulated;
  onSelect: (id: number) => void;
}

// Função auxiliar para renderizar o badge de status
function getStatusBadge(status: string) {
  switch (status as SimulatedStatus) {
    case SimulatedStatus.COMPLETED:
      return <Badge variant="completed">Concluído</Badge>;
    case SimulatedStatus.IN_PROGRESS:
      return <Badge variant="inProgress">Em Progresso</Badge>;
    case SimulatedStatus.PENDING:
      return <Badge variant="pending">Pendente</Badge>;
    case SimulatedStatus.NOTSTARTED:
      return <Badge variant="pending">Não iniciado</Badge>;
  }
}

export function SimulatedItem({ simulated, onSelect }: SimulatedItemProps) {
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{simulated.type}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 pt-2">
          {simulated.subtype.join(", ")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {simulated.unseen && <Badge variant="secondary">Inéditas</Badge>}
          {simulated.review && <Badge variant="secondary">Revisão</Badge>}
          {getStatusBadge(simulated.status)}
        </div>
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
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 mt-auto">
        <p className="text-sm text-muted-foreground">
          Criado em: {simulated.createdAt.toLocaleDateString()}
        </p>
        {simulated.finishedAt && (
          <p className="text-sm text-muted-foreground">
            Concluído em: {simulated.finishedAt.toLocaleDateString()}
          </p>
        )}
        <Button className="w-full mt-2" onClick={() => onSelect(simulated.id)}>
          {simulated.status === SimulatedStatus.COMPLETED
            ? "Ver Resultado"
            : "Continuar"}
        </Button>
      </CardFooter>
    </Card>
  );
}
