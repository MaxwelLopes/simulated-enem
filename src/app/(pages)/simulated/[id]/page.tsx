"use client";

import NavBar from "@/app/components/NavBar";
import { Simulation } from "@/app/container/simulation";

type ParamsType = {
  params: {
    id: string;
  };
};

export const SimulationPage = ({ params }: ParamsType) => {
  return (
    <>
      <Simulation id={params.id} />
    </>
  );
};

export default SimulationPage;
