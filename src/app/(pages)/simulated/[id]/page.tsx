'use client';

import { Simulation } from "@/app/container/simulation";

const SimulationPage = ({ params }: { params: { id: string } }) => {
  return <Simulation params={params} />;
};
export default SimulationPage;