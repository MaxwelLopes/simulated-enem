"use client";

import { Loading } from "@/app/components/Loading";
import { useRouter } from "next/navigation";
import { useSimulateds } from "../hook/simulateds";
import { SimulatedStatus } from "../enum/simulated";
import StatItem from "../components/StatItem";
import TotalIcon from "../components/icon/TotalIcon";
import CheckIcon from "../components/icon/CheckIcon";
import Tag from "../components/Tag";
import DateInfo from "../components/DateInfo";
import StatusText from "../components/StatusText";
import SimulatedButton from "../components/SimulatedButton";

const SimulatedList = () => {
  const router = useRouter();
  const { simulatedList, loading } = useSimulateds();

  if (loading) {
    <Loading />;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 pt-4">Meus Simulados</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...simulatedList].reverse().map((simulated) => (
          <div key={simulated.id} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{simulated.type}</h2>

            <p className="text-gray-600 mb-1">{simulated.subtype.join(", ")}</p>

            <div className="mb-2 flex flex-wrap gap-2">
              <StatusText status={simulated.status} />
              {simulated.unseen && <Tag color="blue" label="Inéditas" />}
              {simulated.review && <Tag color="blue" label="Revisão" />}
            </div>

            <div className="text-gray-500 flex items-center space-x-4 my-3">
              <StatItem
                icon={<TotalIcon />}
                label={`Total: ${simulated.totalQuestions}`}
                color="bg-blue-100 text-blue-700"
              />
              {simulated.status === SimulatedStatus.COMPLETED && (
                <StatItem
                  icon={<CheckIcon />}
                  label={`Acertos: ${simulated.correctAnswers}`}
                  color="bg-green-100 text-green-700"
                />
              )}
            </div>

            <DateInfo simulated={simulated} />

            <SimulatedButton
              onClick={() => router.push(`/simulated/${simulated.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulatedList;
