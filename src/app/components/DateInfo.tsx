import { Simulated } from "@prisma/client";
import { SimulatedStatus } from "../enum/simulated";

const DateInfo = ({ simulated }: { simulated: Simulated }) => {
  const date =
    simulated.status === SimulatedStatus.COMPLETED
      ? simulated.finishedAt
      : simulated.createdAt;

  return (
    <p className="text-gray-500 mb-1">
      {simulated.status === SimulatedStatus.COMPLETED
        ? "Finalizado em: "
        : "Criado em: "}
      {date && new Date(date).toLocaleString()}
    </p>
  );
};

export default DateInfo;
