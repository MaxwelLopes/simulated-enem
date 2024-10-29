"use client";

import { Simulation } from "@/app/container/simulation";

type ParamsType = {
  params: {
    id: string;
  };
};

const SimulationPage = ({ params }: ParamsType) => {
  return <Simulation id={params.id} />;
};

export default SimulationPage;
